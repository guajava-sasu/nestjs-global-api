import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LingotsService } from '../src/lingots/lingots.service.js';
import { MouvementRecord } from '../src/lingots/entities/lingot.entity.js';
import { LINGOTS_CONNECTION_NAME } from '../src/lingots/lingots.constants.js';
import { AppModule } from './../src/app.module.js';
import { setupSwagger } from '../src/swagger.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupSwagger(app);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('reports both MongoDB connections ready and serves the lingots list', async () => {
    const server = app.getHttpServer();
    await request(server).get('/health/ready').expect(200, { status: 'ok' });
    const response = await request(server).get('/lingots').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('serves Swagger UI and the typed OpenAPI document', async () => {
    const server = app.getHttpServer();
    await request(server).get('/docs').expect(200).expect(/Swagger UI/);
    const { body: document } = await request(server).get('/docs-json').expect(200);
    expect(document.paths['/chutage/chariots'].get.responses['200'].content['application/json'].schema)
      .toEqual({ type: 'array', items: { $ref: '#/components/schemas/ChariotResponseDto' } });
    expect(document.paths['/lingots/{id}'].delete.responses['403']).toBeDefined();
    expect(document.components.securitySchemes).toBeUndefined();
  });

  it('keeps documented nested objects and excludes internal MongoDB fields', async () => {
    const model = app.get<Model<MouvementRecord>>(
      getModelToken(MouvementRecord.name, LINGOTS_CONNECTION_NAME),
    );
    const id = new Types.ObjectId();
    const movement = new model({
      depart: {
        _id: id,
        code: 'S',
        nom: 'Stock',
        typeOperation: { _id: id, code: 'ST', nom: 'Stockage' },
      },
    });
    movement.set('internalOnly', 'not public', { strict: false });
    movement.set('depart.internalOnly', 'not public', { strict: false });
    movement.set('__v', 1, { strict: false });
    const service = app.get(LingotsService);
    const spy = vi.spyOn(service, 'findAllMouvements').mockResolvedValueOnce([movement]);
    try {
      const { body } = await request(app.getHttpServer()).get('/mouvements-lingots').expect(200);
      expect(body[0].depart).toEqual({
        _id: id.toHexString(),
        code: 'S',
        nom: 'Stock',
        typeOperation: { _id: id.toHexString(), code: 'ST', nom: 'Stockage' },
      });
      expect(body[0]).not.toHaveProperty('internalOnly');
      expect(body[0]).not.toHaveProperty('__v');
    } finally {
      spy.mockRestore();
    }
  });

  afterEach(async () => {
    await app.close();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  afterEach(async () => {
    await app.close();
  });
});

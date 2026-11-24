import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { LingotsController } from './lingots.controller.js';
import { LingotsService } from './lingots.service.js';

describe('LingotsController POST /lingots/dechiffrer', () => {
  let app: INestApplication;
  const dechiffrerLingot = vi.fn();

  beforeEach(async () => {
    dechiffrerLingot.mockReset();
    const moduleRef = await Test.createTestingModule({
      controllers: [LingotsController],
      providers: [
        {
          provide: LingotsService,
          useValue: { dechiffrerLingot },
        },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('accepte la requête initiale et retourne le contrat incomplet', async () => {
    const resultat = {
      statut: 'incomplet',
      lingot: { fournisseur: 'AC359079', numeroCoulee: '178425' },
    };
    dechiffrerLingot.mockResolvedValue(resultat);

    await request(app.getHttpServer())
      .post('/lingots/dechiffrer')
      .send({
        codeQR: 'ZN-AC359079-178425',
        zone: 'S',
        operateur: 'OP1',
      })
      .expect(201, resultat);

    expect(dechiffrerLingot).toHaveBeenCalledWith({
      codeQR: 'ZN-AC359079-178425',
      zone: 'S',
      operateur: 'OP1',
    });
  });

  it('accepte les informations complétées par le frontend', async () => {
    const resultat = {
      statut: 'cree',
      lingot: {
        _id: '507f1f77bcf86cd799439011',
        codeQR: 'ZN-AC359079-178425-019-1919-AL069-MG300-15102026',
        fournisseur: 'AC359079',
        numeroCoulee: '178425',
        numeroLingot: 19,
        poids: 1919,
        tauxAluminium: 'AL069',
      },
    };
    dechiffrerLingot.mockResolvedValue(resultat);

    await request(app.getHttpServer())
      .post('/lingots/dechiffrer')
      .send({
        codeQR: 'ZN-AC359079-178425-019-1919-AL069-MG300-15102026',
        zone: 'S',
        operateur: 'OP1',
        informations: {
          fournisseur: 'AC359079',
          numeroCoulee: '178425',
          numeroLingot: 19,
          poids: 1919,
          tauxAluminium: 'AL069',
        },
      })
      .expect(201, resultat);

    expect(dechiffrerLingot).toHaveBeenCalledWith({
      codeQR: 'ZN-AC359079-178425-019-1919-AL069-MG300-15102026',
      zone: 'S',
      operateur: 'OP1',
      informations: {
        fournisseur: 'AC359079',
        numeroCoulee: '178425',
        numeroLingot: 19,
        poids: 1919,
        tauxAluminium: 'AL069',
      },
    });
  });
});

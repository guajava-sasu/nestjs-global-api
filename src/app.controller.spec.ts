import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: 'DatabaseConnection', useValue: { readyState: 1 } },
        {
          provide: 'nestjs-global-api-lingotsConnection',
          useValue: { readyState: 1 },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  it('returns a generic health response', () => {
    expect(appController.getHealth()).toEqual({ status: 'ok' });
  });

  it('reports ready when both MongoDB connections are connected', () => {
    expect(appController.getReadiness()).toEqual({ status: 'ok' });
  });

  it('does not expose dependency details when MongoDB is unavailable', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: 'DatabaseConnection', useValue: { readyState: 0 } },
        {
          provide: 'nestjs-global-api-lingotsConnection',
          useValue: { readyState: 1 },
        },
      ],
    }).compile();
    const controller = moduleRef.get(AppController);
    expect(() => controller.getReadiness()).toThrow(
      ServiceUnavailableException,
    );
  });
});

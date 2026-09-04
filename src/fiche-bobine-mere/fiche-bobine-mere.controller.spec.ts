import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FicheBobineMereController } from './fiche-bobine-mere.controller.js';
import { FicheBobineMereService } from './fiche-bobine-mere.service.js';
import { FicheBobineMere } from './entities/fiche-bobine-mere.entity.js';

describe('FicheBobineMereController', () => {
  let controller: FicheBobineMereController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FicheBobineMereController],
      providers: [
        FicheBobineMereService,
        {
          provide: getModelToken(FicheBobineMere.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<FicheBobineMereController>(FicheBobineMereController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

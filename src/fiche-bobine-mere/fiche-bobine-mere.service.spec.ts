import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FicheBobineMereService } from './fiche-bobine-mere.service.js';
import { FicheBobineMere } from './entities/fiche-bobine-mere.entity.js';

describe('FicheBobineMereService', () => {
  let service: FicheBobineMereService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FicheBobineMereService,
        {
          provide: getModelToken(FicheBobineMere.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FicheBobineMereService>(FicheBobineMereService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

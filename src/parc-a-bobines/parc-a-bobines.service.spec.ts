import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ParcABobinesService } from './parc-a-bobines.service.js';
import { ParcABobine } from './entities/parc-a-bobine.entity.js';

describe('ParcABobinesService', () => {
  let service: ParcABobinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParcABobinesService,
        {
          provide: getModelToken(ParcABobine.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ParcABobinesService>(ParcABobinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

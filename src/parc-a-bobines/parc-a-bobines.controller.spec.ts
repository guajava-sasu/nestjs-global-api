import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ParcABobinesController } from './parc-a-bobines.controller.js';
import { ParcABobinesService } from './parc-a-bobines.service.js';
import { ParcABobine } from './entities/parc-a-bobine.entity.js';

describe('ParcABobinesController', () => {
  let controller: ParcABobinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParcABobinesController],
      providers: [
        ParcABobinesService,
        {
          provide: getModelToken(ParcABobine.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ParcABobinesController>(ParcABobinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

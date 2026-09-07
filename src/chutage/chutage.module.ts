import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChutageController } from './chutage.controller.js';
import { ChutageService } from './chutage.service.js';
import {
  BobineAChuter,
  BobineAChuterSchema,
  BobineStockage,
  BobineStockageSchema,
  Chariot,
  ChariotSchema,
  ChuteRive,
  ChuteRiveSchema,
  DemandePontier,
  DemandePontierSchema,
  DetailChuteBobine,
  DetailChuteBobineSchema,
  PontEtatPince,
  PontEtatPinceSchema,
  PreparationChargement,
  PreparationChargementSchema,
} from './entities/chutage.entity.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chariot.name, schema: ChariotSchema },
      { name: DemandePontier.name, schema: DemandePontierSchema },
      { name: PreparationChargement.name, schema: PreparationChargementSchema },
      { name: BobineStockage.name, schema: BobineStockageSchema },
      { name: BobineAChuter.name, schema: BobineAChuterSchema },
      { name: DetailChuteBobine.name, schema: DetailChuteBobineSchema },
      { name: ChuteRive.name, schema: ChuteRiveSchema },
      { name: PontEtatPince.name, schema: PontEtatPinceSchema },
    ]),
  ],
  controllers: [ChutageController],
  providers: [ChutageService],
})
export class ChutageModule {}
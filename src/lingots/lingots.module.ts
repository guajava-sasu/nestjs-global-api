import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BilanLingotsJourRecord,
  BilanLingotsJourSchema,
  EtatStockJournalierRecord,
  EtatStockJournalierSchema,
  LigneReceptionLingotRecord,
  LigneReceptionLingotSchema,
  LingotStockRecord,
  LingotStockSchema,
  LivraisonFournisseurRecord,
  LivraisonFournisseurSchema,
  MouvementLingotRecord,
  MouvementLingotSchema,
  OperateurTrackerRecord,
  OperateurTrackerSchema,
  ReceptionLingotRecord,
  ReceptionLingotSchema,
  ZoneRecord,
  ZoneSchema,
} from './entities/lingot.entity.js';
import { LingotsController } from './lingots.controller.js';
import { LingotsService } from './lingots.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LingotStockRecord.name, schema: LingotStockSchema },
      {
        name: LivraisonFournisseurRecord.name,
        schema: LivraisonFournisseurSchema,
      },
      {
        name: LigneReceptionLingotRecord.name,
        schema: LigneReceptionLingotSchema,
      },
      {
        name: ReceptionLingotRecord.name,
        schema: ReceptionLingotSchema,
      },
      {
        name: EtatStockJournalierRecord.name,
        schema: EtatStockJournalierSchema,
      },
      { name: MouvementLingotRecord.name, schema: MouvementLingotSchema },
      { name: BilanLingotsJourRecord.name, schema: BilanLingotsJourSchema },
      {
        name: OperateurTrackerRecord.name,
        schema: OperateurTrackerSchema,
      },
      { name: ZoneRecord.name, schema: ZoneSchema },
    ]),
  ],
  controllers: [LingotsController],
  providers: [LingotsService],
})
export class LingotsModule {}

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
        name: EtatStockJournalierRecord.name,
        schema: EtatStockJournalierSchema,
      },
      { name: MouvementLingotRecord.name, schema: MouvementLingotSchema },
      { name: BilanLingotsJourRecord.name, schema: BilanLingotsJourSchema },
    ]),
  ],
  controllers: [LingotsController],
  providers: [LingotsService],
})
export class LingotsModule {}

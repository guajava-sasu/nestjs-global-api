import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { getLingotsMongoConfig } from '../database/mongodb.config.js';
import {
  ConfigurationRecord,
  ConfigurationSchema,
  FournisseurRecord,
  FournisseurSchema,
  HistoriqueStockRecord,
  HistoriqueStockSchema,
  InventaireRecord,
  InventaireSchema,
  LingotRecord,
  LingotSchema,
  MatteRecord,
  MatteSchema,
  MouvementRecord,
  MouvementSchema,
  OperateurRecord,
  OperateurSchema,
  OrphelingotSchema,
  TauxAluminiumRecord,
  TauxAluminiumSchema,
  ZoneRecord,
  ZoneSchema,
} from './entities/lingot.entity.js';
import { LINGOTS_CONNECTION_NAME } from './lingots.constants.js';
import { LingotsController } from './lingots.controller.js';
import { LingotsService } from './lingots.service.js';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: LINGOTS_CONNECTION_NAME,
      useFactory: () => ({ uri: getLingotsMongoConfig().uri }),
    }),
    MongooseModule.forFeature(
      [
        { name: ConfigurationRecord.name, schema: ConfigurationSchema },
        { name: LingotRecord.name, schema: LingotSchema },
        { name: 'Orphelingot', schema: OrphelingotSchema },
        { name: OperateurRecord.name, schema: OperateurSchema },
        { name: FournisseurRecord.name, schema: FournisseurSchema },
        { name: TauxAluminiumRecord.name, schema: TauxAluminiumSchema },
        { name: ZoneRecord.name, schema: ZoneSchema },
        { name: InventaireRecord.name, schema: InventaireSchema },
        { name: MatteRecord.name, schema: MatteSchema },
        { name: MouvementRecord.name, schema: MouvementSchema },
        { name: HistoriqueStockRecord.name, schema: HistoriqueStockSchema },
      ],
      LINGOTS_CONNECTION_NAME,
    ),
  ],
  controllers: [LingotsController],
  providers: [LingotsService],
})
export class LingotsModule {}

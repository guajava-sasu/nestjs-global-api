import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
  TauxAluminiumRecord,
  TauxAluminiumSchema,
  ZoneRecord,
  ZoneSchema,
} from './entities/lingot.entity.js';
import {
  LINGOTS_CONNECTION_NAME,
  LINGOTS_DATABASE_NAME,
} from './lingots.constants.js';
import { LingotsController } from './lingots.controller.js';
import { LingotsService } from './lingots.service.js';

const mongoUri =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, {
      connectionName: LINGOTS_CONNECTION_NAME,
      dbName: LINGOTS_DATABASE_NAME,
    }),
    MongooseModule.forFeature(
      [
        { name: ConfigurationRecord.name, schema: ConfigurationSchema },
        { name: LingotRecord.name, schema: LingotSchema },
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

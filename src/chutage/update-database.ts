import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { getMainMongoConfig } from '../database/mongodb.config.js';
import { ChutageModule } from './chutage.module.js';
import { ChutageService } from './chutage.service.js';

if (process.env.CONFIRM_DB_RESET !== 'true') {
  throw new Error(
    'Mise à jour destructive refusée : définissez CONFIRM_DB_RESET=true pour confirmer explicitement.',
  );
}

@Module({
  imports: [
    MongooseModule.forRoot(getMainMongoConfig().uri),
    ChutageModule,
  ],
})
class UpdateChutageDatabaseModule {}

const application = await NestFactory.createApplicationContext(UpdateChutageDatabaseModule);
await application
  .get(ChutageService)
  .updateDatabase('CONFIRM_CHUTAGE_RESET');
await application.close();
console.log('Les collections Chutage ont ete mises a jour.');

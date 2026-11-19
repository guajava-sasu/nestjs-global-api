import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { getMainMongoConfig } from '../database/mongodb.config.js';
import { FicheBobineFilleModule } from './fiche-bobine-fille.module.js';
import { FicheBobineFilleService } from './fiche-bobine-fille.service.js';

const COUNT = 25;

@Module({
  imports: [
    MongooseModule.forRoot(getMainMongoConfig().uri),
    FicheBobineFilleModule,
  ],
})
class GenerateBobinesFillesModule {}

const application = await NestFactory.createApplicationContext(GenerateBobinesFillesModule);
const created = await application.get(FicheBobineFilleService).generateRandomFilles(COUNT);
await application.close();
console.log(`${created.length} bobines filles générées aléatoirement à partir des bobines mères existantes.`);

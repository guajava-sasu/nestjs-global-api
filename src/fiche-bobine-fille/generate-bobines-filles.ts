import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { FicheBobineFilleModule } from './fiche-bobine-fille.module.js';
import { FicheBobineFilleService } from './fiche-bobine-fille.service.js';

const COUNT = 25;

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api'),
    FicheBobineFilleModule,
  ],
})
class GenerateBobinesFillesModule {}

const application = await NestFactory.createApplicationContext(GenerateBobinesFillesModule);
const created = await application.get(FicheBobineFilleService).generateRandomFilles(COUNT);
await application.close();
console.log(`${created.length} bobines filles générées aléatoirement à partir des bobines mères existantes.`);

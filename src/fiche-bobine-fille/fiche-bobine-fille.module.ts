import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FicheBobineFilleService } from './fiche-bobine-fille.service.js';
import { FicheBobineFilleController } from './fiche-bobine-fille.controller.js';
import { FicheBobineFille, FicheBobineFilleSchema } from './entities/fiche-bobine-fille.entity.js';
import { FicheBobineMere, FicheBobineMereSchema } from '../fiche-bobine-mere/entities/fiche-bobine-mere.entity.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FicheBobineFille.name, schema: FicheBobineFilleSchema },
      { name: FicheBobineMere.name, schema: FicheBobineMereSchema },
    ]),
  ],
  controllers: [FicheBobineFilleController],
  providers: [FicheBobineFilleService],
  exports: [FicheBobineFilleService],
})
export class FicheBobineFilleModule {}

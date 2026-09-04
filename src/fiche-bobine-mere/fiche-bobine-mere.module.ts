import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FicheBobineMereService } from './fiche-bobine-mere.service.js';
import { FicheBobineMereController } from './fiche-bobine-mere.controller.js';
import { FicheBobineMere, FicheBobineMereSchema } from './entities/fiche-bobine-mere.entity.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FicheBobineMere.name, schema: FicheBobineMereSchema },
    ]),
  ],
  controllers: [FicheBobineMereController],
  providers: [FicheBobineMereService],
})
export class FicheBobineMereModule {}

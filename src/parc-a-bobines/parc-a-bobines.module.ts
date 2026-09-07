import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParcABobinesService } from './parc-a-bobines.service.js';
import { ParcABobinesController } from './parc-a-bobines.controller.js';
import { ParcABobine, ParcABobineSchema } from './entities/parc-a-bobine.entity.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ParcABobine.name, schema: ParcABobineSchema },
    ]),
  ],
  controllers: [ParcABobinesController],
  providers: [ParcABobinesService],
})
export class ParcABobinesModule {}

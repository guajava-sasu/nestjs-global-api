import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service.js';
import { FicheBobineMereModule } from './fiche-bobine-mere/fiche-bobine-mere.module.js';
import { ParcABobinesModule } from './parc-a-bobines/parc-a-bobines.module.js';
import { ChutageModule } from './chutage/chutage.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: 
  [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'nestjs-global-api',
    }),
     MongooseModule.forRoot('mongodb://localhost:27017/nestjs-global-api'),
     FicheBobineMereModule,
     ParcABobinesModule,
      ChutageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

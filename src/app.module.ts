import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ChutageModule } from './chutage/chutage.module.js';
import { getMainMongoConfig } from './database/mongodb.config.js';
import { FicheBobineFilleModule } from './fiche-bobine-fille/fiche-bobine-fille.module.js';
import { FicheBobineMereModule } from './fiche-bobine-mere/fiche-bobine-mere.module.js';
import { LingotsModule } from './lingots/lingots.module.js';
import { ParcABobinesModule } from './parc-a-bobines/parc-a-bobines.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'nestjs-global-api',
    // }),
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: getMainMongoConfig().uri }),
    }),
    FicheBobineMereModule,
    FicheBobineFilleModule,
    ParcABobinesModule,
    ChutageModule,
    LingotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

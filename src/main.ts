import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Global API')
    .setDescription('BFF custom API documentation')
    .setVersion('0.0.1')
    .addTag('app', 'Endpoints généraux')
    .addTag('fiche-bobine-mere', 'Gestion des fiches bobine mère')
    .addTag('fiche-bobine-fille', 'Gestion des fiches bobine fille')
    .addTag('parc-a-bobines', 'Gestion du parc à bobines')
    .addTag('chutage', 'Gestion du chutage')
    .addTag('lingots', 'Gestion des stocks et mouvements de lingots')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();

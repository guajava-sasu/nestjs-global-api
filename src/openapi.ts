import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Global API')
    .setDescription('BFF custom API documentation')
    .setVersion('0.0.1')
    .addTag('app', 'Endpoints généraux')
    .addTag('fiche-bobine-mere', 'Gestion des fiches bobine mère')
    .addTag('fiche-bobine-fille', 'Gestion des fiches bobine fille')
    .addTag('parc-a-bobines', 'Gestion du parc à bobines')
    .addTag('chutage', 'Gestion du chutage')
    .addTag('lingots', 'Gestion des stocks et mouvements de lingots')
    .addTag('mouvements-lingots', 'CRUD des mouvements de lingots')
    .build();

  return SwaggerModule.createDocument(app, config, {
    // operationId unique et lisible : devient le nom de méthode des clients Angular générés.
    operationIdFactory: (controllerKey, methodKey) =>
      `${controllerKey.replace(/Controller$/, '')}_${methodKey}`,
  });
}

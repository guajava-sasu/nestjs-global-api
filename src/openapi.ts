import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, getSchemaPath } from '@nestjs/swagger';
import { BadRequestResponseDto, HttpErrorResponseDto } from './common/dto/http-response.dto.js';
import { operationId } from './common/openapi-response.interceptor.js';

export function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Global API')
    .setDescription("API sans authentification applicative. Les listes ne sont pas paginées. Les suppressions sont désactivées par défaut.")
    .setVersion('0.0.1')
    .addTag('app', 'Endpoints généraux')
    .addTag('fiche-bobine-mere', 'Gestion des fiches bobine mère')
    .addTag('fiche-bobine-fille', 'Gestion des fiches bobine fille')
    .addTag('parc-a-bobines', 'Gestion du parc à bobines')
    .addTag('chutage', 'Gestion du chutage')
    .addTag('lingots', 'Gestion des stocks et mouvements de lingots')
    .addTag('mouvements-lingots', 'CRUD des mouvements de lingots')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    // operationId unique et lisible : devient le nom de méthode des clients Angular générés.
    operationIdFactory: operationId,
    extraModels: [BadRequestResponseDto, HttpErrorResponseDto],
  });

  const erreur = (description: string, type: typeof HttpErrorResponseDto | typeof BadRequestResponseDto = HttpErrorResponseDto) => ({
    description,
    content: { 'application/json': { schema: { $ref: getSchemaPath(type) } } },
  });
  for (const [path, methods] of Object.entries(document.paths)) {
    for (const method of ['get', 'post', 'patch', 'delete'] as const) {
      const operation = methods[method];
      if (!operation) continue;
      const responses = operation.responses;
      if (operation.operationId?.startsWith('Lingots_')) {
        for (const parameter of operation.parameters ?? []) {
          if (!('$ref' in parameter) && parameter.in === 'path') {
            parameter.description ??= 'Identifiant MongoDB de la ressource';
            parameter.example ??= '6aec5826d7c5208303dc51d8';
          }
        }
      }
      responses['500'] = erreur('Erreur interne du serveur');
      if (method === 'post' || method === 'patch') {
        responses['400'] = erreur('Corps de requête invalide', BadRequestResponseDto);
      }
      if (method === 'delete') responses['403'] = erreur('Suppressions HTTP désactivées');
      if (!responses['404'] && (
        path.startsWith('/lingots/{lingotId}/') ||
        (path === '/mouvements-lingots' && method === 'post')
      )) {
        responses['404'] = erreur('Ressource introuvable ou identifiant invalide');
      }
      const notFound = responses['404'];
      if (notFound && !('$ref' in notFound) && !notFound.content) {
        notFound.content = erreur(notFound.description).content;
      }
    }
  }
  return document;
}

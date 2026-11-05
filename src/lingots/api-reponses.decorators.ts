import { applyDecorators, type Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

export const ApiCreation = (type: Type<unknown>) =>
  applyDecorators(
    ApiCreatedResponse({ type }),
    ApiBadRequestResponse({ description: 'Corps de requête invalide' }),
  );

export const ApiListe = (type: Type<unknown>) =>
  ApiOkResponse({ type: [type] });

export const ApiElement = (type: Type<unknown>) =>
  applyDecorators(
    ApiOkResponse({ type }),
    ApiNotFoundResponse({
      description: 'Ressource introuvable ou _id invalide',
    }),
  );

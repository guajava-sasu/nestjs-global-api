import { applyDecorators, type Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

export const ApiCreation = (type: Type<unknown>) =>
  ApiCreatedResponse({ type });

export const ApiListe = (type: Type<unknown>) =>
  ApiOkResponse({ type: [type] });

export const ApiElement = (type: Type<unknown>) =>
  applyDecorators(
    ApiOkResponse({ type }),
    ApiNotFoundResponse({
      description: 'Ressource introuvable ou _id invalide',
    }),
  );

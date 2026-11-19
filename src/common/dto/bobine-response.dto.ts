import { IntersectionType } from '@nestjs/swagger';
import { CreateFicheBobineMereDto } from '../../fiche-bobine-mere/dto/create-fiche-bobine-mere.dto.js';
import { CreateFicheBobineFilleDto } from '../../fiche-bobine-fille/dto/create-fiche-bobine-fille.dto.js';
import { CreateParcABobineDto } from '../../parc-a-bobines/dto/create-parc-a-bobine.dto.js';
import { MongoDocumentResponseDto } from './http-response.dto.js';

export class FicheBobineMereResponseDto extends IntersectionType(
  MongoDocumentResponseDto, CreateFicheBobineMereDto,
) {}

export class FicheBobineFilleResponseDto extends IntersectionType(
  MongoDocumentResponseDto, CreateFicheBobineFilleDto,
) {}

export class ParcABobineResponseDto extends IntersectionType(
  MongoDocumentResponseDto, CreateParcABobineDto,
) {}

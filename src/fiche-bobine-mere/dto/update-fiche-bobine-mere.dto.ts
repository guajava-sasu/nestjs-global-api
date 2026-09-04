import { PartialType } from '@nestjs/mapped-types';
import { CreateFicheBobineMereDto } from './create-fiche-bobine-mere.dto.js';

export class UpdateFicheBobineMereDto extends PartialType(CreateFicheBobineMereDto) {}

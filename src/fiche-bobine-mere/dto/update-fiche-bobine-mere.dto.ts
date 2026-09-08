import { PartialType } from '@nestjs/swagger';
import { CreateFicheBobineMereDto } from './create-fiche-bobine-mere.dto.js';

export class UpdateFicheBobineMereDto extends PartialType(CreateFicheBobineMereDto) {}

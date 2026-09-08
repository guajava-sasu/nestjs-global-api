import { PartialType } from '@nestjs/swagger';
import { CreateFicheBobineFilleDto } from './create-fiche-bobine-fille.dto.js';

export class UpdateFicheBobineFilleDto extends PartialType(CreateFicheBobineFilleDto) {}

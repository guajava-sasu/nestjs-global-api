import { PartialType } from '@nestjs/swagger';
import { CreateParcABobineDto } from './create-parc-a-bobine.dto.js';

export class UpdateParcABobineDto extends PartialType(CreateParcABobineDto) {}

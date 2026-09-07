import { PartialType } from '@nestjs/mapped-types';
import { CreateParcABobineDto } from './create-parc-a-bobine.dto.js';

export class UpdateParcABobineDto extends PartialType(CreateParcABobineDto) {}

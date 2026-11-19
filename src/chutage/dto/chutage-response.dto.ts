import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MongoDocumentResponseDto } from '../../common/dto/http-response.dto.js';
import { AlerteTransitionDto } from '../../parc-a-bobines/dto/create-parc-a-bobine.dto.js';

export class ChariotResponseDto extends MongoDocumentResponseDto {
  @ApiProperty() numero: number;
  @ApiProperty() bobine: string;
}

export class DemandePontierResponseDto extends MongoDocumentResponseDto {
  @ApiProperty({ enum: ['Chargement', 'Dechargement'] }) sens: string;
  @ApiProperty() bobine: string;
  @ApiProperty() halle: string;
  @ApiProperty() chariot: string;
}

export class PreparationChargementResponseDto extends MongoDocumentResponseDto {
  @ApiProperty() bobine: string;
  @ApiProperty() halle: string;
  @ApiProperty({ type: Number, nullable: true }) chariot: number | null;
}

export class CalculPresetResponseDto {
  @ApiProperty() isValid: boolean;
  @ApiProperty() isCalculated: boolean;
}

export class BobineStockageResponseDto extends MongoDocumentResponseDto {
  @ApiProperty({ enum: ['N', 'S'] }) type: string;
  @ApiProperty() bobine: string;
  @ApiProperty() lot: string;
  @ApiProperty() montage: number;
  @ApiProperty() largeur: string;
  @ApiProperty() epaisseur: number;
  @ApiProperty() poids: number;
  @ApiProperty() cycle: string;
  @ApiProperty() prod: string;
  @ApiProperty() diametre: number;
  @ApiProperty() halle: string;
  @ApiProperty() client: string;
  @ApiProperty() priorite: string;
  @ApiPropertyOptional() reserve?: boolean;
  @ApiPropertyOptional({ type: CalculPresetResponseDto }) calculPreset?: CalculPresetResponseDto;
  @ApiPropertyOptional() Transition?: boolean;
  @ApiPropertyOptional({ type: AlerteTransitionDto }) AlerteTransition?: AlerteTransitionDto;
}

export class BobineAChuterResponseDto extends MongoDocumentResponseDto {
  @ApiProperty() bobine: string;
  @ApiProperty() lgE: number;
  @ApiProperty() lgS: number;
  @ApiProperty() fini: string;
  @ApiProperty() selected: boolean;
}

class ChuteResponseDto extends MongoDocumentResponseDto {
  @ApiProperty() bobine: string;
  @ApiProperty({ enum: ['E', 'S'] }) lieu: string;
  @ApiProperty() longueur: number;
  @ApiProperty() defaut: string;
  @ApiProperty() imputation: number;
  @ApiProperty() revAV: number;
  @ApiProperty() revAR: number;
}

export class DetailChuteBobineResponseDto extends ChuteResponseDto {
  @ApiProperty() zone: number;
  @ApiProperty({ type: Number, nullable: true }) poids: number | null;
}

export class ChuteRiveResponseDto extends ChuteResponseDto {
  @ApiProperty() largeur: number;
  @ApiProperty() poids: number;
}

export class EtatPontResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() color: string;
}

export class PontEtatPinceResponseDto extends MongoDocumentResponseDto {
  @ApiProperty({ type: EtatPontResponseDto }) pont: EtatPontResponseDto;
  @ApiProperty({ type: EtatPontResponseDto }) etat: EtatPontResponseDto;
  @ApiProperty() pince: string;
}

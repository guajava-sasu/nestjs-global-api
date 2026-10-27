import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { TypeLingot } from '../entities/lingot.entity.js';
import { couleursZoneAutorisees } from '../entities/lingot.entity.js';

const typesLingot: TypeLingot[] = ['B', 'OB', 'VB', 'BB', 'N'];

export class CreateOperateurTrackerDto {
  @ApiProperty() @IsString() id: string;
  @ApiProperty() @IsString() username: string;
  @ApiProperty() @IsString() entreprise: string;
  @ApiProperty() @IsString() nom: string;
  @ApiProperty() @IsString() prenom: string;
}
export class UpdateOperateurTrackerDto extends PartialType(
  CreateOperateurTrackerDto,
) {}

export class CreateZoneDto {
  @ApiProperty() @IsNumber() id: number;
  @ApiProperty() @IsString() nom: string;
  @ApiProperty() @IsString() code: string;
  @ApiProperty({ enum: [...couleursZoneAutorisees] })
  @IsIn([...couleursZoneAutorisees])
  couleur: string;
}
export class UpdateZoneDto extends PartialType(CreateZoneDto) {}

export class AnalyseLingotDto {
  @ApiProperty() @IsNumber() al: number;
  @ApiProperty() @IsNumber() fe: number;
  @ApiProperty() @IsNumber() pb: number;
}

export class CreateLigneReceptionLingotDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @IsNumber() numero: number;
  @ApiProperty() @IsString() numeroLingotCoulee: string;
  @ApiProperty() @IsString() typeLingot: string;
  @ApiProperty({ nullable: true }) @IsOptional() @IsNumber() poids:
    number | null;
}
export class UpdateLigneReceptionLingotDto extends PartialType(
  CreateLigneReceptionLingotDto,
) {}

export class CreateLingotStockDto {
  @ApiProperty() @IsString() id: string;
  @ApiProperty() @IsNumber() poids: number;
  @ApiProperty() @IsString() fournisseur: string;
  @ApiProperty() @IsString() numeroCoulee: string;
  @ApiProperty() @IsBoolean() valide: boolean;
  @ApiProperty() @IsNumber() numeroLingot: number;
  @ApiProperty() @IsNumber() alFournisseur: number;
  @ApiProperty() @IsNumber() alArcelor: number;
  @ApiProperty() @Type(() => Date) @IsDate() dateReception: Date;
  @ApiProperty({ enum: typesLingot }) @IsIn(typesLingot) type: TypeLingot;
  @ApiPropertyOptional() @IsOptional() @IsString() preparation?: string;
}
export class UpdateLingotStockDto extends PartialType(CreateLingotStockDto) {}

export class CreateLivraisonFournisseurDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @Type(() => Date) @IsDate() dateLivraison: Date;
  @ApiProperty() @IsString() fournisseur: string;
  @ApiProperty() @IsString() numeroCoulee: string;
  @ApiProperty({ type: AnalyseLingotDto })
  @ValidateNested()
  @Type(() => AnalyseLingotDto)
  analyseFournisseur: AnalyseLingotDto;
  @ApiProperty({ type: AnalyseLingotDto })
  @ValidateNested()
  @Type(() => AnalyseLingotDto)
  analyseArcelor: AnalyseLingotDto;
  @ApiProperty() @IsNumber() nbLingots: number;
  @ApiProperty() @IsNumber() tonnage: number;
  @ApiProperty({ enum: typesLingot }) @IsIn(typesLingot) type: TypeLingot;
  @ApiProperty() @IsBoolean() couleeValidee: boolean;
}
export class UpdateLivraisonFournisseurDto extends PartialType(
  CreateLivraisonFournisseurDto,
) {}

export class LigneReceptionIntegreeDto {
  @ApiProperty() @IsNumber() numero: number;
  @ApiProperty() @IsString() numeroLingotCoulee: string;
  @ApiProperty() @IsString() typeLingot: string;
  @ApiProperty({ nullable: true }) @IsOptional() @IsNumber() poids:
    number | null;
}

export class CreateReceptionLingotDto {
  @ApiProperty() @IsString() id: string;
  @ApiProperty() @IsString() codeFournisseur: string;
  @ApiProperty() @IsString() numeroCoulee: string;
  @ApiProperty() @Type(() => Date) @IsDate() dateReception: Date;
  @ApiProperty({ type: AnalyseLingotDto })
  @ValidateNested()
  @Type(() => AnalyseLingotDto)
  analyseFournisseur: AnalyseLingotDto;
  @ApiProperty({ type: [LigneReceptionIntegreeDto] })
  @ValidateNested({ each: true })
  @Type(() => LigneReceptionIntegreeDto)
  lignesReception: LigneReceptionIntegreeDto[];
}
export class UpdateReceptionLingotDto extends PartialType(
  CreateReceptionLingotDto,
) {}

export class EtatStockTypeDto {
  @ApiProperty() @IsNumber() nombre: number;
  @ApiProperty() @IsNumber() poids: number;
}

export class EtatStockParTypeDto {
  @ApiPropertyOptional({ type: EtatStockTypeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EtatStockTypeDto)
  B?: EtatStockTypeDto;
  @ApiPropertyOptional({ type: EtatStockTypeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EtatStockTypeDto)
  OB?: EtatStockTypeDto;
  @ApiPropertyOptional({ type: EtatStockTypeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EtatStockTypeDto)
  VB?: EtatStockTypeDto;
  @ApiPropertyOptional({ type: EtatStockTypeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EtatStockTypeDto)
  BB?: EtatStockTypeDto;
  @ApiPropertyOptional({ type: EtatStockTypeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EtatStockTypeDto)
  N?: EtatStockTypeDto;
}

export class CreateEtatStockJournalierDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @Type(() => Date) @IsDate() date: Date;
  @ApiProperty({ type: EtatStockParTypeDto })
  @ValidateNested()
  @Type(() => EtatStockParTypeDto)
  parType: EtatStockParTypeDto;
  @ApiProperty() @IsNumber() mattes: number;
}
export class UpdateEtatStockJournalierDto extends PartialType(
  CreateEtatStockJournalierDto,
) {}

export class CreateMouvementLingotDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @Type(() => Date) @IsDate() date: Date;
  @ApiProperty() @IsString() poste: string;
  @ApiProperty({ enum: [...typesLingot, 'MATTE'] })
  @IsIn([...typesLingot, 'MATTE'])
  type: TypeLingot | 'MATTE';
  @ApiPropertyOptional() @IsOptional() @IsString() numeroCoulee?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() numeroLingot?: number;
  @ApiProperty() @IsNumber() poids: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() al?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() table?: string;
  @ApiProperty() @IsString() creuset: string;
}
export class UpdateMouvementLingotDto extends PartialType(
  CreateMouvementLingotDto,
) {}

export class CreateBilanLingotsJourDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @Type(() => Date) @IsDate() date: Date;
  @ApiProperty() @IsNumber() pot: number;
  @ApiProperty() @IsNumber() alM: number;
  @ApiProperty() @IsNumber() alA: number;
  @ApiProperty() @IsNumber() alN: number;
  @ApiProperty() @IsNumber() alJ: number;
  @ApiProperty() @IsNumber() typeBc: number;
  @ApiProperty() @IsNumber() typeJ: number;
  @ApiProperty() @IsNumber() typeO: number;
  @ApiProperty() @IsNumber() typeV: number;
  @ApiProperty() @IsNumber() typeB: number;
  @ApiProperty() @IsNumber() typeN: number;
  @ApiProperty() @IsNumber() mattes: number;
}
export class UpdateBilanLingotsJourDto extends PartialType(
  CreateBilanLingotsJourDto,
) {}

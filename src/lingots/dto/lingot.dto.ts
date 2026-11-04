import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { TypeLingot } from '../entities/lingot.entity.js';

const typesLingot: TypeLingot[] = ['B', 'OB', 'VB', 'BB', 'N'];

export class CreateOperateurDto {
  @ApiProperty() @IsString() id: string;
  @ApiProperty() @IsString() username: string;
  @ApiProperty() @IsString() entreprise: string;
  @ApiProperty() @IsString() nom: string;
  @ApiProperty() @IsString() prenom: string;
}
export class UpdateOperateurDto extends PartialType(CreateOperateurDto) {}

export class CreateFournisseurDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @IsString() nom: string;
  @ApiProperty() @IsString() code: string;
}
export class UpdateFournisseurDto extends PartialType(CreateFournisseurDto) {}

export class CreateTauxAluminiumDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @IsString() nom: string;
  @ApiProperty() @IsString() couleur: string;
}
export class UpdateTauxAluminiumDto extends PartialType(
  CreateTauxAluminiumDto,
) {}

export class CreatePositionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() nom: string;
}
export class UpdatePositionDto extends PartialType(CreatePositionDto) {}

export class CreateMouvementDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @Type(() => Date) @IsDate() date: Date;
  @ApiProperty({ type: CreateOperateurDto })
  @ValidateNested()
  @Type(() => CreateOperateurDto)
  operateur: CreateOperateurDto;
  @ApiProperty({ type: CreatePositionDto })
  @ValidateNested()
  @Type(() => CreatePositionDto)
  position: CreatePositionDto;
}
export class UpdateMouvementDto extends PartialType(CreateMouvementDto) {}

export class CreateLingotDto {
  @ApiProperty() @IsString() id: string;
  @ApiProperty() @IsString() codeQR: string;
  @ApiProperty({ type: CreateFournisseurDto })
  @ValidateNested()
  @Type(() => CreateFournisseurDto)
  fournisseur: CreateFournisseurDto;
  @ApiProperty() @IsString() numeroCoulee: string;
  @ApiProperty() @IsNumber() numeroLingot: number;
  @ApiProperty() @IsNumber() poids: number;
  @ApiProperty({ enum: typesLingot }) @IsIn(typesLingot) type: TypeLingot;
  @ApiProperty({ type: CreateTauxAluminiumDto })
  @ValidateNested()
  @Type(() => CreateTauxAluminiumDto)
  tauxAluminium: CreateTauxAluminiumDto;
  @ApiProperty() @Type(() => Date) @IsDate() dateReception: Date;
  @ApiProperty() @IsString() reference: string;
  @ApiProperty({ type: CreatePositionDto })
  @ValidateNested()
  @Type(() => CreatePositionDto)
  positionActuelle: CreatePositionDto;
  @ApiProperty({ type: [CreateMouvementDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateMouvementDto)
  mouvements: CreateMouvementDto[];
}
export class UpdateLingotDto extends PartialType(CreateLingotDto) {}

export class CreateInventaireDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @Type(() => Date) @IsDate() date: Date;
  @ApiProperty({ type: CreateOperateurDto })
  @ValidateNested()
  @Type(() => CreateOperateurDto)
  operateur: CreateOperateurDto;
  @ApiProperty({ type: [CreateLingotDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateLingotDto)
  lingots: CreateLingotDto[];
}
export class UpdateInventaireDto extends PartialType(CreateInventaireDto) {}

export class CreateMatteDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @Type(() => Date) @IsDate() date: Date;
  @ApiProperty() @IsNumber() quantite: number;
  @ApiProperty({ enum: ['ajout', 'suppression'] })
  @IsIn(['ajout', 'suppression'])
  action: string;
  @ApiProperty() @IsNumber() nouveauTotal: number;
  @ApiProperty({ type: CreateOperateurDto })
  @ValidateNested()
  @Type(() => CreateOperateurDto)
  operateur: CreateOperateurDto;
}
export class UpdateMatteDto extends PartialType(CreateMatteDto) {}

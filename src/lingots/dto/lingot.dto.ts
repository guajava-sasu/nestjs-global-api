import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class CreateConfigurationDto {
  @ApiProperty({ example: 'nombreLingotsMaximum' })
  @IsString()
  @Matches(/\S/)
  cle: string;

  @ApiProperty({
    example: 100,
    oneOf: [
      { type: 'number' },
      { type: 'string' },
      { type: 'boolean' },
      { type: 'object', additionalProperties: true },
      { type: 'array', items: {} },
    ],
  })
  @IsDefined()
  valeur: unknown;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
export class UpdateConfigurationDto extends PartialType(CreateConfigurationDto) {}

export class CreateOperateurDto {
  @ApiProperty() @IsString() username: string;
  @ApiProperty() @IsString() entreprise: string;
  @ApiProperty() @IsString() nom: string;
  @ApiProperty() @IsString() prenom: string;
  @ApiProperty() @IsString() codeQR: string;
}
export class UpdateOperateurDto extends PartialType(CreateOperateurDto) {}

export class CreateFournisseurDto {
  @ApiProperty() @IsString() nom: string;
  @ApiProperty() @IsString() code: string;
}
export class UpdateFournisseurDto extends PartialType(CreateFournisseurDto) {}

export class CreateTauxAluminiumDto {
  @ApiProperty() @IsString() nom: string;
  @ApiProperty({
    description:
      'Couleur hexadécimale issue du design system @n3ga2/design-system',
    example: '#0072ce',
  })
  @Matches(/^#[0-9a-f]{6}$/i, {
    message: 'couleur doit être une valeur hexadécimale (#rrggbb)',
  })
  couleur: string;
}
export class UpdateTauxAluminiumDto extends PartialType(
  CreateTauxAluminiumDto,
) {}

export class CreateZoneDto {
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() nom: string;
}
export class UpdateZoneDto extends PartialType(CreateZoneDto) {}

export class CreateMouvementDto {
  @ApiProperty() @Type(() => Date) @IsDate() date: Date;
  @ApiPropertyOptional({ type: CreateZoneDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateZoneDto)
  depart?: CreateZoneDto | null;
  @ApiProperty({ type: CreateZoneDto })
  @ValidateNested()
  @Type(() => CreateZoneDto)
  arrivee: CreateZoneDto;
  @ApiProperty({ type: CreateOperateurDto })
  @ValidateNested()
  @Type(() => CreateOperateurDto)
  operateur: CreateOperateurDto;
}
export class CreateMouvementCollectionDto extends CreateMouvementDto {
  @ApiProperty({ description: '_id MongoDB du lingot associé' })
  @IsString()
  lingotId: string;
}
export class UpdateMouvementDto extends PartialType(CreateMouvementDto) {}

export class CreateLingotDto {
  @ApiProperty() @IsString() codeQR: string;
  @ApiProperty({ type: CreateFournisseurDto })
  @ValidateNested()
  @Type(() => CreateFournisseurDto)
  fournisseur: CreateFournisseurDto;
  @ApiProperty() @IsString() numeroCoulee: string;
  @ApiProperty() @IsNumber() numeroLingot: number;
  @ApiProperty() @IsNumber() poids: number;
  @ApiProperty({ type: CreateTauxAluminiumDto })
  @ValidateNested()
  @Type(() => CreateTauxAluminiumDto)
  tauxAluminium: CreateTauxAluminiumDto;
  @ApiProperty() @Type(() => Date) @IsDate() dateReception: Date;
  @ApiProperty({ type: CreateZoneDto })
  @ValidateNested()
  @Type(() => CreateZoneDto)
  zone: CreateZoneDto;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFusion?: Date;
}
export class UpdateLingotDto extends PartialType(CreateLingotDto) {}

export class CreateInventaireDto {
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

export class CreatePoidsParTauxDto {
  @ApiProperty({ type: CreateTauxAluminiumDto })
  @ValidateNested()
  @Type(() => CreateTauxAluminiumDto)
  taux: CreateTauxAluminiumDto;

  @ApiProperty() @IsNumber() poids: number;
}

export class CreateHistoriqueStockDto {
  @ApiProperty() @Type(() => Date) @IsDate() date: Date;
  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @IsNumber()
  quantiteMatte?: number | null;
  @ApiPropertyOptional({ type: CreateFournisseurDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFournisseurDto)
  fournisseur?: CreateFournisseurDto | null;
  @ApiProperty({ type: [CreatePoidsParTauxDto] })
  @ValidateNested({ each: true })
  @Type(() => CreatePoidsParTauxDto)
  quantiteParTaux: CreatePoidsParTauxDto[];
}
export class UpdateHistoriqueStockDto extends PartialType(
  CreateHistoriqueStockDto,
) {}

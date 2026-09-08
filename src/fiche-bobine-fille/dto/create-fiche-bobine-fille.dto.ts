import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import {
  DimensionsDto,
  RevetementsDto,
  FormatSortieDto,
  VitesseCentreDto,
  DefautDto,
} from '../../fiche-bobine-mere/dto/create-fiche-bobine-mere.dto.js';

export class FilleGeneralitesDto {
  @ApiProperty() @IsString() bobine: string;
  @ApiProperty() @IsNumber() lot: number;
  @ApiProperty() @IsNumber() montage: number;
  @ApiProperty() @IsString() commande: string;
  @ApiProperty() @IsString() client: string;
  @ApiProperty() @IsNumber() delai: number;
  @ApiProperty() @IsNumber() aspect: number;
  @ApiProperty() @IsNumber() planeite: number;
  @ApiProperty() @IsString() type: string;
}

export class FilleRevetementsDto {
  @ApiProperty({ type: RevetementsDto })
  @ValidateNested()
  @Type(() => RevetementsDto)
  consigne: RevetementsDto;

  @ApiProperty({ type: RevetementsDto })
  @ValidateNested()
  @Type(() => RevetementsDto)
  reel: RevetementsDto;
}

export class FilleFormatSortieDto {
  @ApiProperty({ type: FormatSortieDto })
  @ValidateNested()
  @Type(() => FormatSortieDto)
  consigne: FormatSortieDto;

  @ApiProperty({ type: FormatSortieDto })
  @ValidateNested()
  @Type(() => FormatSortieDto)
  reel: FormatSortieDto;
}

export class DecisionFilleDto {
  @ApiProperty() @IsString() codeDecision: string;
  @ApiProperty() @IsString() signatureInspecteur: string;
  @ApiProperty() @IsString() defautImputation1: string;
  @ApiProperty() @IsString() defautImputation2: string;
  @ApiProperty() @IsString() defautImputation3: string;
  @ApiProperty() @IsString() texteLibre: string;
}

export class CreateFicheBobineFilleDto {
  @ApiProperty() @IsString() bobine: string;

  @ApiProperty({ description: 'Numéro de la bobine mère associée' })
  @IsString()
  identiteBobineMere: string;

  @ApiProperty({ type: FilleGeneralitesDto })
  @ValidateNested()
  @Type(() => FilleGeneralitesDto)
  generalites: FilleGeneralitesDto;

  @ApiProperty({ type: DimensionsDto })
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  @ApiProperty({ type: FilleRevetementsDto })
  @ValidateNested()
  @Type(() => FilleRevetementsDto)
  revetements: FilleRevetementsDto;

  @ApiProperty({ type: FilleFormatSortieDto })
  @ValidateNested()
  @Type(() => FilleFormatSortieDto)
  formatSortie: FilleFormatSortieDto;

  @ApiProperty({ type: VitesseCentreDto })
  @ValidateNested()
  @Type(() => VitesseCentreDto)
  vitesseCentre: VitesseCentreDto;

  @ApiProperty({ type: [DefautDto] })
  @ValidateNested({ each: true })
  @Type(() => DefautDto)
  defauts: DefautDto[];

  @ApiProperty({ type: DecisionFilleDto })
  @ValidateNested()
  @Type(() => DecisionFilleDto)
  decision: DecisionFilleDto;
}

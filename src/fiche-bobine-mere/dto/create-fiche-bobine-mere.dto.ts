import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class GeneralitesDto {
  @ApiProperty() @IsString() bobine: string;
  @ApiProperty() @IsNumber() lot: number;
  @ApiProperty() @IsNumber() montage: number;
  @ApiProperty() @IsString() commande: string;
  @ApiProperty() @IsString() client: string;
  @ApiProperty() @IsNumber() delai: number;
  @ApiProperty() @IsString() halle: string;
  @ApiProperty() @IsString() emplacement: string;
  @ApiProperty() @IsNumber() aspect: number;
  @ApiProperty() @IsNumber() planeite: number;
  @ApiProperty() @IsString() outilAmont: string;
  @ApiProperty() @IsString() codeRecuit: string;
  @ApiProperty() @IsString() type: string;
}

export class DimensionsDto {
  @ApiProperty() @IsNumber() longueur: number;
  @ApiProperty() @IsNumber() larg: number;
  @ApiProperty() @IsNumber() epais: number;
  @ApiProperty() @IsNumber() poids: number;
  @ApiProperty() @IsNumber() diaExt: number;
  @ApiProperty() @IsNumber() diaArr: number;
  @ApiProperty() @IsNumber() diaHte: number;
  @ApiProperty() @IsString() outilAmont: string;
}

export class LimitesDto {
  @ApiProperty() @IsNumber() mini: number;
  @ApiProperty() @IsNumber() vise: number;
  @ApiProperty() @IsNumber() maxi: number;
}

export class RevetementsDto {
  @ApiProperty() @IsBoolean() refAuto: boolean;

  @ApiProperty({ type: LimitesDto })
  @ValidateNested()
  @Type(() => LimitesDto)
  avant: LimitesDto;

  @ApiProperty({ type: LimitesDto })
  @ValidateNested()
  @Type(() => LimitesDto)
  arriere: LimitesDto;
}

export class VitesseCentreDto {
  @ApiProperty() @IsNumber() n2: number;
  @ApiProperty() @IsNumber() rg: number;
  @ApiProperty() @IsNumber() rgRef: number;
}

export class ChutageDto {
  @ApiProperty() @IsNumber() debut: number;
  @ApiProperty() @IsNumber() fin: number;
  @ApiProperty() @IsString() causeDebut: string;
  @ApiProperty() @IsString() causeFin: string;
}

export class FormatSortieLimitesDto {
  @ApiProperty() @IsNumber() larg: number;
  @ApiProperty() @IsNumber() epai: number;
}

export class FormatSortieDto {
  @ApiProperty({ type: FormatSortieLimitesDto })
  @ValidateNested()
  @Type(() => FormatSortieLimitesDto)
  mini: FormatSortieLimitesDto;

  @ApiProperty({ type: FormatSortieLimitesDto })
  @ValidateNested()
  @Type(() => FormatSortieLimitesDto)
  vise: FormatSortieLimitesDto;

  @ApiProperty({ type: FormatSortieLimitesDto })
  @ValidateNested()
  @Type(() => FormatSortieLimitesDto)
  maxi: FormatSortieLimitesDto;
}

export class SuggestionDto {
  @ApiProperty() @IsNumber() ordre: number;
  @ApiProperty() @IsString() libelle: string;
}

export class DefautDto {
  @ApiProperty() @IsString() bobine: string;
  @ApiProperty() @IsNumber() numero: number;
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @IsNumber() debut: number;
  @ApiProperty() @IsNumber() fin: number;
  @ApiProperty() @IsString() long: string;
  @ApiProperty() @IsString() face: string;
  @ApiProperty() @IsNumber() imp: number;
  @ApiProperty() @IsString() renseignementComplementaires: string;
}

export class CreateFicheBobineMereDto {
  @ApiProperty() @IsString() bobine: string;

  @ApiProperty({ type: GeneralitesDto })
  @ValidateNested()
  @Type(() => GeneralitesDto)
  generalites: GeneralitesDto;

  @ApiProperty({ type: DimensionsDto })
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  @ApiProperty({ type: RevetementsDto })
  @ValidateNested()
  @Type(() => RevetementsDto)
  revetements: RevetementsDto;

  @ApiProperty({ type: VitesseCentreDto })
  @ValidateNested()
  @Type(() => VitesseCentreDto)
  vitesseCentre: VitesseCentreDto;

  @ApiProperty({ type: ChutageDto })
  @ValidateNested()
  @Type(() => ChutageDto)
  chutage: ChutageDto;

  @ApiProperty({ type: FormatSortieDto })
  @ValidateNested()
  @Type(() => FormatSortieDto)
  formatSortie: FormatSortieDto;

  @ApiProperty({ type: [SuggestionDto] })
  @ValidateNested({ each: true })
  @Type(() => SuggestionDto)
  suggestions: SuggestionDto[];

  @ApiProperty({ type: [DefautDto] })
  @ValidateNested({ each: true })
  @Type(() => DefautDto)
  defauts: DefautDto[];
}

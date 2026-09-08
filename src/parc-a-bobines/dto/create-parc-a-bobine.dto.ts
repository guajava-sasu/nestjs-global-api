import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AlerteTransitionDto {
  @ApiProperty() @IsString() BackgroundColor: string;
  @ApiProperty() @IsString() ForegroundColor: string;
  @ApiProperty() @IsString() Message: string;
}

export class CreateParcABobineDto {
  @ApiProperty() @IsString() bobine: string;
  @ApiProperty() @IsString() identite: string;
  @ApiProperty() @IsNumber() lot: number;
  @ApiProperty() @IsNumber() montage: number;
  @ApiProperty() @IsString() largeur: string;
  @ApiProperty() @IsNumber() diametre: number;
  @ApiProperty() @IsNumber() epaisseur: number;
  @ApiProperty() @IsNumber() poids: number;
  @ApiProperty() @IsString() cycle: string;
  @ApiProperty() @IsString() prod: string;
  @ApiProperty() @IsNumber() zav: number;
  @ApiProperty() @IsNumber() zar: number;
  @ApiProperty() @IsString() def: string;
  @ApiProperty() @IsString() client: string;
  @ApiProperty() @IsString() texteLibre: string;
  @ApiProperty() @IsString() commandes: string;
  @ApiProperty() @IsString() type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  Transition?: boolean;

  @ApiPropertyOptional({ type: AlerteTransitionDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AlerteTransitionDto)
  AlerteTransition?: AlerteTransitionDto;
}

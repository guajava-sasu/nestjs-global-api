import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MongoDocumentResponseDto } from '../../common/dto/http-response.dto.js';
import { TypeZoneDto } from './lingot.dto.js';

export class ConfigurationResponseDto extends MongoDocumentResponseDto {
  @ApiProperty({ example: 'nombreLingotsMaximum' }) cle: string;
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
  valeur: unknown;
  @ApiPropertyOptional() description?: string;
}

export class OperateurResponseDto extends MongoDocumentResponseDto {
  @ApiProperty() username: string;
  @ApiProperty() entreprise: string;
  @ApiProperty() nom: string;
  @ApiProperty() prenom: string;
  @ApiProperty() codeQR: string;
}

export class FournisseurResponseDto extends MongoDocumentResponseDto {
  @ApiProperty() nom: string;
  @ApiProperty() code: string;
}

export class TauxAluminiumResponseDto extends MongoDocumentResponseDto {
  @ApiProperty() nom: string;
  @ApiProperty({
    description: 'Couleur hexadécimale issue du design system',
    example: '#0072ce',
  })
  couleur: string;
}

export class ZoneResponseDto extends MongoDocumentResponseDto {
  @ApiProperty() code: string;
  @ApiProperty() nom: string;
  @ApiProperty({ type: () => TypeZoneDto })
  typeOperation: TypeZoneDto;
}

export class LingotResponseDto extends MongoDocumentResponseDto {
  @ApiProperty() codeQR: string;
  @ApiProperty({ type: () => FournisseurResponseDto })
  fournisseur: FournisseurResponseDto;
  @ApiProperty() numeroCoulee: string;
  @ApiProperty() numeroLingot: number;
  @ApiProperty() poids: number;
  @ApiProperty({ type: () => TauxAluminiumResponseDto })
  tauxAluminium: TauxAluminiumResponseDto;
  @ApiProperty({ type: String, format: 'date-time' })
  dateReception: Date;
  @ApiProperty({ type: () => ZoneResponseDto })
  zone: ZoneResponseDto;
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  dateFusion?: Date;
}

export class MouvementResponseDto extends MongoDocumentResponseDto {
  @ApiProperty({
    type: () => ZoneResponseDto,
    nullable: true,
    description: 'null pour le mouvement initial (arrivée en stock)',
  })
  depart: ZoneResponseDto | null;
  @ApiProperty({ type: () => ZoneResponseDto })
  arrivee: ZoneResponseDto;
  @ApiProperty({ type: String, format: 'date-time' })
  date: Date;
  @ApiProperty({ type: () => OperateurResponseDto })
  operateur: OperateurResponseDto;
  @ApiProperty({ type: () => LingotResponseDto })
  lingot: LingotResponseDto;
}

export class InventaireResponseDto extends MongoDocumentResponseDto {
  @ApiProperty({ type: String, format: 'date-time' })
  date: Date;
  @ApiProperty({ type: () => OperateurResponseDto })
  operateur: OperateurResponseDto;
  @ApiProperty({ type: () => [LingotResponseDto] })
  lingots: LingotResponseDto[];
}

export class MatteResponseDto extends MongoDocumentResponseDto {
  @ApiProperty({ type: String, format: 'date-time' })
  date: Date;
  @ApiProperty() quantite: number;
  @ApiProperty({ enum: ['ajout', 'suppression'] })
  action: 'ajout' | 'suppression';
  @ApiProperty() nouveauTotal: number;
  @ApiProperty({ type: () => OperateurResponseDto })
  operateur: OperateurResponseDto;
}

export class PoidsParTauxResponseDto {
  @ApiProperty({ type: () => TauxAluminiumResponseDto })
  taux: TauxAluminiumResponseDto;
  @ApiProperty() poids: number;
}

export class HistoriqueStockResponseDto extends MongoDocumentResponseDto {
  @ApiProperty({ type: String, format: 'date-time' })
  date: Date;
  @ApiProperty({ type: Number, nullable: true })
  quantiteMatte: number | null;
  @ApiProperty({ type: () => FournisseurResponseDto, nullable: true })
  fournisseur: FournisseurResponseDto | null;
  @ApiProperty({ type: () => [PoidsParTauxResponseDto] })
  quantiteParTaux: PoidsParTauxResponseDto[];
}

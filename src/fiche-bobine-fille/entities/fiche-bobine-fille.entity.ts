import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  Dimensions,
  DimensionsSchema,
  Revetements,
  RevetementsSchema,
  FormatSortie,
  FormatSortieSchema,
  VitesseCentre,
  VitesseCentreSchema,
  Defaut,
  DefautSchema,
} from '../../fiche-bobine-mere/entities/fiche-bobine-mere.entity.js';

@Schema({ _id: false })
export class FilleGeneralites {
  @Prop({ required: true })
  bobine: string;

  @Prop({ required: true })
  lot: number;

  @Prop({ required: true })
  montage: number;

  @Prop({ required: true })
  commande: string;

  @Prop({ required: true })
  client: string;

  @Prop({ required: true })
  delai: number;

  @Prop({ required: true })
  aspect: number;

  @Prop({ required: true })
  planeite: number;

  @Prop({ required: true })
  type: string;
}
export const FilleGeneralitesSchema = SchemaFactory.createForClass(FilleGeneralites);

@Schema({ _id: false })
export class FilleRevetements {
  @Prop({ type: RevetementsSchema, required: true })
  consigne: Revetements;

  @Prop({ type: RevetementsSchema, required: true })
  reel: Revetements;
}
export const FilleRevetementsSchema = SchemaFactory.createForClass(FilleRevetements);

@Schema({ _id: false })
export class FilleFormatSortie {
  @Prop({ type: FormatSortieSchema, required: true })
  consigne: FormatSortie;

  @Prop({ type: FormatSortieSchema, required: true })
  reel: FormatSortie;
}
export const FilleFormatSortieSchema = SchemaFactory.createForClass(FilleFormatSortie);

@Schema({ _id: false })
export class DecisionFille {
  @Prop({ required: true })
  codeDecision: string;

  @Prop({ required: true })
  signatureInspecteur: string;

  @Prop({ default: '' })
  defautImputation1: string;

  @Prop({ default: '' })
  defautImputation2: string;

  @Prop({ default: '' })
  defautImputation3: string;

  @Prop({ default: '' })
  texteLibre: string;
}
export const DecisionFilleSchema = SchemaFactory.createForClass(DecisionFille);

export type FicheBobineFilleDocument = HydratedDocument<FicheBobineFille>;

@Schema({ collection: 'fiches-bobines-filles', timestamps: true })
export class FicheBobineFille {
  @Prop({ required: true, unique: true, index: true })
  bobine: string;

  @Prop({ required: true, index: true })
  identiteBobineMere: string;

  @Prop({ type: FilleGeneralitesSchema, required: true })
  generalites: FilleGeneralites;

  @Prop({ type: DimensionsSchema, required: true })
  dimensions: Dimensions;

  @Prop({ type: FilleRevetementsSchema, required: true })
  revetements: FilleRevetements;

  @Prop({ type: FilleFormatSortieSchema, required: true })
  formatSortie: FilleFormatSortie;

  @Prop({ type: VitesseCentreSchema, required: true })
  vitesseCentre: VitesseCentre;

  @Prop({ type: [DefautSchema], default: [] })
  defauts: Defaut[];

  @Prop({ type: DecisionFilleSchema, required: true })
  decision: DecisionFille;
}

export const FicheBobineFilleSchema = SchemaFactory.createForClass(FicheBobineFille);

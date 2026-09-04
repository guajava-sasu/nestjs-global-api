import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class Generalites {
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
  halle: string;

  @Prop({ required: true })
  emplacement: string;

  @Prop({ required: true })
  aspect: number;

  @Prop({ required: true })
  planeite: number;

  @Prop({ required: true })
  outilAmont: string;

  @Prop({ required: true })
  codeRecuit: string;

  @Prop({ required: true })
  type: string;
}
export const GeneralitesSchema = SchemaFactory.createForClass(Generalites);

@Schema({ _id: false })
export class Dimensions {
  @Prop({ required: true })
  longueur: number;

  @Prop({ required: true })
  larg: number;

  @Prop({ required: true })
  epais: number;

  @Prop({ required: true })
  poids: number;

  @Prop({ required: true })
  diaExt: number;

  @Prop({ required: true })
  diaArr: number;

  @Prop({ required: true })
  diaHte: number;

  @Prop({ required: true })
  outilAmont: string;
}
export const DimensionsSchema = SchemaFactory.createForClass(Dimensions);

@Schema({ _id: false })
export class Limites {
  @Prop({ required: true })
  mini: number;

  @Prop({ required: true })
  vise: number;

  @Prop({ required: true })
  maxi: number;
}
export const LimitesSchema = SchemaFactory.createForClass(Limites);

@Schema({ _id: false })
export class Revetements {
  @Prop({ required: true, default: false })
  refAuto: boolean;

  @Prop({ type: LimitesSchema, required: true })
  avant: Limites;

  @Prop({ type: LimitesSchema, required: true })
  arriere: Limites;
}
export const RevetementsSchema = SchemaFactory.createForClass(Revetements);

@Schema({ _id: false })
export class VitesseCentre {
  @Prop({ required: true })
  n2: number;

  @Prop({ required: true })
  rg: number;

  @Prop({ required: true })
  rgRef: number;
}
export const VitesseCentreSchema = SchemaFactory.createForClass(VitesseCentre);

@Schema({ _id: false })
export class Chutage {
  @Prop({ required: true })
  debut: number;

  @Prop({ required: true })
  fin: number;

  @Prop({ required: true })
  causeDebut: string;

  @Prop({ required: true })
  causeFin: string;
}
export const ChutageSchema = SchemaFactory.createForClass(Chutage);

@Schema({ _id: false })
export class FormatSortieLimites {
  @Prop({ required: true })
  larg: number;

  @Prop({ required: true })
  epai: number;
}
export const FormatSortieLimitesSchema = SchemaFactory.createForClass(FormatSortieLimites);

@Schema({ _id: false })
export class FormatSortie {
  @Prop({ type: FormatSortieLimitesSchema, required: true })
  mini: FormatSortieLimites;

  @Prop({ type: FormatSortieLimitesSchema, required: true })
  vise: FormatSortieLimites;

  @Prop({ type: FormatSortieLimitesSchema, required: true })
  maxi: FormatSortieLimites;
}
export const FormatSortieSchema = SchemaFactory.createForClass(FormatSortie);

@Schema({ _id: false })
export class Suggestion {
  @Prop({ required: true })
  ordre: number;

  @Prop({ required: true })
  libelle: string;
}
export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);

@Schema({ _id: false })
export class Defaut {
  @Prop({ required: true })
  bobine: string;

  @Prop({ required: true })
  numero: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  debut: number;

  @Prop({ required: true })
  fin: number;

  @Prop({ required: true })
  long: string;

  @Prop({ required: true })
  face: string;

  @Prop({ required: true })
  imp: number;

  @Prop({ required: true })
  renseignementComplementaires: string;
}
export const DefautSchema = SchemaFactory.createForClass(Defaut);

export type FicheBobineMereDocument = HydratedDocument<FicheBobineMere>;

@Schema({ collection: 'fiches-bobines', timestamps: true })
export class FicheBobineMere {
  @Prop({ required: true, unique: true, index: true })
  bobine: string;

  @Prop({ type: GeneralitesSchema, required: true })
  generalites: Generalites;

  @Prop({ type: DimensionsSchema, required: true })
  dimensions: Dimensions;

  @Prop({ type: RevetementsSchema, required: true })
  revetements: Revetements;

  @Prop({ type: VitesseCentreSchema, required: true })
  vitesseCentre: VitesseCentre;

  @Prop({ type: ChutageSchema, required: true })
  chutage: Chutage;

  @Prop({ type: FormatSortieSchema, required: true })
  formatSortie: FormatSortie;

  @Prop({ type: [SuggestionSchema], default: [] })
  suggestions: Suggestion[];

  @Prop({ type: [DefautSchema], default: [] })
  defauts: Defaut[];
}

export const FicheBobineMereSchema = SchemaFactory.createForClass(FicheBobineMere);

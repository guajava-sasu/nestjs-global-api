import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TypeLingot = 'B' | 'OB' | 'VB' | 'BB' | 'N';

@Schema({ _id: false })
export class AnalyseLingot {
  @Prop({ required: true })
  al: number;

  @Prop({ required: true })
  fe: number;

  @Prop({ required: true })
  pb: number;
}
export const AnalyseLingotSchema = SchemaFactory.createForClass(AnalyseLingot);

export interface LigneReceptionLingot {
  numero: number;
  numeroLingotCoulee: string;
  typeLingot: string;
  poids: number | null;
}

export type LigneReceptionLingotDocument =
  HydratedDocument<LigneReceptionLingotRecord>;

@Schema({ collection: 'lignes-reception-lingots', timestamps: true })
export class LigneReceptionLingotRecord implements LigneReceptionLingot {
  @Prop({ required: true })
  numero: number;

  @Prop({ required: true })
  numeroLingotCoulee: string;

  @Prop({ required: true })
  typeLingot: string;

  @Prop({ type: Number, default: null })
  poids: number | null;
}
export const LigneReceptionLingotSchema = SchemaFactory.createForClass(
  LigneReceptionLingotRecord,
);

export interface LingotStock {
  id: string;
  poids: number;
  fournisseur: string;
  numeroCoulee: string;
  valide: boolean;
  numeroLingot: number;
  alFournisseur: number;
  alArcelor: number;
  dateReception: Date;
  type: TypeLingot;
  preparation?: string;
}

export type LingotStockDocument = HydratedDocument<LingotStockRecord>;

@Schema({ collection: 'lingots-stock', timestamps: true, versionKey: false })
export class LingotStockRecord implements LingotStock {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: true, min: 0 })
  poids: number;

  @Prop({ required: true })
  fournisseur: string;

  @Prop({ required: true, index: true })
  numeroCoulee: string;

  @Prop({ required: true, default: false })
  valide: boolean;

  @Prop({ required: true })
  numeroLingot: number;

  @Prop({ required: true })
  alFournisseur: number;

  @Prop({ required: true })
  alArcelor: number;

  @Prop({ required: true, type: Date })
  dateReception: Date;

  @Prop({ required: true, enum: ['B', 'OB', 'VB', 'BB', 'N'] })
  type: TypeLingot;

  @Prop()
  preparation?: string;
}
export const LingotStockSchema =
  SchemaFactory.createForClass(LingotStockRecord);

export interface LivraisonFournisseur {
  dateLivraison: Date;
  fournisseur: string;
  numeroCoulee: string;
  analyseFournisseur: AnalyseLingot;
  analyseArcelor: AnalyseLingot;
  nbLingots: number;
  tonnage: number;
  type: TypeLingot;
  couleeValidee: boolean;
}

export type LivraisonFournisseurDocument =
  HydratedDocument<LivraisonFournisseurRecord>;

@Schema({ collection: 'livraisons-fournisseurs', timestamps: true })
export class LivraisonFournisseurRecord implements LivraisonFournisseur {
  @Prop({ required: true, type: Date })
  dateLivraison: Date;

  @Prop({ required: true })
  fournisseur: string;

  @Prop({ required: true, index: true })
  numeroCoulee: string;

  @Prop({ type: AnalyseLingotSchema, required: true })
  analyseFournisseur: AnalyseLingot;

  @Prop({ type: AnalyseLingotSchema, required: true })
  analyseArcelor: AnalyseLingot;

  @Prop({ required: true, min: 0 })
  nbLingots: number;

  @Prop({ required: true, min: 0 })
  tonnage: number;

  @Prop({ required: true, enum: ['B', 'OB', 'VB', 'BB', 'N'] })
  type: TypeLingot;

  @Prop({ required: true, default: false })
  couleeValidee: boolean;
}
export const LivraisonFournisseurSchema = SchemaFactory.createForClass(
  LivraisonFournisseurRecord,
);

export interface EtatStockType {
  nombre: number;
  poids: number;
}

@Schema({ _id: false })
export class EtatStockTypeRecord implements EtatStockType {
  @Prop({ required: true })
  nombre: number;

  @Prop({ required: true })
  poids: number;
}
export const EtatStockTypeSchema =
  SchemaFactory.createForClass(EtatStockTypeRecord);

@Schema({ _id: false })
export class EtatStockParType {
  @Prop({ type: EtatStockTypeSchema })
  B?: EtatStockType;

  @Prop({ type: EtatStockTypeSchema })
  OB?: EtatStockType;

  @Prop({ type: EtatStockTypeSchema })
  VB?: EtatStockType;

  @Prop({ type: EtatStockTypeSchema })
  BB?: EtatStockType;

  @Prop({ type: EtatStockTypeSchema })
  N?: EtatStockType;
}
export const EtatStockParTypeSchema =
  SchemaFactory.createForClass(EtatStockParType);

export interface EtatStockJournalier {
  date: Date;
  parType: Partial<Record<TypeLingot, EtatStockType>>;
  mattes: number;
}

export type EtatStockJournalierDocument =
  HydratedDocument<EtatStockJournalierRecord>;

@Schema({ collection: 'etats-stock-journaliers', timestamps: true })
export class EtatStockJournalierRecord implements EtatStockJournalier {
  @Prop({ required: true, type: Date, index: true })
  date: Date;

  @Prop({ type: EtatStockParTypeSchema, required: true })
  parType: Partial<Record<TypeLingot, EtatStockType>>;

  @Prop({ required: true, default: 0 })
  mattes: number;
}
export const EtatStockJournalierSchema = SchemaFactory.createForClass(
  EtatStockJournalierRecord,
);

export interface MouvementLingot {
  date: Date;
  poste: string;
  type: TypeLingot | 'MATTE';
  numeroCoulee?: string;
  numeroLingot?: number;
  poids: number;
  al?: number;
  table?: string;
  creuset: string;
}

export type MouvementLingotDocument = HydratedDocument<MouvementLingotRecord>;

@Schema({ collection: 'mouvements-lingots', timestamps: true })
export class MouvementLingotRecord implements MouvementLingot {
  @Prop({ required: true, type: Date, index: true })
  date: Date;

  @Prop({ required: true })
  poste: string;

  @Prop({ required: true, enum: ['B', 'OB', 'VB', 'BB', 'N', 'MATTE'] })
  type: TypeLingot | 'MATTE';

  @Prop()
  numeroCoulee?: string;

  @Prop()
  numeroLingot?: number;

  @Prop({ required: true, min: 0 })
  poids: number;

  @Prop()
  al?: number;

  @Prop()
  table?: string;

  @Prop({ required: true })
  creuset: string;
}
export const MouvementLingotSchema = SchemaFactory.createForClass(
  MouvementLingotRecord,
);

export interface BilanLingotsJour {
  date: Date;
  pot: number;
  alM: number;
  alA: number;
  alN: number;
  alJ: number;
  typeBc: number;
  typeJ: number;
  typeO: number;
  typeV: number;
  typeB: number;
  typeN: number;
  mattes: number;
}

export type BilanLingotsJourDocument = HydratedDocument<BilanLingotsJourRecord>;

@Schema({ collection: 'bilans-lingots-jours', timestamps: true })
export class BilanLingotsJourRecord implements BilanLingotsJour {
  @Prop({ required: true, type: Date, index: true })
  date: Date;

  @Prop({ required: true })
  pot: number;

  @Prop({ required: true })
  alM: number;

  @Prop({ required: true })
  alA: number;

  @Prop({ required: true })
  alN: number;

  @Prop({ required: true })
  alJ: number;

  @Prop({ required: true })
  typeBc: number;

  @Prop({ required: true })
  typeJ: number;

  @Prop({ required: true })
  typeO: number;

  @Prop({ required: true })
  typeV: number;

  @Prop({ required: true })
  typeB: number;

  @Prop({ required: true })
  typeN: number;

  @Prop({ required: true })
  mattes: number;
}
export const BilanLingotsJourSchema = SchemaFactory.createForClass(
  BilanLingotsJourRecord,
);

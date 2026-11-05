import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LingotDocument = HydratedDocument<LingotRecord>;
export type InventaireDocument = HydratedDocument<InventaireRecord>;
export type MatteDocument = HydratedDocument<MatteRecord>;
export type OperateurDocument = HydratedDocument<OperateurRecord>;
export type FournisseurDocument = HydratedDocument<FournisseurRecord>;
export type TauxAluminiumDocument = HydratedDocument<TauxAluminiumRecord>;
export type ZoneDocument = HydratedDocument<ZoneRecord>;

export interface Operateur {
  _id: Types.ObjectId;
  username: string;
  entreprise: string;
  nom: string;
  prenom: string;
  codeQR: string;
}

export interface Zone {
  _id: Types.ObjectId;
  code: string;
  nom: string;
}

export interface Mouvement {
  _id: Types.ObjectId;
  depart: Zone | null;
  arrivee: Zone;
  date: Date;
  operateur: Operateur;
  lingot: Lingot;
}

export interface HistoriqueStock {
  _id: Types.ObjectId;
  date: Date;
  quantiteMatte: number;
  fournisseur: Fournisseur;
  quantiteParTaux: { taux: TauxAluminium; poids: number }[];
}

export interface Lingot {
  _id: Types.ObjectId;
  fournisseur: Fournisseur;
  numeroCoulee: string;
  numeroLingot: number;
  dateReception: Date;
  tauxAluminium: TauxAluminium;
  poids: number;
  zone: Zone;
  dateFusion?: Date;
  codeQR: string;
}

export interface Matte {
  _id: Types.ObjectId;
  date: Date;
  quantite: number;
  action: string; // ajout ou suppression
  nouveauTotal: number;
  operateur: Operateur;
}

export interface Inventaire {
  _id: Types.ObjectId;
  date: Date;
  operateur: Operateur;
  lingots: Lingot[];
}

export interface TauxAluminium {
  _id: Types.ObjectId;
  nom: string;
  couleur: string;
  /**  'B' | 'OB' | 'VB' | 'BB' | 'N' */
  type: string;
}

export interface Fournisseur {
  _id: Types.ObjectId;
  nom: string;
  code: string;
}

@Schema({
  collection: 'operateurs-lingots',
  timestamps: true,
  versionKey: false,
})
export class OperateurRecord {
  declare _id: Types.ObjectId;
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  entreprise: string;

  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop({ required: true, unique: true })
  codeQR: string;
}
export const OperateurSchema = SchemaFactory.createForClass(OperateurRecord);

@Schema({
  collection: 'fournisseurs-lingots',
  timestamps: true,
  versionKey: false,
})
export class FournisseurRecord {
  declare _id: Types.ObjectId;
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  code: string;
}
export const FournisseurSchema =
  SchemaFactory.createForClass(FournisseurRecord);

@Schema({
  collection: 'taux-aluminium-lingots',
  timestamps: true,
  versionKey: false,
})
export class TauxAluminiumRecord {
  declare _id: Types.ObjectId;
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  couleur: string;

  @Prop({ required: true })
  type: string;
}
export const TauxAluminiumSchema =
  SchemaFactory.createForClass(TauxAluminiumRecord);

@Schema({
  collection: 'zones-lingots',
  timestamps: true,
  versionKey: false,
})
export class ZoneRecord {
  declare _id: Types.ObjectId;
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  nom: string;
}
export const ZoneSchema = SchemaFactory.createForClass(ZoneRecord);

@Schema({ collection: 'lingots', timestamps: true, versionKey: false })
export class LingotRecord {
  declare _id: Types.ObjectId;
  @Prop({ required: true, unique: true, index: true })
  codeQR: string;

  @Prop({ type: FournisseurSchema, required: true })
  fournisseur: Fournisseur;

  @Prop({ required: true, index: true })
  numeroCoulee: string;

  @Prop({ required: true, min: 0 })
  numeroLingot: number;

  @Prop({ required: true, min: 0 })
  poids: number;

  @Prop({ type: TauxAluminiumSchema, required: true })
  tauxAluminium: TauxAluminium;

  @Prop({ required: true, type: Date })
  dateReception: Date;

  @Prop({ type: ZoneSchema, required: true })
  zone: Zone;

  @Prop({ type: Date })
  dateFusion?: Date;
}
export const LingotSchema = SchemaFactory.createForClass(LingotRecord);
export const LingotSnapshotSchema = LingotSchema.clone();
LingotSnapshotSchema.clearIndexes();

@Schema({
  collection: 'mouvements-lingots',
  timestamps: true,
  versionKey: false,
})
export class MouvementRecord {
  declare _id: Types.ObjectId;
  @Prop({ type: ZoneSchema, default: null })
  depart: Zone | null;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: ZoneSchema, required: true })
  arrivee: Zone;

  @Prop({ type: OperateurSchema, required: true })
  operateur: Operateur;

  @Prop({ type: LingotSnapshotSchema, required: true })
  lingot: Lingot;
}
export const MouvementSchema = SchemaFactory.createForClass(MouvementRecord);

@Schema({
  collection: 'inventaires-lingots',
  timestamps: true,
  versionKey: false,
})
export class InventaireRecord {
  declare _id: Types.ObjectId;
  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: OperateurSchema, required: true })
  operateur: Operateur;

  @Prop({ type: [LingotSnapshotSchema], default: [] })
  lingots: Lingot[];
}
export const InventaireSchema = SchemaFactory.createForClass(InventaireRecord);

@Schema({ collection: 'matte-lingots', timestamps: true, versionKey: false })
export class MatteRecord {
  declare _id: Types.ObjectId;
  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, min: 0 })
  quantite: number;

  @Prop({ required: true, enum: ['ajout', 'suppression'] })
  action: string;

  @Prop({ required: true, min: 0 })
  nouveauTotal: number;

  @Prop({ type: OperateurSchema, required: true })
  operateur: Operateur;
}
export const MatteSchema = SchemaFactory.createForClass(MatteRecord);

@Schema({ _id: false })
export class QuantiteParTauxRecord {
  @Prop({ type: TauxAluminiumSchema, required: true })
  taux: TauxAluminium;

  @Prop({ required: true, min: 0 })
  poids: number;
}
export const QuantiteParTauxSchema =
  SchemaFactory.createForClass(QuantiteParTauxRecord);

@Schema({
  collection: 'historique-stock-lingots',
  timestamps: true,
  versionKey: false,
})
export class HistoriqueStockRecord {
  declare _id: Types.ObjectId;
  @Prop({ required: true, type: Date, index: true })
  date: Date;

  @Prop({ required: true, min: 0 })
  quantiteMatte: number;

  @Prop({ type: FournisseurSchema, required: true })
  fournisseur: Fournisseur;

  @Prop({ type: [QuantiteParTauxSchema], default: [] })
  quantiteParTaux: HistoriqueStock['quantiteParTaux'];
}
export const HistoriqueStockSchema =
  SchemaFactory.createForClass(HistoriqueStockRecord);

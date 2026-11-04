import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TypeLingot = 'B' | 'OB' | 'VB' | 'BB' | 'N';

export type LingotDocument = HydratedDocument<LingotRecord>;
export type InventaireDocument = HydratedDocument<InventaireRecord>;
export type MatteDocument = HydratedDocument<MatteRecord>;
export type OperateurDocument = HydratedDocument<OperateurRecord>;
export type FournisseurDocument = HydratedDocument<FournisseurRecord>;
export type TauxAluminiumDocument = HydratedDocument<TauxAluminiumRecord>;
export type PositionDocument = HydratedDocument<PositionRecord>;

export interface Operateur {
  id: string;
  username: string;
  entreprise: string;
  nom: string;
  prenom: string;
}

@Schema({
  collection: 'operateurs-lingots',
  timestamps: true,
  versionKey: false,
})
export class OperateurRecord implements Operateur {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  entreprise: string;

  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;
}
export const OperateurSchema = SchemaFactory.createForClass(OperateurRecord);

export interface Lingot {
  id: string;
  codeQR: string;
  fournisseur: Fournisseur;
  numeroCoulee: string;
  numeroLingot: number;
  poids: number;
  type: TypeLingot;
  tauxAluminium: TauxAluminium;
  dateReception: Date;
  reference: string;
  positionActuelle: Position;
  /**Liste des changement de position du lingot au fil du temps */
  mouvements: Mouvement[];
}

@Schema({
  collection: 'fournisseurs-lingots',
  timestamps: true,
  versionKey: false,
})
export class FournisseurRecord implements Fournisseur {
  @Prop({ unique: true, sparse: true, index: true })
  id?: string;

  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  code: string;
}
export const FournisseurSchema =
  SchemaFactory.createForClass(FournisseurRecord);

export interface Fournisseur {
  id?: string;
  nom: string;
  code: string;
}

@Schema({
  collection: 'taux-aluminium-lingots',
  timestamps: true,
  versionKey: false,
})
export class TauxAluminiumRecord implements TauxAluminium {
  @Prop({ unique: true, sparse: true, index: true })
  id?: string;

  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  couleur: string;
}
export const TauxAluminiumSchema =
  SchemaFactory.createForClass(TauxAluminiumRecord);

export interface TauxAluminium {
  id?: string;
  nom: string;
  couleur: string;
}

@Schema({
  collection: 'positions-lingots',
  timestamps: true,
  versionKey: false,
})
export class PositionRecord implements Position {
  @Prop({ unique: true, sparse: true, index: true })
  id?: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  nom: string;
}
export const PositionSchema = SchemaFactory.createForClass(PositionRecord);

@Schema({ _id: false })
export class MouvementRecord implements Mouvement {
  @Prop({ unique: true, sparse: true, index: true })
  id?: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: OperateurSchema, required: true })
  operateur: Operateur;

  @Prop({ type: PositionSchema, required: true })
  position: Position;
}
export const MouvementSchema = SchemaFactory.createForClass(MouvementRecord);

@Schema({ collection: 'lingots', timestamps: true, versionKey: false })
export class LingotRecord implements Lingot {
  @Prop({ required: true, unique: true, index: true })
  id: string;

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

  @Prop({ required: true, enum: ['B', 'OB', 'VB', 'BB', 'N'] })
  type: TypeLingot;

  @Prop({ type: TauxAluminiumSchema, required: true })
  tauxAluminium: TauxAluminium;

  @Prop({ required: true, type: Date })
  dateReception: Date;

  @Prop({ required: true })
  reference: string;

  @Prop({ type: PositionSchema, required: true })
  positionActuelle: Position;

  @Prop({ type: [MouvementSchema], default: [] })
  mouvements: Mouvement[];
}
export const LingotSchema = SchemaFactory.createForClass(LingotRecord);

export interface Inventaire {
  id?: string;
  date: Date;
  operateur: Operateur;
  lingots: Lingot[];
}

@Schema({
  collection: 'inventaires-lingots',
  timestamps: true,
  versionKey: false,
})
export class InventaireRecord implements Inventaire {
  @Prop({ unique: true, sparse: true, index: true })
  id?: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: OperateurSchema, required: true })
  operateur: Operateur;

  @Prop({ type: [LingotSchema], default: [] })
  lingots: Lingot[];
}
export const InventaireSchema = SchemaFactory.createForClass(InventaireRecord);

export interface Matte {
  id?: string;
  date: Date;
  quantite: number;
  action: string; // ajout ou suppression
  nouveauTotal: number;
  operateur: Operateur;
}

@Schema({ collection: 'matte-lingots', timestamps: true, versionKey: false })
export class MatteRecord implements Matte {
  @Prop({ unique: true, sparse: true, index: true })
  id?: string;

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

export interface Position {
  id?: string;
  code: string;
  nom: string;
}

export interface Mouvement {
  id?: string;
  date: Date;
  operateur: Operateur;
  position: Position;
}

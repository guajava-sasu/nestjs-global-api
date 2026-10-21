import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  AlerteTransition,
  AlerteTransitionSchema,
} from '../../parc-a-bobines/entities/parc-a-bobine.entity.js';

@Schema({ collection: 'chariots', timestamps: true })
export class Chariot {
  @Prop({ required: true, unique: true, index: true })
  numero: number;

  @Prop({ default: '' })
  bobine: string;
}
export const ChariotSchema = SchemaFactory.createForClass(Chariot);

@Schema({ collection: 'demandes-pontier', timestamps: true })
export class DemandePontier {
  @Prop({ required: true, enum: ['Chargement', 'Dechargement'] })
  sens: string;

  @Prop({ default: '' })
  bobine: string;

  @Prop({ default: '' })
  halle: string;

  @Prop({ default: '' })
  chariot: string;
}
export const DemandePontierSchema = SchemaFactory.createForClass(DemandePontier);

@Schema({ collection: 'preparations-chargement', timestamps: true })
export class PreparationChargement {
  @Prop({ default: '' })
  bobine: string;

  @Prop({ required: true })
  halle: string;

  @Prop({ type: Number, default: null })
  chariot: number | null;
}
export const PreparationChargementSchema = SchemaFactory.createForClass(PreparationChargement);

@Schema({ _id: false })
export class CalculPreset {
  @Prop({ required: true })
  isValid: boolean;

  @Prop({ required: true })
  isCalculated: boolean;
}
export const CalculPresetSchema = SchemaFactory.createForClass(CalculPreset);

@Schema({ collection: 'bobines-stockage', timestamps: true })
export class BobineStockage {
  @Prop({ required: true, enum: ['N', 'S'], index: true })
  type: string;

  @Prop({ required: true, unique: true, index: true })
  bobine: string;

  @Prop({ required: true }) lot: string;
  @Prop({ required: true }) montage: number;
  @Prop({ required: true }) largeur: string;
  @Prop({ required: true }) epaisseur: number;
  @Prop({ required: true }) poids: number;
  @Prop({ required: true }) cycle: string;
  @Prop({ required: true }) prod: string;
  @Prop({ required: true }) diametre: number;
  @Prop({ required: true }) halle: string;
  @Prop({ required: true }) client: string;
  @Prop({ default: '' }) priorite: string;

  @Prop({ default: false })
  reserve?: boolean;

  @Prop({ type: CalculPresetSchema })
  calculPreset?: CalculPreset;

  @Prop()
  Transition?: boolean;

  @Prop({ type: AlerteTransitionSchema })
  AlerteTransition?: AlerteTransition;
}
export const BobineStockageSchema = SchemaFactory.createForClass(BobineStockage);

@Schema({ collection: 'bobines-chutage', timestamps: true })
export class BobineAChuter {
  @Prop({ required: true, unique: true, index: true }) bobine: string;
  @Prop({ required: true }) lgE: number;
  @Prop({ required: true }) lgS: number;
  @Prop({ default: '' }) fini: string;
  @Prop({ required: true }) selected: boolean;
}
export const BobineAChuterSchema = SchemaFactory.createForClass(BobineAChuter);

@Schema({ collection: 'chutes-bobines', timestamps: true })
export class DetailChuteBobine {
  @Prop({ required: true, index: true }) bobine: string;
  @Prop({ required: true, enum: ['E', 'S'] }) lieu: string;
  @Prop({ required: true }) position: number;
  @Prop({ required: true }) longueur: number;
  @Prop({ type: Number, default: null }) poids: number | null;
  @Prop({ required: true }) defaut: string;
  @Prop({ required: true }) imputation: number;
  @Prop({ required: true }) revAV: number;
  @Prop({ required: true }) revAR: number;
}
export const DetailChuteBobineSchema = SchemaFactory.createForClass(DetailChuteBobine);

@Schema({ collection: 'chutes-rives', timestamps: true })
export class ChuteRive {
  @Prop({ required: true, index: true }) bobine: string;
  @Prop({ required: true, enum: ['E', 'S'] }) lieu: string;
  @Prop({ required: true }) largeur: number;
  @Prop({ required: true }) longueur: number;
  @Prop({ required: true }) poids: number;
  @Prop({ required: true }) defaut: string;
  @Prop({ required: true }) imputation: number;
  @Prop({ required: true }) revAV: number;
  @Prop({ required: true }) revAR: number;
}
export const ChuteRiveSchema = SchemaFactory.createForClass(ChuteRive);

@Schema({ _id: false })
export class EtatPont {
  @Prop({ required: true }) id: number;
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) color: string;
}
export const EtatPontSchema = SchemaFactory.createForClass(EtatPont);

@Schema({ collection: 'ponts-etat-pince', timestamps: true })
export class PontEtatPince {
  @Prop({ required: true, type: EtatPontSchema }) pont: EtatPont;
  @Prop({ required: true, type: EtatPontSchema }) etat: EtatPont;
  @Prop({ default: '' }) pince: string;
}
export const PontEtatPinceSchema = SchemaFactory.createForClass(PontEtatPince);
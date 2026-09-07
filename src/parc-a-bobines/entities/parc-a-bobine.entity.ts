import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class AlerteTransition {
  @Prop({ required: true })
  BackgroundColor: string;

  @Prop({ required: true })
  ForegroundColor: string;

  @Prop({ required: true })
  Message: string;
}
export const AlerteTransitionSchema = SchemaFactory.createForClass(AlerteTransition);

export type ParcABobineDocument = HydratedDocument<ParcABobine>;

@Schema({ collection: 'parc-a-bobines', timestamps: true })
export class ParcABobine {
  @Prop({ required: true, unique: true, index: true })
  bobine: string;

  @Prop({ required: true })
  identite: string;

  @Prop({ required: true })
  lot: number;

  @Prop({ required: true })
  montage: number;

  @Prop({ required: true })
  largeur: string;

  @Prop({ required: true })
  diametre: number;

  @Prop({ required: true })
  epaisseur: number;

  @Prop({ required: true })
  poids: number;

  @Prop({ required: true })
  cycle: string;

  @Prop({ required: true })
  prod: string;

  @Prop({ required: true })
  zav: number;

  @Prop({ required: true })
  zar: number;

  @Prop({ required: true })
  def: string;

  @Prop({ required: true })
  client: string;

  @Prop({ required: true })
  texteLibre: string;

  @Prop({ required: true })
  commandes: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  Transition?: boolean;

  @Prop({ type: AlerteTransitionSchema })
  AlerteTransition?: AlerteTransition;
}

export const ParcABobineSchema = SchemaFactory.createForClass(ParcABobine);

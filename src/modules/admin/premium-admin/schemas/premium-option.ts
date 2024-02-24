import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PremiumOptionSchemaDocument = HydratedDocument<PremiumOption>;

@Schema({ timestamps: true, collection: 'premiumoptions' })
export class PremiumOption {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  monthly: number;

  @Prop({ required: true })
  yearly: number;

  @Prop({ required: true })
  precent: number;

  @Prop({ type: [{ item: { type: String }, subList: [{ type: String }] }], required: true })
  majorInfo: { item: string, subList: string[] }[];
}

export const PremiumOptionSchema = SchemaFactory.createForClass(PremiumOption);

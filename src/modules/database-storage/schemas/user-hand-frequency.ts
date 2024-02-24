
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CardFrequencyDocument = HydratedDocument<CardFrequency>;

@Schema()
export class CardFrequency {
  @Prop()
  userId: string;

  @Prop({ type: Map })
  frequencyStatus: Map<string, {
    fold: number;
    call: number;
    raise: number;
    allin: number;
  }>;
}

export const CardFrequencySchema = SchemaFactory.createForClass(CardFrequency);

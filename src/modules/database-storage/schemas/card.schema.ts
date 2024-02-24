import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CardSchemaDocument = HydratedDocument<Card>;

@Schema()
export class Card {
  @Prop({
    type: { rank: String, suit: String },
    _id: false,
  })
  cards: {
    rank: string;
    suit: string;
  };
}

export const CardSchema = SchemaFactory.createForClass(Card);

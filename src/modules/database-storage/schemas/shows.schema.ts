import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Card } from './card.schema';

export type ShowsSchemaDocument = HydratedDocument<Shows>;

@Schema()
export class Shows {
  @Prop({
    type: { playerName: String, cards: Array<Card> },
    _id: false,
  })
  shows: {
    playerName: string;
    cards: {
      rank: string;
      suit: string;
    }[];
  };
}

export const ShowsSchema = SchemaFactory.createForClass(Shows);

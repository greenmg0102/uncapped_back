import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CollectedSchemaDocument = HydratedDocument<Collected>;

@Schema()
export class Collected {
  @Prop({
    type: { playerName: String, amount: Number },
    _id: false,
  })
  collected: {
    playerName: string;
    amount: string;
  };
}

export const CollectedSchema = SchemaFactory.createForClass(Collected);

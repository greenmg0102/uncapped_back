import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose'

export type SupportSchemaDocument = HydratedDocument<Support>;

@Schema({ timestamps: true, collection: 'supports' })
export class Support {

  @Prop({ required: true })
  fullName: string

  @Prop({ required: true })
  mail: string

  @Prop({ required: true })
  phone: string

  @Prop({ required: true })
  type: string

  @Prop({ required: true })
  subject: string

  @Prop({ required: true })

  @Prop({ _id: false })
  question: {
    query: string;
    who: Boolean;
    supportedDate: string
  }[];

  @Prop({ required: true, default: false })
  checked: boolean

}

export const SupportSchema = SchemaFactory.createForClass(Support);

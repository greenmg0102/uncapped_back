import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type NotificationSchemaDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  content: string

  @Prop({ required: true })
  sender: string;

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
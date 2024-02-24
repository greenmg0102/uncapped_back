import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Profile } from '../../payment/schemas/profile.schema'

export type ActivitylogSchemaDocument = HydratedDocument<Activitylog>;

@Schema({ timestamps: true, collection: 'activitylogs' })
export class Activitylog {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Profiles' })
  profilesId: Profile

  @Prop({ required: true })
  accessIp: string

  @Prop({ required: true })
  activity: string

}

export const ActivitylogSchema = SchemaFactory.createForClass(Activitylog);
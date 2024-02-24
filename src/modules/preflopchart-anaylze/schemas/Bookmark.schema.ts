import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Profile } from '../../payment/schemas/profile.schema'

interface FlagObject {
  chipAmount: number;
  position: string;
}

export type BookmarkSchemaDocument = HydratedDocument<Bookmark>;

@Schema()
export class Bookmark {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Profiles' })
  profilesId: Profile

  @Prop({ required: false, type: SchemaTypes.Mixed }) // Using SchemaTypes.Mixed for flexibility
  flags: FlagObject[]

}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);

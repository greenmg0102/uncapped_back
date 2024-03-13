import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../../users/schemas/user.schema'

export type ProfileDocument = HydratedDocument<Profile>

@Schema({ timestamps: true, collection: 'Profiles' })
export class Profile {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Users', unique: true })
  userId: User

  @Prop()
  displayName?: string

  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true })
  socialAvatar: string

  @Prop({ type: SchemaTypes.ObjectId, ref: 'roles' })
  role: string

  @Prop({ type: SchemaTypes.ObjectId, ref: 'premiumoptions' })
  premiumId: string
  
  @Prop()
  nationality?: string

  @Prop({ type: SchemaTypes.Array })
  rooms?: Array<string>

  @Prop({ type: SchemaTypes.Array })
  formats?: Array<string>

  @Prop({ type: SchemaTypes.Array })
  types?: Array<string>

  @Prop({ type: SchemaTypes.Array })
  stakes?: Array<string>

  @Prop()
  biography?: string
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)
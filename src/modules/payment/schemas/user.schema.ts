import { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ActiveSubscription } from '../interfaces'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true, collection: 'Users' })
export class User {
  @Prop()
  googleId: string

  @Prop()
  facebookId: string

  @Prop()
  customerId?: string

  @Prop({ required: true })
  email: string
  
  @Prop({ required: false })
  password: string

  @Prop()
  subscriptionId?: string

  @Prop({
    type: {
      gameType: String,
      name: String
    }
  })
  subscriptionDetails?: ActiveSubscription

  @Prop()
  isVerifiedEmail?: boolean

  @Prop()
  isActive?: boolean

  @Prop({ required: true })
  provider: string

  @Prop()
  accessToken?: string

  @Prop()
  refreshToken?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
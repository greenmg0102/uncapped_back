import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type RoleDocument = HydratedDocument<Role>

@Schema({ collection: 'Roles' })
export class Role {

  @Prop()
  roleName?: string

  @Prop({ type: SchemaTypes.Array })
  admittingPageList?: Array<string>

}

export const RoleSchema = SchemaFactory.createForClass(Role)
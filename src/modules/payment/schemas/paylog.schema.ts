import { HydratedDocument, SchemaTypes } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Profile } from '../schemas/profile.schema'
import { PremiumOption } from '../../admin/premium-admin/schemas/premium-option'

interface PayInvoice {
  payment_id: number;
  invoice_id: number | null;
  payment_status: string;
  pay_address: string;
}

export type PayLogSchemaDocument = HydratedDocument<PayLog>;

@Schema({ timestamps: true })
export class PayLog {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Profiles' })
  profilesId: Profile

  @Prop({ type: SchemaTypes.ObjectId, ref: 'premiumoptions' })
  premiumId: PremiumOption

  @Prop({ required: true })
  currentType: number      // 0: classical  1: crypto

  @Prop({ required: true })
  period: number    // 0: monthly  1: yearly

  @Prop({ required: true })
  price: number;

  @Prop({ required: false, type: SchemaTypes.Mixed }) // Using SchemaTypes.Mixed for flexibility
  invoice: PayInvoice;

}

export const PayLogSchema = SchemaFactory.createForClass(PayLog);
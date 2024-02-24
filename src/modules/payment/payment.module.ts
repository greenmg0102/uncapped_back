import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './controllers/payment.controller';
import { GenerateService } from './services/crypto/generate.service';
import { PayLog, PayLogSchema } from '../payment/schemas/paylog.schema';
import { Profile, ProfileSchema } from '../payment/schemas/profile.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PayLog.name, schema: PayLogSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [
    PaymentController
  ],
  providers: [
    GenerateService,
  ]
})
export class PaymentModule { }

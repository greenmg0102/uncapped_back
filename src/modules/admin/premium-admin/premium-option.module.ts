import { Module } from '@nestjs/common';
import { PremiumCreateService } from './services/premium-create.service';
import { PremiumOptionController } from './controllers/premium-option.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PremiumOption, PremiumOptionSchema } from 'src/modules/admin/premium-admin/schemas/premium-option';

@Module({
  imports: [MongooseModule.forFeature([{ name: PremiumOption.name, schema: PremiumOptionSchema }])],
  providers: [PremiumCreateService],
  controllers: [
    PremiumOptionController
  ]
})

export class PremiumOptionModule { }
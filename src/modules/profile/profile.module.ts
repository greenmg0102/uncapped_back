import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { PremiumOptionService } from './services/premiumOption.service';
import { ProfileController } from './controllers/profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HandHistory, HandHistorySchema } from 'src/modules/database-storage/schemas/hand-history.schema';
import { PremiumOption, PremiumOptionSchema } from 'src/modules/admin/premium-admin/schemas/premium-option';
import { Profile, ProfileSchema } from 'src/modules/profiles/schemas/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HandHistory.name, schema: HandHistorySchema },
      { name: PremiumOption.name, schema: PremiumOptionSchema },
      { name: Profile.name, schema: ProfileSchema }
    ])
  ],
  providers: [ProfileService, PremiumOptionService],
  controllers: [
    ProfileController
  ]
})

export class ProfileModule { }
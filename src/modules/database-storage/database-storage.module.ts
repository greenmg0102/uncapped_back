import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbClientService } from './services/mongodb-client.service';
import { HandHistoryDataWriterService } from './services/hand-history-data-writer.service';

import { DatabaseController } from './controllers/database.controller';
import { RoomTypes } from 'src/common/constants/common.constants';
import { HandHistoryRepository } from './services/hand-history-strategy.service';
import { UserHandFrequencyRepository } from 'src/modules/database-storage/services/user-hand-frequency.service'
import { HandHistory, HandHistorySchema } from './schemas/hand-history.schema';
import { CardFrequency, CardFrequencySchema } from './schemas/user-hand-frequency';
import { User, UserSchema } from '../users/schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HandHistory.name, schema: HandHistorySchema },
      { name: CardFrequency.name, schema: CardFrequencySchema },
      { name: User.name, schema: UserSchema }
    ]),
  ],

  controllers: [DatabaseController],
  providers: [
    MongodbClientService,
    HandHistoryDataWriterService,
    HandHistoryRepository,
    UserHandFrequencyRepository,
    RoomTypes,
  ],
  exports: [HandHistoryDataWriterService, HandHistoryRepository],
})
export class DatabaseStorageModule { }

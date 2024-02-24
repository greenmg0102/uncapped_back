import { Module } from '@nestjs/common';
import { DataStreamController } from './controllers/data-stream.controller';
import { HandHistoryParserService } from '../hand-history-parsing/services/hand-history-parser.service';
import { DetectorService } from '../poker-room-detection/services/detector.service';
import {
  ActionType,
  RoomTypes,
  Street
} from '../../common/constants/common.constants';
import { EightStarStrategyService } from '../hand-history-parsing/strategies/eight-star-strategy.service';
import { GgPokerStrategyService } from '../hand-history-parsing/strategies/gg-poker-strategy.service';
import { PokerStarsStrategyService } from '../hand-history-parsing/strategies/poker-stars-strategy.service';
import { HandHistoryDataWriterService } from '../database-storage/services/hand-history-data-writer.service';
import { IgnitionPokerStrategyService } from '../hand-history-parsing/strategies/ignition-poker-strategy.service';
import { ChicoPokerStrategyService } from '../hand-history-parsing/strategies/chico-poker-strategy.service';
import { DatabaseStorageModule } from '../database-storage/database-storage.module';
import { RoomStrategyFactory } from '../hand-history-parsing/factories/room-strategy.factory';
import { PartyPokerStrategyService } from '../hand-history-parsing/strategies/party-poker-strategy.services';
import { WinamaxPokerStrategyService } from '../hand-history-parsing/strategies/winamax-poker-strategy.service';
import { WpnPokerStrategyService } from '../hand-history-parsing/strategies/wpn-poker-strategy.service';
import { IPokerStrategyService } from '../hand-history-parsing/strategies/ipoker-strategy.service';
import { HandHistory } from '../database-storage/schemas/hand-history.schema';
import { UserHandFrequencyRepository } from 'src/modules/database-storage/services/user-hand-frequency.service'
import { CardFrequency, CardFrequencySchema } from 'src/modules/database-storage/schemas/user-hand-frequency';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    DatabaseStorageModule,
    MongooseModule.forFeature([
      { name: CardFrequency.name, schema: CardFrequencySchema },
    ]),
  ],
  controllers: [
    DataStreamController,
  ],
  providers: [
    HandHistoryDataWriterService,
    HandHistoryParserService,
    DetectorService,
    RoomTypes,
    Street,
    ActionType,
    EightStarStrategyService,
    GgPokerStrategyService,
    PokerStarsStrategyService,
    IgnitionPokerStrategyService,
    ChicoPokerStrategyService,
    PartyPokerStrategyService,
    WinamaxPokerStrategyService,
    WpnPokerStrategyService,
    IPokerStrategyService,
    RoomStrategyFactory,
    HandHistory,
    UserHandFrequencyRepository,
  ],
})
export class DataStreamApiModule { }

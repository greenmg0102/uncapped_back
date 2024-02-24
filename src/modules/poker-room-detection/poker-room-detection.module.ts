import { Module } from '@nestjs/common';
import { PokerRoomController } from './controllers/poker-room.controller';
import { DetectorService } from './services/detector.service';
import { DetectorCacheService } from './services/detector-cache.service';
import { RoomTypes } from "../../common/constants/common.constants";

@Module({
  controllers: [PokerRoomController],
  providers: [
    DetectorService,
    DetectorCacheService,
    RoomTypes
  ]
})
export class PokerRoomDetectionModule {}

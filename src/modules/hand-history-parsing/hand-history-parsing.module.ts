import { Module } from '@nestjs/common';
import { HandHistoryController } from './controllers/hand-history.controller';
import { HandHistoryParserService } from './services/hand-history-parser.service';

@Module({
  controllers: [HandHistoryController],
  providers: [HandHistoryParserService]
})
export class HandHistoryParsingModule {}

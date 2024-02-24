import { Module } from '@nestjs/common';
import { PreflopchartAnaylzeService } from './services/preflopchart-analyze.service';
import { PreflopchartAnalyzeFlagService } from './services/preflopchart-analyze-flag.service';
import { PreflopchartAnaylzeController } from './controllers/preflopchart-analyze.controller';
import { PreflopchartAnalyzeFlagController } from './controllers/preflopchart-analyze-flag.controller';
import { GetNodeService } from './services/getNode.service'
import { GetHandStatusService } from './services/getHandStatus.service'
import { ReportCollectionService } from 'src/modules/reporting/services/report-collection.service'
import { MongooseModule } from '@nestjs/mongoose';
import { HandHistory, HandHistorySchema } from 'src/modules/database-storage/schemas/hand-history.schema';
import { CardFrequency, CardFrequencySchema } from 'src/modules/database-storage/schemas/user-hand-frequency';
import { Bookmark, BookmarkSchema } from 'src/modules/preflopchart-anaylze/schemas/Bookmark.schema';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: HandHistory.name, schema: HandHistorySchema },
      { name: CardFrequency.name, schema: CardFrequencySchema },
      { name: Bookmark.name, schema: BookmarkSchema },
    ])
  ],

  providers: [
    PreflopchartAnalyzeFlagService,
    PreflopchartAnaylzeService,
    GetNodeService,
    GetHandStatusService,
    ReportCollectionService
  ],

  controllers: [
    PreflopchartAnaylzeController,
    PreflopchartAnalyzeFlagController
  ]
  
})

export class PreflopchartAnaylzeModule { }
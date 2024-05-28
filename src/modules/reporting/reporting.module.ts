import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from './controllers/report.controller';
import { MACDController } from './controllers/macd.controller';
import { DeviationsController } from './controllers/deviations.controller';

import { ReportGeneratorService } from './services/report-generator.service';
import { ReportMacdPairService } from './services/report-macd-pair.service';
import { ReportMacdHandsService } from './services/report-macd-hands.service';
import { ReportMacdOffSuitedService } from './services/report-macd-offSuited.service';
import { ReportMacdbb100Service } from './services/report-macd-bb100.service';
import { ReportMacdAllinbb100Service } from './services/report-macd-allinbb100.service';
import { ReportMacdBBService } from './services/report-macd-BB.service';
import { ReportMacdDateService } from './services/report-macd-date.service';
import { ReportScatterService } from './services/report-scatter.service';
import { HeroRaiseSizingService } from './services/hero-raise-sizing.service';
import { VillainRaiseSizingService } from './services/villain-raise-sizing.service';
import { RaiseSizingTableService } from './services/raise-sizing-table.service';
import { SqueezeRaiseSizingService } from './services/squeeze-raise-sizing.service';
import { ReportGlobalStatisticService } from './services/report-global-statistic.service';


import { ReportUserGeneratingService } from './services/report-user-generating';
import { ReportCollectionService } from './services/report-collection.service';
import { GlobalOpportunityService } from './services/global-opportunity.service';
import { ReportDetailTableService } from './services/report-detail-table';
import { ReportEachPairService } from './services/report-each-pair';
import { ConditionPairService } from './services/condition-pair';
import { HandHistory, HandHistorySchema } from '../database-storage/schemas/hand-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HandHistory.name, schema: HandHistorySchema },
    ]),
  ],
  controllers: [
    ReportController,
    MACDController,
    DeviationsController
  ],
  providers: [
    ReportGeneratorService,
    ReportMacdHandsService,
    ReportMacdOffSuitedService,
    ReportGlobalStatisticService,
    ReportMacdAllinbb100Service,
    ReportMacdBBService,
    ReportMacdDateService,
    ReportMacdbb100Service,
    ReportCollectionService,
    ReportMacdPairService,
    GlobalOpportunityService,
    ReportEachPairService,
    ConditionPairService,
    ReportDetailTableService,
    ReportUserGeneratingService,
    ReportScatterService,
    HeroRaiseSizingService,
    VillainRaiseSizingService,
    RaiseSizingTableService,
    SqueezeRaiseSizingService
  ]
})
export class ReportingModule { }

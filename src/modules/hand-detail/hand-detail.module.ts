import { Module } from '@nestjs/common';
import { HandDetailService } from './services/hand-detail.service';
import { HandDetailController } from './controllers/hand-detail.controller';
import { EachHandGetService } from './services/eachHandGet.service'
import { BundleDeleteService } from './services/bundleDelete.service'
import { ActivityLogService } from 'src/modules/activityLog/services/activity-log.service'
import { MongooseModule } from '@nestjs/mongoose';
import { HandHistory, HandHistorySchema } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Activitylog, ActivitylogSchema } from 'src/modules/activityLog/schema/ActivityLog';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HandHistory.name, schema: HandHistorySchema },
      { name: Activitylog.name, schema: ActivitylogSchema },
    ])
  ],
  providers: [HandDetailService, EachHandGetService, BundleDeleteService, ActivityLogService],
  controllers: [
    HandDetailController
  ]
})

export class HandDetailModule { }
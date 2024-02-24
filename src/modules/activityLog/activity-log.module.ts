import { Module } from '@nestjs/common';
import { ActivityLogController } from './controllers/activity-log.controller';
import { ActivityLogService } from 'src/modules/activityLog/services/activity-log.service'
import { ActivityReadService } from 'src/modules/activityLog/services/activity-read.service'
import { MongooseModule } from '@nestjs/mongoose';
import { Activitylog, ActivitylogSchema } from 'src/modules/activityLog/schema/ActivityLog';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';
import { HandHistory, HandHistorySchema } from 'src/modules/database-storage/schemas/hand-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activitylog.name, schema: ActivitylogSchema },
      { name: User.name, schema: UserSchema },
      { name: HandHistory.name, schema: HandHistorySchema }
    ])
  ],
  providers: [ActivityLogService, ActivityReadService],
  controllers: [
    ActivityLogController
  ]
})

export class ActivityLogModule { }
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './controllers/notification.controller';
import { NotificationRegistService } from './services/notificationRegist.service';
import { Notification, NotificationSchema } from '../notification/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [
    NotificationController
  ],
  providers: [
    NotificationRegistService,
  ]
})

export class NotificationModule { }

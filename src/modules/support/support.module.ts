import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportController } from './controllers/support.controller';

import { SupportAdminService } from './services/support.admin.service';
import { EmailService } from './services/EmailServer.service';

import { SupportService } from './services/support.service';
import { Support, SupportSchema } from './schema/support.schema';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: Support.name, schema: SupportSchema },
    ]),
  ],

  controllers: [
    SupportController
  ],

  providers: [
    SupportService,
    SupportAdminService,
    EmailService
  ]

})
export class SupportModule { }

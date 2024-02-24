import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { APP_FILTER } from '@nestjs/core';
import { join } from "path";
import { JwtModule } from '@nestjs/jwt'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { StreamReceiverService } from './modules/data-stream-api/services/stream-receiver.service';
import { DataBufferService } from './modules/data-stream-api/services/data-buffer.service';
import { ChunkParserService } from './modules/data-stream-api/services/chunk-parser.service';
import { HandHistoryValidatorService } from './modules/data-stream-api/services/hand-history-validator.service';

import { PaymentModule } from './modules/payment/payment.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PremiumOptionModule } from './modules/admin/premium-admin/premium-option.module';
import { PokerRoomDetectionModule } from './modules/poker-room-detection/poker-room-detection.module';
import { BlogModule } from './modules/admin/blog/blog.module';
import { UserBlogModule } from './modules/blog/user-blog.module';

import { DataStreamApiModule } from './modules/data-stream-api/data-stream-api.module';
import { HandHistoryParsingModule } from './modules/hand-history-parsing/hand-history-parsing.module';
import { DatabaseStorageModule } from './modules/database-storage/database-storage.module';
import { HandDetailModule } from './modules/hand-detail/hand-detail.module';
import { ActivityLogModule } from './modules/activityLog/activity-log.module';
import { PreflopchartAnaylzeModule } from './modules/preflopchart-anaylze/preflopchart-analyze.module';
import { SupportModule } from './modules/support/support.module';
import { ErrorHandlingModule } from './modules/error-handling/error-handling.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config/services/config.service';
import { JwtStrategy } from './shared/strategy/jwt.strategy'

import { ConfigService as NetConfigService } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
// import { ProfileModule } from './modules/profiles/profile.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { RoleModule } from './modules/role/role.module';

import * as path from 'path'; // Import the path module


@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.getMongoConfig(),
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to the uploads directory
      serveRoot: '/uploads', // Optional: Specify the root URL path for the served files
      exclude: ['/api/v1/*'],
    }),

    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),

    MailerModule.forRoot({
      transport: {
        host: 'uncappedtheory.com',
        port: 587,
        secure: false,
        auth: {
          user: 'comantivirus250@gmail.com',
          pass: 'Supernover@525',
        },
      },
      defaults: {
        from: '"Upto" <uncappedtheory@support.com>',
      },
      template: {
        dir: path.join(__dirname, '..', 'templates'), // Construct the absolute path to the 
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    JwtModule.register({
      // secret: process.env.JWT_SECRET,
      secret: 'Glk09q7xsdiHeASQ',
      signOptions: {
        expiresIn: '356d',
      },
    }),


    UserModule,
    AuthModule,
    ProfileModule,
    StripeModule,
    RoleModule,

    DatabaseStorageModule,
    HandDetailModule,
    ActivityLogModule,
    PreflopchartAnaylzeModule,
    SupportModule,
    DataStreamApiModule,
    PaymentModule,
    HandHistoryParsingModule,
    PremiumOptionModule,
    PokerRoomDetectionModule,
    BlogModule,
    UserBlogModule,
    ProfileModule,
    ErrorHandlingModule,
    ReportingModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    StreamReceiverService,
    NetConfigService,
    DataBufferService,
    JwtStrategy,
    ChunkParserService,
    HandHistoryValidatorService,
  ],
})
export class AppModule { }

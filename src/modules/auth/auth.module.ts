import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../users/user.module'
import { FacebookStrategy, GoogleStrategy, JwtStrategy, RtStrategy } from './strategies'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ProfileModule } from '../profiles/profile.module'
import { StripeModule } from '../stripe/stripe.module'
import { MailAuth } from './services/mail.auth.service'
import { PayLog, PayLogSchema } from '../payment/schemas/paylog.schema';
import { PremiumOption, PremiumOptionSchema } from '../admin/premium-admin/schemas/premium-option'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PayLog.name, schema: PayLogSchema },
      { name: PremiumOption.name, schema: PremiumOptionSchema }
    ]),
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
    }),
    UserModule,
    ProfileModule,
    StripeModule,
    JwtModule.register({
      // secret: process.env.JWT_SECRET,
      secret: 'Glk09q7xsdiHeASQ',
      signOptions: {
        expiresIn: '356d'
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailAuth,
    GoogleStrategy,
    FacebookStrategy,
    JwtStrategy,
    RtStrategy
  ],
})

export class AuthModule { }
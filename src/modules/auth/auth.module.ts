import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '../users/user.module'
import { FacebookStrategy, GoogleStrategy, JwtStrategy, RtStrategy } from './strategies'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ProfileModule } from '../profiles/profile.module'
import { StripeModule } from '../stripe/stripe.module'


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.development`,
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
    GoogleStrategy,
    FacebookStrategy,
    JwtStrategy,
    RtStrategy
  ],
})

export class AuthModule { }
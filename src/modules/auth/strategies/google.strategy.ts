import { Injectable, } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'
import { AuthService } from '../auth.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      // clientID: process.env.GOOGLE_CLIENT_ID,
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: process.env.GOOGLE_REDIRECT_URL,

      clientID: "1047816426192-n7e5n61ein1pkf13pogd6k9e9t9g0llj.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/api/v1/auth/google/redirect",

      scope: ['profile', 'email'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      const user = await this.authService.validateProviderProfile(profile)
      const tokens = await this.authService.generateTokens(user)
      done(null, { user, tokens })
    } catch (err) {
      done(null, { error: { error: true, status: err?.response.statusCode, message: err?.response.message } })
    }
  }
}

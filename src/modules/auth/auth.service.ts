import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Types } from 'mongoose'
import { Profile as GoogleProfile } from 'passport-google-oauth20'
import { Profile as FacebookProfile } from 'passport-facebook'
import { Tokens } from '../../common/interfaces'
import { UserDocument } from '../users/schemas/user.schema'
import { UserService } from '../users/user.service'
import { ProfileService } from '../profiles/profile.service'
import { StripeService } from '../stripe/stripe.service'

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private jwtService: JwtService,
    private stripeService: StripeService
  ) { }

  async validateProviderProfile(profile: GoogleProfile | FacebookProfile): Promise<UserDocument> {
    const user = await this.userService.getUserByProviderId({ googleId: profile.provider === 'google' ? profile.id : null, facebookId: profile.provider === 'facebook' ? profile.id : null })
    if (!user) {
      const emailIsUnique: boolean = await this.userService.validateEmail(profile.emails[0].value, profile.provider)
      if (!emailIsUnique) throw new ForbiddenException('User with this email but a different provider already exists!')

      const stripeCustomer = await this.stripeService.createCustomer(profile.emails[0].value)

      const user = await this.userService.createUser({
        googleId: profile.provider === 'google' ? profile.id : null,
        facebookId: profile.provider === 'facebook' ? profile.id : null,
        customerId: stripeCustomer.id,
        email: profile.emails[0].value,
        provider: profile.provider,
        subscriptionDetails: { gameType: 'Any', name: 'Free' }
      })

      await this.profileService.createProfile({
        userId: user,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName === undefined ? "!" : profile.name.familyName,
        displayName: null,
        socialAvatar: profile.photos ? profile.photos[0].value : 'https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png',
      })

      return user
    }
    return user
  }

  async generateTokens(user: UserDocument): Promise<Tokens> {
    const payload = {
      sub: {
        _id: user._id,
        googleId: user.googleId,
        facebookId: user.facebookId,
        customerId: user.customerId
      }
    }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '356d' })
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })
    await this.userService.saveTokens({ accessToken, refreshToken }, user)
    return { accessToken, refreshToken }
  }

  async refresh(userId: Types.ObjectId, userRt: string): Promise<Tokens> {
    const user = await this.userService.getUserByObjectId(userId)
    if (!user || user.refreshToken !== userRt) throw new ForbiddenException()
    return this.generateTokens(user)
  }
}

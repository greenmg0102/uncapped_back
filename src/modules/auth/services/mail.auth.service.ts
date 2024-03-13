import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Types } from 'mongoose'
import { Profile as GoogleProfile } from 'passport-google-oauth20'
import { Profile as FacebookProfile } from 'passport-facebook'
import { Tokens } from '../../../common/interfaces'
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from '../../users/schemas/user.schema'
import { UserService } from '../../users/user.service'
import { ProfileService } from '../../profiles/profile.service'
import { StripeService } from '../../stripe/stripe.service'

import { PayLog } from '../../payment/schemas/paylog.schema';
import { PremiumOption } from '../../admin/premium-admin/schemas/premium-option'

@Injectable()
export class MailAuth {

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private jwtService: JwtService,
    private stripeService: StripeService,

    @InjectModel(PayLog.name) private readonly payLogModel: Model<PayLog>,
    @InjectModel(PremiumOption.name) private readonly premiumOptionModel: Model<PremiumOption>,
  ) { }

  async mail(data: any): Promise<any> {

    console.log("mail", data);

    let tokens = {
      accessToken: null,
      refreshToken: null
    }

    const user = await this.userService.createUser({
      googleId: null,
      facebookId: null,
      customerId: null,
      email: data.mail,
      password: data.password,
      provider: "uncappedtheory",
      subscriptionDetails: { gameType: 'Any', name: 'Free' }
    })

    await this.profileService.createProfile({
      userId: user,
      firstName: data.mail.split('@')[0],
      lastName: " !",
      displayName: null,
      socialAvatar: 'https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png',
      role: '6549b46dcdf3a0cc5fb51bd7',
      premiumId: '6596bec7dfae083621d4c33f'
    })

    console.log('3');
    

    const payload = {
      sub: {
        _id: user._id,
        // googleId: user.googleId,
        // facebookId: user.facebookId,
        // customerId: user.customerId
      }
    }

    const accessToken = this.jwtService.sign(payload, { expiresIn: '356d' })
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '356d' })

    await this.userService.saveTokens({ accessToken, refreshToken }, user)

    tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken
    }

    return tokens

  }

}

import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { UserService } from '../../users/user.service'
import { ProfileService } from '../../profiles/profile.service'
import { PayLog } from '../../payment/schemas/paylog.schema';
import { PremiumOption } from '../../admin/premium-admin/schemas/premium-option'
import * as bcrypt from 'bcrypt';

@Injectable()
export class MailAuth {

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private jwtService: JwtService,

    @InjectModel(PayLog.name) private readonly payLogModel: Model<PayLog>,
    @InjectModel(PremiumOption.name) private readonly premiumOptionModel: Model<PremiumOption>

  ) { }

  async mail(data: any): Promise<any> {

    let tokens = {
      accessToken: null,
      refreshToken: null
    }

    let isUserExist = await this.userService.findByEmail(data.mail)

    if (isUserExist === null) {

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.userService.createUser({
        googleId: null,
        facebookId: null,
        customerId: null,
        email: data.mail,
        password: hashedPassword,
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

      const payload = {
        sub: {
          _id: user._id,
        }
      }

      const accessToken = this.jwtService.sign(payload, { expiresIn: '356d' })
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '356d' })

      await this.userService.saveTokens({ accessToken, refreshToken }, user)

      tokens = {
        accessToken: accessToken,
        refreshToken: refreshToken
      }

      return {
        result: true,
        tokens: tokens
      }

    } else {
      const isMatch = await bcrypt.compare(data.password, isUserExist.password);

      if (isMatch) {

        const payload = {
          sub: {
            _id: isUserExist._id,
          }
        }

        const accessToken = this.jwtService.sign(payload, { expiresIn: '356d' })
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '356d' })

        await this.userService.saveTokens({ accessToken, refreshToken }, isUserExist)

        tokens = {
          accessToken: accessToken,
          refreshToken: refreshToken
        }

        return {
          result: true,
          tokens: tokens
        }
      } else {
        return {
          result: false,
          message: "Passwords do not match"
        }
      }
    }
  }
}

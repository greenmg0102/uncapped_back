import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types, UpdateWriteOpResult } from 'mongoose'
import { User as UserSchema, UserDocument } from '../schemas/user.schema'
import { ProviderId } from '../interfaces'
import { CreateUserDto } from '../dtos'
import { Tokens } from '../../../common/interfaces'
import { ActiveSubscription } from 'src/modules/stripe/interfaces'

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserSchema>,
  ) { }

  async createUser(user: CreateUserDto): Promise<UserDocument> {
    try {
      const createdUser = new this.userModel(user)
      await createdUser.save()
      return createdUser
    }
    catch (e) {
      console.log(e)
    }
  }

  async findById(_id: Types.ObjectId): Promise<UserDocument | null> {
    return await this.userModel.findOne({ _id }).exec()
  }

  async findByProviderId(id: ProviderId): Promise<UserDocument | null> {
    return await this.userModel
      .findOne(
        id.googleId
          ? { googleId: id.googleId }
          : { facebookId: id.facebookId },
      )
      .exec()
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec()
  }

  async saveTokens(tokens: Tokens, user: UserDocument): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { _id: user._id },
      { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken },
    )
  }

  async getActiveSubscription(customerId: string) {
    const user = await this.userModel.findOne({ customerId })
    return { id: user.subscriptionId, details: user.subscriptionDetails }
  }

  async updateSubscription(customerId: string, subscriptionId: string, subscriptionDetails: ActiveSubscription) {
    try {
      return await this.userModel.updateOne({ customerId }, { subscriptionId: subscriptionId, subscriptionDetails })
    }
    catch (e) {
      console.log(e)
    }
  }

  async cancelSubscription(customerId: string) {
    try {
      return await this.userModel.updateOne({ customerId }, { subscriptionId: null, subscriptionDetails: { gameType: 'Any', name: 'Free' } })
    }
    catch (e) {
      console.log(e)
    }
  }
}

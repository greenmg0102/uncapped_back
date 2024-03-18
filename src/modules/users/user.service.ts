import { Types, UpdateWriteOpResult } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { User, UserDocument } from './schemas/user.schema'
import { ProviderId } from './interfaces'
import { UserRepository } from './repositories/user.repository'
import { Tokens } from '../../common/interfaces'
import { CreateUserDto } from './dtos'
import { ActiveSubscription } from '../stripe/interfaces'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async validateEmail(email: string, provider: string): Promise<boolean> {
    const user: User = await this.userRepository.findByEmail(email)
    if (!user) return true
    return user.provider === provider
  }

  async findByEmail(email: any): Promise<UserDocument> {
    return await this.userRepository.findByEmail(email)
  }

  async createUser(user: CreateUserDto): Promise<UserDocument> {
    return await this.userRepository.createUser(user)
  }

  async getUserByObjectId(_id: Types.ObjectId): Promise<UserDocument | null> {
    return await this.userRepository.findById(_id)
  }

  async getUserByProviderId(id: ProviderId): Promise<UserDocument | null> {
    return await this.userRepository.findByProviderId(id)
  }

  async saveTokens(tokens: Tokens, user: UserDocument): Promise<UpdateWriteOpResult> {
    return await this.userRepository.saveTokens(tokens, user)
  }

  async getActiveSubscription(customerId: string) {
    return await this.userRepository.getActiveSubscription(customerId)
  }

  async updateSubscription(customerId: string, subscriptionId: string, subscriptionDetails: ActiveSubscription) {
    return await this.userRepository.updateSubscription(customerId, subscriptionId, subscriptionDetails)
  }

  async cancelSubscription(customerId: string) {
    return await this.userRepository.cancelSubscription(customerId)
  }
}

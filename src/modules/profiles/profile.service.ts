import { Types, UpdateWriteOpResult } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { ProfileRepository } from './repositories/profile.repository'
import { ProfileDocument } from './schemas/profile.schema'
import { CreateProfileDto, UpdateProfileDto } from './dtos'

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
  ) { }

  
  async profileGet(id: any): Promise<any> {
    return await this.profileRepository.profileGet(id)
  }

  async createProfile(profile: CreateProfileDto): Promise<ProfileDocument> {
    return await this.profileRepository.createProfile(profile)
  }

  async fetchProfileData(userId: Types.ObjectId): Promise<ProfileDocument | null> {
    return await this.profileRepository.findByUserId(userId)
  }

  async updateProfile(userId: Types.ObjectId, profile: UpdateProfileDto): Promise<UpdateWriteOpResult> {
    return await this.profileRepository.updateProfile(userId, profile)
  }

  async updateAvatar(userId: Types.ObjectId, fileUrl: string): Promise<UpdateWriteOpResult> {
    return await this.profileRepository.updateAvatar(userId, fileUrl)
  }

  async removeAvatar(userId: Types.ObjectId): Promise<UpdateWriteOpResult> {
    return await this.profileRepository.removeAvatar(userId)
  }

  async userMangingGet(): Promise<any> {
    return await this.profileRepository.userMangingGet()
  }

  async userRoleChange(body: any): Promise<any> {
    return await this.profileRepository.userRoleChange(body)
  }

}

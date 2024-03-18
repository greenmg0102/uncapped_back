import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types, UpdateWriteOpResult } from 'mongoose'
import { Profile, ProfileDocument } from '../schemas/profile.schema'
import { CreateProfileDto, UpdateProfileDto } from '../dtos'
const mongoose = require('mongoose');

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>,
  ) { }

  async profileGet(id: any): Promise<any> {

    const [profile] = await this.profileModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'Roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $project: {
          user: 1,
          displayName: 1,
          firstName: 1,
          lastName: 1,
          socialAvatar: 1,
          rooms: 1,
          formats: 1,
          types: 1,
          stakes: 1,
          role: {
            $ifNull: ['$role', []]
          }
        }
      }
    ]).exec();
    return profile || [];

  }

  async userMangingGet(): Promise<any> {

    const profile = await this.profileModel.aggregate([
      {
        $lookup: {
          from: 'Users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'Roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $project: {
          user: 1,
          displayName: 1,
          firstName: 1,
          lastName: 1,
          socialAvatar: 1,
          rooms: 1,
          formats: 1,
          types: 1,
          stakes: 1,
          role: {
            $ifNull: ['$role', []]
          }
        }
      }
    ]).exec();
    return profile || [];
  }

  async userRoleChange(body: any): Promise<any> {

    try {
      const result = await this.profileModel
        .findByIdAndUpdate(body.id, { role: body.role })
        .then(async (result: any) => {

          const profile = await this.profileModel.aggregate([
            {
              $lookup: {
                from: 'Users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $unwind: '$user',
            },
            {
              $lookup: {
                from: 'Roles',
                localField: 'role',
                foreignField: '_id',
                as: 'role',
              },
            },
            {
              $project: {
                user: 1,
                displayName: 1,
                firstName: 1,
                lastName: 1,
                socialAvatar: 1,
                rooms: 1,
                formats: 1,
                types: 1,
                stakes: 1,
                role: {
                  $ifNull: ['$role', []]
                }
              }
            }
          ]).exec();
          return profile || null;
        })
      return result;

    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createProfile(profile: CreateProfileDto): Promise<ProfileDocument> {
    try {
      const createdProfile = new this.profileModel(profile)

      await createdProfile.save().then((result: any) => {
      }).catch((err: any) => {
        console.log('err', err);
      })
      return
    }
    catch (e) {
      console.log(e)
    }
  }

  async findByUserId(userId: Types.ObjectId): Promise<ProfileDocument | null> {
    return await this.profileModel.findOne({ userId }).exec()
  }


  async updateProfile(userId: Types.ObjectId, profile: UpdateProfileDto): Promise<UpdateWriteOpResult> {
    try {
      return await this.profileModel.updateOne({ userId }, profile)
    }
    catch (e) {
      console.log(e)
    }
  }

  async updateAvatar(userId: Types.ObjectId, fileUrl: string): Promise<UpdateWriteOpResult> {
    return await this.profileModel.updateOne(
      { userId },
      { socialAvatar: `https://cdn.fishevolver.com/avatars/${fileUrl}` },
    )
  }

  async removeAvatar(userId: Types.ObjectId): Promise<UpdateWriteOpResult> {
    return await this.profileModel.updateOne(
      { userId },
      { socialAvatar: "https://cdn.fishevolver.com/avatars/blank.png" }
    )
  }
}

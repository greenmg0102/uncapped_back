import { Body, Controller, Get, Post, Put, Param, UseGuards, UseInterceptors } from '@nestjs/common'
import { Request } from 'express'
import { Types } from 'mongoose'
import { ProfileService } from './profile.service'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import avatarNameGenerator from './utils/avatar-name-generator'
import { GetFileUrl, GetUserId, } from '../../common/decorators'
import { UpdateProfileDto } from './dtos'

@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private jwtService: JwtService,
  ) { }

  @Get("/:id")
  async profileGet(@Param('id') id: Types.ObjectId) {

    let realValue = await this.profileService.profileGet(id)
    return realValue
  }

  @Post("/user-manging-get")
  async userMangingGet() {
    return await this.profileService.userMangingGet()
  }
  @Post("/user-role-change")
  async userRoleChange(@Body() body: any) {
    return await this.profileService.userRoleChange(body)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async fetchProfileData(@GetUserId() userId: Types.ObjectId) {
    return await this.profileService.fetchProfileData(userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateProfile(@GetUserId() userId: Types.ObjectId, @Body() profileData: UpdateProfileDto) {
    return await this.profileService.updateProfile(userId, profileData)
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/assets/blog',
        filename: (request: Request & { fileUrl: string | null }, file: Express.Multer.File, save) => {
          const fileName: string = avatarNameGenerator(file.mimetype.split('/')[1])
          request.fileUrl = fileName
          save(null, fileName)
        },
      }),
    }),
  )
  @Post('avatar')
  async updateAvatar(@GetUserId() userId: Types.ObjectId, @GetFileUrl() fileUrl: string) {
    return await this.profileService.updateAvatar(userId, fileUrl)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('avatar/remove')
  async removeAvatar(@GetUserId() userId: Types.ObjectId) {
    return await this.profileService.removeAvatar(userId)
  }
}

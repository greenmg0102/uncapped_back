import { Types } from 'mongoose'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from './user.service'
import { GetUserId } from '../../common/decorators'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@GetUserId() userId: Types.ObjectId) {
    return this.userService.getUserByObjectId(userId)
  }
}

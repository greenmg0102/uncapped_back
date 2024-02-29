import { Response } from 'express'
import { Types } from 'mongoose'
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { Tokens } from '../../common/interfaces'
import { GetUserId, GetUserRt } from '../../common/decorators'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  googleLogin() {

    return ''
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleRedirect(@Req() req: any, @Res() res: Response) {
    const { tokens, error } = req.user
    if (error) {
      return res.redirect(
        `http://https://uncappedtheory.com/sign-in?status=${error.status}&message=${error.message}`,
      )
    }
    return res.redirect(
      `http://https://uncappedtheory.com/sign-in?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    )
  }

  @Get('facebook/login')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {
    return ''
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookRedirect(@Req() req: any, @Res() res: Response) {
    const { tokens, error } = req.user
    if (error) {
      return res.redirect(
        `http://https://uncappedtheory.com/sign-in?status=${error.status}&message=${error.message}`,
      )
    }
    return res.redirect(
      `http://https://uncappedtheory.com/sign-in?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    )
  }

  @Get('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@GetUserId() userId: Types.ObjectId, @GetUserRt() userRt: string): Promise<Tokens> {
    return await this.authService.refresh(userId, userRt)
  }
}

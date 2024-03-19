import { Response } from 'express'
import { Types } from 'mongoose'
import { Controller, Get, Req, Res, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { MailAuth } from './services/mail.auth.service'
import { Tokens } from '../../common/interfaces'
import { GetUserId, GetUserRt } from '../../common/decorators'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailAuth: MailAuth,
  ) { }

  @Post('mail/login')
  async mailLogin(@Req() req: any, @Res() res: Response) {
    let tokens = await this.mailAuth.mail(req.body)


    if (tokens.result) {
      return res.status(200).json({
        result: true,
        redirectUrl: `http://localhost:5173/sign-in?accessToken=${tokens.tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
      });
    } else {
      return res.status(200).json({
        result: false,
        message: tokens.message
      });
    }


  }

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
        `http://localhost:5173/sign-in?status=${error.status}&message=${error.message}`,
      )
    }
    return res.redirect(
      `http://localhost:5173/sign-in?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
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
        `http://localhost:5173/sign-in?status=${error.status}&message=${error.message}`,
      )
    }
    return res.redirect(
      `http://localhost:5173/sign-in?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    )
  }

  @Get('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@GetUserId() userId: Types.ObjectId, @GetUserRt() userRt: string): Promise<Tokens> {
    return await this.authService.refresh(userId, userRt)
  }
}

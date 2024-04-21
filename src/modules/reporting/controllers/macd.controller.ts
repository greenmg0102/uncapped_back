import { Controller, Post, Body, UseGuards, HttpCode, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport'
import { ReportMacdPairService } from '../services/report-macd-pair.service';
import { ReportMacdHandsService } from '../services/report-macd-hands.service';
import { ReportMacdOffSuitedService } from '../services/report-macd-offSuited.service';
import { ReportMacdbb100Service } from '../services/report-macd-bb100.service';
import { ReportMacdAllinbb100Service } from '../services/report-macd-allinbb100.service';
import { ReportMacdBBService } from '../services/report-macd-BB.service';
import { ReportMacdDateService } from '../services/report-macd-date.service';


@Controller('report-macd')
export class MACDController {

    constructor(
        private reportMacdPairService: ReportMacdPairService,
        private reportMacdHandsService: ReportMacdHandsService,
        private reportMacdOffSuitedService: ReportMacdOffSuitedService,
        private reportMacdbb100Service: ReportMacdbb100Service,
        private reportMacdAllinbb100Service: ReportMacdAllinbb100Service,
        private reportMacdBBService: ReportMacdBBService,
        private reportMacdDateService: ReportMacdDateService

    ) { }

    @Post('/card-pair')
    @HttpCode(200)
    async pair(@Body() body: any) {
        return await this.reportMacdPairService.cardPair(body)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/hands')
    @HttpCode(200)
    async hands(@Req() req: Request, @Body() body: any) {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = body
        bufferBody.userId = userId

        return await this.reportMacdHandsService.hands(bufferBody)
    }

    @Post('/off-suited')
    @HttpCode(200)
    async offSuited(@Body() body: any) {
        return await this.reportMacdOffSuitedService.offSuited(body)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/bb100')
    @HttpCode(200)
    async bb100(@Req() req: Request, @Body() body: any) {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = body
        bufferBody.userId = userId

        return await this.reportMacdbb100Service.bb100(bufferBody)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/allin-bb100')
    @HttpCode(200)
    async allinbb100(@Req() req: Request, @Body() body: any) {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = body
        bufferBody.userId = userId

        return await this.reportMacdAllinbb100Service.allinbb100(bufferBody)
    }

    @Post('/BB')
    @HttpCode(200)
    async BB(@Body() body: any) {
        return await this.reportMacdBBService.BB(body)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/according-to-Date')
    @HttpCode(200)
    async date(@Req() req: Request, @Body() body: any) {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = body
        bufferBody.userId = userId

        return await this.reportMacdDateService.date(bufferBody)
    }


}

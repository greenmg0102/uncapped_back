import {
    Controller,
    Get,
    UseGuards,
    HttpCode,
    Param,
    Post,
    Body,
    Req
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport'
import { HandDetailService } from '../services/hand-detail.service'
import { ActivityLogService } from 'src/modules/activityLog/services/activity-log.service'

@Controller('hand-detail')
export class HandDetailController {

    constructor(
        private handDetailService: HandDetailService,
        private readonly activityLogService: ActivityLogService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('/getHands')
    async getHands(@Req() req: Request, @Body() body: any) {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = body
        bufferBody.userId = userId

        this.activityLogService.logCreate(req, "3-1")
        const hands = await this.handDetailService.getHands(bufferBody);
        return hands;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/deleteHand')
    async deleteHand(@Req() req: Request, @Body() body: any) {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = body
        bufferBody.userId = userId

        this.activityLogService.logCreate(req, "3-1")
        const hands = await this.handDetailService.deleteHand(bufferBody);
        return hands;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/bundle-delete')
    async bundleDelete(@Req() req: Request, @Body() body: any) {

        const user: any = req.user;
        const userId = user.sub._id;

        let bufferBody = body
        bufferBody.userId = userId

        this.activityLogService.logCreate(req, "3-1")
        const hands = await this.handDetailService.bundleDelete(bufferBody);
        return hands;
    }

    
    
    @UseGuards(AuthGuard('jwt'))
    @Get('/getHand/:handId')
    @HttpCode(200)
    async getHand(@Param('handId') handId: string): Promise<string> {
        const hand = await this.handDetailService.getHand(handId);
        return hand;
    }
}

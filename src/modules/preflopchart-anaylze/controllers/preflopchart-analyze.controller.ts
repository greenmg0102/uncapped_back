import {
    Controller,
    Response,
    Post,
    Body,
    UseGuards,
    Res,
    Get,
    HttpCode,
    Param
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport'
import { GetPreflopInterface, GetHandStatusInterface } from '../interfaces/getNode.interface'
import { PreflopchartAnaylzeService } from '../services/preflopchart-analyze.service'

@Controller('getPreflop-analyze')
export class PreflopchartAnaylzeController {

    constructor(
        private preflopchartAnaylzeService: PreflopchartAnaylzeService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('/get-node')
    async getNode(@Body() body: GetPreflopInterface, @Res() res: Response) {
        return await this.preflopchartAnaylzeService.getNode(body, res);
    }

    @Get('/get-hand-status/:handId')
    @HttpCode(200)
    async getHandStatus(@Param('handId') handId: GetHandStatusInterface): Promise<string> {
        return await this.preflopchartAnaylzeService.getHandStatus(handId);
    }

}

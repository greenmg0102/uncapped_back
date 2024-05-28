import {
    Controller,
    Response,
    Post,
    Body,
    Res,
    Get,
    HttpCode,
    Param
} from '@nestjs/common';
import { GetPreflopInterface, GetHandStatusInterface } from '../interfaces/getNode.interface'
import { PreflopchartAnalyzeFlagService } from '../services/preflopchart-analyze-flag.service'

@Controller('getPreflop-analyze-flag')
export class PreflopchartAnalyzeFlagController {

    constructor(
        private preflopchartAnalyzeFlagService: PreflopchartAnalyzeFlagService,
    ) { }

    @Post('/regist-flag')
    async registerFlag(@Body() body: GetPreflopInterface,) {
        return await this.preflopchartAnalyzeFlagService.registerFlag(body);
    }
    @Post('/get-flag')
    async getFlag(@Body() body: GetPreflopInterface,) {
        return await this.preflopchartAnalyzeFlagService.getFlag(body);
    }

}

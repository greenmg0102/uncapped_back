import { Controller, Post, Body, HttpCode } from '@nestjs/common';

import { ReportScatterService } from '../services/report-scatter.service';

@Controller('report-stastic')
export class DeviationsController {

    constructor(
        private reportScatterService: ReportScatterService,
    ) { }

    @Post('/scatter')
    @HttpCode(200)
    async collections(@Body() body: any) {
        return await this.reportScatterService.scatterStatstic(body)
    }
}
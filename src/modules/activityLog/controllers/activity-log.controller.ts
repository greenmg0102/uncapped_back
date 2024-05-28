import {
    Controller,
    Get,
    Post,
    Body,
    Req
} from '@nestjs/common';
import { ActivityReadService } from 'src/modules/activityLog/services/activity-read.service'

@Controller('activity-log')
export class ActivityLogController {

    constructor(
        private activityReadService: ActivityReadService,
    ) { }

    @Post('/read')
    async logRead(@Body() pagination: any) {

        const hands = await this.activityReadService.logRead(pagination);
        return hands;
    }

    @Get('/get-statistic-info')
    async getStatisticInfo() {
        const hands = await this.activityReadService.getStatisticInfo();
        return hands;
    }

}

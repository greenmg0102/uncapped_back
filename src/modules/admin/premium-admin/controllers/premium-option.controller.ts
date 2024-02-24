import {
    Controller,
    Get,
    UseGuards,
    HttpCode,
    Param,
    Post,
    Body
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'

import { PremiumCreateService } from '../services/premium-create.service'

@Controller('premium')
export class PremiumOptionController {

    constructor(
        private premiumCreateService: PremiumCreateService,
    ) { }

    @Get('/read')
    async read() {
        const hands = await this.premiumCreateService.read();
        return hands;
    }

    @Post('/regist')
    async regist(@Body() body: any) {
        const hands = await this.premiumCreateService.regist(body);
        return hands;
    }


}

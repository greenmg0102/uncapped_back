import { Controller, Get, Post, Body, Param, HttpCode, Res } from '@nestjs/common';

import { GenerateService } from '../services/crypto/generate.service';

@Controller('payment')
export class PaymentController {

    constructor(
        private generateService: GenerateService,
    ) { }

    @Post('/crypto/generate-address')
    @HttpCode(200)
    async collections(@Body() body: any) {
        return await this.generateService.generate(body)
    }

    @Post('/crypto/paylog-create')
    @HttpCode(200)
    async payLogCreate(@Body() body: any) {
        return await this.generateService.payLogCreate(body)
    }

    
    @Post('/crypto/paylog-read')
    @HttpCode(200)
    async payLogRead(@Body() body: any) {
        return await this.generateService.payLogRead(body)
    }

    

}

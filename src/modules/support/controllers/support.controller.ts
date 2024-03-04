import { Controller, Post, Body, HttpCode } from '@nestjs/common';

import { SupportService } from '../services/support.service';
import { SupportAdminService } from '../services/support.admin.service';

@Controller('support')
export class SupportController {
    constructor(
        private supportService: SupportService,
        private supportAdminService: SupportAdminService,
    ) { }

    @Post('/post')
    @HttpCode(200)
    async post(@Body() body: any) {
        return await this.supportService.post(body)
    }

    @Post('/verify-mail')
    @HttpCode(200)
    async verifyMail(@Body() body: any) {
        return await this.supportService.verifyMail(body)
    }

    @Post('/post-get')
    @HttpCode(200)
    async postGet(@Body() body: any) {
        return await this.supportAdminService.postGet(body)
    }

    @Post('/anwser-send')
    @HttpCode(200)
    async anwserSend(@Body() body: any) {
        return await this.supportAdminService.anwserSend(body)
    }

}
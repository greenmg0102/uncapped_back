import { Controller, Get, Post, Body, Param, HttpCode, Res } from '@nestjs/common';

import { NotificationRegistService } from '../services/notificationRegist.service';

@Controller('notification')
export class NotificationController {

    constructor(
        private notificationRegistService: NotificationRegistService,
    ) { }

    @Post('/read')
    @HttpCode(200)
    async read(@Body() body: any) {
        return await this.notificationRegistService.read(body)
    }

    @Post('/create')
    @HttpCode(200)
    async create(@Body() body: any) {
        return await this.notificationRegistService.create(body)
    }

    @Post('/delete/:id')
    @HttpCode(200)
    async delete(@Param('id') id: string) {
        return await this.notificationRegistService.delete(id)
    }

}

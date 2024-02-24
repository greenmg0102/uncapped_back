import {
    Controller,
    Get,
    Param,
    Post,
    Body
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'

import { BlogCreateService } from '../services/user-blog.service'

@Controller('user/blog')
export class BlogController {

    constructor(
        private blogCreateService: BlogCreateService,
    ) { }

    @Post('/read')
    async read(@Body() body: any) {
        const hands = await this.blogCreateService.read(body);
        return hands;
    }
    @Get('/more-detail/:id')
    async moreDetail(@Param('id') id: string) {
        const hands = await this.blogCreateService.moreDetail(id);
        return hands;
    }


    

}

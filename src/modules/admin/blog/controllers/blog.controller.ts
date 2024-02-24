import {
    Controller,
    Get,
    UseGuards,
    HttpCode,
    Param,
    Post,
    Body,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogCreateService } from '../services/blog-create.service'
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('admin/blog')
export class BlogController {

    constructor(
        private blogCreateService: BlogCreateService,
    ) { }


    @Post('image-upload')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/assets/blog', // Specify the destination folder for storing the uploaded images
            filename: (req, file, callback) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return callback(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))

    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const fileName = file.filename;
        return { isOk: true, fileName };
    }

    @Post('/read')
    async read(@Body() body: any) {
        const hands = await this.blogCreateService.read(body);
        return hands;
    }

    @Post('/regist')
    async regist(@Body() body: any) {
        const hands = await this.blogCreateService.regist(body);
        return hands;
    }


    @Post('/delete')
    async delete(@Body() body: any) {
        const hands = await this.blogCreateService.delete(body);
        return hands;
    }

}

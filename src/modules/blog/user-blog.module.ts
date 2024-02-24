import { Module } from '@nestjs/common';
import { BlogCreateService } from './services/user-blog.service';
import { BlogController } from './controllers/user-blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/modules/admin/blog/schemas/blog.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
  providers: [BlogCreateService],
  controllers: [
    BlogController
  ]
})

export class UserBlogModule { }
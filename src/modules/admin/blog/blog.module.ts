import { Module } from '@nestjs/common';
import { BlogCreateService } from './services/blog-create.service';
import { BlogController } from './controllers/blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/modules/admin/blog/schemas/blog.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
  providers: [BlogCreateService],
  controllers: [
    BlogController
  ]
})

export class BlogModule { }
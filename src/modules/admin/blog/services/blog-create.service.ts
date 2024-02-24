import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Blog } from 'src/modules/admin/blog/schemas/blog.schema';

@Injectable()
export class BlogCreateService {

    constructor(
        @InjectModel(Blog.name) private readonly blogModal: Model<Blog>,
    ) { }

    async read(body: any): Promise<any> {

        let result = await this.blogModal
            .find()
            .then((res: any) => {
                return res
            })
            .catch((err: any) => {
                return []
            });

        return result
    }

    async regist(body: any): Promise<any> {

        let newBlog = new this.blogModal(body);

        let result = await newBlog
            .save()
            .then(async (res: any) => {
                let result = await this.blogModal
                    .find()
                    .then((res: any) => {
                        return res
                    })
                    .catch((err: any) => {
                        return []
                    });

                return result
            })
            .catch((err: any) => {
                console.log("newBlog saving fail ~~ !");
                return
            });
        return result
    }

    async delete(body: any): Promise<any> {

        return []
    }
}

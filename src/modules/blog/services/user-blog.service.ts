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

    
    async moreDetail(id: any): Promise<any> {

        let result = await this.blogModal
            .findOne({_id: id})
            .then((res: any) => {
                return res
            })
            .catch((err: any) => {
                return {}
            });

        return result
    }
    

}

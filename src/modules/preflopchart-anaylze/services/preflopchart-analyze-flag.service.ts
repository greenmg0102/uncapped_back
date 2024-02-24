import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Bookmark } from 'src/modules/preflopchart-anaylze/schemas/Bookmark.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class PreflopchartAnalyzeFlagService {

    constructor(
        @InjectModel(Bookmark.name) private readonly bookmarkModel: Model<Bookmark>,
    ) { }

    async getFlag(body: any): Promise<any> {
        return await this.bookmarkModel
            .aggregate([
                { $match: { profilesId: new ObjectId(body.profilesId) } },
                { $project: { flags: 1 } }
            ])
            .exec();
    }


    async registerFlag(body: any): Promise<any> {

        return await this.bookmarkModel.find({ profilesId: body.profilesId })
            .then(async (result: any) => {

                if (result.length > 50) {
                    return {
                        isOk: true,
                        message: "Flags exceed 50"
                    }
                } else {

                    let bufferBody = body
                    bufferBody.profilesId = new ObjectId(body.profilesId);
                    bufferBody.flags = bufferBody.flags

                    let newBookmarkModel = new this.bookmarkModel(bufferBody);

                    return await newBookmarkModel
                        .save()
                        .then(async (res: any) => {
                            return {
                                isOk: true,
                                message: "Flag was registered correctly"
                            }
                        })
                        .catch((err: any) => {
                            return {
                                isOk: false,
                                message: "Flag registration failed"
                            }
                        });
                }
            })
    }
}
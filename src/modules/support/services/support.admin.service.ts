import { Support } from 'src/modules/support/schema/support.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class SupportAdminService {
  constructor(
    @InjectModel(Support.name) private readonly supportModel: Model<Support>,
  ) { }

  async postGet(body: any) {
    // const { page, pageSize } = pagination;
    // const skip = (page - 1) * pageSize;
    // const limit = pageSize;
    const result = await this.supportModel.aggregate([
      { $skip: 0 },
      { $limit: 10 }
    ]).exec();

    return result;
  }

  async anwserSend(body: any) {

    let question = await this.supportModel
      .findOne({ _id: body.id })
      .exec()
      .then((res) => { return res.question })
      .catch((err) => { return [] });

    question.push({
      query: body.answer,
      who: true,
      supportedDate: new Date().toISOString().replace('T', ' ').replace(/\..+/, '')
    })


    return await this.supportModel
      .findOneAndUpdate({ _id: body.id }, { question: question, checked: true })
      .exec()
      .then((res: any) => {
        return { isOk: true }
      })
      .catch((err) => {
        return { isOk: false }
      });
  }

}
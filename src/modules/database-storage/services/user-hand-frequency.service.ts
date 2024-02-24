import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CardFrequency } from 'src/modules/database-storage/schemas/user-hand-frequency';
import { userHandFrequencyMerge } from "src/shared/userHandParse/userHandFrequencyMerge";
export class UserHandFrequencyRepository {
  constructor(
    @InjectModel(CardFrequency.name) private readonly cardFrequencyModel: Model<CardFrequency>,
  ) { }

  async userHandStore(result: any) {

    let bufferFrequency = await this.cardFrequencyModel
      .findOne({ userId: 'ShuHei Ito' })
      .then((result: any) => {
        if (result === null) return {}
        else return result.frequencyStatus
      })

    if (Object.keys(bufferFrequency).length > 0) {

      let mergedResult = await userHandFrequencyMerge(bufferFrequency, result)

      this.cardFrequencyModel
        .findOneAndUpdate({ userId: 'ShuHei Ito' }, { frequencyStatus: mergedResult })
        .then((result: any) => { return })
        .catch((error: any) => { return })

    } else {

      let bufferModel = {
        userId: "ShuHei Ito",
        frequencyStatus: result
      }

      let newUserHand = new this.cardFrequencyModel(bufferModel);
      newUserHand
        .save()
        .then((res: any) => { return })
        .catch((err: any) => {
          console.log("err", err);
          return
        });
      return
    }

  }
}

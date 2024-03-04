
import { generatingAddress } from 'src/shared/payment/generatingAddress'
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { PayLog } from 'src/modules/payment/schemas/paylog.schema';
import { Profile } from 'src/modules/payment/schemas/profile.schema';
import { ObjectId } from 'mongodb';

export class GenerateService {
    constructor(
        @InjectModel(PayLog.name) private readonly payLogModal: Model<PayLog>,
        @InjectModel(Profile.name) private readonly profileModal: Model<Profile>,
    ) { }

    async generate(body: any) {
        return generatingAddress(body)
    }

    async payLogCreate(body: any) {

        let bufferBody = body
        bufferBody.premiumId = new ObjectId(body.premiumId);
        bufferBody.profilesId = new ObjectId(body.profilesId);

        let newPayLog = new this.payLogModal(body);

        let result = await newPayLog
            .save()
            .then(async (res: any) => {
                const updatedResult = await this.profileModal.findOneAndUpdate(
                    { _id: new ObjectId(body.profilesId) },
                    { premiumId: new ObjectId(body.premiumId) },
                    { new: true }
                );
                return true
            })
            .catch((err: any) => {
                return false
            });

        return result
    }

    async payLogRead(body: any) {


        let result = await this.payLogModal
            .aggregate([
                {
                    $lookup: {
                        from: 'premiumoptions',
                        localField: 'premiumId',
                        foreignField: '_id',
                        as: 'premium',
                    },
                },
                {
                    $unwind: '$premium',
                }
            ])
            .then((res: any) => {
                return res
            })
            .catch((err: any) => {
                return []
            });

        return result
    }




}

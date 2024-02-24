import { Injectable } from '@nestjs/common';
import { Types, Model, Schema as MongooseSchema } from 'mongoose';
import { PremiumOption } from 'src/modules/admin/premium-admin/schemas/premium-option';
import { Profile } from 'src/modules/profiles/schemas/profile.schema';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

@Injectable()
export class PremiumOptionService {

    constructor(
        @InjectModel(PremiumOption.name) private readonly premiumOptionModel: Model<PremiumOption>,
        @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    ) { }

    async getPremiumInfo(id: string): Promise<any> {
        try {
            let premiumInfo: any = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) });
            if (premiumInfo && premiumInfo.premiumId) {
                const result = await this.premiumOptionModel.findOne({ _id: premiumInfo.premiumId }).exec();
                return result;
            } else {
                return {};
            }
        } catch (err) {
            return {};
        }
    }

}
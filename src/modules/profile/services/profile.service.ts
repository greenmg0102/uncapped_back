import { Injectable } from '@nestjs/common';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

@Injectable()
export class ProfileService {

    constructor(
        @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
    ) { }

    async getCountPerPokerNet(id: string): Promise<any> {
        const pokertypeCounts = await this.handHistoryModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $group: {
                    _id: "$pokerRoomId",
                    count: { $sum: 1 }
                }
            }
        ]).exec();
        return pokertypeCounts;
    }
}
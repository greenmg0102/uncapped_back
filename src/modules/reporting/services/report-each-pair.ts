import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

export class ReportEachPairService {
  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async reportEachPair(body: any) {

    const nodeList = body.nodeList
    const skip = (body.page - 1) * body.pageSize;
    const limit = body.pageSize;

    const nodeIds = nodeList.map((id: any) => new mongoose.Types.ObjectId(id));

    const query = {
      userId: new mongoose.Types.ObjectId(body.userId),
      "_id": { $in: nodeIds }
    };

    const projectQuery = {
      _id: 1,
      holeCards: 1,
      communityCards: 1,
      summary: 1,
      rawData: 1,
      players: 1,

      pokerRoomId: 1,
      handDate: 1,
      handTime: 1,
      blindLevel: 1,
      buttonSeat: 1,
      smallBlind: 1,
      bigBlind: 1,
      bigBlindSeat: 1,
      ante: 1,
      reportContent: 1
    };

    const totalCount = await this.handHistoryModel.countDocuments(query);
    const hands = await this.handHistoryModel.aggregate([
      { $match: query },
      { $unwind: "$holeCards" },
      { $project: projectQuery },
      { $skip: skip },
      { $limit: limit }
    ]).exec();

    return {
      totalCount: totalCount,
      result: hands,
    };
  }
}
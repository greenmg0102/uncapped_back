import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString } from "src/shared/parsingAction/fileRead"
import { ObjectId } from 'mongodb';

export class ReportUserGeneratingService {
  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async userHandInfo(body: any) {

    const pokertypeCounts = await this.handHistoryModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(body.userId)
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

  async mainDataHandInfo(body: any) {

  }

  async getNodeHand(id: any) {
    const objectId = new ObjectId(id);
    return await this.handHistoryModel.aggregate([
      {
        $match: { "_id": objectId }
      },
      {
        $project: {
          rawData: 1
        }
      }
    ]).exec();
  }

  async userDataGenerating(body: any) {

    let heroPosiotionList = exchangeIntoNumberFromPositionString(body.heroPosition)
    let villianPosiotionList = exchangeIntoNumberFromPositionString(body.VillianPosition)
    let stackDepth = body.stackDepth
    let action = body.action

    let pipeLine = {
      userId: new mongoose.Types.ObjectId(body.userId),
      "reportContent.action": { $elemMatch: { $eq: action } },
      pokerRoomId: body.pokerType,
      maxTableSeats: body.tableSize,
      date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
    }

    if (heroPosiotionList.length > 0) pipeLine["reportContent.heroPosition"] = { $in: heroPosiotionList }
    if (villianPosiotionList.length > 0) pipeLine["$or"] = villianPosiotionList.map((item: any) => { return { "reportContent.villain": { $elemMatch: { $eq: item } } } })
    if (stackDepth.length > 0) pipeLine["reportContent.stackDepth"] = { $in: stackDepth }

    return await this.handHistoryModel.aggregate([
      {
        $match: pipeLine
      },
      {
        $project: {
          _id: 1,
          holeCards: 1,
          "reportContent.bettingAction": 1
        }
      }
    ]).exec();
  }
}
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class ConditionPairService {
  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async conditionPair(body: any) {

    console.log("conditionPair", body);

    const heroPosition = body.reportSetting.position;
    const heroAction = body.reportSetting.action;
    const stackDepthCategory = body.stackDepthCategory
    const skip = (body.page - 1) * body.pageSize;
    const limit = body.pageSize;

    let conditionPairPipeline = {
      pokerRoomId: body.pokerType,
      date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) },
      "reportContent.heroPosition": heroPosition,
      "reportDetail.stackDepth": { $in: stackDepthCategory.split(',').map(Number) }
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

    if (heroAction === "VPIP" || heroAction === "PFR") {
      const hasBettingActionCondition = heroAction === "PFR" ?
        { $or: [{ $expr: { $gt: ["$reportContent.bettingAction.raise", 0] } }, { $expr: { $gt: ["$reportContent.bettingAction.allin", 0] } }] } :
        { $or: [{ $expr: { $gt: ["$reportContent.bettingAction.raise", 0] } }, { $expr: { $gt: ["$reportContent.bettingAction.call", 0] } }, { $expr: { $gt: ["$reportContent.bettingAction.allin", 0] } }] };

      const totalCountPipeline = [
        { $match: conditionPairPipeline },
        { $match: hasBettingActionCondition },
        { $count: "totalCount" }
      ];

      const handsPipeline = [
        { $match: conditionPairPipeline },
        { $match: hasBettingActionCondition },
        { $project: projectQuery },
        { $skip: skip },
        { $limit: limit }
      ];

      const [totalCountResult, handsResult] = await Promise.all([
        this.handHistoryModel.aggregate(totalCountPipeline).exec(),
        this.handHistoryModel.aggregate(handsPipeline).exec()
      ]);

      const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

      return {
        totalCount: totalCount,
        result: handsResult,
      };
    } else {
      conditionPairPipeline["reportContent.action"] = heroAction === "" ? { $exists: true } : heroAction;

      const totalCount = await this.handHistoryModel.countDocuments(conditionPairPipeline);
      const hands = await this.handHistoryModel.aggregate([
        { $match: conditionPairPipeline },
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
}
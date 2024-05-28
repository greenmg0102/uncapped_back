import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

export class RaiseSizingTableService {
  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async raisingSizeTabelExtracting(body: any) {

    const skip = (body.page - 1) * body.pageSize;
    const limit = body.pageSize;

    let bufferAction = body.actionType.includes("all in") ? body.actionType.replace(/\s\(all in\)/g, '') : body.actionType

    const stackDepthBucket = {
      'Shallow Stack': [10, 15, 20],
      'Middle Stack': [25, 30, 40, 50],
      'Deep Stack': [60, 80, 100]
    }

    const bbRange = {
      '2bb': {
        min: 2.0,
        max: 2.49,
      },
      '10bballin': {
        min: 1.0,
        max: 10.0,
      },
      '25bb': {
        min: 2.5,
        max: 2.99,
      },
      '20bballin': {
        min: 11.0,
        max: 20.0,
      },
      '3bb': {
        min: 3.0,
        max: 3.49,
      },
      '30bballin': {
        min: 21.0,
        max: 30.0,
      },
      '35bb': {
        min: 3.5,
        max: 3.99,
      },
      '40bballin': {
        min: 31.0,
        max: 40.0,
      },
      '4bb': {
        min: 4.0,
        max: 4.49,
      },
      '50bballin': {
        min: 41.0,
        max: 50.0,
      },
      '45bb': {
        min: 4.5,
        max: 5.0,
      },
      '60bballin': {
        min: 51.0,
        max: 60.0,
      },
      '501bb': {
        min: 5.01,
        max: 99999999.0,
      },
      '61bballin': {
        min: 61.0,
        max: 99999999.0,
      },
      '1squeeze': {
        min: 1.0,
        max: 2.99,
      },
      '3squeeze': {
        min: 3.0,
        max: 3.49,
      },
      '35squeeze': {
        min: 3.5,
        max: 3.99,
      },
      '4squeeze': {
        min: 4.0,
        max: 4.49,
      },
      '45squeeze': {
        min: 4.5,
        max: 4.99
      },
      '5squeeze': {
        min: 5.0,
        max: 5.49,
      },
      '55squeeze': {
        min: 5.5,
        max: 5.99,
      },
      '6squeeze': {
        min: 6.0,
        max: 9999.0,
      }
    }

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

    if (body.type === "Hero") {

      let conditionPairPipeline = {
        userId: new mongoose.Types.ObjectId(body.userId),
        pokerRoomId: body.pokerType,
        maxTableSeats: body.tableSize,
        date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) },
        "reportDetail.action": {
          $elemMatch: {
            category: { $in: [bufferAction] },
            currentAction: body.field.includes("allin") ?
              { $regex: "all in", $options: "i" }
              :
              "raise"
          }
        },
        "reportDetail.stackDepth": { $in: stackDepthBucket[body.stackDepth] },
        "reportDetail.heroPosition": body.position
      };

      const hasBettingActionCondition = {
        $and: [
          {
            $expr: {
              $gte: [
                {
                  $max: {
                    $map: {
                      input: "$reportDetail.action",
                      as: "action",
                      in: { $divide: ["$$action.actionAmount", body.field.includes("allin") ? "$bigBlind" : "$$action.previousBettingAmount"] }
                    }
                  }
                },
                bbRange[body.field].min
              ]
            }
          },
          {
            $expr: {
              $lt: [
                {
                  $max: {
                    $map: {
                      input: "$reportDetail.action",
                      as: "action",
                      in: { $divide: ["$$action.actionAmount", body.field.includes("allin") ? "$bigBlind" : "$$action.previousBettingAmount"] }
                    }
                  }
                },
                bbRange[body.field].max
              ]
            }
          }
        ]
      }

      const handsPipeline = [
        { $match: conditionPairPipeline },
        { $match: hasBettingActionCondition },
        { $project: projectQuery },
        { $skip: skip },
        { $limit: limit }
      ];

      const totalCount = await this.handHistoryModel.countDocuments({ ...conditionPairPipeline, ...hasBettingActionCondition })

      const result = await this.handHistoryModel.aggregate(handsPipeline).exec()

      return {
        isOkay: true,
        totalCount: totalCount,
        result: result
      }

    } else if (body.type === "villain") {

      let conditionPairPipeline = {
        userId: new mongoose.Types.ObjectId(body.userId),
        pokerRoomId: body.pokerType,
        maxTableSeats: body.tableSize,
        date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) },
        "reportDetail.action": {
          $elemMatch: {
            villain: {
              $elemMatch: {
                villainCategory: { $in: [body.actionType] },
              }
            },
          }
        },
        "reportDetail.stackDepth": { $in: stackDepthBucket[body.stackDepth] },
      };

      const hasBettingActionCondition = {
        $and: [
          {
            $expr: {
              $gte: [
                {
                  $max: {
                    $map: {
                      input: "$reportDetail.action",
                      as: "action",
                      in: { $divide: ["$$action.actionAmount", body.field.includes("allin") ? "$bigBlind" : "$$action.previousBettingAmount"] }
                    }
                  }
                },
                bbRange[body.field].min
              ]
            }
          },
          {
            $expr: {
              $lt: [
                {
                  $max: {
                    $map: {
                      input: "$reportDetail.action",
                      as: "action",
                      in: { $divide: ["$$action.actionAmount", body.field.includes("allin") ? "$bigBlind" : "$$action.previousBettingAmount"] }
                    }
                  }
                },
                bbRange[body.field].max
              ]
            }
          }
        ]
      }

      const handsPipeline = [
        { $match: conditionPairPipeline },
        { $match: hasBettingActionCondition },
        { $project: projectQuery },
        { $skip: skip },
        { $limit: limit }
      ];

      const totalCount = await this.handHistoryModel.countDocuments({ ...conditionPairPipeline, ...hasBettingActionCondition })

      const result = await this.handHistoryModel.aggregate(handsPipeline).exec()

      return {
        isOkay: true,
        totalCount: totalCount,
        result: result
      }

    } else if (body.type === "Suqeeze") {

      console.log("body", body);

      let conditionPairPipeline = {
        userId: new mongoose.Types.ObjectId(body.userId),
        pokerRoomId: body.pokerType,
        maxTableSeats: body.tableSize,
        date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) },
        "reportDetail.action": {
          $elemMatch: {
            category: { $in: [bufferAction] },
            currentAction: "raise"
          }
        },
        "reportDetail.stackDepth": { $in: stackDepthBucket[body.stackDepth] },
        "reportDetail.heroPosition": body.position
      };

      const hasBettingActionCondition = {
        $and: [
          {
            $expr: {
              $gte: [
                {
                  $max: {
                    $map: {
                      input: "$reportDetail.action",
                      as: "action",
                      in: { $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }
                    }
                  }
                },
                bbRange[body.field].min
              ]
            }
          },
          {
            $expr: {
              $lt: [
                {
                  $max: {
                    $map: {
                      input: "$reportDetail.action",
                      as: "action",
                      in: { $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }
                    }
                  }
                },
                bbRange[body.field].max
              ]
            }
          }
        ]
      }

      const handsPipeline = [
        { $match: conditionPairPipeline },
        { $match: hasBettingActionCondition },
        { $project: projectQuery },
        { $skip: skip },
        { $limit: limit }
      ];

      const totalCount = await this.handHistoryModel.countDocuments({ ...conditionPairPipeline, ...hasBettingActionCondition })

      const result = await this.handHistoryModel.aggregate(handsPipeline).exec()

      return {
        isOkay: true,
        totalCount: totalCount,
        result: result
      }
    }
  }
}
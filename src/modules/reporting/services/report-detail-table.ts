import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { exchangeIntoNumberFromPositionString } from "src/shared/parsingAction/fileRead"
const mongoose = require('mongoose');
export class ReportDetailTableService {

  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async detailedTable(body: any) {

    let actionArray = ["RFI", "vs RFI", "3-Bet", "vs 3-Bet", "4-Bet", "vs 4-Bet", "5-Bet" ]

    // let matchObj = {
    //   userId: new mongoose.Types.ObjectId(body.userId),
    //   pokerRoomId: body.pokerType,
    //   date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) },
    //   "reportContent.heroPosition": { $exists: true },
    //   "reportContent.action": { $exists: true }
    // }

    let heroPosiotionList = exchangeIntoNumberFromPositionString(body.heroPosition)
    let villianPosiotionList = exchangeIntoNumberFromPositionString(body.VillianPosition)
    let stackDepth = body.stackDepth
    let action = body.action

    let matchObj = {
      userId: new mongoose.Types.ObjectId(body.userId),
      "reportContent.action": { $elemMatch: { $eq: action } },
      pokerRoomId: body.pokerType,
      maxTableSeats: body.tableSize,
      date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
    }

    if (heroPosiotionList.length > 0) matchObj["reportContent.heroPosition"] = { $in: heroPosiotionList }
    if (villianPosiotionList.length > 0) matchObj["$or"] = villianPosiotionList.map((item: any) => { return { "reportContent.villain": { $elemMatch: { $eq: item } } } })
    if (stackDepth.length > 0) matchObj["reportContent.stackDepth"] = { $in: stackDepth }

    let groupObj = {
      _id: "$reportContent.heroPosition",
      reportContent: { $first: "$reportContent" },
      totalCount: { $sum: 1 },
      bb100: {
        $sum: {
          $cond: {
            if: {
              $gt: [{ $size: { $filter: { input: "$summary.collected", as: "item", cond: { $eq: ["$$item.playerName", "Hero"] } } } }, 0]
            },
            then: {
              $divide: [
                {
                  $subtract: [
                    {
                      $add: [
                        {
                          $toDouble: { $arrayElemAt: [{ $map: { input: { $filter: { input: "$summary.collected", as: "item", cond: { $eq: ["$$item.playerName", "Hero"] } } }, as: "item", in: "$$item.amount" } }, 0] }
                        },
                        { $toDouble: "$returnedChip" }
                      ]
                    },
                    {
                      $add: [
                        { $toDouble: { $sum: { $map: { input: { $filter: { input: "$actions", as: "action", cond: { $and: [{ $eq: ["$$action.playerName", "Hero"] }] } } }, as: "action", in: { $ifNull: ["$$action.actionAmount", 0] } } } } },
                        {
                          $subtract: [
                            { $toDouble: "$heroChipBeforeHole" },
                            { $toDouble: "$sbCaseChip" }
                          ]
                        }
                      ]
                    }
                  ]
                },
                { $toDouble: "$bigBlind" }
              ]
            },
            else: {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: [
                        {
                          $add: [
                            { $toDouble: { $sum: { $map: { input: { $filter: { input: "$actions", as: "action", cond: { $and: [{ $eq: ["$$action.playerName", "Hero"] }] } } }, as: "action", in: { $ifNull: ["$$action.actionAmount", 0] } } } } },
                            { $toDouble: "$heroChipBeforeHole" }
                          ]
                        },
                        { $toDouble: "$returnedChip" }
                      ]
                    },
                    { $toDouble: "$bigBlind" }
                  ]
                }, -1
              ]
            }
          }
        }
      },
      allinbb100: {
        $sum: {
          $cond: {
            if: {
              $eq: [
                {
                  $add: [
                    { $toDouble: { $sum: { $map: { input: { $filter: { input: "$actions", as: "action", cond: { $and: [{ $eq: ["$$action.playerName", "Hero"] }] } } }, as: "action", in: { $ifNull: ["$$action.actionAmount", 0] } } } } },
                    { $toDouble: "$heroChipBeforeHole" }
                  ]
                },
                {
                  $toDouble: {
                    $arrayElemAt: [
                      { $map: { input: { $filter: { input: "$players", as: "player", cond: { $eq: ["$$player.playerName", "Hero"] } } }, as: "player", in: "$$player.chipCount" } },
                      0
                    ]
                  }
                }
              ]
            },
            then: {
              $cond: {
                if: {
                  $gt: [{ $size: { $filter: { input: "$summary.collected", as: "item", cond: { $eq: ["$$item.playerName", "Hero"] } } } }, 0]
                },
                then: {
                  $divide: [
                    {
                      $subtract: [
                        {
                          $add: [
                            {
                              $toDouble: { $arrayElemAt: [{ $map: { input: { $filter: { input: "$summary.collected", as: "item", cond: { $eq: ["$$item.playerName", "Hero"] } } }, as: "item", in: "$$item.amount" } }, 0] }
                            },
                            { $toDouble: "$returnedChip" }
                          ]
                        },
                        {
                          $add: [
                            { $toDouble: { $sum: { $map: { input: { $filter: { input: "$actions", as: "action", cond: { $and: [{ $eq: ["$$action.playerName", "Hero"] }] } } }, as: "action", in: { $ifNull: ["$$action.actionAmount", 0] } } } } },
                            {
                              $subtract: [
                                { $toDouble: "$heroChipBeforeHole" },
                                { $toDouble: "$sbCaseChip" }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    { $toDouble: "$bigBlind" }
                  ]
                },
                else: {
                  $multiply: [
                    {
                      $divide: [
                        {
                          $subtract: [
                            {
                              $add: [
                                { $toDouble: { $sum: { $map: { input: { $filter: { input: "$actions", as: "action", cond: { $and: [{ $eq: ["$$action.playerName", "Hero"] }] } } }, as: "action", in: { $ifNull: ["$$action.actionAmount", 0] } } } } },
                                { $toDouble: "$heroChipBeforeHole" }
                              ]
                            },
                            { $toDouble: "$returnedChip" }
                          ]
                        },
                        { $toDouble: "$bigBlind" }
                      ]
                    }, -1
                  ]
                }
              }
            },
            else: 0
          }
        }
      },
      VPIP: {
        $sum: {
          $cond: {
            if: {
              $or: [
                { $gt: ["$reportContent.bettingAction.raise", 0] },
                { $gt: ["$reportContent.bettingAction.call", 0] },
                { $gt: ["$reportContent.bettingAction.allin", 0] }
              ]
            }, then: 1, else: 0
          }
        }
      },
      PFR: {
        $sum: {
          $cond: {
            if: {
              $or: [
                { $gt: ["$reportContent.bettingAction.raise", 0] },
                { $gt: ["$reportContent.bettingAction.allin", 0] }
              ]
            }, then: 1, else: 0
          }
        }
      }
    }

    actionArray.forEach((item: any) => {
      groupObj[item] = {
        $sum: {
          $cond: {
            if: { $in: [item, "$reportContent.action"] }, then: 1, else: 0
          }
        }
      }
    })

    let statistics = await this.handHistoryModel.aggregate([
      { $match: matchObj },
      { $group: groupObj },
      {
        $project: {
          _id: 1, totalCount: 1, bb100: 1, allinbb100: 1, PFR: 1, VPIP: 1, RFI: 1, "vs RFI": 1, "3-Bet": 1, "vs 3-Bet": 1, "4-Bet": 1, "vs 4-Bet": 1, "5-Bet": 1,
          //  "vs 5-Bet": 1
        }
      }
    ])

    return statistics;

  }
}

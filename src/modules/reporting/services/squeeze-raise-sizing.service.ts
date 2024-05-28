import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

export class SqueezeRaiseSizingService {
  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async extractingSqueezeRaisingTable(body: any) {

    console.log("extractingSqueezeRaisingTable", body);

    // let bufferAction = body.actionType.includes("all in") ? body.actionType.replace(/\s\(all in\)/g, '') : body.actionType
    let bufferAction = body.actionType

    const stackDepthBucket = {
      'Shallow Stack': [10, 15, 20],
      'Middle Stack': [25, 30, 40, 50],
      'Deep Stack': [60, 80, 100]
    }

    let matchObj = {
      userId: new mongoose.Types.ObjectId(body.userId),
      "reportDetail.action": { $elemMatch: { category: { $in: [bufferAction] } } },
      "reportDetail.stackDepth": { $in: stackDepthBucket[body.stackDepth] },
      pokerRoomId: body.pokerType,
      maxTableSeats: body.tableSize,
      date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
    };

    let groupObj = {
      _id: "$reportDetail.heroPosition",
      reportDetail: { $first: "$reportDetail" },
      // All: { $sum: 1 },
      '1squeeze': {
        $sum: {
          $size: {
            $filter: {
              input: {
                $map: {
                  input: "$reportDetail.action",
                  as: "action",
                  in: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$$action.currentAction", "raise"] },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 1.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 2.99] },
                        ]
                      },
                      then: "$$action",
                      else: null
                    }
                  }
                }
              },
              as: "filteredAction",
              cond: { $ne: ["$$filteredAction", null] }
            }
          }
        }
      },
      '3squeeze': {
        $sum: {
          $size: {
            $filter: {
              input: {
                $map: {
                  input: "$reportDetail.action",
                  as: "action",
                  in: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$$action.currentAction", "raise"] },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 3.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 3.49] },
                        ]
                      },
                      then: "$$action",
                      else: null
                    }
                  }
                }
              },
              as: "filteredAction",
              cond: { $ne: ["$$filteredAction", null] }
            }
          }
        }
      },
      '35squeeze': {
        $sum: {
          $size: {
            $filter: {
              input: {
                $map: {
                  input: "$reportDetail.action",
                  as: "action",
                  in: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$$action.currentAction", "raise"] },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 3.5] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 3.99] }
                        ]
                      },
                      then: "$$action",
                      else: null
                    }
                  }
                }
              },
              as: "filteredAction",
              cond: { $ne: ["$$filteredAction", null] }
            }
          }
        }
      },
      '4squeeze': {
        $sum: {
          $size: {
            $filter: {
              input: {
                $map: {
                  input: "$reportDetail.action",
                  as: "action",
                  in: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$$action.currentAction", "raise"] },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 4.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 4.49] }
                        ]
                      },
                      then: "$$action",
                      else: null
                    }
                  }
                }
              },
              as: "filteredAction",
              cond: { $ne: ["$$filteredAction", null] }
            }
          }
        }
      },
      '45squeeze': {
        $sum: {
          $size: {
            $filter: {
              input: {
                $map: {
                  input: "$reportDetail.action",
                  as: "action",
                  in: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$$action.currentAction", "raise"] },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 4.5] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 4.99] }
                        ]
                      },
                      then: "$$action",
                      else: null
                    }
                  }
                }
              },
              as: "filteredAction",
              cond: { $ne: ["$$filteredAction", null] }
            }
          }
        }
      },
      '5squeeze': {
        $sum: {
          $size: {
            $filter: {
              input: {
                $map: {
                  input: "$reportDetail.action",
                  as: "action",
                  in: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$$action.currentAction", "raise"] },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 5.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 5.49] }
                        ]
                      },
                      then: "$$action",
                      else: null
                    }
                  }
                }
              },
              as: "filteredAction",
              cond: { $ne: ["$$filteredAction", null] }
            }
          }
        }
      },
      '55squeeze': {
        $sum: {
          $size: {
            $filter: {
              input: {
                $map: {
                  input: "$reportDetail.action",
                  as: "action",
                  in: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$$action.currentAction", "raise"] },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 5.5] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 5.99] }
                        ]
                      },
                      then: "$$action",
                      else: null
                    }
                  }
                }
              },
              as: "filteredAction",
              cond: { $ne: ["$$filteredAction", null] }
            }
          }
        }
      },
      '6squeeze': {
        $sum: {
          $size: {
            $filter: {
              input: {
                $map: {
                  input: "$reportDetail.action",
                  as: "action",
                  in: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$$action.currentAction", "raise"] },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 6.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 9999.0] }
                        ]
                      },
                      then: "$$action",
                      else: null
                    }
                  }
                }
              },
              as: "filteredAction",
              cond: { $ne: ["$$filteredAction", null] }
            }
          }
        }
      },

    };

    let statistics = await this.handHistoryModel.aggregate([
      { $match: matchObj },
      { $group: groupObj },
      {
        $project: {
          _id: 1,
          // All: 1,
          '1squeeze': 1,
          '3squeeze': 1,
          '35squeeze': 1,
          '4squeeze': 1,
          '45squeeze': 1,
          "5squeeze": 1,
          '55squeeze': 1,
          '6squeeze': 1
        }
      }
    ]);


    return statistics
  }
}
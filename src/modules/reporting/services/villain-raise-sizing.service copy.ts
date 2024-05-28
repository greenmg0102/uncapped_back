import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

export class VillainRaiseSizingService {
  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async extractingVillainRaisingTable(body: any) {

    console.log("extractingVillainRaisingTable", body);

    const stackDepthBucket = {
      'Shallow Stack': [10, 15, 20],
      'Middle Stack': [25, 30, 40, 50],
      'Deep Stack': [60, 80, 100]
    }

    let matchObj = {
      userId: new mongoose.Types.ObjectId(body.userId),
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
      pokerRoomId: body.pokerType,
      maxTableSeats: body.tableSize,
      date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
    };

    let groupObj = {
      _id: "$reportDetail.action.villain.position",
      reportDetail: { $first: "$reportDetail" },
      '2bb': {
        $sum: {
          $size: {
            $filter: {
              input: {
                $map: {
                  input: "$reportDetail.action",
                  as: "action",
                  in: {
                    // $cond: {
                    //   if: {
                    //     $and: [
                    //       { $eq: ["$$action.currentAction", "raise"] },
                    //       { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 2.0] },
                    //       { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 2.49] },
                    //     ]
                    //   },
                    //   then: "$$action",
                    //   else: null
                    // }

                    $map: {
                      input: "$$action.villain",
                      as: "villainAction",
                      in: {
                        $cond: {
                          if: {
                            $and: [
                              // { $eq: ["$$action.currentAction", "raise"] },
                              { $gte: [{ $divide: ["$$villainAction.currentVillainActionAmount", "$bigBlind"] }, 2.0] },
                              { $lt: [{ $divide: ["$$villainAction.currentVillainActionAmount", "$bigBlind"] }, 2.49] },
                            ]
                          },
                          then: "$$action",
                          else: null
                        }

                      }
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
      '25bb': {
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
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 2.5] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 2.99] }
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
      '3bb': {
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
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 3.49] }
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
      '35bb': {
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
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 3.5] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 3.99] }
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
      '4bb': {
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
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 4.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 4.49] }
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
      '45bb': {
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
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 4.5] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 5.0] }
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
      '501bb': {
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
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 5.01] }
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

    let unwindObj1 = {
      $unwind: "$_id"
    };

    let unwindObj2 = {
      $unwind: "$_id"
    };

    let statistics = await this.handHistoryModel.aggregate([
      { $match: matchObj },
      { $group: groupObj },
      unwindObj1,
      unwindObj2,
      {
        $project: {
          _id: 1,
          '2bb': 1,
          '25bb': 1,
          '3bb': 1,
          '35bb': 1,
          '4bb': 1,
          '45bb': 1,
          '501bb': 1,
        }
      }
    ]);

    const result = Object.values(statistics.reduce((acc: any, item: any) => {
      const id = item._id;
      if (!acc[id]) {
        acc[id] = { ...item };
      } else {
        for (const key in item) {
          if (key !== "_id") {
            acc[id][key] = (acc[id][key] || 0) + item[key];
          }
        }
      }
      return acc;
    }, {}));

    return result
  }

}
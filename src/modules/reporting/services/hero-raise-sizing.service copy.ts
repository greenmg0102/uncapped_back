import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

export class HeroRaiseSizingService {
  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async extractingHeroRaisingTable(body: any) {

    console.log("extractingHeroRaisingTable", body);

    let bufferAction = body.actionType.includes("all in") ? body.actionType.replace(/\s\(all in\)/g, '') : body.actionType
    let bufferTableSeat = body.tableSize === '2~10' ? [2, 3, 4, 5, 6, 7, 8, 9, 10] : [body.tableSize]

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
      maxTableSeats: { $in: bufferTableSeat },
      date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
    };

    let groupObj = {
      _id: "$reportDetail.heroPosition",
      reportDetail: { $first: "$reportDetail" },
      // All: { $sum: 1 },
      '2bb': {
        $sum: {
          $size: {
            $filter: {
              input: {
                $map: {
                  input: "$reportDetail.action",
                  as: "action",
                  in: {
                    $filter: {
                      input: "$$action.villain",
                      as: "villainAction",
                      cond: {
                        $and: [
                          { $gte: [{ $divide: ["$$villainAction.currentVillainActionAmount", "$$action.previousBettingAmount"] }, 2.0] },
                          { $lt: [{ $divide: ["$$villainAction.currentVillainActionAmount", "$$action.previousBettingAmount"] }, 2.49] }
                        ]
                      }
                    }
                  }
                }
              },
              as: "filteredAction",
              cond: { $ne: ["$$filteredAction", []] }
            }
          }
        }
      },
      // '2bb': {
      //   $sum: {
      //     $size: {
      //       $filter: {
      //         input: {
      //           $map: {
      //             input: "$reportDetail.action",
      //             as: "action",
      //             in: {
      //               $cond: {
      //                 if: {
      //                   $and: [
      //                     { $eq: ["$$action.currentAction", "raise"] },
      //                     { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 2.0] },
      //                     { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 2.49] },
      //                   ]
      //                 },
      //                 then: "$$action",
      //                 else: null
      //               }
      //             }
      //           }
      //         },
      //         as: "filteredAction",
      //         cond: { $ne: ["$$filteredAction", null] }
      //       }
      //     }
      //   }
      // },
      '10bballin': {
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
                          { $regexMatch: { input: "$$action.currentAction", regex: "all in" } },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 1.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 9.99] },
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
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 2.5] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 2.99] }
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
      '20bballin': {
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
                          { $regexMatch: { input: "$$action.currentAction", regex: "all in" } },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 10.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 19.99] }
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
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 3.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 3.49] }
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
      '30bballin': {
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
                          { $regexMatch: { input: "$$action.currentAction", regex: "all in" } },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 21.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 30.0] }
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
      '40bballin': {
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
                          { $regexMatch: { input: "$$action.currentAction", regex: "all in" } },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 31.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 40.0] }
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
      '50bballin': {
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
                          { $regexMatch: { input: "$$action.currentAction", regex: "all in" } },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 41.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 50.0] }
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
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 4.5] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 5.0] }
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
      '60bballin': {
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
                          { $regexMatch: { input: "$$action.currentAction", regex: "all in" } },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 51.0] },
                          { $lt: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 60.0] }
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
                          { $gte: [{ $divide: ["$$action.actionAmount", "$$action.previousBettingAmount"] }, 5.01] }
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
      '61bballin': {
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
                          { $regexMatch: { input: "$$action.currentAction", regex: "all in" } },
                          { $gte: [{ $divide: ["$$action.actionAmount", "$bigBlind"] }, 61.0] }
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
      }

    };

    let statistics = await this.handHistoryModel.aggregate([
      { $match: matchObj },
      { $group: groupObj },
      {
        $project: {
          _id: 1,
          // All: 1,
          '2bb': 1,
          '10bballin': 1,
          '25bb': 1,
          '20bballin': 1,
          '3bb': 1,
          '30bballin': 1,
          '35bb': 1,
          '40bballin': 1,
          '4bb': 1,
          '50bballin': 1,
          '45bb': 1,
          '60bballin': 1,
          '501bb': 1,
          '61bballin': 1
        }
      }
    ]);

    console.log("statistics", statistics);



    return statistics
  }
}
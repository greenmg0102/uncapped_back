import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { squeezeActionRecursive } from 'src/shared/report/squeezeRecursiveData'
import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString } from "src/shared/parsingAction/fileRead"
import { ObjectId } from 'mongodb';

export class ReportGlobalStatisticService {

    constructor(
        @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
    ) { }

    async globalStatistic(body: any) {

        let pipeLine = {
            userId: new mongoose.Types.ObjectId(body.userId),
            date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
        }

        let groupObj = {
            _id: "$_id",
            handDate: { $first: "$handDate" },
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
                                                { $toDouble: { $arrayElemAt: [{ $map: { input: { $filter: { input: "$summary.collected", as: "item", cond: { $eq: ["$$item.playerName", "Hero"] } } }, as: "item", in: "$$item.amount" } }, 0] } },
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
            // allinbb100: {
            //     $sum: {
            //         $cond: {
            //             if: {
            //                 $eq: [
            //                     {
            //                         $add: [
            //                             { $toDouble: { $sum: { $map: { input: { $filter: { input: "$actions", as: "action", cond: { $and: [{ $eq: ["$$action.playerName", "Hero"] }] } } }, as: "action", in: { $ifNull: ["$$action.actionAmount", 0] } } } } },
            //                             { $toDouble: "$heroChipBeforeHole" }
            //                         ]
            //                     },
            //                     {
            //                         $toDouble: {
            //                             $arrayElemAt: [
            //                                 { $map: { input: { $filter: { input: "$players", as: "player", cond: { $eq: ["$$player.playerName", "Hero"] } } }, as: "player", in: "$$player.chipCount" } },
            //                                 0
            //                             ]
            //                         }
            //                     }
            //                 ]
            //             },
            //             then: {
            //                 $cond: {
            //                     if: {
            //                         $gt: [{ $size: { $filter: { input: "$summary.collected", as: "item", cond: { $eq: ["$$item.playerName", "Hero"] } } } }, 0]
            //                     },
            //                     then: {
            //                         $divide: [
            //                             {
            //                                 $subtract: [
            //                                     {
            //                                         $add: [
            //                                             {
            //                                                 $toDouble: { $arrayElemAt: [{ $map: { input: { $filter: { input: "$summary.collected", as: "item", cond: { $eq: ["$$item.playerName", "Hero"] } } }, as: "item", in: "$$item.amount" } }, 0] }
            //                                             },
            //                                             { $toDouble: "$returnedChip" }
            //                                         ]
            //                                     },
            //                                     {
            //                                         $add: [
            //                                             { $toDouble: { $sum: { $map: { input: { $filter: { input: "$actions", as: "action", cond: { $and: [{ $eq: ["$$action.playerName", "Hero"] }] } } }, as: "action", in: { $ifNull: ["$$action.actionAmount", 0] } } } } },
            //                                             {
            //                                                 $subtract: [
            //                                                     { $toDouble: "$heroChipBeforeHole" },
            //                                                     { $toDouble: "$sbCaseChip" }
            //                                                 ]
            //                                             }
            //                                         ]
            //                                     }
            //                                 ]
            //                             },
            //                             { $toDouble: "$bigBlind" }
            //                         ]
            //                     },
            //                     else: {
            //                         $multiply: [
            //                             {
            //                                 $divide: [
            //                                     {
            //                                         $subtract: [
            //                                             {
            //                                                 $add: [
            //                                                     { $toDouble: { $sum: { $map: { input: { $filter: { input: "$actions", as: "action", cond: { $and: [{ $eq: ["$$action.playerName", "Hero"] }] } } }, as: "action", in: { $ifNull: ["$$action.actionAmount", 0] } } } } },
            //                                                     { $toDouble: "$heroChipBeforeHole" }
            //                                                 ]
            //                                             },
            //                                             { $toDouble: "$returnedChip" }
            //                                         ]
            //                                     },
            //                                     { $toDouble: "$bigBlind" }
            //                                 ]
            //                             }, -1
            //                         ]
            //                     }
            //                 }
            //             },
            //             else: 0
            //         }
            //     }
            // },
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
            showHand: {
                $sum: {
                    $cond: {
                        if: {
                            $and: [
                                {
                                    $gt: [{ $size: { $filter: { input: "$summary.shows", as: "show", cond: { $eq: ["$$show.playerName", "Hero"] }, }, }, }, 0]
                                },
                                {
                                    $gt: [{ $size: { $filter: { input: "$summary.collected", as: "item", cond: { $eq: ["$$item.playerName", "Hero"] } } } }, 0]
                                }
                            ]
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
            notShowHand: {
                $sum: {
                    $cond: {
                        if: {
                            $and: [
                                {
                                    $lt: [{ $size: { $filter: { input: "$summary.shows", as: "show", cond: { $eq: ["$$show.playerName", "Hero"] } }, } }, 1,]
                                },
                                {
                                    $gt: [{ $size: { $filter: { input: "$summary.collected", as: "item", cond: { $eq: ["$$item.playerName", "Hero"] } } } }, 0]
                                }
                            ]
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
                                },
                                -1
                            ]
                        }
                    }
                }
            },
            ev: { $first: "$reportDetail.ev" },
            sbCaseChip: { $first: "$sbCaseChip" },
            returnedChip: { $first: "$returnedChip" },
            heroChipBeforeHole: { $first: "$heroChipBeforeHole" },
            holeCards: { $first: "$holeCards" },
            summary: { $first: "$summary" }
        }

        let statistics = await this.handHistoryModel.aggregate([
            { $match: pipeLine },
            { $group: groupObj },
            { $sort: { handDate: 1 } },
            {
                $project: {
                    bb100: 1,
                    allinbb100: 1,
                    showHand: 1,
                    notShowHand: 1,
                    ev: 1,
                    sbCaseChip: 1,
                    returnedChip: 1,
                    heroChipBeforeHole: 1,
                    holeCards: 1,
                    summary: 1
                }
            }
        ])

        let real = []
        let sumBB = 0;
        let sumExpected = 0;
        let sumShow = 0;
        let sumNotShowHand = 0;

        let count = 0;

        if (statistics.length === 0) {
            return []
        }

        real.push({
            sumBB: parseFloat(statistics[0].bb100.toFixed(3)),
            sumExpected: parseFloat(statistics[0].ev.toFixed(3)),
            sumShow: parseFloat(statistics[0].showHand.toFixed(3)),
            sumNotShowHand: parseFloat(statistics[0].notShowHand.toFixed(3)),
            sbCaseChip: statistics[0].sbCaseChip,
            returnedChip: statistics[0].returnedChip,
            heroChipBeforeHole: statistics[0].heroChipBeforeHole,
            holeCards: statistics[0].holeCards,
            summary: statistics[0].summary
        });

        for (let i = 1; i < statistics.length; i++) {

            for (let j = 0; j < i; j++) {

                sumBB += statistics[j].bb100;
                sumExpected += statistics[j].ev;
                sumShow += statistics[j].showHand;
                sumNotShowHand += statistics[j].notShowHand;

                count++;

                if (j === i - 1) {
                    real.push({
                        sumBB: parseFloat(sumBB.toFixed(3)),
                        sumExpected: parseFloat(sumExpected.toFixed(3)),
                        sumShow: parseFloat(sumShow.toFixed(3)),
                        sumNotShowHand: parseFloat(sumNotShowHand.toFixed(3)),

                        sbCaseChip: statistics[j].sbCaseChip,
                        returnedChip: statistics[j].returnedChip,
                        heroChipBeforeHole: statistics[j].heroChipBeforeHole,
                        holeCards: statistics[j].holeCards,
                        summary: statistics[j].summary,
                    });
                    sumBB = 0;
                    sumExpected = 0;
                    sumShow = 0;
                    sumNotShowHand = 0;

                    count = 0;
                }
            }
        }

        return real;

    }

    generateNumbers(randomValue: any, rangeBetween: any) {
        let value = 1;
        let range = 100;

        while (randomValue > range) {

            value *= 10;
            range *= 10;
        }

        return value;
    }


}
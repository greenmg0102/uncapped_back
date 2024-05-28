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
                                }, -1]
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
            showHand: {
                $sum: {
                    $cond: {
                        if: {
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$summary.shows",
                                            as: "show",
                                            cond: { $eq: ["$$show.playerName", "Hero"] },
                                        },
                                    },
                                },
                                0,
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
                                }, -1]
                        }
                    }
                }
            },
            notShowHand: {
                $sum: {
                    $cond: {
                        if: {
                            $lt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$summary.shows",
                                            as: "show",
                                            cond: { $eq: ["$$show.playerName", "Hero"] },
                                        },
                                    },
                                },
                                1,
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
                                }, -1]
                        }
                    }
                }
            }
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
                }
            }
        ])

        let real = []
        let sumBB = 0;
        let sumExpected = 0;
        let sumShow = 0;
        let sumNotShowHand = 0;

        let count = 0;

        real.push({
            sumBB: 0,
            sumExpected: 0,
            sumShow: 0,
            sumNotShowHand: 0
        });

        for (let i = 0; i < statistics.length; i++) {

            for (let j = 0; j < i; j++) {

                sumBB += statistics[j].bb100;
                sumExpected += statistics[j].allinbb100;
                sumShow += statistics[j].showHand;
                sumNotShowHand += statistics[j].notShowHand;

                count++;

                if (j === i - 1) {

                    real.push({
                        sumBB: Math.round(sumBB),
                        sumExpected: Math.round(sumExpected),
                        sumShow: Math.round(sumShow),
                        sumNotShowHand: Math.round(sumNotShowHand)
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
}
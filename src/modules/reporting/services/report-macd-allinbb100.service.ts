import { Injectable } from '@nestjs/common';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

@Injectable()
export class ReportMacdAllinbb100Service {
    constructor(
        @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
    ) { }

    async allinbb100(body: any) {

        let pipeLine = {
            userId: new mongoose.Types.ObjectId(body.userId),
            pokerRoomId: body.pokerType,
            maxTableSeats: body.tableSize,
            date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
        }

        let groupObj = {
            _id: "$handDate",
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
                                    $multiply: [
                                        {
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
                                        }, 0.01
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
                                        }, -0.01
                                    ]
                                }
                            }
                        },
                        else: 0
                    }
                }
            }
        }


        let statistics = await this.handHistoryModel.aggregate([
            { $match: pipeLine },
            { $group: groupObj },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 1, allinbb100: 1
                }
            }
        ])

        return statistics;

    }

}

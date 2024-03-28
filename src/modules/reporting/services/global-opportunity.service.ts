import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { exchangeIntoNumberFromPositionString } from "src/shared/parsingAction/fileRead"
const mongoose = require('mongoose');

export class GlobalOpportunityService {
    constructor(
        @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
    ) { }

    async eachActionPosition(body: any) {

        // let pipeLine = {
        //     userId: new mongoose.Types.ObjectId(body.userId),
        //     pokerRoomId: body.pokerType,
        //     maxTableSeats: body.tableSize,
        //     date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
        // }

        let heroPosiotionList = exchangeIntoNumberFromPositionString(body.heroPosition)
        let villianPosiotionList = exchangeIntoNumberFromPositionString(body.VillianPosition)
        let stackDepth = body.stackDepth
        let action = body.action

        let pipeLine = {
            userId: new mongoose.Types.ObjectId(body.userId),
            // "reportContent.action": { $elemMatch: { $eq: action } },
            "reportDetail.action": {
                $elemMatch: {
                    category: { $in: [action] }
                }
            },
            pokerRoomId: body.pokerType,
            maxTableSeats: body.tableSize,
            date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
        }

        if (heroPosiotionList.length > 0) pipeLine["reportContent.heroPosition"] = { $in: heroPosiotionList }
        if (villianPosiotionList.length > 0) pipeLine["$or"] = villianPosiotionList.map((item: any) => { return { "reportContent.villain": { $elemMatch: { $eq: item } } } })
        if (stackDepth.length > 0) pipeLine["reportContent.stackDepth"] = { $in: stackDepth }

        let result = await this.handHistoryModel.aggregate([
            { $match: pipeLine },
            { $unwind: "$holeCards" },
            {
                $addFields: {
                    formattedCards: {
                        $switch: {
                            branches: [
                                {
                                    case: { $eq: [{ $arrayElemAt: ["$holeCards.cards.rank", 0] }, { $arrayElemAt: ["$holeCards.cards.rank", 1] }] },
                                    then: { $concat: [{ $arrayElemAt: ["$holeCards.cards.rank", 0] }, { $arrayElemAt: ["$holeCards.cards.rank", 1] }] }
                                },
                                {
                                    case: {
                                        $and: [
                                            { $ne: [{ $arrayElemAt: ["$holeCards.cards.rank", 0] }, { $arrayElemAt: ["$holeCards.cards.rank", 1] }] },
                                            { $eq: [{ $arrayElemAt: ["$holeCards.cards.suit", 0] }, { $arrayElemAt: ["$holeCards.cards.suit", 1] }] }
                                        ]
                                    },
                                    then: { $concat: [{ $arrayElemAt: ["$holeCards.cards.rank", 0] }, { $arrayElemAt: ["$holeCards.cards.rank", 1] }, "s"] }
                                }
                            ],
                            default: { $concat: [{ $arrayElemAt: ["$holeCards.cards.rank", 0] }, { $arrayElemAt: ["$holeCards.cards.rank", 1] }, "o"] }
                        }
                    }
                }
            }
            ,
            {
                $group: {
                    _id: {
                        action: "$reportContent.action",
                        heroPosition: "$reportContent.heroPosition",
                        stackDepth: "$reportContent.stackDepth",
                        formattedCards: "$formattedCards"
                    },
                    count: { $sum: 1 }
                }
            },
            // Reshape the output to match the desired structure
            {
                $group: {
                    _id: {
                        action: "$_id.action",
                        heroPosition: "$_id.heroPosition",
                        stackDepth: "$_id.stackDepth"
                    },
                    formattedCardCounts: {
                        $push: {
                            formattedCards: "$_id.formattedCards",
                            count: "$count"
                        }
                    }
                }
            },
            // Reshape the output further if necessary
            {
                $group: {
                    _id: {
                        action: "$_id.action"
                    },
                    heroPosition: {
                        $push: {
                            position: "$_id.heroPosition",
                            stackDepth: {
                                depth: "$_id.stackDepth",
                                formattedCardCounts: "$formattedCardCounts"
                            }
                        }
                    }
                }
            },
            // Final projection to shape the output exactly as needed
            {
                $project: {
                    _id: 0,
                    action: "$_id.action",
                    heroPosition: 1
                }
            }
        ]).exec();

        return result

    }
}
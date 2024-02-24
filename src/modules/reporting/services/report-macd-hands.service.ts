import { Injectable } from '@nestjs/common';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

@Injectable()
export class ReportMacdHandsService {

    constructor(
        @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
    ) { }

    async hands(body: any) {

        const { handType, page, pageSize, actionType, pokerType, range, tableSize, reportSetting: { position, action } } = body;

        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        const conditionPairPipeline = {
            userId: new mongoose.Types.ObjectId(body.userId),
            pokerRoomId: pokerType,
            maxTableSeats: tableSize,
            date: { $gte: new Date(range.split(" to ")[0]), $lte: new Date(range.split(" to ")[1]) },
            [`reportContent.bettingAction.${actionType}`]: { $gt: 0 }
        };

        let matchExpression = {}
        if (handType === "Pairs") {
            matchExpression = {
                $expr: { $eq: [{ $arrayElemAt: ["$holeCards.cards.rank", 0] }, { $arrayElemAt: ["$holeCards.cards.rank", 1] }] }
            };
        } else if (handType === "Suited") {
            matchExpression = {
                $expr: {
                    $and: [
                        { $ne: [{ $arrayElemAt: ["$holeCards.cards.rank", 0] }, { $arrayElemAt: ["$holeCards.cards.rank", 1] }] },
                        { $eq: [{ $arrayElemAt: ["$holeCards.cards.suit", 0] }, { $arrayElemAt: ["$holeCards.cards.suit", 1] }] }
                    ]
                }
            };
        } else if (handType === "Offsuit") {
            matchExpression = {
                $expr: {
                    $and: [
                        { $ne: [{ $arrayElemAt: ["$holeCards.cards.rank", 0] }, { $arrayElemAt: ["$holeCards.cards.rank", 1] }] },
                        { $ne: [{ $arrayElemAt: ["$holeCards.cards.suit", 0] }, { $arrayElemAt: ["$holeCards.cards.suit", 1] }] }
                    ]
                }
            };
        }

        const totalCountAggregation = await this.handHistoryModel.aggregate([
            { $match: conditionPairPipeline },
            { $unwind: "$holeCards" },
            { $match: matchExpression },
            { $count: "total" }
        ]).exec();

        const totalCount = (totalCountAggregation.length > 0) ? totalCountAggregation[0].total : 0;


        const hands = await this.handHistoryModel.aggregate([
            { $match: conditionPairPipeline },
            { $unwind: "$holeCards" },
            { $match: matchExpression },
            {
                $project: {
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
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]).exec();

        return {
            totalCount: totalCount,
            result: hands,
        };
    }
}

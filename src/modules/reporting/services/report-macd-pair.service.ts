import { Injectable } from '@nestjs/common';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReportMacdPairService {
    constructor(
        @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
    ) { }

    async cardPair(body: any) {

        let result = await this.handHistoryModel.aggregate([
            // {
            //     $match: pipeLine
            // },
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
                        formattedCards: "$formattedCards"
                    },
                    count: { $sum: 1 }
                }
            }
        ])

        return result
    }

}

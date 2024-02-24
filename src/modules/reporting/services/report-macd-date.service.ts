import { Injectable } from '@nestjs/common';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

@Injectable()
export class ReportMacdDateService {
    constructor(
        @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
    ) { }


    async date(body: any) {

        let pipeLine = {
            userId: new mongoose.Types.ObjectId(body.userId),
            pokerRoomId: body.pokerType,
            maxTableSeats: body.tableSize,
            date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
        }

        try {
            let resultCursor = this.handHistoryModel.collection.aggregate([
                {
                    $match: pipeLine
                },
                {
                    $group: {
                        _id: {
                            year: { $year: { $toDate: "$handDate" } },
                            month: { $month: { $toDate: "$handDate" } },
                            day: { $dayOfMonth: { $toDate: "$handDate" } }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: {
                            $dateToString: {
                                format: "%Y/%m/%d",
                                date: { $toDate: { $concat: [{ $toString: "$_id.year" }, "-", { $toString: "$_id.month" }, "-", { $toString: "$_id.day" }] } }
                            }
                        },
                        count: "$count"
                    }
                },
                {
                    $sort: { date: 1 } // Sort by date in ascending order
                }
            ]);

            const result = await resultCursor.toArray();

            return result

            // Process the result
        } catch (err) {
            console.error(err);
            // Handle error
        }
    }

    // async date(body: any) {
    //     return this.handHistoryModel.collection.aggregate([
    //       {
    //         $project: {
    //           yearMonth: { $dateToString: { format: "%Y-%m", date: { $dateFromString: { dateString: "$handDate", format: "%Y/%m/%d" } } } }
    //         }
    //       },
    //       {
    //         $group: {
    //           _id: "$yearMonth",
    //           count: { $sum: 1 }
    //         }
    //       },
    //       {
    //         $sort: { _id: 1 }
    //       }
    //     ]).toArray(); // Convert the aggregation result to an array
    //   }



}

import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');

export class RaiseSizingTableService {
  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async raisingSizeTabelExtracting(body: any) {

    const stackDepthBucket = {
      'Shallow Stack': [10, 15, 20],
      'Middle Stack': [25, 30, 40, 50],
      'Deep Stack': [60, 80, 100]
    }

    const bbRange = {
      '2bb': {
        min: 2.0,
        max: 2.49,
      },
      '25bb': {
        min: 2.5,
        max: 2.99,
      },
      '3bb': {
        min: 3.0,
        max: 3.49,
      },
      '35bb': {
        min: 3.5,
        max: 3.99,
      },
      '4bb': {
        min: 4.0,
        max: 4.49,
      },
      '45bb': {
        min: 4.5,
        max: 5.0,
      },
      '501bb': {
        min: 5.01,
        max: 99999,
      },
    }

    // const raiseSizingCondition = {
    //   $expr: {
    //     $gte: [
    //       { $divide: ["$reportDetail.action.actionAmount", "$bigBlind"] },
    //       2.0
    //     ]
    //   }
    //   // "reportDetail.action": {
    //   //   $elemMatch: {
    //   //     $expr: {
    //   //       $gte: [
    //   //         { $divide: ["$reportDetail.action.actionAmount", "$bigBlind"] },
    //   //         2.0
    //   //       ]
    //   //     }
    //   //   }
    //   // }
    // };

    // const raiseSizingCondition = {
    //   input: "$reportDetail.action",
    //   as: "action",
    //   in: {
    //     $gte: [
    //       { $divide: ["$$action.actionAmount", "$bigBlind"] },
    //       2.0
    //     ]
    //   }
    // };

    // let matchObj = {
    //   userId: new mongoose.Types.ObjectId(body.userId),
    //   "reportDetail.action": {
    //     $elemMatch: {
    //       category: { $in: [body.actionType] },
    //     }
    //   },
    //   "reportDetail.stackDepth": { $in: stackDepthBucket[body.stackDepth] },
    //   "reportDetail.heroPosition": body.position,
    //   pokerRoomId: body.pokerType,
    //   maxTableSeats: body.tableSize,
    //   date: { $gte: new Date(body.range.split(" to ")[0]), $lte: new Date(body.range.split(" to ")[1]) }
    // };

    // let statistics = await this.handHistoryModel.aggregate([
    //   // { $match: matchObj },
    //   { $match: raiseSizingCondition },

    // ]);

    // let result = statistics.filter((item: any) => {
    //   if (
    //     item.reportDetail.action.some((each: any) => {
    //       return (each.actionAmount / item.bigBlind) >= bbRange[body.field].min || (each.actionAmount / item.bigBlind) <= bbRange[body.field].max
    //     })
    //   ) {
    //     return item
    //   }
    // })


    // const raiseSizingCondition = {
    //   $where: `
    //   this.reportDetail.action.some(action => action.actionAmount / this.bigBlind >= 5.1) &&
    //   this.userId.equals(new mongoose.Types.ObjectId("${body.userId}")) &&
    //   this.reportDetail.action.some(action => action.category.includes("${body.actionType}")) &&
    //   stackDepthBucket["${body.stackDepth}"].includes(this.reportDetail.stackDepth) &&
    //   this.reportDetail.heroPosition === "${body.position}" &&
    //   this.pokerRoomId === "${body.pokerType}" &&
    //   this.maxTableSeats === ${body.tableSize} &&
    //   this.date >= new Date("${body.range.split(" to ")[0]}") &&
    //   this.date <= new Date("${body.range.split(" to ")[1]}")
    //   `
    // };

    // let statistics = await this.handHistoryModel.find(raiseSizingCondition);

    // console.log('statistics', statistics);

    // return statistics;

    const raiseSizingCondition = {
      $where: `
        this.reportDetail.action.some(action => action.category.includes("${body.actionType}")) &&
        this.reportDetail.action.some(action => action.actionAmount / this.bigBlind >= 5.1) &&
        this.pokerRoomId === "${body.pokerType}" &&
        this.reportDetail.heroPosition === ${body.position} &&
        this.maxTableSeats === ${body.tableSize} &&
        this.date >= new Date("${body.range.split(" to ")[0]}") &&
        this.date <= new Date("${body.range.split(" to ")[1]}")
        `
    };

    // this.userId.equals(new mongoose.Types.ObjectId("${body.userId}")) &&
    // ${stackDepthBucket[body.stackDepth].some((s tack: any) => stack === 50)} &&
    // ${stackDepthBucket[body.stackDepth].some((stack: any) => this.reportDetail.stackDepth === stack)} &&
    // this.userId.toString() === "${body.userId}" &&

    let statistics = await this.handHistoryModel.find(raiseSizingCondition);

    console.log("statistics", statistics.length);

    return statistics;

  }
}
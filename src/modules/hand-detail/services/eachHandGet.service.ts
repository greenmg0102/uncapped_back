import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import mongoose from 'mongoose';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';

@Injectable()
export class EachHandGetService {

  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async deleteHand(pageData: any): Promise<any> {

    await this.handHistoryModel.findByIdAndRemove(pageData.id)

    const { pageNumber, pageSize, pokerType, tableSize, heroPosition, range, userId } = pageData;

    let seatNumber = this.getPlayerSeatNumber(heroPosition)

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const query = {
      userId: new mongoose.Types.ObjectId(userId),
      pokerRoomId: pokerType === "N/A" ? { $regex: new RegExp("", "i") } : pokerType,
      maxTableSeats: tableSize === "N/A" ? { $exists: true } : parseInt(tableSize),
      "reportContent.heroPosition": seatNumber === null ? { $exists: true } : seatNumber,
      date: { $gte: new Date(range.split(" to ")[0]), $lte: new Date(range.split(" to ")[1]) }
    };
    const totalCount = await this.handHistoryModel.countDocuments(query);
    const hands = await this.handHistoryModel.aggregate([
      { $match: query },
      { $skip: skip },
      { $limit: limit }
    ]).exec();

    return {
      totalCount: totalCount,
      hands: hands
    };
  }


  async getHands(pageData: any): Promise<any> {

    
    const { pageNumber, pageSize, pokerType, tableSize, heroPosition, range, userId } = pageData;

    let seatNumber = this.getPlayerSeatNumber(heroPosition)

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const query = {
      userId: new mongoose.Types.ObjectId(userId),
      pokerRoomId: pokerType === "N/A" ? { $regex: new RegExp("", "i") } : pokerType,
      maxTableSeats: tableSize === "N/A" ? { $exists: true } : parseInt(tableSize),
      "reportContent.heroPosition": seatNumber === null ? { $exists: true } : seatNumber,
      // players: {
      //   $elemMatch: {
      //     seatNumber: heroPosition === "N/A" ? { $exists: true } : seatNumber,
      //     playerName: heroPosition === "N/A" ? { $exists: true } : "Hero"
      //   }
      // },
      date: { $gte: new Date(range.split(" to ")[0]), $lte: new Date(range.split(" to ")[1]) }
    };

    const totalCount = await this.handHistoryModel.countDocuments(query);
    const hands = await this.handHistoryModel.aggregate([
      { $match: query },
      { $skip: skip },
      { $limit: limit }
    ]).exec();

    return {
      totalCount: totalCount,
      hands: hands
    };
  }

  async getHand(handId: string): Promise<any> {
    const hands = await this.handHistoryModel.findOne({ handId: handId }).exec()
    return hands;
  }

  getPlayerSeatNumber(heroPosition: string): number | null {
    const hero8Site = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"];

    const index = hero8Site.findIndex((position) => position === heroPosition);
    if (index !== -1) {
      const seatNumber = index;
      return seatNumber;
    }
    return null;
  }
}

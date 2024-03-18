import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import mongoose from 'mongoose';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';

@Injectable()
export class BundleDeleteService {

  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async bundleDelete(pageData: any): Promise<any> {

    const { pageNumber, pageSize, pokerType, tableSize, heroPosition, range, userId, newRange } = pageData;

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

    await this.handHistoryModel.deleteMany(query);

    const newquery = {
      userId: new mongoose.Types.ObjectId(userId),
      pokerRoomId: { $regex: new RegExp("", "i") },
      maxTableSeats: { $exists: true },
      "reportContent.heroPosition": { $exists: true },
      date: { $gte: new Date(newRange.split(" to ")[0]), $lte: new Date(newRange.split(" to ")[1]) }
    };

    const totalCount = await this.handHistoryModel.countDocuments(newquery);
    const hands = await this.handHistoryModel.aggregate([
      { $match: newquery },
      { $skip: skip },
      { $limit: limit }
    ]).exec();

    return {
      totalCount: totalCount,
      hands: hands
    };

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

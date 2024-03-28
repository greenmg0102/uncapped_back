import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PokerHistoryDto } from 'src/modules/database-storage/dtos/history.dto';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import reportingParse from 'src/shared/reportingParseWhenUpload'
import reportingDetailParse from 'src/shared/reportingDetailParse'

export class HandHistoryRepository {
  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
  ) { }

  async getHistoryByGameId(handId: string) {
    let history: any;
    try {
      history = await this.handHistoryModel.findOne({ handId });
    }
    catch (error) {
      throw new InternalServerErrorException('');
    }
    if (!history) {
      return null;
    }
    return history;
  }

  async createHandHistory(handHistories: PokerHistoryDto[], userId: string) {

    for (const [index, query] of handHistories.entries()) {

      let reportContent = await reportingParse(query.pokerRoomId, query.players, query.actions, query.bigBlind, query.buttonSeat)
      let reportDetail = await reportingDetailParse(query.pokerRoomId, query.players, query.actions, query.bigBlind, query.buttonSeat)
      
      let bufferQuery = { ...query, reportContent: reportContent, reportDetail: reportDetail, userId: new ObjectId(userId) }

      let client = await this.getHistoryByGameId(bufferQuery.handId);

      if (!client && bufferQuery.handId != null) {
        let newClient = new this.handHistoryModel(bufferQuery);
        await newClient
          .save()
          .then((res: any) => {
            return
          })
          .catch((err: any) => {
            console.log("Hand saving fail ~~ !");
            return
          });

      } else {
        await this.handHistoryModel
          .findOneAndUpdate({ handId: bufferQuery.handId }, bufferQuery, { new: true })
          .exec()
          .then((res) => {
            return
          })
          .catch((err) => {
            console.log("Hand updating fail ~~ !");
            return
          });
      }
    }
    return 'Database Success';
  }
}

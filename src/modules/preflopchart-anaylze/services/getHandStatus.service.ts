import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { CardFrequency } from 'src/modules/database-storage/schemas/user-hand-frequency';
import { GetHandStatusInterface } from '../interfaces/getNode.interface'
import { ParsingAction } from 'src/shared/parsingAction'
import { distinguishCardKind } from 'src/shared/distinguishCardKind'
@Injectable()
export class GetHandStatusService {

  constructor(
    @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
    @InjectModel(CardFrequency.name) private readonly cardFrequencyModel: Model<CardFrequency>,
  ) { }

  async getHandStatus(handId: GetHandStatusInterface): Promise<any> {

    let result = await this.getHandInfo(handId)

    let body = {
      heroPosiotionList: [result.heroPosition],
      stackDepthList: this.decidingStack(result.heroChipInBigBlind),
      action: 'RFI'
    }

    let frequency = await this.getHandFrequency()

    return {
      userData: ParsingAction(body),
      frequency: frequency
    }
  }

  decidingStack(stack: number): any {
    if (stack <= 20) return [10, 15, 20]
    if (stack > 20 && stack < 60) return [25, 30, 398750, 50]
    if (stack >= 60) return [60, 80, 100]
  }

  async getHandInfo(handId: GetHandStatusInterface) {

    const hands = await this.handHistoryModel.findOne({ handId: handId }).exec()

    let orderHero = 0
    let totalRaise = 0

    hands.actions
      .filter((item: any) => item.street === "preFlop")
      .filter((element: any) => {
        if (element.action !== "fold") return element
      })
      .forEach((each: any, index: any) => {
        totalRaise = index + 1
        if (each.playerName === "Hero") orderHero = index + 1
      })

    let heroInfo = hands.players.filter((item: any) => item.playerName === "Hero")[0]
    return {
      heroPosition: heroInfo.seatNumber,
      heroChipInBigBlind: Number((heroInfo.chipCount / hands.bigBlind).toFixed(2)),
      heroAction: orderHero,
      totalActionCount: totalRaise
    }
  }

  async getHandFrequency() {

    let cardFrequency = await this.cardFrequencyModel.findOne({ userId: 'ShuHei Ito' }).exec()
    // let object = {}

    // let real = await this.handHistoryModel.find().select('holeCards').exec()

    // for (let i = 0; i < real.length; i++) {
    //   let buffer = distinguishCardKind(real[i].holeCards[0].cards)
    //   if (buffer in object) object[buffer] = object[buffer] + 1
    //   else object[buffer] = 1
    // }

    return cardFrequency
  }
}
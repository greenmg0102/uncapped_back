import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import actionValidation from 'src/shared/reportingDetailParse/gg/actionValidation'
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';

@Injectable()
export class DatabaseUpdateService {

    constructor(
        @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
    ) { }

    async updateDdbyNewLogic() {

        try {

            let batchSize = 100
            let realBuffer = 1

            let totalCount = await this.handHistoryModel.countDocuments({ regionalHandDate: "new value" }).exec();
            console.log("totalCount", totalCount);

            do {
                let query = this.handHistoryModel.find();
                query = query.find({ regionalHandDate: "new value" });
                const batch: any = await query.sort({ _id: 1 }).limit(batchSize).exec();

                console.log("batch", batch.length);

                for (const doc of batch) {

                    console.log("doc", doc);

                    let bufferreportDetail = await actionValidation(doc.players, doc.actions, doc.heroPostion, doc.stackRange, doc.tableStandard, doc.bufferBTNPosition, doc.bigBlind, doc.holeCards, doc.ante, doc.buttonSeat, doc.heroChipBeforeHole, doc.summary, doc.communityCards, true)
                    doc.regionalHandDate = '1';  // 1: before giving feedback from louie, first testers, etc, ...

                    doc.reportDetail = bufferreportDetail
                    await doc.save();
                }
                realBuffer = batch.length

                console.log("One step done");

            } while (realBuffer > 0);

            console.log('The updating ended!');

            return {
                isOkay: true,
            };

        } catch (error) {
            console.error('Error processing data:', error);
            return {
                isOkay: false
            };
        }

    }
}

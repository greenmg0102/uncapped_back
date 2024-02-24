import { Injectable } from '@nestjs/common';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReportMacdOffSuitedService {
    constructor(
        @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,
    ) { }

    async offSuited(body: any) {

        return ""
    }

}

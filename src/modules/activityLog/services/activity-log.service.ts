import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Schema as MongooseSchema } from 'mongoose';
import { Activitylog } from 'src/modules/activityLog/schema/ActivityLog';
import { requestDecode } from 'src/modules/activityLog/services/requestDecode.service';

@Injectable()
export class ActivityLogService {

    constructor(
        @InjectModel(Activitylog.name) private readonly activitylogModel: Model<Activitylog>,
    ) { }

    logCreate(req: Request, activity: string) {
        let decodedResult = requestDecode(req, activity)
        let newActivitylogModel = new this.activitylogModel(decodedResult)
        newActivitylogModel.save()
    }
}
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Schema as MongooseSchema } from 'mongoose';
import { Activitylog } from 'src/modules/activityLog/schema/ActivityLog';
import { User } from 'src/modules/users/schemas/user.schema';
import { HandHistory } from 'src/modules/database-storage/schemas/hand-history.schema';
import { activityMessage } from 'src/shared/activityRelative/activityMessage'
import { activityCountry } from 'src/shared/activityRelative/activityCountry'
import { ActivityLogService } from 'src/modules/activityLog/services/activity-log.service'

@Injectable()
export class ActivityReadService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Activitylog.name) private readonly activitylogModel: Model<Activitylog>,
        @InjectModel(HandHistory.name) private readonly handHistoryModel: Model<HandHistory>,

        private readonly activityLogService: ActivityLogService,
    ) { }

    async logRead(pagination: any) {

        const { page, pageSize } = pagination;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const result = await this.activitylogModel.aggregate([
            { $skip: skip },
            { $limit: limit }
        ]).exec();
        const bList = result.map((item, index) => ({
            id: index + 1,
            Date: new Date(item.createdAt).toLocaleString(),
            Country: activityCountry["185"], // You may need to fetch the country based on the IP
            Ip: "111.127.34.84",
            // Ip: item.accessIp,
            Activity: activityMessage[item.activity],
        }));
        return bList;
    }

    async getStatisticInfo() {
        
        let totalUser = await this.userModel.countDocuments()
        let totalHand = await this.handHistoryModel.countDocuments()
        let totalVisit = await this.activitylogModel.countDocuments({ activity: "3-1" })
        
        return {
            totalUser: totalUser,
            totalHand: totalHand,
            totalVisit: totalVisit
        };
    }


}
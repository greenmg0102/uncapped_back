
import { generatingAddress } from 'src/shared/payment/generatingAddress'
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Notification } from 'src/modules/notification/schemas/notification.schema';
const mongoose = require('mongoose');

export class NotificationRegistService {
    constructor(
        @InjectModel(Notification.name) private readonly notificationModal: Model<Notification>,
    ) { }

    async create(body: any) {
        let newNotification = new this.notificationModal(body)
        await newNotification.save().then((result: any) => { return })
        let result = this.notificationModal.find().then((resList: any) => { return resList })
        return result
    }

    async delete(id: any) {
        await this.notificationModal.findByIdAndRemove(new mongoose.Types.ObjectId(id)).then((result: any) => { return })
        let result = this.notificationModal.find().then((resList: any) => { return resList })
        return result
    }

    async read(body: any) {
        let result = this.notificationModal.find().then((resList: any) => { return resList })
        return result
    }

}

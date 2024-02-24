import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { PremiumOption } from 'src/modules/admin/premium-admin/schemas/premium-option';

@Injectable()
export class PremiumCreateService {

    constructor(
        @InjectModel(PremiumOption.name) private readonly premiumOptionodel: Model<PremiumOption>,
    ) { }

    async read(): Promise<any> {

        let result = await this.premiumOptionodel
            .find()
            .then((res: any) => {
                return res
            })
            .catch((err: any) => {
                return []
            });

        return result
    }

    async regist(body: any): Promise<any> {

        let newPremium = new this.premiumOptionodel(body);

        let result = await newPremium
            .save()
            .then(async (res: any) => {
                let result = await this.premiumOptionodel
                    .find()
                    .then((res: any) => {
                        return res
                    })
                    .catch((err: any) => {
                        return []
                    });

                return result
            })
            .catch((err: any) => {
                console.log("newPremium saving fail ~~ !");
                return
            });
        return result

    }
}

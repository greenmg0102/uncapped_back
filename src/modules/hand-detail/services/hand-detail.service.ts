import { Injectable } from '@nestjs/common';
import { EachHandGetService } from './eachHandGet.service'
import { BundleDeleteService } from './bundleDelete.service'

@Injectable()
export class HandDetailService {

    constructor(
        private readonly eachHandGetService: EachHandGetService,
        private readonly bundleDeleteService: BundleDeleteService,
    ) { }

    async bundleDelete(pageData: any): Promise<any> {
        return this.bundleDeleteService.bundleDelete(pageData);
    }

    async deleteHand(pageData: any): Promise<any> {
        return this.eachHandGetService.deleteHand(pageData);
    }

    async getHands(pageData: any): Promise<any> {
        return this.eachHandGetService.getHands(pageData);
    }

    async getHand(handId: string): Promise<any> {
        return this.eachHandGetService.getHand(handId);
    }
}
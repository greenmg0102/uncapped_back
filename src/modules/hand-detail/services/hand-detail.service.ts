import { Injectable } from '@nestjs/common';
import { EachHandGetService } from './eachHandGet.service'

@Injectable()
export class HandDetailService {

    constructor(
        private readonly eachHandGetService: EachHandGetService, 
    ) { }

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
import { Injectable } from '@nestjs/common';
import { GetNodeService } from './getNode.service'
import { GetHandStatusService } from './getHandStatus.service'
import { GetPreflopInterface, GetHandStatusInterface } from '../interfaces/getNode.interface'

@Injectable()
export class PreflopchartAnaylzeService {

    constructor(
        private readonly getNodeService: GetNodeService,
        private readonly getHandStatusService: GetHandStatusService,
    ) { }

    async getNode(body: GetPreflopInterface, res: any): Promise<any> {
        return this.getNodeService.getNode(body, res);
    }

    async getHandStatus(handId: GetHandStatusInterface): Promise<any> {
        return this.getHandStatusService.getHandStatus(handId);
    }
}
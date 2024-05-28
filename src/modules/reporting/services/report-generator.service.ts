import { Injectable } from '@nestjs/common';
import { ReportCollectionService } from './report-collection.service';
import { ReportUserGeneratingService } from './report-user-generating';
import { ReportDetailTableService } from './report-detail-table';
import { ReportEachPairService } from './report-each-pair';
import { ConditionPairService } from './condition-pair';
import userDataFrequencySort, { squeezeUserDataFrequencySort } from 'src/shared/reportingParseWhenUpload/gg/userDataFrequencySort'

@Injectable()
export class ReportGeneratorService {
    constructor(
        private reportCollectionService: ReportCollectionService,
        private reportEachPairService: ReportEachPairService,
        private conditionPairService: ConditionPairService,
        private reportUserGeneratingService: ReportUserGeneratingService,
        private reportDetailTableService: ReportDetailTableService,
    ) { }

    async collections(body: any, res: any) {
        // return await this.reportCollectionService.collections(body, res);
    }

    async reportEachPair(body: any) {
        return await this.reportEachPairService.reportEachPair(body);
    }

    async conditionPair(body: any) {
        return await this.conditionPairService.conditionPair(body);
    }

    async reportIntegration(body: any) {

        let currentAction = body.action
        let userDataSection = []

        if (!body.isSqueeze) userDataSection = await this.reportUserGeneratingService.userDataGenerating(body);
        else userDataSection = await this.reportUserGeneratingService.squeezeUserDataGenerating(body);

        let userData = !body.isSqueeze ? userDataFrequencySort(userDataSection, currentAction) : squeezeUserDataFrequencySort(body, userDataSection)

        return {
            userData: userData
        }
    }

    async getNodeHand(body: any) {
        return await this.reportUserGeneratingService.getNodeHand(body);
    }

    async userHandInfo(body: any) {
        return await this.reportUserGeneratingService.userHandInfo(body);
    }

    async detailedTable(body: any) {
        return await this.reportDetailTableService.detailedTable(body);
    }

    async mainDataHandInfo(body: any) {

        let buffer = body
        buffer.heroPosition = [body.heroPosition]
        buffer.stackDepth = [body.stackDepth]

        buffer.villianPosition = body.VillianPosition

        return await this.reportCollectionService.collections(buffer)
    }

}

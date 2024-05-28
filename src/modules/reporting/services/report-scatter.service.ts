import { Injectable } from '@nestjs/common';
import userDataFrequencySort from 'src/shared/reportingParseWhenUpload/gg/userDataFrequencySort'
import { ReportUserGeneratingService } from './report-user-generating';
import { ReportGlobalStatisticService } from './report-global-statistic.service';

import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString, extractType } from "src/shared/parsingAction/fileRead"
import { actionRecursive } from 'src/shared/report/recursiveData'

@Injectable()
export class ReportScatterService {
    constructor(
        private reportUserGeneratingService: ReportUserGeneratingService,
        private reportGlobalStatisticService: ReportGlobalStatisticService
    ) { }


    async globalStatistic(body: any) {

        let globalStatisticResult = await this.reportGlobalStatisticService.globalStatistic(body)
        return  globalStatisticResult 
    }

    async scatterStatstic(body: any) {

        let mainData = await mainDataGet(body)
        let userData = await this.userDataGet(body)

        return {
            mainData: mainData,
            userData: userData,
        }
    }

    async userDataGet(body: any) {
        let real: any = [];

        let stackDepth = [
            // 10,
            15,
            20, 25, 30, 398750, 50, 60, 80, 100
        ];
        let heroPosition = [
            "UTG",
            "UTG+1",
            "LJ",
            "HJ",
            "CO", "BTN", "SB", "BB"
        ];

        for (let stack of stackDepth) {
            for (let position of heroPosition) {
                let bufferBody: any = {
                    action: body.action,
                    heroPosition: [position],
                    stackDepth: [stack],
                    VillianPosition: [],
                    range: body.range,
                    tableSize: body.tableSize,
                    pokerType: body.pokerType
                };

                let userDataSection = await this.reportUserGeneratingService.userDataGenerating(bufferBody);
                let userData = userDataFrequencySort(userDataSection, "RFI");

                real.push({
                    action: body.action,
                    stack: stack,
                    position: position,
                    handResult: userData
                });
            }
        }

        return real;
    }

}


export async function mainDataGet(body: any) {
    let actonTraking = actionRecursive[body.action]

    let real: any = []

    let max8 = [
        "UTG",
        "UTG+1",
        "LJ",
        "HJ",
        "CO", "BTN", "SB", "BB"
    ];
    let bbData = [
        // 10,
        15,
        20, 25, 30, 398750, 50, 60, 80, 100
    ];
    let tableSize = body.tableSize

    let heroPositionList = body.heroPositionList.length === 0 ? max8.slice(max8.length - Object.keys(actonTraking).length, max8.length) : body.heroPositionList

    let heroPositionNumberList = exchangeIntoNumberFromPositionString(body.heroPositionList.length === 0 ? max8.slice(1, max8.length) : body.heroPositionList)
    let stackDepthList = body.stackDepthList.length === 0 ? bbData : body.stackDepthList

    stackDepthList.forEach((stack: any) => heroPositionList.forEach((position: any, order: any) => {

        let result: any = []

        Object.keys(actonTraking[position]).forEach((actionRF: any) => {
            let buffer = GeneralReportLogicRecursive(stack, tableSize, heroPositionNumberList[order], 0, actonTraking[position][actionRF], 0)
            if (buffer !== undefined) result.push(buffer)
        });

        if (result.length !== 0) {
            real.push({
                action: body.action,
                stack: stack,
                position: position,
                handResult: sumAverage(result)
            })
        }
    }));

    return real
}

export function GeneralReportLogicRecursive(stackDepth: number, maxPlayer: number, heroPosition: number, currentPosition: number, actionRFList: any, index: any) {

    if (currentPosition !== undefined) {
        if (actionRFList.length === 1) {
            return generateFileData(stackDepth, maxPlayer, currentPosition)
        } else {
            let real = generateFileData(stackDepth, maxPlayer, currentPosition)
            let secondPosition = -1

            secondPosition = extractType(real.actions, actionRFList[index] === "R" ? "R" : "F")

            if (real.player !== heroPosition) return GeneralReportLogicRecursive(stackDepth, maxPlayer, heroPosition, secondPosition, actionRFList, index + 1)
            else return real
        }
    }
}
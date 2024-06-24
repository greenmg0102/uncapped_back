import { calculatingPosition } from '../index'
import { findNearestStandard } from './index'

const standards = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100];

export default function actionValidation(playerList: any, actionsList: any, heroPostion: any, stackRange: any, tableStandard: any, bufferBTNPosition: any, bigBlind: any): any {

    let reportDetail = {
        heroPosition: null,
        stackDepth: null,
        action: [],
    }
    let bufferReportDetailAction = []

    reportDetail.heroPosition = heroPostion
    reportDetail.stackDepth = stackRange

    let real = actionsList.filter((item: any) => item.street === "preFlop")

    let actionHeroIndexList = real.reduce((indices: number[], item: any, index: number) => {
        if (item.playerName === "Hero") { indices.push(index); }
        return indices;
    }, []);

    let activeIndexList = real.reduce((indices: number[], item: any, index: number) => {
        if (item.action === "raise" || item.action.includes("all in")) { indices.push(index); }
        return indices;
    }, []);

    let actionHeroRaiseIndexList = real.reduce((indices: number[], item: any, index: number) => {
        if (item.playerName === "Hero" && (item.action === "raise" || item.action.includes("all in"))) { indices.push(index); }
        return indices;
    }, []);

    console.log("actionHeroRaiseIndexList", actionHeroRaiseIndexList);

    actionHeroIndexList.forEach((indexItem: any) => {

        let actionBettingAction = {
            fold: 0,
            raise: 0,
            check: 0,
            call: 0,
            allin: 0
        }

        let actionItem: any = {}
        actionItem.category = actionTypeValidation(real.slice(0, indexItem + 1), indexItem)
        actionItem.actionAmount = real[indexItem].actionAmount
        actionItem.currentAction = real[indexItem].action

        let previousActionIndex = activeIndexList.findIndex((item: any) => item === indexItem)

        if (actionHeroRaiseIndexList.length === 0) actionItem.previousBettingAmount = null
        else actionItem.previousBettingAmount = previousActionIndex === -1 || real[activeIndexList[previousActionIndex - 1]] === undefined ? bigBlind : real[activeIndexList[previousActionIndex - 1]].actionAmount

        let realVillain = villianValidation(playerList, real.slice(0, indexItem + 1), bigBlind).map((item: any) => calculatingPosition(item, tableStandard, bufferBTNPosition))

        actionItem.villain = realVillain

        real.slice(0, indexItem + 1)
            .filter((item: any) => (item.playerName === "Hero" && item.street === "preFlop"))
            .forEach((element: any) => {
                if (element.action === "all in, raise") actionBettingAction = { ...actionBettingAction, allin: actionBettingAction.allin + 1 }
                else if (element.action === "all in, call") actionBettingAction = { ...actionBettingAction, call: actionBettingAction.call + 1 }
                else actionBettingAction = { ...actionBettingAction, [element.action]: actionBettingAction[element.action] + 1 }
            });

        actionItem.bettingAction = actionBettingAction
        bufferReportDetailAction.push(actionItem)
    })

    reportDetail.action = bufferReportDetailAction

    return reportDetail
}

export function villianValidation(playerList: any, actionsList: any, bigBlind: any): any {

    // console.log("actionsList", actionsList);

    let villianNameList = actionsList
        .filter((item: any) =>
            item.playerName !== "Hero" &&
            item.street === "preFlop" &&
            (
                item.action === "raise" || item.action === "all in, raise" ||
                item.action === "call" || item.action === "check" ||
                item.action === "bet" || item.action === "check"
            )
        );
    // console.log("villianNameList", villianNameList);

    let villainPlayerNames = villianNameList.map((villain: any) => villain.playerName);

    // console.log("villainPlayerNames", villainPlayerNames);

    let indexes = playerList.reduce((acc: any, obj: any, index: any) => {
        if (villainPlayerNames.includes(obj.playerName)) {

            let itemVillain: any = {}

            itemVillain.position = index
            itemVillain.villainAction = actionsList.filter((item: any) => item.playerName === obj.playerName)[0] === undefined ? null : actionsList.filter((item: any) => item.playerName === obj.playerName)[0].action
            itemVillain.villainStackDepth = findNearestStandard((playerList.find((item: any) => item.playerName === obj.playerName).chipCount / bigBlind).toFixed(2), standards)

            if (villianNameList.length === 0) {
                itemVillain.previousActionAmount = null
                itemVillain.currentVillainActionAmount = null
            }
            if (villianNameList.length === 1) {
                itemVillain.previousActionAmount = bigBlind
                itemVillain.currentVillainActionAmount = villianNameList[villianNameList.length - 1].actionAmount
            }
            else {
                itemVillain.previousActionAmount = villianNameList[villianNameList.length - 2].actionAmount
                itemVillain.currentVillainActionAmount = villianNameList[villianNameList.length - 1].actionAmount
            }

            let actionVillainIndexList = villianNameList.reduce((indices: number[], item: any, index: number) => {
                if (item.playerName === obj.playerName) { indices.push(index); }
                return indices;
            }, []);

            itemVillain.villainCategory = actionTypeValidation(villianNameList.slice(0, actionVillainIndexList[actionVillainIndexList.length - 1] + 1), actionVillainIndexList[actionVillainIndexList.length - 1])

            acc.push(itemVillain);
        }
        return acc;
    }, []);

    return indexes
}


export function actionTypeValidation(preflopActioList: any, heroIndex: any): any {

    console.log("preflopActioList", preflopActioList);
    console.log("heroIndex", heroIndex);

    let actionList = []
    let actionBet = ["RFI", "vs RFI", "3-Bet", "vs 3-Bet", "4-Bet", "VS 4-Bet", "5-Bet +"]
    let totalCount = []

    preflopActioList.slice(0, heroIndex + 1).forEach((item: any, i: any) => {
        if (item.action === "raise" || item.action === 'all in, raise') totalCount.push(i);
    });

    let matchedPosition = totalCount.indexOf(heroIndex)

    if (matchedPosition === 0) actionList = ["RFI"]
    else if (matchedPosition === 1) {

        let callerIndexList = preflopActioList.reduce((acc: any, curr: any, index: any) => {
            if (curr.action === "call") acc.push(index);
            return acc;
        }, []);

        if (callerIndexList.length === 1 && totalCount.length === 2 && callerIndexList[0] > totalCount[0] && callerIndexList[0] < totalCount[1]) actionList.push("squeeze")
        else actionList.push("3-Bet")

    }
    else if (matchedPosition === 2) actionList.push("4-Bet")
    else if (matchedPosition >= 3) actionList.push("5-Bet +")

    else if (matchedPosition === -1 && totalCount.length === 0) actionList.push("VPIP")
    else if (matchedPosition === -1 && totalCount[totalCount.length - 1] < heroIndex) {
        let realIndex = (2 * (totalCount.length - 1)) + 1
        actionList.push(actionBet[realIndex])
    }

    return actionList
}

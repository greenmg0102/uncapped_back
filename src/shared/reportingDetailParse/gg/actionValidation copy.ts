import { calculatingPosition } from '../index'

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

        actionItem.previousBettingAmount = 3000

        if (actionHeroRaiseIndexList.length === 0) actionItem.previousBettingAmount = null
        else {
            actionItem.previousBettingAmount = previousActionIndex === -1 || real[activeIndexList[previousActionIndex - 1]] === undefined ? bigBlind : real[activeIndexList[previousActionIndex - 1]].actionAmount
        }

        actionItem.villain = villianValidation(playerList, real.slice(0, indexItem + 1)).map((item: any) => calculatingPosition(item, tableStandard, bufferBTNPosition))

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

export function actionTypeValidation(preflopActioList: any, heroIndex: any): any {

    let actionList = []
    // let sameBet = ["VPIP", "RFI", "vs RFI", "PFR", "3-Bet", "vs 3-Bet", "Bb/100", "4-Bet", "VS 4-Bet", "bb/100", "5-Bet +", "vs 5-Bet +"]
    let actionBet = ["RFI", "vs RFI", "3-Bet", "vs 3-Bet", "4-Bet", "VS 4-Bet", "5-Bet +"]
    let totalCount = []

    preflopActioList.slice(0, heroIndex + 1).forEach((item: any, i: any) => {
        if (item.action === "raise" || item.action === 'all in, raise') totalCount.push(i);
    });

    let matchedPosition = totalCount.indexOf(heroIndex)

    if (matchedPosition === 0) actionList = ["RFI"]
    else if (matchedPosition === 1) {

        let callerIndexList = preflopActioList.reduce((acc: any, curr: any, index: any) => {
            if (curr.action === "call") {
                acc.push(index);
            }
            return acc;
        }, []);

        if (
            callerIndexList.length === 1 &&
            totalCount.length === 2 &&
            callerIndexList[0] > totalCount[0] &&
            callerIndexList[0] < totalCount[1]
        ) {
            actionList.push("squeeze")
        } else {
            actionList.push("3-Bet")
        }

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

export function villianValidation(playerList: any, actionsList: any): any {

    let villianNameList = actionsList
        .filter((item: any) =>
            item.playerName !== "Hero" &&
            item.street === "preFlop" &&
            (
                item.action === "raise" ||
                item.action === "all in, raise" ||
                item.action === "call" ||
                item.action === "check" ||
                item.action === "bet" ||
                item.action === "check"
            )
        );
    let villainPlayerNames = villianNameList.map((villain: any) => villain.playerName);
    const indexes = playerList.reduce((acc: any, obj: any, index: any) => {
        if (villainPlayerNames.includes(obj.playerName)) acc.push(index);
        return acc;
    }, []);

    return indexes
}
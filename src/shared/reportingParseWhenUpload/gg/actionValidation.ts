import { calculatingPosition } from '../index'

export default function actionValidation(playerList: any, actionsList: any, heroPostion: any, stackRange: any, tableStandard: any, bufferBTNPosition: any): any {

    let bettingAction = {
        fold: 0,
        raise: 0,
        check: 0,
        call: 0,
        allin: 0
    }

    let actionHeroIndex = actionsList.findIndex((item: any) => item.playerName === "Hero")

    let real = actionsList.filter((item: any) => item.street === "preFlop")
    // let real = actionsList.slice(0, actionHeroIndex + 1).filter((item: any) => item.street === "preFlop")

    let villianNameList = villianValidation(playerList, real).map((item: any) => calculatingPosition(item, tableStandard, bufferBTNPosition))

    let actionType = actionTypeValidation(real, actionHeroIndex)

    real
        .filter((item: any) => (item.playerName === "Hero" && item.street === "preFlop"))
        .forEach((element: any) => {
            if (element.action === "all in, raise") bettingAction = { ...bettingAction, allin: bettingAction.allin + 1 }   // bet
            else if (element.action === "all in, call") bettingAction = { ...bettingAction, call: bettingAction.call + 1 }
            else bettingAction = { ...bettingAction, [element.action]: bettingAction[element.action] + 1 }
        });

    let test = {
        heroPosition: heroPostion,
        stackDepth: stackRange,
        villain: villianNameList,
        action: actionType,
        bettingAction: bettingAction
    }

    return test
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
    else if (matchedPosition === 1) actionList.push("3-Bet")
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
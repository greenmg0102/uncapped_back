import { reportingDetailParseGG } from 'src/shared/reportingDetailParse/gg'

export function identifyActionList(actionList: any): any {

    const result = [];
    actionList.slice(0, actionList.length - 1).forEach((item: any, index: any) => {
        if (item.playerName === 'Hero') {
            let bufferList = extractingActionList(actionList.slice(0, index + 1))
            result.push(bufferList)
        }
    });

    return result
}

export function extractingActionList(actionList: any): any {

    let result = []

    actionList.slice(0, actionList.length - 1).forEach((element: any) => {
        if (element.action === "fold") result.push("F")
        if (element.action === "call") result.push("C")
        if (element.action === "raise") result.push("R")
        if (element.action.includes("all in")) result.push("R")
    });
    return result
}

export default async function reportingDetailParse(pokerRoomId: any, players: any, actions: any, bigBlind: any, buttonSeat: any): Promise<any> {
    // if (pokerRoomId === "GGPoker") 
    return await reportingDetailParseGG(players, actions, bigBlind, buttonSeat)
}

export function calculatingHeroPosition(currentPosition: any, tableStandard: any, buttonSeat: any): any {
    let btnPosition = tableStandard.findIndex((item: any) => item === 5)

    return tableStandard[(currentPosition + btnPosition - buttonSeat + tableStandard.length) % tableStandard.length]

}

export function calculatingPosition(currentPosition: any, tableStandard: any, buttonSeat: any): any {
    let btnPosition = tableStandard.findIndex((item: any) => item === 5)

    let villainPosition = tableStandard[(currentPosition.position + btnPosition - buttonSeat + tableStandard.length) % tableStandard.length]

    return {
        position: villainPosition,
        villainStackDepth:currentPosition.villainStackDepth,
        villainAction:currentPosition.villainAction,
        previousActionAmount: currentPosition.previousActionAmount,
        currentVillainActionAmount: currentPosition.currentVillainActionAmount,
        villainCategory: currentPosition.villainCategory
    }
}

export const tableSeat = {
    10: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    9: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    8: [0, 1, 2, 3, 4, 5, 6, 7],
    7: [1, 2, 3, 4, 5, 6, 7],
    6: [2, 3, 4, 5, 6, 7],
    5: [3, 4, 5, 6, 7],
    4: [4, 5, 6, 7],
    3: [5, 6, 7],
    2: [6, 7]
}
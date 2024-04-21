import { reportingParseGG } from 'src/shared/reportingParseWhenUpload/gg'

export default async function reportingParse(pokerRoomId: any, players: any, actions: any, bigBlind: any, buttonSeat: any): Promise<any> {
    if (pokerRoomId === "GGPoker") return await reportingParseGG(players, actions, bigBlind, buttonSeat)
}

export function calculatingPosition(currentPosition: any, tableStandard: any, buttonSeat: any): any {

    let btnPosition = tableStandard.findIndex((item: any) => item === 5)

    return tableStandard[(currentPosition + btnPosition - buttonSeat + tableStandard.length) % tableStandard.length]
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
import { reportingDetailParseGG } from 'src/shared/reportingDetailParse/gg'

export default async function reportingDetailParse(pokerRoomId: any, players: any, actions: any, bigBlind: any, buttonSeat: any): Promise<any> {
    if (pokerRoomId === "GGPoker") return await reportingDetailParseGG(players, actions, bigBlind, buttonSeat)
}

export function calculatingPosition(currentPosition: any, tableStandard: any, buttonSeat: any): any {
    let btnPosition = tableStandard.findIndex((item: any) => item === 5)
    return tableStandard[(currentPosition + btnPosition - buttonSeat + tableStandard.length) % tableStandard.length]
}

export const tableSeat = {
    8: [0, 1, 2, 3, 4, 5, 6, 7],
    7: [1, 2, 3, 4, 5, 6, 7],
    6: [2, 3, 4, 5, 6, 7],
    5: [3, 4, 5, 6, 7],
    4: [4, 5, 6, 7],
    3: [5, 6, 7],
    2: [6, 7]
}
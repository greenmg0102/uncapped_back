import actionValidation from './actionValidation'
import { calculatingHeroPosition, tableSeat } from '../index'

export async function reportingDetailParseGG(players: any, actions: any, bigBlind: any, buttonSeat: any, holeCards: any, ante: any, heroChipBeforeHole: any, summary: any, communityCards: any): Promise<any> {

    const standards = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100];

    let tableStandard = tableSeat[players.length]

    let bufferHeroSeat = players.filter((obj: any) => obj.playerName === 'Hero')[0].seatNumber;
    let bufferHeroPosition = players.findIndex((obj: any) => obj.playerName === 'Hero');
    let bufferBTNPosition = players.findIndex((obj: any) => obj.seatNumber === buttonSeat);

     let heroPostion = calculatingHeroPosition(bufferHeroPosition, tableStandard, bufferBTNPosition);

    let stackAmount = Number((players.filter((item: any) => item.seatNumber === bufferHeroSeat)[0].chipCount / bigBlind).toFixed(2));

    let stackRange = await findNearestStandard(stackAmount, standards);
    let heroAction = await actionValidation(players, actions, heroPostion, stackRange, tableStandard, bufferBTNPosition, bigBlind, holeCards, ante, buttonSeat, heroChipBeforeHole, summary, communityCards, false);

    return heroAction
}

export function findNearestStandard(value: any, standards: any) {
    let nearest = standards[0];
    let minDiff = Math.abs(nearest - value);
    for (let i = 1; i < standards.length; i++) {
        let diff = Math.abs(standards[i] - value);
        if (diff < minDiff) {
            minDiff = diff;
            nearest = standards[i];
        }
    }
    return nearest;
}
import { findNearestStandard } from './index'
import { actionTypeValidation } from './actionTypeValidation'

const standards = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100];


export function villianValidation(playerList: any, actionsList: any, bigBlind: any): any {

    let villianNameList = actionsList
        .filter((item: any) =>
            item.playerName !== "Hero" &&
            item.street === "preFlop" &&
            (
                item.action === "raise" || item.action === "all in, raise" ||
                item.action === "call" || item.action === "check" ||
                item.action === "bet" || item.action === "check"
            )
        )

    let villainPlayerNames = villianNameList.map((villain: any) => villain.playerName);

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

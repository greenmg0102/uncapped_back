import { calculatingPosition } from '../index'
import { findNearestStandard } from './index'
import { extractingActionList } from 'src/shared/reportingDetailParse'
import { isolatingHand } from 'src/shared/distinguishCardKind'
import { TexasHoldem } from 'poker-variants-odds-calculator';
import { GeneralReportLogicRecursive } from 'src/shared/parsingAction/GeneralReportLogic'

const standards = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100];

export default function actionValidation(playerList: any, actionsList: any, heroPostion: any, stackRange: any, tableStandard: any, bufferBTNPosition: any, bigBlind: any, holeCards: any, ante: any, buttonSeat: any, heroChipBeforeHole: any, summary: any, communityCards: any): any {

    let reportDetail = {
        heroPosition: null,
        stackDepth: null,
        action: [],
        ev: 0
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

        let stageActionList = real.slice(0, indexItem + 1)

        actionItem.category = actionTypeValidation(stageActionList, indexItem)

        actionItem.actionAmount = real[indexItem].actionAmount
        actionItem.currentAction = real[indexItem].action

        let previousActionIndex = activeIndexList.findIndex((item: any) => item === indexItem)

        if (actionHeroRaiseIndexList.length === 0) actionItem.previousBettingAmount = null
        else actionItem.previousBettingAmount = previousActionIndex === -1 || real[activeIndexList[previousActionIndex - 1]] === undefined ? bigBlind : real[activeIndexList[previousActionIndex - 1]].actionAmount

        let realVillain = villianValidation(playerList, stageActionList, bigBlind).map((item: any) => calculatingPosition(item, tableStandard, bufferBTNPosition))

        actionItem.villain = realVillain

        stageActionList
            .filter((item: any) => (item.playerName === "Hero" && item.street === "preFlop"))
            .forEach((element: any) => {
                if (element.action === "all in, raise") actionBettingAction = { ...actionBettingAction, allin: actionBettingAction.allin + 1 }
                else if (element.action === "all in, call") actionBettingAction = { ...actionBettingAction, call: actionBettingAction.call + 1 }
                else actionBettingAction = { ...actionBettingAction, [element.action]: actionBettingAction[element.action] + 1 }
            });

        actionItem.bettingAction = actionBettingAction

        // let actionList = extractingActionList(stageActionList)
        // let buffer = GeneralReportLogicRecursive(stackRange === 40 ? 398750 : stackRange, 8, 0, 8 - 8, actionList, 0)
        // console.log("buffer", buffer.hands["22"].evs);

        let heroPlayers = stageActionList
            .filter((action: any) => action.playerName === "Hero")
            .map((action: any) => action.playerName);
        let heroHands = holeCards
            .filter((item: any) => heroPlayers.includes(item.playerName))
            .map((item: any) => item.cards)
            .map((item: any) => isolatingHand(item))

        // let opponentPlayers = actionsList
        //     .filter((action: any) => action.actionAmount !== null && action.playerName !== "Hero")
        //     .map((action: any) => action.playerName);

        let opponentPlayers = summary.shows
            .filter((action: any) => action.playerName !== "Hero")
            .map((action: any) => action.playerName);

        let unrepeatedopponentPlayers = new Set([...opponentPlayers])

        // let opponentHands = holeCards
        //     .filter((item: any) => opponentPlayers.includes(item.playerName))
        //     .map((item: any) => item.cards)
        //     .map((item: any) => isolatingHand(item))

        let opponentHands = summary.shows
            .filter((action: any) => action.playerName !== "Hero")
            .map((item: any) => item.cards)
            .map((item: any) => isolatingHand(item))

        opponentHands.unshift(heroHands[0]);

        // console.log("stageActionList", stageActionList);
        // console.log("summary", summary);

        let heroChip: any = 0

        const heroPlayer = playerList.find((player: any) => player.playerName === 'Hero');

        // Check if heroPlayer is found and log chipCount if found
        if (heroPlayer) {
            heroChip = heroPlayer.chipCount; // Outputs: 11500
        }

        let lastIndex = -1;

        for (let i = actionsList.length - 1; i >= 0; i--) {
            if (actionsList[i].playerName === 'Hero' && actionsList[i].action.includes('all in')) {
                lastIndex = i;
                break;
            }
        }

        const sumActionAmount = actionsList.reduce((sum: any, action: any) => {
            if (action.playerName === 'Hero' && action.actionAmount !== null) {
                return sum + action.actionAmount;
            }
            return sum;
        }, 0);

        if (heroChip <= (heroChipBeforeHole + sumActionAmount) && lastIndex !== -1) {

            let isHeroWinner = summary.collected.find((item: any) => item.playerName === "Hero")

            console.log("isHeroWinner", isHeroWinner);

            let allinStreet = actionsList[lastIndex].street

            let streeetMap = {
                "preFlop": 0,
                "Flop": 3,
                "Turn": 4,
                "River": 5
            }

            let communityCardsLastIndex = streeetMap[allinStreet]

            let communityCardList = communityCards.slice(0, communityCardsLastIndex).map((item: any) => item.rank + item.suit)

            if (!isHeroWinner) {
                console.log("summary.collected", summary.collected);
                console.log("playerList", playerList);
                console.log("actionsList", actionsList);
                // this is part which have to focus on 
                reportDetail.ev = -20
            } else {

                let herowinningchip = isHeroWinner.amount

                let winningchip = herowinningchip - heroChip
                let losingchip = heroChip



                // const Table = new TexasHoldem(buttonSeat);
                const Table = new TexasHoldem(buttonSeat);

                if (opponentHands.length === 1) {
                    // console.log("opponentHands", opponentHands);
                    // console.log("player", playerList);
                }

                if (communityCardsLastIndex > 0) {

                    opponentHands.forEach((hand: any) => {
                        Table.addPlayer(hand);
                    });
                    Table.setBoard(communityCardList)

                } else {
                    opponentHands.forEach((hand: any) => {
                        Table.addPlayer(hand);
                    });
                }

                const Result = Table.calculate();

                let winningPercentage = parseFloat(Result.getPlayers()[0].getWinsPercentageString().replace('~', '').replace('%', '')) / 100
                let losingPercentage = 1 - winningPercentage

                let ev = winningchip * winningPercentage - losingchip * losingPercentage

                let bbinev = Number((ev / bigBlind).toFixed(4))
                reportDetail.ev = bbinev
            }
        } else reportDetail.ev = 0

        // if (heroHands.length > 0) {

        //     let heroAction = stageActionList[indexItem]

        //     const sumActionAmounts = stageActionList.slice(0, -1).reduce((sum: any, item: any) => {
        //         if (item.playerName !== 'Hero') {
        //             return sum + (item.actionAmount || 0);
        //         }
        //         return sum;
        //     }, 0);

        //     let isHeroWinner = summary.collected.find((item: any) => item.playerName === "Hero")

        //     if (opponentPlayers.length > 1) {

        //         if (heroAction.actionAmount === null) {
        //             let ev = Number(((heroChipBeforeHole) / bigBlind).toFixed(4))
        //             console.log("villain is there but hero fold : ev", -ev);
        //             reportDetail.ev = -ev
        //         } else {

        //             if (!isHeroWinner) {
        //                 console.log("! isHeroWinner : ev", 0);
        //                 reportDetail.ev = 0
        //             } else {

        //                 const Table = new TexasHoldem(buttonSeat);

        //                 opponentHands.forEach((hand: any) => {
        //                     Table.addPlayer(hand);
        //                 });

        //                 const Result = Table.calculate();

        //                 let winningPercentage = parseFloat(Result.getPlayers()[0].getWinsPercentageString().replace('~', '').replace('%', '')) / 100
        //                 let losingPercentage = 1 - winningPercentage
        //                 let total = heroChipBeforeHole + sumActionAmounts
        //                 let ev = Number((((total + heroAction.actionAmount) * winningPercentage - heroAction.actionAmount * losingPercentage) / bigBlind).toFixed(4))
        //                 console.log("with villain : ev", ev);
        //                 reportDetail.ev = ev
        //             }

        //         }
        //     } else {
        //         let ev = Number(((heroChipBeforeHole) / bigBlind).toFixed(4))
        //         if (!isHeroWinner) {
        //             reportDetail.ev = -ev
        //         } else {
        //             reportDetail.ev = ev
        //         }

        //     }
        // } else {
        //     let ev = Number(((heroChipBeforeHole) / bigBlind).toFixed(4))
        //     console.log("No hero : ev", 0);
        //     reportDetail.ev = 0
        // }

        actionItem.processedActionList = extractingActionList(stageActionList)
        bufferReportDetailAction.push(actionItem)
    })

    reportDetail.action = bufferReportDetailAction

    return reportDetail
}

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

export function actionTypeValidation(preflopActioList: any, heroIndex: any): any {

    let actionList = []
    let actionBet = ["RFI", "vs RFI", "3-Bet", "vs 3-Bet", "4-Bet", "VS 4-Bet", "5-Bet +"]
    let totalCount = []

    preflopActioList.slice(0, heroIndex + 1).forEach((item: any, i: any) => {
        if (item.action === "raise" || item.action === 'all in, raise') totalCount.push(i);
    });

    let matchedPosition = totalCount.indexOf(heroIndex)

    if (heroIndex && preflopActioList && preflopActioList[heroIndex] && preflopActioList[heroIndex] !== "fold") actionList.push("VPIP")
    else actionList.push("fold")

    if (matchedPosition === 0) actionList.push("RFI")
    if (matchedPosition > -1) actionList.push("PFR")

    // if (
    //     heroIndex && preflopActioList && preflopActioList[heroIndex] && preflopActioList[heroIndex] === "raise" &&
    //     heroIndex && preflopActioList && preflopActioList[heroIndex] && preflopActioList[heroIndex] === "all in, raise"     
    // ) actionList.push("PFR")

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

    // else if (matchedPosition === -1 && totalCount.length === 0) actionList.push("VPIP")
    else if (matchedPosition === -1 && totalCount[totalCount.length - 1] < heroIndex) {
        let realIndex = (2 * (totalCount.length - 1)) + 1
        actionList.push(actionBet[realIndex])
    }
    return actionList.length === 0 ? ["fold"] : actionList
}

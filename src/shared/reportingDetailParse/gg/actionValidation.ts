import uploadingActionValidation from './uploadingActionValidation'
import updatingActionValidation from './updatingActionValidation'

export default function actionValidation(playerList: any, actionsList: any, heroPostion: any, stackRange: any, tableStandard: any, bufferBTNPosition: any, bigBlind: any, holeCards: any, ante: any, buttonSeat: any, heroChipBeforeHole: any, summary: any, communityCards: any, isUpdating = false): any {

    if (isUpdating) {
        return updatingActionValidation(playerList, actionsList, heroPostion, stackRange, tableStandard, bufferBTNPosition, bigBlind, holeCards, ante, buttonSeat, heroChipBeforeHole, summary, communityCards)
    } else {
        return uploadingActionValidation(playerList, actionsList, heroPostion, stackRange, tableStandard, bufferBTNPosition, bigBlind, holeCards, ante, buttonSeat, heroChipBeforeHole, summary, communityCards)
    }
}

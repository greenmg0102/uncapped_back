import { distinguishCardKind } from 'src/shared/distinguishCardKind'

export default function userDataFrequencySort(list: any): any {

    let real = {}

    list.forEach((element: any) => {

        let card = distinguishCardKind(element.holeCards[0].cards)

        if (card in real) {

            let bufferFold = real[card].frequency.fold + element.reportContent.bettingAction.fold
            let bufferCall = real[card].frequency.call + element.reportContent.bettingAction.call
            let bufferRaise = real[card].frequency.raise + element.reportContent.bettingAction.raise
            let bufferAllin = real[card].frequency.allin + element.reportContent.bettingAction.allin

            real[card] = {
                card: card,
                frequency: {
                    fold: bufferFold,
                    call: bufferCall,
                    raise: bufferRaise,
                    allin: bufferAllin
                },
                foldNode: element.reportContent.bettingAction.fold !== 0 ? [...real[card].foldNode, element._id] : [...real[card].foldNode],
                raiseNode: element.reportContent.bettingAction.raise !== 0 ? [...real[card].raiseNode, element._id] : [...real[card].raiseNode],
                callNode: element.reportContent.bettingAction.call !== 0 ? [...real[card].callNode, element._id] : [...real[card].callNode],
                allinNode: element.reportContent.bettingAction.allin !== 0 ? [...real[card].allinNode, element._id] : [...real[card].allinNode],
            }

        } else {

            real[card] = {
                card: card,
                frequency: element.reportContent.bettingAction,
                foldNode: element.reportContent.bettingAction.fold !== 0 ? [element._id] : [],
                raiseNode: element.reportContent.bettingAction.raise !== 0 ? [element._id] : [],
                callNode: element.reportContent.bettingAction.call !== 0 ? [element._id] : [],
                allinNode: element.reportContent.bettingAction.allin !== 0 ? [element._id] : [],
            }
        }
    });
    return real
}
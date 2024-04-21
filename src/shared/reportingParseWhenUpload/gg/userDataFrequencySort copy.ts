import { distinguishCardKind } from 'src/shared/distinguishCardKind'
import { squeezeActionRecursive } from 'src/shared/report/squeezeRecursiveData'


export default function userDataFrequencySort(list: any, action: any): any {

    let real = {}

    list.forEach((element: any) => {

        let bufferBettingAction = element.reportDetail.action.find((item: any) => {
            return item.category.some((each: any) => each === action)
        }).bettingAction

        let card = distinguishCardKind(element.holeCards[0].cards)

        if (card in real) {

            let bufferFold = real[card].frequency.fold + bufferBettingAction.fold
            let bufferCall = real[card].frequency.call + bufferBettingAction.call
            let bufferRaise = real[card].frequency.raise + bufferBettingAction.raise
            let bufferAllin = real[card].frequency.allin + bufferBettingAction.allin

            real[card] = {
                card: card,
                frequency: {
                    fold: bufferFold,
                    call: bufferCall,
                    raise: bufferRaise,
                    allin: bufferAllin
                },
                foldNode: bufferBettingAction.fold !== 0 ? [...real[card].foldNode, element._id] : [...real[card].foldNode],
                raiseNode: bufferBettingAction.raise !== 0 ? [...real[card].raiseNode, element._id] : [...real[card].raiseNode],
                callNode: bufferBettingAction.call !== 0 ? [...real[card].callNode, element._id] : [...real[card].callNode],
                allinNode: bufferBettingAction.allin !== 0 ? [...real[card].allinNode, element._id] : [...real[card].allinNode],
            }

        } else {

            real[card] = {
                card: card,
                frequency: bufferBettingAction,
                foldNode: bufferBettingAction.fold !== 0 ? [element._id] : [],
                raiseNode: bufferBettingAction.raise !== 0 ? [element._id] : [],
                callNode: bufferBettingAction.call !== 0 ? [element._id] : [],
                allinNode: bufferBettingAction.allin !== 0 ? [element._id] : [],
            }
        }
    });
    return real
}


export function squeezeUserDataFrequencySort(body: any, list: any): any {

    console.log("squeezeUserDataFrequencySort", list);

    let real = {}

    list.forEach((element: any) => {

        let elementProcessedActionList = element.processedActionList
        let previousBuffer: any = squeezeActionRecursive.find((item: any) => item.squeeze === body.squeeze && item.squeezeAction === body.squeezeAction && item.position === body.heroPosition[0]).rangeList

        let buffer = {}

        Object.keys(previousBuffer).forEach((key: any) => {
            buffer[key] = previousBuffer[key].slice(0, previousBuffer[key].length - 1)
        })

        const matchedIndex = elementProcessedActionList.findIndex((arr: any) => {
            return Object.values(buffer).some(rangeArr => {
                return JSON.stringify(rangeArr) === JSON.stringify(arr);
            });
        });

        let bufferBettingAction = element.reportDetail.action.find((item: any) => {
            return item.category.some((each: any) => each === element.reportDetail.action[matchedIndex].category[0])
        }).bettingAction

        let card = distinguishCardKind(element.holeCards[0].cards)

        if (card in real) {

            let bufferFold = real[card].frequency.fold + bufferBettingAction.fold
            let bufferCall = real[card].frequency.call + bufferBettingAction.call
            let bufferRaise = real[card].frequency.raise + bufferBettingAction.raise
            let bufferAllin = real[card].frequency.allin + bufferBettingAction.allin

            real[card] = {
                card: card,
                frequency: {
                    fold: bufferFold,
                    call: bufferCall,
                    raise: bufferRaise,
                    allin: bufferAllin
                },
                foldNode: bufferBettingAction.fold !== 0 ? [...real[card].foldNode, element._id] : [...real[card].foldNode],
                raiseNode: bufferBettingAction.raise !== 0 ? [...real[card].raiseNode, element._id] : [...real[card].raiseNode],
                callNode: bufferBettingAction.call !== 0 ? [...real[card].callNode, element._id] : [...real[card].callNode],
                allinNode: bufferBettingAction.allin !== 0 ? [...real[card].allinNode, element._id] : [...real[card].allinNode],
            }

        } else {

            real[card] = {
                card: card,
                frequency: bufferBettingAction,
                foldNode: bufferBettingAction.fold !== 0 ? [element._id] : [],
                raiseNode: bufferBettingAction.raise !== 0 ? [element._id] : [],
                callNode: bufferBettingAction.call !== 0 ? [element._id] : [],
                allinNode: bufferBettingAction.allin !== 0 ? [element._id] : [],
            }
        }
    });
    return real
}



// import { distinguishCardKind } from 'src/shared/distinguishCardKind'

// export default function userDataFrequencySort(list: any, action: any): any {

//     console.log("userDataFrequencySort", action);

//     let real = {}

//     list.forEach((element: any) => {

//         let bufferBettingAction = element.reportDetail.action.filter((item: any) => {
//             return item.category.some((each: any) => each === action)
//         }).bettingAction

//         console.log("bufferBettingAction", bufferBettingAction);


//         let card = distinguishCardKind(element.holeCards[0].cards)

//         if (card in real) {

//             let bufferFold = real[card].frequency.fold + element.reportContent.bettingAction.fold
//             let bufferCall = real[card].frequency.call + element.reportContent.bettingAction.call
//             let bufferRaise = real[card].frequency.raise + element.reportContent.bettingAction.raise
//             let bufferAllin = real[card].frequency.allin + element.reportContent.bettingAction.allin

//             real[card] = {
//                 card: card,
//                 frequency: {
//                     fold: bufferFold,
//                     call: bufferCall,
//                     raise: bufferRaise,
//                     allin: bufferAllin
//                 },
//                 foldNode: element.reportContent.bettingAction.fold !== 0 ? [...real[card].foldNode, element._id] : [...real[card].foldNode],
//                 raiseNode: element.reportContent.bettingAction.raise !== 0 ? [...real[card].raiseNode, element._id] : [...real[card].raiseNode],
//                 callNode: element.reportContent.bettingAction.call !== 0 ? [...real[card].callNode, element._id] : [...real[card].callNode],
//                 allinNode: element.reportContent.bettingAction.allin !== 0 ? [...real[card].allinNode, element._id] : [...real[card].allinNode],
//             }

//         } else {

//             real[card] = {
//                 card: card,
//                 frequency: element.reportContent.bettingAction,
//                 foldNode: element.reportContent.bettingAction.fold !== 0 ? [element._id] : [],
//                 raiseNode: element.reportContent.bettingAction.raise !== 0 ? [element._id] : [],
//                 callNode: element.reportContent.bettingAction.call !== 0 ? [element._id] : [],
//                 allinNode: element.reportContent.bettingAction.allin !== 0 ? [element._id] : [],
//             }
//         }
//     });
//     return real
// }
import { distinguishCardKind } from 'src/shared/distinguishCardKind'

export async function userHandParse(data: any): Promise<any> {

    let heroCard = distinguishCardKind(data.heroCard)
    let actionCount = await extractAction(data.actions)

    return {
        card: heroCard,
        actionCount: actionCount
    }
}

export async function extractAction(actionList: any): Promise<any> {

    let result = {
        fold: 0,
        call: 0,
        raise: 0,
        allin: 0
    }

    actionList.filter((item: any) => item.street === "preFlop" && item.playerName === "Hero").forEach((element: any) => {
        if (element.action === standard[element.action]) result = { ...result, [element.action]: result[element.action] + 1 }
    });

    return result
}

export const standard = {
    "fold": "fold",
    "call": "call",
    "raise": "raise",
    "all in, raise": "allin",
}
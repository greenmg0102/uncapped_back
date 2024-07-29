

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

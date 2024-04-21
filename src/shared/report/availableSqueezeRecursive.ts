import { generateFileData } from "src/shared/parsingAction/fileRead"

export const availableSqueezeRecursive = (squeeze: any, squeezeAction: any, position: any, stack: any, maxSeat: any) => {

    if (
        squeeze === '1 Caller' &&
        squeezeAction === 'First Action'
    ) {
        return caller1FirstAction(position, stack, maxSeat)
    } else if (
        squeeze === '1 Caller' &&
        squeezeAction === 'Middle Action'
    ) {
        return caller1MiddleAction(position, stack, maxSeat)
    } else if (
        squeeze === '1 Caller' &&
        squeezeAction === 'Last Action'
    ) {
        return caller1LastAction(position, stack, maxSeat)
    } else if (
        squeeze === '2 Caller' &&
        squeezeAction === 'First Action'
    ) {
        return caller2FirstAction(position, stack, maxSeat)
    } else if (
        squeeze === '2 Caller' &&
        squeezeAction === 'Middle Action'
    ) {
        return caller2MiddleAction(position, stack, maxSeat)
    } else if (
        squeeze === '2 Caller' &&
        squeezeAction === 'Last Action'
    ) {
        return caller2LastAction(position, stack, maxSeat)
    }

}
export function caller1FirstAction(position: any, stack: any, maxSeat: any) {

    let result: any = []

    for (let i = 0; i < 5319; i++) {    // 5319

        const element = generateFileData(stack === 40 ? 398750 : stack, maxSeat, i)
        let bufferSequence = element.sequence.map((item: any, index: any) => item.type)

        if (
            element.sequence.length > 3 &&
            bufferSequence.filter((item: any) => item === "C").length === 1 &&
            bufferSequence.filter((item: any) => item === "R").length === 2
        ) {

            let callerIndex = bufferSequence.findIndex((item: any) => item === "C")
            let prefix = bufferSequence.slice(0, callerIndex)
            let backfix = bufferSequence.slice(callerIndex + 1, bufferSequence.length)

            if (
                prefix.filter((item: any) => item === "R").length === 1 &&
                backfix.filter((item: any) => item === "R").length === 1 &&
                element.player === position
            ) {
                result.push(element)
            }
        }
    }

    const uniqueArrays = [...new Set(result.map(JSON.stringify))].map((arr: any) => JSON.parse(arr));

    return uniqueArrays
}

export function caller1MiddleAction(position: any, stack: any, maxSeat: any) {

    let result: any = []

    for (let i = 0; i < 5319; i++) {    // 5319

        const element = generateFileData(stack === 40 ? 398750 : stack, maxSeat, i)
        let bufferSequence = element.sequence.map((item: any, index: any) => item.type)

        if (
            element.sequence.length > 3 &&
            bufferSequence.filter((item: any) => item === "C").length === 1 &&
            bufferSequence.filter((item: any) => item === "R").length === 2
        ) {

            let callerIndex = bufferSequence.findIndex((item: any) => item === "C")
            let prefix = bufferSequence.slice(0, callerIndex)
            let backfix = bufferSequence.slice(callerIndex + 1, bufferSequence.length)

            if (
                prefix.filter((item: any) => item === "R").length === 1 &&
                backfix.filter((item: any) => item === "R").length === 1 &&
                element.player === position
            ) {
                result.push(element)
            }
        }
    }

    const uniqueArrays = [...new Set(result.map(JSON.stringify))].map((arr: any) => JSON.parse(arr));

    return uniqueArrays
}

export function caller1LastAction(position: any, stack: any, maxSeat: any) {

    let result: any = []

    for (let i = 0; i < 5319; i++) {    // 5319

        const element = generateFileData(stack === 40 ? 398750 : stack, maxSeat, i)
        let bufferSequence = element.sequence.map((item: any, index: any) => item.type)

        if (
            element.sequence.length > 3 &&
            bufferSequence.filter((item: any) => item === "C").length === 1 &&
            bufferSequence.filter((item: any) => item === "R").length === 2
        ) {

            let callerIndex = bufferSequence.findIndex((item: any) => item === "C")
            let prefix = bufferSequence.slice(0, callerIndex)
            let backfix = bufferSequence.slice(callerIndex + 1, bufferSequence.length)

            if (
                prefix.filter((item: any) => item === "R").length === 1 &&
                backfix.filter((item: any) => item === "R").length === 1 &&
                element.player === position
            ) {
                result.push(element)
            }
        }
    }

    const uniqueArrays = [...new Set(result.map(JSON.stringify))].map((arr: any) => JSON.parse(arr));

    return uniqueArrays
}

export function caller2FirstAction(position: any, stack: any, maxSeat: any) {

    let result: any = []

    for (let i = 0; i < 5319; i++) {    // 5319

        const element = generateFileData(stack === 40 ? 398750 : stack, maxSeat, i)
        let bufferSequence = element.sequence.map((item: any, index: any) => item.type)

        const callerIndexArray = bufferSequence.reduce((acc: any, curr: any, index: any) => {
            if (curr === "C") {
                acc.push(index);
            }
            return acc;
        }, []);

        if (
            element.sequence.length > 4 &&
            callerIndexArray.length === 2 &&
            bufferSequence.slice(callerIndexArray[0] + 1, callerIndexArray[1]).some((item: any) => item !== "F") === false &&
            bufferSequence.filter((item: any) => item === "R").length === 2
        ) {

            let prefix = bufferSequence.slice(0, callerIndexArray[0])
            let backfix = bufferSequence.slice(callerIndexArray[1] + 1, bufferSequence.length)

            if (
                prefix.filter((item: any) => item === "R").length === 1 &&
                backfix.filter((item: any) => item === "R").length === 1 &&
                element.player === position
            ) {
                result.push(element)
            }
        }
    }
    const uniqueArrays = [...new Set(result.map(JSON.stringify))].map((arr: any) => JSON.parse(arr));

    return uniqueArrays
}

export function caller2MiddleAction(position: any, stack: any, maxSeat: any) {

    let result: any = []

    for (let i = 0; i < 5319; i++) {    // 5319

        const element = generateFileData(stack === 40 ? 398750 : stack, maxSeat, i)
        let bufferSequence = element.sequence.map((item: any, index: any) => item.type)

        const callerIndexArray = bufferSequence.reduce((acc: any, curr: any, index: any) => {
            if (curr === "C") {
                acc.push(index);
            }
            return acc;
        }, []);

        if (
            element.sequence.length > 4 &&
            callerIndexArray.length === 2 &&
            bufferSequence.slice(callerIndexArray[0] + 1, callerIndexArray[1]).some((item: any) => item !== "F") === false &&
            bufferSequence.filter((item: any) => item === "R").length === 2
        ) {

            let prefix = bufferSequence.slice(0, callerIndexArray[0])
            let backfix = bufferSequence.slice(callerIndexArray[1] + 1, bufferSequence.length)

            if (
                prefix.filter((item: any) => item === "R").length === 1 &&
                backfix.filter((item: any) => item === "R").length === 1 &&
                element.player === position
            ) {
                result.push(element)
            }
        }
    }
    const uniqueArrays = [...new Set(result.map(JSON.stringify))].map((arr: any) => JSON.parse(arr));

    return uniqueArrays
}
export function caller2LastAction(position: any, stack: any, maxSeat: any) {

    let result: any = []

    for (let i = 0; i < 5319; i++) {    // 5319

        const element = generateFileData(stack === 40 ? 398750 : stack, maxSeat, i)
        let bufferSequence = element.sequence.map((item: any, index: any) => item.type)

        const callerIndexArray = bufferSequence.reduce((acc: any, curr: any, index: any) => {
            if (curr === "C") {
                acc.push(index);
            }
            return acc;
        }, []);

        if (
            element.sequence.length > 4 &&
            callerIndexArray.length === 2 &&
            bufferSequence.slice(callerIndexArray[0] + 1, callerIndexArray[1]).some((item: any) => item !== "F") === false &&
            bufferSequence.filter((item: any) => item === "R").length === 2
        ) {

            let prefix = bufferSequence.slice(0, callerIndexArray[0])
            let backfix = bufferSequence.slice(callerIndexArray[1] + 1, bufferSequence.length)

            if (
                prefix.filter((item: any) => item === "R").length === 1 &&
                backfix.filter((item: any) => item === "R").length === 1 &&
                element.player === position
            ) {
                result.push(element)
            }
        }
    }
    const uniqueArrays = [...new Set(result.map(JSON.stringify))].map((arr: any) => JSON.parse(arr));

    return uniqueArrays
}



export async function userHandFrequencyMerge(bufferFrequency: any, result: any) {

    let real = Object.fromEntries(bufferFrequency)

    Object.keys(result).forEach((resultKey: any) => {

        if (resultKey in real) {

            let bufferFold = real[resultKey].fold + result[resultKey].fold
            let bufferCall = real[resultKey].call + result[resultKey].call
            let bufferRaise = real[resultKey].raise + result[resultKey].raise
            let bufferAllin = real[resultKey].allin + result[resultKey].allin

            real[resultKey] = {
                fold: bufferFold,
                call: bufferCall,
                raise: bufferRaise,
                allin: bufferAllin
            }
        } else {
            real[resultKey] = result[resultKey]
        }
    })

    return real
}
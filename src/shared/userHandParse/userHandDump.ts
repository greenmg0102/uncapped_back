
export async function userHandDump(buffer: any): Promise<any> {

    let real = {}

    buffer.forEach((element: any) => {
        if (real[element.card]) {

            real[element.card].fold = real[element.card].fold + element.actionCount.fold
            real[element.card].call = real[element.card].call + element.actionCount.call
            real[element.card].raise = real[element.card].raise + element.actionCount.raise
            real[element.card].allin = real[element.card].allin + element.actionCount.allin
            
        } else {
            real[element.card] = element.actionCount
        }
    });
    return real
}

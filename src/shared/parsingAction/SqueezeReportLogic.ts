import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString, extractType } from "src/shared/parsingAction/fileRead"
import { actionRecursive } from 'src/shared/report/recursiveData'
import { squeezeActionRecursive } from 'src/shared/report/squeezeRecursiveData'

export function SqueezeReportLogic(body: any) {

  let actonTraking = actionRecursive[body.action]

  let result: any = []
  let max8 = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
  let bbData = [10, 15, 20, 25, 30, 398750, 50, 60, 80, 100]
  let heroPositionList = body.heroPositionList.length === 0 ? max8.slice(max8.length - Object.keys(actonTraking).length, max8.length) : body.heroPositionList

  let heroPositionNumberList = exchangeIntoNumberFromPositionString(body.heroPositionList.length === 0 ? max8.slice(1, max8.length) : body.heroPositionList)
  let villianPositionNumberList = exchangeIntoNumberFromPositionString(body.villianPosition.length === 0 ? [] : body.villianPosition)
  let stackDepthList = body.stackDepthList.length === 0 ? bbData : body.stackDepthList
  let tableSize = body.tableSize

  stackDepthList.forEach((stack: any) => heroPositionList.forEach((position: any, order: any) => {

    let buffer = squeezeActionRecursive.find((item: any) => item.squeeze === body.squeeze && item.squeezeAction === body.squeezeAction && item.position === position).rangeList

    const processBuffer = async () => {
      try {
        await Promise.all(Object.keys(buffer).map(async (key: any) => {
          await Promise.all(buffer[key].map(async (element: any, index: any) => {
            if (element !== "R" && villianPositionNumberList.some((which: any) => index === which)) {
              buffer[key][index] = "C";
            }
          }));
        }));
      } catch (error) {
        console.error('An error occurred in processBuffer');
      }
    };

    processBuffer();

    Object.keys(buffer).forEach((actionRF: any) => {
      let bufferLater = SqueezeReportLogicRecursive(stack === 40 ? 398750 : stack, tableSize, heroPositionNumberList[order], 0, buffer[actionRF], 0)
      result.push(bufferLater)
    });
  }));

  return sumAverage(result)
}

export function SqueezeReportLogicRecursive(stackDepth: number, maxPlayer: number, heroPosition: number, currentPosition: number, actionRFList: any, index: any) {

  if (currentPosition !== undefined) {
    if (actionRFList.length === 1) {
      return generateFileData(stackDepth, maxPlayer, currentPosition)
    } else {

      let real = generateFileData(stackDepth, maxPlayer, currentPosition)
      let secondPosition = -1

      secondPosition = extractType(real.actions, actionRFList[index])

      // if (real.player !== heroPosition) return SqueezeReportLogicRecursive(stackDepth, maxPlayer, heroPosition, secondPosition, actionRFList, index + 1)
      if (index !== actionRFList.length - 1) return SqueezeReportLogicRecursive(stackDepth, maxPlayer, heroPosition, secondPosition, actionRFList, index + 1)
      else return real
    }
  }
}

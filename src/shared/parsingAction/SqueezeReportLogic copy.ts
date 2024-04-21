import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString, extractType } from "src/shared/parsingAction/fileRead"
import { actionRecursive } from 'src/shared/report/recursiveData'
import { squeezeActionRecursive } from 'src/shared/report/squeezeRecursiveData'
import { availableSqueezeRecursive } from 'src/shared/report/availableSqueezeRecursive'

export function SqueezeReportLogic(body: any) {

  let result: any = []
  let max8 = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
  let bbData = [10, 15, 20, 25, 30, 398750, 50, 60, 80, 100]
  // let heroPositionList = body.heroPositionList.length === 0 ? max8.slice(max8.length - Object.keys(actonTraking).length, max8.length) : body.heroPositionList

  let heroPositionNumberList = exchangeIntoNumberFromPositionString(body.heroPositionList.length === 0 ? max8.slice(1, max8.length) : body.heroPositionList)
  let villianPositionNumberList = exchangeIntoNumberFromPositionString(body.villianPosition.length === 0 ? [] : body.villianPosition)
  let stackDepthList = body.stackDepthList.length === 0 ? bbData : body.stackDepthList
  let tableSize = body.tableSize

  stackDepthList.forEach((stack: any) => heroPositionNumberList.forEach((position: any, order: any) => {
    let matchResult = availableSqueezeRecursive(body.squeeze, body.squeezeAction, position, stack, tableSize)
    result = [...result, ...matchResult]
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

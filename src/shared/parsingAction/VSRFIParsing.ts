import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString, extractType } from "src/shared/parsingAction/fileRead"
import { actionRecursive } from 'src/shared/report/recursiveData'

export function VSRFIParsing(body: any) {

  let actonTraking = actionRecursive["vs RFI"]

  let result: any = []
  let max8 = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
  let bbData = [10, 15, 20, 25, 30, 398750, 50, 60, 80, 100]
  let heroPositionList = body.heroPositionList.length === 0 ? max8 : body.heroPositionList
  let heroPositionNumberList = exchangeIntoNumberFromPositionString(body.heroPositionList.length === 0 ? max8.slice(1, max8.length) : body.heroPositionList)
  let stackDepthList = body.stackDepthList.length === 0 ? bbData : body.stackDepthList
  let tableSize = body.tableSize

  stackDepthList.forEach((stack: any) => heroPositionList.forEach((position: any, order: any) => {
    Object.keys(actonTraking[position]).forEach((actionRF: any) => {
      let buffer = RecursiveVSRFIParsingRecursive(stack, tableSize, heroPositionNumberList[order], 0, actonTraking[position][actionRF], 0)
      result.push(buffer)
    });
  }));

  return sumAverage(result)
}

export function RecursiveVSRFIParsingRecursive(stackDepth: number, maxPlayer: number, heroPosition: number, currentPosition: number, actionRFList: any, index: any) {

  let real = generateFileData(stackDepth, maxPlayer, currentPosition)
  let secondPosition = -1

  secondPosition = extractType(real.actions, actionRFList[index] === "R" ? "R" : "F")

  if (real.player !== heroPosition) return RecursiveVSRFIParsingRecursive(stackDepth, maxPlayer, heroPosition, secondPosition, actionRFList, index + 1)
  else return real
}

import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString } from "src/shared/parsingAction/fileRead"

export function VPIPParsing(body: any) {

  let max8 = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
  let bbData = [10, 15, 20, 25, 30, 398750, 50, 60, 80, 100]

  let real: any = []
  let heroPositionList = exchangeIntoNumberFromPositionString(body.heroPositionList.length === 0 ? max8 : body.heroPositionList)
  let stackDepthList = body.stackDepthList.length === 0 ? bbData : body.stackDepthList

  let tableSize = body.tableSize

  stackDepthList.forEach((element: any) => heroPositionList.forEach((each: any) => real.push(generateFileData(element, tableSize, each))));

  return sumAverage(real)

}
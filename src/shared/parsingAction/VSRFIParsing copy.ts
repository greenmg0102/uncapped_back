import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString, extractType } from "src/shared/parsingAction/fileRead"

export function VSRFIParsing(body: any) {

  let max8 = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
  let bbData = [10, 15, 20, 25, 30, 398750, 50, 60, 80, 100]
  let bufferResult: any = []
  let real: any = []
  let heroPositionList = exchangeIntoNumberFromPositionString(body.heroPositionList.length === 0 ? max8.slice(1, max8.length) : body.heroPositionList)
  let stackDepthList = body.stackDepthList.length === 0 ? bbData : body.stackDepthList
  let tableSize = body.tableSize

  stackDepthList.forEach((stack: any) => heroPositionList.forEach((each: any) => {
    let buffer = RecursiveVSRFIParsing(stack, tableSize, each, 0, false)
    real = [...real, ...buffer]
  }));

  real.forEach((element: any) => {
    bufferResult.push(generateFileData(element.stackDepth, element.maxPlayer, element.currentPosition))
  });

  return sumAverage(bufferResult)
}

export function RecursiveVSRFIParsing(stackDepth: number, maxPlayer: number, heroPosition: number, currentPosition: number, isRaise: boolean) {

  let result = []

  Array(heroPosition).fill(0).forEach((item: any, index) => {
    let real = generateFileData(stackDepth, maxPlayer, index)
    let buffer = RecursiveVSRFIParsingRecursive(stackDepth, maxPlayer, heroPosition, real.player, isRaise)
    result.push(buffer)
  })
  return result
}

export function RecursiveVSRFIParsingRecursive(stackDepth: number, maxPlayer: number, heroPosition: number, currentPosition: number, isRaise: boolean) {

  let real = generateFileData(stackDepth, maxPlayer, currentPosition)

  let secondPosition = -1
  secondPosition = extractType(real.actions, isRaise ? "F" : "R")

  if (real.player !== heroPosition) return RecursiveVSRFIParsingRecursive(stackDepth, maxPlayer, heroPosition, secondPosition, isRaise === false ? true : true)
  else {
    return {
      stackDepth: stackDepth,
      maxPlayer: maxPlayer,
      currentPosition: currentPosition
    }
  }
}

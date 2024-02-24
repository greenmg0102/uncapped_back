import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString, extractType } from "src/shared/parsingAction/fileRead"

export function VS3BetParsing(body: any) {

  let max8 = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
  let bbData = [10, 15, 20, 25, 30, 398750, 50, 60, 80, 100]
  let bufferResult: any = []
  let real: any = []
  let heroPositionList = exchangeIntoNumberFromPositionString(body.heroPositionList.length === 0 ? max8.slice(2, max8.length) : body.heroPositionList)
  let stackDepthList = body.stackDepthList.length === 0 ? bbData : body.stackDepthList
  let tableSize = body.tableSize

  stackDepthList.forEach((stack: any) => heroPositionList.forEach((each: any) => {
    let buffer = RecursiveVS3BetParsing(stack, tableSize, each, 0)
    real = buffer
  }));

  real.forEach((element: any) => {
    bufferResult.push(generateFileData(element.stackDepth, element.maxPlayer, element.currentPosition))
  });

  return sumAverage(bufferResult)

}

export function RecursiveVS3BetParsing(stackDepth: number, maxPlayer: number, destinationPosition: number, currentPosition: number) {

  let result = []

  for (let j = 0; j < destinationPosition - 4; j++) {
    for (let i = j; i < destinationPosition; i++) {
      let buffer = RecursiveVS3BetParsingRecursive(stackDepth, maxPlayer, destinationPosition, currentPosition, i, 0)
      result.push(buffer)
    }
  }

  return result
}

export function RecursiveVS3BetParsingRecursive(stackDepth: number, maxPlayer: number, destinationPosition: number, currentPosition: number, raisePosition: any, sequence: any) {

  let real = generateFileData(stackDepth, maxPlayer, currentPosition)
  let nextNode = extractType(real.actions, raisePosition === sequence ? "R" : "F")

  if (real.player === destinationPosition && sequence === destinationPosition) {

    let latestRaise = generateFileData(stackDepth, maxPlayer, currentPosition)
    let latestNode = extractType(latestRaise.actions, "R")

    return {
      stackDepth: stackDepth,
      maxPlayer: maxPlayer,
      currentPosition: latestNode
    }
  }
  else return RecursiveVS3BetParsingRecursive(stackDepth, maxPlayer, destinationPosition, nextNode, raisePosition, sequence + 1)

}
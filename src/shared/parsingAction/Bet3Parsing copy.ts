import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString, extractType } from "src/shared/parsingAction/fileRead"

export function Bet3Parsing(body: any) {

  let max8 = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
  let bbData = [10, 15, 20, 25, 30, 398750, 50, 60, 80, 100]
  let bufferResult: any = []
  let real: any = []
  let heroPosiotionList = exchangeIntoNumberFromPositionString(body.heroPosition.length === 0 ? max8 : body.heroPosition)
  let stackDepthList = body.stackDepth.length === 0 ? bbData : body.stackDepth
  let tableSize = body.tableSize

  stackDepthList.forEach((stack: any) => heroPosiotionList.forEach((each: any) => {
    let buffer = RecursiveBet3Parsing(stack, tableSize, each, 0)
    real = buffer
  }));

  real.forEach((element: any) => {
    bufferResult.push(generateFileData(element.stackDepth, element.maxPlayer, element.currentPosition))
  });

  return sumAverage(bufferResult)
}

export function RecursiveBet3Parsing(stackDepth: number, maxPlayer: number, destinationPosition: number, currentPosition: number) {

  let result = []

  for (let i = 0; i < destinationPosition; i++) {
    let buffer = RecursiveBet3ParsingRecursive(stackDepth, maxPlayer, destinationPosition, currentPosition, i, 0)
    result.push(buffer)
  }

  return result
}

export function RecursiveBet3ParsingRecursive(stackDepth: number, maxPlayer: number, destinationPosition: number, currentPosition: number, raisePosition: any, sequence: any) {

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
  else return RecursiveBet3ParsingRecursive(stackDepth, maxPlayer, destinationPosition, nextNode, raisePosition, sequence + 1)

}
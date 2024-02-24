import { generateFileData, sumAverage } from "src/shared/parsingAction/fileRead"

export function PFR(body: any) {

  let result: any = {}
  // let real: any = []
  // let heroPosiotionList = body.heroPosiotionList
  // let stackDepthList = body.stackDepthList

  // stackDepthList.forEach((element: any) => heroPosiotionList.forEach((each: any) => real.push(generateFileData(element, 8, each))));

  // result = sumAverage(real)
  return result

}


// import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString } from "src/shared/parsingAction/fileRead"

// export function PFR(body: any) {

//   let max8 = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
//   let bbData = [10, 15, 20, 25, 30, 398750, 50, 60, 80, 100]

//   let real: any = []
//   let heroPosiotionList = exchangeIntoNumberFromPositionString(body.heroPosition.length === 0 ? max8 : body.heroPosition)
//   let stackDepthList = body.stackDepth.length === 0 ? bbData : body.stackDepth

//   let tableSize = body.tableSize

//   stackDepthList.forEach((element: any) => heroPosiotionList.forEach((each: any) => real.push(generateFileData(element, tableSize, each))));

//   return sumAverage(real)

// }
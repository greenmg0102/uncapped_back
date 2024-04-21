import { generateFileData, sumAverage, exchangeIntoNumberFromPositionString, extractType } from "src/shared/parsingAction/fileRead"
import { actionRecursive } from 'src/shared/report/recursiveData'
import { squeezeActionRecursive } from 'src/shared/report/squeezeRecursiveData'
import { availableSqueezeRecursive } from 'src/shared/report/availableSqueezeRecursive'

export async function SqueezeReportLogic(body: any) {

  console.log("body", body);


  let result: any = []

  let tableSize = body.tableSize
  let actionList = body.actionLit
  let heroIndex = actionList.findIndex((item: any) => item.action === "H")

  let availableActionList = actionList.filter((item: any, index: any) => index < heroIndex).map((item: any) => item.action)

  for (const stack of body.SqueezeStackDepth) {
    let real = nextNode(stack, tableSize, 0, availableActionList, 0)
    result = [real]
  }
  return sumAverage(result)

}

export function nextNode(stackDepth: number, maxPlayer: number, currentPosition: number, actionList: any, arrayIndex: any) {

  let real = generateFileData(stackDepth, maxPlayer, currentPosition)

  if (actionList.length === arrayIndex) {

    console.log("final - currentPosition", currentPosition);

    return real

  }
  else {

    let actionIndex = real.actions.findIndex((item: any) => item.type === actionList[arrayIndex])
    let bufferNextNodeBumber = real.actions[actionIndex].node

    console.log("bufferNextNodeBumber", bufferNextNodeBumber);

    return nextNode(stackDepth, maxPlayer, bufferNextNodeBumber, actionList, arrayIndex + 1)
  }

}
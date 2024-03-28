import * as fs from 'fs';
import * as path from 'path';

export function extractType(actions: any, type: string) {

  if (actions.filter((item: any) => item.type === type).length === 0) {
    return undefined
  } else return actions.filter((item: any) => item.type === type)[0].node
}

export function sumAverage(real: any): any {

  let result: any = {}
  Object.keys(real.filter((item: any) => item !== undefined)[0].hands).map((key: any) => {

    let weight = 0
    let played = {}
    let evs = {}

    Array(real.length)
      .fill(0)
      .map((item: any, index: any) => index)
      .forEach(element => {

        if (real[element] !== undefined) {

          weight += real[element].hands[key].weight
          let { playedItem, evsItem } = actionDistinguish(real[element].hands[key], real[element].actions)
          played[element] = playedItem
          evs[element] = evsItem
        }
      });

    result[key] = {
      weight: Number(weight / real.length),
      played: arraySumAverage(played),
      evs: arraySumAverage(evs)
    }
  })
  return result
}

export function actionDistinguish(frequency: any, actions: any): any {

  let indexFold = actions.findIndex((element: any) => element.type === "F")
  let indexCall = actions.findIndex((element: any) => element.type === "C")
  let indexListRaise = actions.reduce((acc: any, el: any, index: any) => {
    if (el.type === "R") {
      acc.push(index);
    }
    return acc;
  }, []);

  let playedItem = [0, 0, 0, 0]
  let evsItem = [0, 0, 0, 0]

  playedItem[0] = indexFold !== -1 ? frequency.played[indexFold] : 0
  playedItem[1] = indexCall !== -1 ? frequency.played[indexCall] : 0
  playedItem[2] = indexListRaise.length === 0 ? 0 : indexListRaise.length === 2 ? frequency.played[indexListRaise[0]] : 0
  playedItem[3] = indexListRaise.length === 0 ? 0 : indexListRaise.length === 2 ? frequency.played[indexListRaise[1]] : frequency.played[indexListRaise[0]]

  evsItem[0] = indexFold !== -1 ? frequency.evs[indexFold] : 0
  evsItem[1] = indexCall !== -1 ? frequency.evs[indexCall] : 0
  evsItem[2] = indexListRaise.length === 0 ? 0 : indexListRaise.length === 2 ? frequency.evs[indexListRaise[0]] : 0
  evsItem[3] = indexListRaise.length === 0 ? 0 : indexListRaise.length === 2 ? frequency.evs[indexListRaise[1]] : frequency.evs[indexListRaise[0]]

  return {
    playedItem: playedItem,
    evsItem: evsItem
  }

}

export function handCollection(body: any) {
  let real: any = []
  let result: any = {}
  let heroPositionList = body.heroPositionList
  let stackDepthList = body.stackDepthList

  stackDepthList.forEach((element: any) => heroPositionList.forEach((each: any) => real.push(generateFileData(element, 8, each))));

  Object.keys(real[0].hands).map((key: any) => {

    let weight = 0
    let played = {}
    let evs = {}

    Array(real.length)
      .fill(0)
      .map((item: any, index: any) => index)
      .forEach(element => {

        weight += real[element].hands[key].weight
        played[element] = real[element].hands[key].played
        evs[element] = real[element].hands[key].evs

      });

    result[key] = {
      weight: Number(weight / real.length),
      played: arraySumAverage(played),
      evs: arraySumAverage(evs)
    }
  })
  return result
}

export function generateFileData(chipAmount: any, maxUser: any, nodeNumber: any): any {
  const filePath = path.join(__dirname, `../../../assets/preflopChartModel/${chipAmount}bb_${maxUser}max_4-2-1_2HU-1MW/nodes/${nodeNumber}.json`);
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}

export function arraySumAverage(object: any): any {

  let result = []
  Array(4)
    // Array(object[0].length)
    .fill(0)
    .map((item: any, index: any) => index)
    .map((item: any, index: any) => {
      let real = 0
      Object.keys(object).map((key: any) => real += object[key][index])
      result.push(Number((real / Object.keys(object).length).toFixed(2)))
    })
  return result
}

export function exchangeIntoNumberFromPositionString(array: any) {

  let max9 = ["UTG", "UTG+1", "UTG+2", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
  let max8 = ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"]
  return array.map((element: any) => max8.indexOf(element));
}
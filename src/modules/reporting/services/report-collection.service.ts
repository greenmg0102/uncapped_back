import * as fs from 'fs';
import * as path from 'path';
import { ParsingAction } from 'src/shared/parsingAction'

export class ReportCollectionService {
  constructor() { }

  collections(body: any) {
    return ParsingAction(body)
  }

  handCollection(body: any): any {
    let real: any = []
    let result: any = {}
    let heroPosiotionList = body.heroPosiotionList
    let stackDepthList = body.stackDepthList

    stackDepthList.forEach((element: any) => heroPosiotionList.forEach((each: any) => real.push(this.generateFileData(element, 8, each))));

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
        played: this.arraySumAverage(played),
        evs: this.arraySumAverage(evs)
      }
    })
    return result
  }

  generateFileData(chipAmount: any, maxUser: any, nodeNumber: any): any {
    const filePath = path.join(__dirname, `../../../../assets/preflopChartModel/${chipAmount}bb_${maxUser}max_4-2-1_2HU-1MW/nodes/${nodeNumber}.json`);
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  }

  arraySumAverage(object: any): any {

    let result = []
    Array(object[0].length)
      .fill(0)
      .map((item: any, index: any) => index)
      .map((item: any, index: any) => {
        let real = 0
        Object.keys(object).map((key: any) => real += object[key][index])
        result.push(Number((real / Object.keys(object).length).toFixed(2)))
      })
    return result
  }
}

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { GetPreflopInterface } from '../interfaces/getNode.interface'

@Injectable()
export class GetNodeService {

  constructor() { }

  async getNode(body: GetPreflopInterface, res: any): Promise<any> {

    const fileData = generateFileData(body.chipAmount, body.maxUser, body.nodeNumber);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=filename.text');
    res.send(fileData);
  }
}


function generateFileData(chipAmount: Number, maxUser: any, nodeNumber: Number): Buffer {

  const filePath = path.join(__dirname, `../../../../assets/preflopChartModel/${chipAmount}bb_${maxUser}max_4-2-1_2HU-1MW/nodes/${nodeNumber}.json`);
  const fileData = fs.readFileSync(filePath);

  return fileData;
}

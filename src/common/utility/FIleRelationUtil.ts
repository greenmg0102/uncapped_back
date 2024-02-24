import * as fs from 'fs';
import * as path from 'path';

export function generateFileData(chipAmount: any, maxUser: any, nodeNumber: any): Buffer {
  // Generate the file data (replace this with your own logic)
  const filePath = path.join(__dirname, `../../../../assets/preflopChartModel/${chipAmount}bb_${maxUser}max_4-2-1_2HU-1MW/nodes/${nodeNumber}.json`);
  const fileData = fs.readFileSync(filePath);

  return fileData;
}

module.exports = {
  generateFileData
};
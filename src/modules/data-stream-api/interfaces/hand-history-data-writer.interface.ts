export interface HandHistoryDataWriterInterface {
    saveHistory(data: any[], roomType: string, sections: any): Promise<any>;
  }
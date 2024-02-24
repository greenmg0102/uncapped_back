export interface GetPreflopInterface {
    nodeNumber: Number;
    chipAmount: Number;
    maxUser: string;
}

export interface GetHandStatusInterface {
    handId: string | undefined
}

export interface HandHistoryDataWriterInterface {
    saveHistory(data: any[], roomType: String, sections: any): Promise<any>;
}
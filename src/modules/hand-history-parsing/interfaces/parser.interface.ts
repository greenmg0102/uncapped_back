import { ParsedHandHistory } from './parsed-hand-history.interface';
import { HydratedDocument, SchemaTypes } from 'mongoose'
export interface ParsedReturnData {
  data: ParsedHandHistory[];
  parsedNumber: number;
  rejectedNumber: number;
  rejectedTournamentPlo: number;
  rejectedCashNlh: number;
  rejectedCashPlo: number;
  rejectedCashOther: number;
  rejectedTournamentOther: number;
  rejectedOther: number;
}

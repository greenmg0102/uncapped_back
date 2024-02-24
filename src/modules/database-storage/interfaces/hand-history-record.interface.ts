import { Document } from "mongoose";

export interface HandHistoryRecord extends Document {
  readonly id: string;
  readonly name: string;
}

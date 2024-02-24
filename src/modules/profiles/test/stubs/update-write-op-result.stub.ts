import { UpdateWriteOpResult } from "mongoose"

export const updateWriteOpResultStub = (): UpdateWriteOpResult => {
  return {
    acknowledged: true,
    modifiedCount: 1,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 1
  }
}
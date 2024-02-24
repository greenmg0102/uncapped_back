import { Types } from "mongoose";

export interface UserIdentity {
    _id: Types.ObjectId;
    googleId: string | null;
    facebookId: string | null;
}
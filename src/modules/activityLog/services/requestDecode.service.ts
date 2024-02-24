import { Request } from 'express';
import { ObjectId } from 'mongodb';

export function requestDecode(req: Request, activity: string) {

    return {
        profilesId: new ObjectId("65849f7fdafd57880710c9ab"),
        accessIp: req.ip,
        activity: activity
    }

}
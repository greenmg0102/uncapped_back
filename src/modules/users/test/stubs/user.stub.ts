import { Types } from "mongoose"
import { UserDocument } from "../../schemas/user.schema"

export const userStub = (): UserDocument => {
  return {
    _id: new Types.ObjectId('64f07244c69147695ff00377'),
    googleId: '110314035757182449125',
    facebookId: null,
    customerId: 'cus_OXk9Z4XqTmpKbg',
    email: 'test@test.com',
    provider: 'google',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  } as UserDocument
}
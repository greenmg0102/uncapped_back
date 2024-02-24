import { ProfileDocument } from "../../schemas/profile.schema"
import { User } from "../../../users/schemas/user.schema"
import { userStub } from "../../../users/test/stubs"

export const profileStub = (): ProfileDocument => {
  return {
    userId: userStub() as User,
    firstName: 'First Name',
    lastName: 'Last Name',
    socialAvatar: 'https://cdn.fishevolver.com/avatar_awguiaebgoainv',
  } as ProfileDocument
}
import { userStub } from "../test/stubs"

export const UserService = jest.fn().mockReturnValue({
  getUserByObjectId: jest.fn().mockResolvedValue(userStub()),
})
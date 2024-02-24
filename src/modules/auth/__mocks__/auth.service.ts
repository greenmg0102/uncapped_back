import { tokensStub } from "../test/stubs"

export const AuthService = jest.fn().mockReturnValue({
  refresh: jest.fn().mockResolvedValue(tokensStub()),
})
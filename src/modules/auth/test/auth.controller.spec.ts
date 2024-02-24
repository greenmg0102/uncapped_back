import { Test } from "@nestjs/testing"
import { AuthController } from "../auth.controller"
import { AuthService } from "../auth.service"
import { tokensStub } from "./stubs"
import { userStub } from "../../users/test/stubs"
import { Tokens } from "../../../common/interfaces"

jest.mock('../auth.service')

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile()

    authController = moduleRef.get<AuthController>(AuthController)
    authService = moduleRef.get<AuthService>(AuthService)
    jest.clearAllMocks()
  })

  describe('refresh', () => {
    describe('when refresh is called', () => {
      let tokens: Tokens

      const fakeUser = userStub()
      const userId = fakeUser._id
      const userRt = fakeUser.refreshToken

      beforeEach(async () => {
        tokens = await authController.refresh(userId, userRt)
      })

      test('then it should call authService', () => {
        expect(authService.refresh).toBeCalledWith(userId, userRt)
      })

      test('then it should return new tokens', () => {
        expect(tokens).toEqual(tokensStub())
      })
    })
  })
})
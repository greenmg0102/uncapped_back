import { Test } from "@nestjs/testing"
import { UserController } from "../user.controller"
import { UserService } from "../user.service"
import { userStub } from "./stubs"
import { UserDocument } from "../schemas/user.schema"

jest.mock('../user.service')

describe('UserController', () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [UserService],
    }).compile()

    userController = moduleRef.get<UserController>(UserController)
    userService = moduleRef.get<UserService>(UserService)
    jest.clearAllMocks()
  })

  describe('getUser', () => {
    describe('when getUser is called', () => {
      let user: UserDocument

      beforeEach(async () => {
        user = await userController.getUser(userStub()._id)
      })

      test('then it should call userService', () => {
        expect(userService.getUserByObjectId).toBeCalledWith(userStub()._id)
      })

      test('then it should return a user', () => {
        expect(user).toEqual(userStub())
      })
    })
  })
})
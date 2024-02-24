import { Test } from "@nestjs/testing"
import { ProfileController } from "../profile.controller"
import { ProfileService } from "../profile.service"
import { ProfileDocument } from "../schemas/profile.schema"
import { userStub } from "../../users/test/stubs"
import { profileStub, updateWriteOpResultStub } from "./stubs"
import { UpdateWriteOpResult } from "mongoose"
import { UpdateProfileDto } from "../dtos"

jest.mock('../profile.service')

describe('ProfileController', () => {
  let profileController: ProfileController
  let profileService: ProfileService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [ProfileController],
      providers: [ProfileService],
    }).compile()

    profileController = moduleRef.get<ProfileController>(ProfileController)
    profileService = moduleRef.get<ProfileService>(ProfileService)
    jest.clearAllMocks()
  })

  describe('fetchProfileData', () => {
    describe('when fetchProfileData is called', () => {
      let profile: ProfileDocument

      beforeEach(async () => {
        profile = await profileController.fetchProfileData(userStub()._id)
      })

      test('then it should call profileService', () => {
        expect(profileService.fetchProfileData).toBeCalledWith(userStub()._id)
      })

      test('then it should return a profile', () => {
        expect(profile).toEqual(profileStub())
      })
    })
  })

  describe('updateProfile', () => {
    describe('when updateProfile is called', () => {
      let result: UpdateWriteOpResult

      const dto: UpdateProfileDto = { displayName: 'new name', nationality: 'Canada' }

      beforeEach(async () => {
        result = await profileController.updateProfile(userStub()._id, dto)
      })

      test('then it should call profileService', () => {
        expect(profileService.updateProfile).toBeCalledWith(userStub()._id, dto)
      })

      test('then it should return update result', () => {
        expect(result).toEqual(updateWriteOpResultStub())
      })
    })
  })

  describe('updateAvatar', () => {
    describe('when updateAvatar is called', () => {
      let result: UpdateWriteOpResult

      const userId = userStub()._id
      const fileUrl = 'avatar_sxthXz3b3uX13OgQ.png'

      beforeEach(async () => {
        result = await profileController.updateAvatar(userId, fileUrl)
      })

      test('then it should call profileService', () => {
        expect(profileService.updateAvatar).toBeCalledWith(userId, fileUrl)
      })

      test('then it should return update result', () => {
        expect(result).toEqual(updateWriteOpResultStub())
      })
    })
  })

  describe('removeAvatar', () => {
    describe('when removeAvatar is called', () => {
      let result: UpdateWriteOpResult

      beforeEach(async () => {
        result = await profileController.removeAvatar(userStub()._id)
      })

      test('then it should call profileService', () => {
        expect(profileService.removeAvatar).toBeCalledWith(userStub()._id)
      })

      test('then it should return update result', () => {
        expect(result).toEqual(updateWriteOpResultStub())
      })
    })
  })
})
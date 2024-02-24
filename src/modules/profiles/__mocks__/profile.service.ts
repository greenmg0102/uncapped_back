import { profileStub, updateWriteOpResultStub } from "../test/stubs"

export const ProfileService = jest.fn().mockReturnValue({
  createProfile: jest.fn().mockResolvedValue(profileStub()),
  fetchProfileData: jest.fn().mockResolvedValue(profileStub()),
  updateProfile: jest.fn().mockResolvedValue(updateWriteOpResultStub()),
  updateAvatar: jest.fn().mockResolvedValue(updateWriteOpResultStub()),
  removeAvatar: jest.fn().mockResolvedValue(updateWriteOpResultStub())
})
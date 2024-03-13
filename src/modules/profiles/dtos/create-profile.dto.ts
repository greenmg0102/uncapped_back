import { UserDocument } from "../../users/schemas/user.schema"

export class CreateProfileDto {
  userId: UserDocument
  firstName: string
  lastName: string
  displayName: string
  socialAvatar: string
  role: string
  premiumId: string
}
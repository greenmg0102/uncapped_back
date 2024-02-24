export class CreateUserDto {
  googleId: string
  facebookId: string
  customerId: string
  email: string
  provider: string
  subscriptionDetails: { gameType: string, name: string }
}
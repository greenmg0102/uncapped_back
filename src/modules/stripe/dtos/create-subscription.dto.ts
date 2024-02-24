import { IsNotEmpty, IsString } from 'class-validator'

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  priceId: string
}

export default CreateSubscriptionDto
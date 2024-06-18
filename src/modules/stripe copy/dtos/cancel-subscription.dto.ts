import { IsNotEmpty, IsString } from 'class-validator'

export class CancelSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  subscriptionId: string
}

export default CancelSubscriptionDto
import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmPaymentIntentDto {
  @IsString()
  @IsNotEmpty()
  intentId: string;

  @IsString()
  @IsNotEmpty()
  methodId: string;
}

export default ConfirmPaymentIntentDto
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreatePaymentIntentDto {
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}

export default CreatePaymentIntentDto
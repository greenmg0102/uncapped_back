import { IsString, IsNotEmpty } from 'class-validator'

export class AddCardDto {
  @IsString()
  @IsNotEmpty()
  sourceToken: string;
}

export default AddCardDto
import { IsString, IsNotEmpty } from 'class-validator'

export class RemoveCardDto {
  @IsString()
  @IsNotEmpty()
  sourceId: string;
}

export default RemoveCardDto
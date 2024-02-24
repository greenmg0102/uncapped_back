import { IsArray, IsNotEmpty, IsString } from 'class-validator'
export class UpdateRoleDto {

  @IsString()
  @IsNotEmpty()
  public roleName?: string

  @IsArray()
  public admittingPageList?: Array<string>

}
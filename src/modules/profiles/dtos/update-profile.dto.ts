import { Transform, TransformFnParams } from 'class-transformer'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'
import * as sanitizeHtml from 'sanitize-html'

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  public displayName?: string

  @IsString()
  public nationality?: string

  @IsArray()
  public rooms?: Array<string>

  @IsArray()
  public formats?: Array<string>

  @IsArray()
  public types?: Array<string>

  @IsArray()
  public stakes?: Array<string>

  @IsString()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  public biography?: string
}
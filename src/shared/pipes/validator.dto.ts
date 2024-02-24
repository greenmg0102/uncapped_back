import { IsTxtFile } from './validation.pipe';
import { IsNotEmpty, IsString } from 'class-validator';

export class FileUploadDto {
  @IsNotEmpty()
  @IsString()
  originalname: string;

  @IsNotEmpty()
  @IsString()
  mimetype: string;

  @IsNotEmpty()
  buffer: Buffer;
}

export class UploadDto {
  @IsNotEmpty()
  @IsTxtFile()
  file: any;
}

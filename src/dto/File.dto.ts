import { Expose } from 'class-transformer';
import { IsMimeType, IsString } from 'class-validator';

export class UploadedFileDto {
  @Expose()
  @IsString()
  url: string;

  @Expose()
  @IsMimeType()
  type: string;
}

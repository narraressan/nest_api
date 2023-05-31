import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from 'src/utils/constants';
import { UserRoleEnum } from '../db/entities/Base';

export class RegisterInputDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fullname?: string;

  @ApiProperty()
  @MaxLength(PASSWORD_MAX_LENGTH)
  @MinLength(PASSWORD_MIN_LENGTH)
  @IsString()
  password: string;
}

export class LoginInputDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MaxLength(PASSWORD_MAX_LENGTH)
  @MinLength(PASSWORD_MIN_LENGTH)
  @IsString()
  password: string;
}

export class ReLoginInputDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class LoginOutputDto {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class JwtPayloadDto {
  email: string;
  role: UserRoleEnum;
  timestamp: string;
}

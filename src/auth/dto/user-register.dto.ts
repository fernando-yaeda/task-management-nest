import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsUniqueConstraint } from '../validators/is-unique';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDTO {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  @Validate(IsUniqueConstraint, ['username'])
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @Validate(IsUniqueConstraint, ['email'])
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}

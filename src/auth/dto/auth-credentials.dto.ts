import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsUniqueConstraint } from '../validators/is-unique';

export class AuthCredentialsDTO {
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  @Validate(IsUniqueConstraint, ['username'])
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsEmail()
  @Validate(IsUniqueConstraint, ['email'])
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/((?=.*\d)|(?=.*\W))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}

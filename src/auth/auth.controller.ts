import {
  Body,
  ConflictException,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { SignInDTO } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  sighUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDTO,
  ): Promise<void | ConflictException> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signInDto: SignInDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto);
  }
}

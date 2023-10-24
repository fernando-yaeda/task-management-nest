import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDTO } from './dto/user-register.dto';
import { LoginResultDTO } from './dto/login-result.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: 'Successfully Registered' })
  async userRegister(
    @Body(ValidationPipe) userRegisterDto: UserRegisterDTO,
  ): Promise<void | ConflictException> {
    return await this.authService.signUp(userRegisterDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: LoginResultDTO })
  async userLogin(
    @Body(ValidationPipe) userLoginDto: UserLoginDTO,
  ): Promise<LoginResultDTO> {
    return await this.authService.signIn(userLoginDto);
  }
}

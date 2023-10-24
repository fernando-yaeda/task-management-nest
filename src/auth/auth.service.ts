import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterDTO } from './dto/user-register.dto';
import { LoginResultDTO } from './dto/login-result.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    userRegisterDto: UserRegisterDTO,
  ): Promise<void | ConflictException> {
    return await this.userRepository.signUp(userRegisterDto);
  }

  async signIn(userLoginDto: UserLoginDTO): Promise<LoginResultDTO> {
    const user = await this.userRepository.validateUserPassword(userLoginDto);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { username: user.username };
    const accessToken = await this.jwtService.sign(payload);

    return {
      user,
      token: accessToken,
    };
  }
}

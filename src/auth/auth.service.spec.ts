import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';

const mockUserRepository = () => ({
  signUp: jest.fn(),
  validateUserPassword: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

const mockAuthCredentialsDto = {
  username: 'username',
  password: 'password',
};

describe('AuthService', () => {
  let authService;
  let jwtService;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    it('should return userRepository.signUp result', async () => {
      userRepository.signUp.mockResolvedValue(undefined);

      const result = await authService.signUp(mockAuthCredentialsDto);

      expect(result).toEqual(undefined);
      expect(userRepository.signUp).toHaveBeenCalledWith(
        mockAuthCredentialsDto,
      );
    });
  });

  describe('signIn', () => {
    it('should return access token given valid credentials ', async () => {
      userRepository.validateUserPassword.mockResolvedValue(
        mockAuthCredentialsDto.username,
      );
      jwtService.sign.mockResolvedValue('access_token');

      const result = await authService.signIn(mockAuthCredentialsDto);

      expect(result).toEqual({ accessToken: 'access_token' });
      expect(userRepository.validateUserPassword).toHaveBeenCalledWith(
        mockAuthCredentialsDto,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockAuthCredentialsDto.username,
      });
    });

    it('should return UnauthorizedException given invalid credentials ', async () => {
      userRepository.validateUserPassword.mockResolvedValue(null);

      await expect(
        authService.signIn(mockAuthCredentialsDto),
      ).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
    });
  });
});

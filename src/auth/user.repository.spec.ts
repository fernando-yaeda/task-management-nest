import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigTest } from '../config/typeorm.config';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  const authCredentialsDto: AuthCredentialsDTO = {
    username: 'username',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfigTest),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      await expect(userRepository.count()).resolves.toEqual(0);

      await userRepository.signUp(authCredentialsDto);

      await expect(userRepository.count()).resolves.toEqual(1);
      await expect(userRepository.find({ where: { id: 1 } })).resolves.toEqual([
        expect.objectContaining({
          id: 1,
          username: 'username',
          password: expect.any(String),
          salt: expect.any(String),
          tasks: expect.any(Array),
        }),
      ]);
    });

    it('should throw an conclict error if username was already taken', async () => {
      await userRepository.signUp(authCredentialsDto);

      // sqlite unique constratint error code is different than postgres
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '23505' });

      await expect(userRepository.signUp(authCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(userRepository.count()).resolves.toEqual(1);
    });

    it('should throw internal server error given unhandled error code', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '99999' });

      await expect(userRepository.signUp(authCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(userRepository.count()).resolves.toEqual(0);
    });
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      user = new User();
      user.username = authCredentialsDto.username;
      user.validatePassword = jest.fn();
    });

    it('should return the username if validation succed', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(user, 'validatePassword').mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(
        authCredentialsDto,
      );

      expect(result).toEqual(user.username);
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockReturnValue(undefined);

      const result = await userRepository.validateUserPassword(
        authCredentialsDto,
      );

      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });

    it('should return null when password is invalid', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(user, 'validatePassword').mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(
        authCredentialsDto,
      );

      expect(result).toEqual(null);
    });
  });
});

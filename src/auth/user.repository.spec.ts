import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { SignInDTO } from './dto/sign-in.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let module: TestingModule;

  const authCredentialsDto: AuthCredentialsDTO = {
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@email.com',
    password: 'password',
  };

  const signInDto: SignInDTO = {
    email: 'email@email.com',
    password: 'password',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      await expect(userRepository.count()).resolves.toEqual(0);

      await userRepository.signUp(authCredentialsDto);

      await expect(userRepository.find({ where: { id: 1 } })).resolves.toEqual([
        {
          id: 1,
          username: 'username',
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email@email.com',
          password: expect.any(String),
          salt: expect.any(String),
          tasks: [],
          projects: [],
        },
      ]);
    });

    it('should throw internal server error given unhandled error code', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '99999' });

      await expect(userRepository.count()).resolves.toEqual(0);
      await expect(userRepository.signUp(authCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      user = new User();
      user.username = 'username';
      user.firstName = 'firstName';
      user.lastName = 'lastName';
      user.email = signInDto.email;
      user.validatePassword = jest.fn();
    });

    it('should return the user without sensitive data and tasks if validation succed', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(user, 'validatePassword').mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(signInDto);

      expect(result).toEqual(user);
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockReturnValue(undefined);

      const result = await userRepository.validateUserPassword(signInDto);

      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });

    it('should return null when password is invalid', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(user, 'validatePassword').mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(signInDto);

      expect(result).toEqual(null);
    });
  });
});

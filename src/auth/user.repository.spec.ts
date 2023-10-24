import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { UserRegisterDTO } from './dto/user-register.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let module: TestingModule;

  const userRegisterDto: UserRegisterDTO = {
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@email.com',
    password: 'password',
  };

  const userLoginDto: UserLoginDTO = {
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

      await userRepository.signUp(userRegisterDto);

      await expect(userRepository.find({ where: { id: 1 } })).resolves.toEqual([
        {
          id: 1,
          username: 'username',
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email@email.com',
          password: expect.any(String),
          salt: expect.any(String),
        },
      ]);
    });

    it('should throw internal server error given unhandled error code', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '99999' });

      await expect(userRepository.count()).resolves.toEqual(0);
      await expect(userRepository.signUp(userRegisterDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.username = 'username';
      user.firstName = 'firstName';
      user.lastName = 'lastName';
      user.email = userLoginDto.email;
      user.validatePassword = jest.fn();
    });

    it('should return the user without sensitive data and tasks if validation succed', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(user, 'validatePassword').mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(userLoginDto);

      expect(result).toEqual(user);
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockReturnValue(undefined);

      const result = await userRepository.validateUserPassword(userLoginDto);

      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });

    it('should return null when password is invalid', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(user, 'validatePassword').mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(userLoginDto);

      expect(result).toEqual(null);
    });
  });
});

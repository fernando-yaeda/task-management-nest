import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiConfigService } from '../shared/api-config.service';
import { JwtStrategy } from './jwt.stategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
});

const mockApiConfigService = () => ({
  authConfig: {
    jwtSecret: 'secret',
  },
});

describe('JwtStrategy', () => {
  let module: TestingModule;
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
        {
          provide: ApiConfigService,
          useFactory: mockApiConfigService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('validate', () => {
    it('should return the user based on received payload', async () => {
      const user = new User();
      user.username = 'username';

      userRepository.findOneBy.mockResolvedValue(user);

      const result = await jwtStrategy.validate({ username: user.username });

      expect(result).toEqual(user);
      expect(result.username).toEqual(user.username);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: user.username,
      });
    });

    it('should return Unauthorized Exception if user cannot be found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(
        jwtStrategy.validate({ username: 'username' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: 'username',
      });
    });
  });
});

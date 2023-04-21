import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'password';
    user.salt = 'salt';
  });

  describe('validatePassword', () => {
    it('returns true if passwordd is valid', async () => {
      const bcryptHash = jest.fn().mockResolvedValue(user.password);
      (bcrypt.hash as jest.Mock) = bcryptHash;

      const result = await user.validatePassword(user.password);
      expect(result).toEqual(true);
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, user.salt);
    });

    it('returns false if password is invalid', async () => {
      const bcryptHash = jest.fn().mockResolvedValue('otherpassword');
      (bcrypt.hash as jest.Mock) = bcryptHash;

      const result = await user.validatePassword(user.password);
      expect(result).toEqual(false);
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, user.salt);
    });
  });
});

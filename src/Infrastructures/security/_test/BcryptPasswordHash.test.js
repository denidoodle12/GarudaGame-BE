import { vi } from 'vitest';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import BcryptPasswordHash from '../BcryptPasswordHash.js';

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      const bcrypt = { hash: vi.fn().mockResolvedValue('hashed_password') };
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      expect(encryptedPassword).toEqual('hashed_password');
      expect(bcrypt.hash).toHaveBeenCalledWith('plain_password', 10);
    });
  });

  describe('comparePassword function', () => {
    it('should throw AuthenticationError when password does not match', async () => {
      const bcrypt = { compare: vi.fn().mockResolvedValue(false) };
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      await expect(bcryptPasswordHash.comparePassword('plain_password', 'hashed_password'))
        .rejects.toThrow(AuthenticationError);
      expect(bcrypt.compare).toHaveBeenCalledWith('plain_password', 'hashed_password');
    });

    it('should resolve when password matches', async () => {
      const bcrypt = { compare: vi.fn().mockResolvedValue(true) };
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      await expect(bcryptPasswordHash.comparePassword('plain_password', 'hashed_password'))
        .resolves.toBeUndefined();
      expect(bcrypt.compare).toHaveBeenCalledWith('plain_password', 'hashed_password');
    });
  });
});

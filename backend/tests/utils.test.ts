import { signAccessToken, verifyAccessToken } from '../src/utils/jwt';

describe('JWT Utils', () => {
  describe('signAccessToken and verifyAccessToken', () => {
    it('should sign and verify a token successfully', () => {
      const userId = 'test-user-id';
      const token = signAccessToken(userId);
      const payload = verifyAccessToken(token);

      expect(payload.sub).toBe(userId);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyAccessToken('invalid-token');
      }).toThrow();
    });
  });
});

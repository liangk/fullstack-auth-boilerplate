// Setup test environment
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
process.env.JWT_EMAIL_SECRET = 'test_email_secret';
process.env.JWT_PASSWORD_RESET_SECRET = 'test_password_reset_secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Mock nodemailer createTransport
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  }),
}));

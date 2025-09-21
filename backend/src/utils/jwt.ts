import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const ACCESS_SECRET: Secret = (process.env.JWT_ACCESS_SECRET || 'change_me_access') as Secret;
const REFRESH_SECRET: Secret = (process.env.JWT_REFRESH_SECRET || 'change_me_refresh') as Secret;
const EMAIL_SECRET: Secret = (process.env.JWT_EMAIL_SECRET || 'change_me_email') as Secret;
const PASSWORD_RESET_SECRET: Secret = (process.env.JWT_PASSWORD_RESET_SECRET || 'change_me_password_reset') as Secret;
const ACCESS_EXPIRES: SignOptions['expiresIn'] = (process.env.JWT_ACCESS_EXPIRES || '15m') as SignOptions['expiresIn'];
const REFRESH_EXPIRES: SignOptions['expiresIn'] = (process.env.JWT_REFRESH_EXPIRES || '7d') as SignOptions['expiresIn'];
const EMAIL_EXPIRES: SignOptions['expiresIn'] = (process.env.JWT_EMAIL_EXPIRES || '24h') as SignOptions['expiresIn'];
const PASSWORD_RESET_EXPIRES: SignOptions['expiresIn'] = (process.env.JWT_PASSWORD_RESET_EXPIRES || '1h') as SignOptions['expiresIn'];

if (!ACCESS_SECRET || !REFRESH_SECRET || !EMAIL_SECRET || !PASSWORD_RESET_SECRET) {
  console.warn('One or more JWT secrets are not configured (access, refresh, email, password reset).');
}

export type AccessPayload = { sub: string };
export type RefreshPayload = { sub: string; tv: number };
export type EmailPayload = { sub: string; type: 'email_verification' };
export type PasswordResetPayload = { sub: string; type: 'password_reset' };

export function signAccessToken(userId: string) {
  return jwt.sign({ sub: userId } as AccessPayload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessPayload;
}

export function signRefreshToken(userId: string, tokenVersion: number) {
  return jwt.sign({ sub: userId, tv: tokenVersion } as RefreshPayload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, REFRESH_SECRET) as RefreshPayload;
}

export function signEmailVerificationToken(userId: string) {
  return jwt.sign({ sub: userId, type: 'email_verification' } as EmailPayload, EMAIL_SECRET, { expiresIn: EMAIL_EXPIRES });
}

export function verifyEmailVerificationToken(token: string): EmailPayload {
  const payload = jwt.verify(token, EMAIL_SECRET) as EmailPayload;
  if (payload.type !== 'email_verification') {
    throw new Error('Invalid token type');
  }
  return payload;
}

export function signPasswordResetToken(userId: string) {
  return jwt.sign({ sub: userId, type: 'password_reset' } as PasswordResetPayload, PASSWORD_RESET_SECRET, { expiresIn: PASSWORD_RESET_EXPIRES });
}

export function verifyPasswordResetToken(token: string): PasswordResetPayload {
  const payload = jwt.verify(token, PASSWORD_RESET_SECRET) as PasswordResetPayload;
  if (payload.type !== 'password_reset') {
    throw new Error('Invalid token type');
  }
  return payload;
}

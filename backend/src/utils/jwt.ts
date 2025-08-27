import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const ACCESS_SECRET: Secret = (process.env.JWT_ACCESS_SECRET || 'change_me_access') as Secret;
const REFRESH_SECRET: Secret = (process.env.JWT_REFRESH_SECRET || 'change_me_refresh') as Secret;
const ACCESS_EXPIRES: SignOptions['expiresIn'] = (process.env.JWT_ACCESS_EXPIRES || '15m') as SignOptions['expiresIn'];
const REFRESH_EXPIRES: SignOptions['expiresIn'] = (process.env.JWT_REFRESH_EXPIRES || '7d') as SignOptions['expiresIn'];

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  console.warn('JWT_ACCESS_SECRET or JWT_REFRESH_SECRET is not set.');
}

export type AccessPayload = { sub: string };
export type RefreshPayload = { sub: string; tv: number };

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

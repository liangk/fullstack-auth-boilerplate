import { Request, Response } from 'express';
import { createUser, getUserById, validateUser } from '../services/authService';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, IS_PROD } from '../utils/constants';
import { prisma } from '../prisma';

function setAccessCookie(res: Response, token: string) {
  res.cookie(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export async function register(req: Request, res: Response, next: any) {
  try {
    const { email, password, name } = req.body as { email: string; password: string; name?: string };
    const user = await createUser(email, password, name);
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return res.status(500).json({ message: 'User creation inconsistent' });
    const access = signAccessToken(user.id);
    const refresh = signRefreshToken(user.id, dbUser.tokenVersion);
    setAccessCookie(res, access);
    setRefreshCookie(res, refresh);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: any) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await validateUser(email, password);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return res.status(500).json({ message: 'User not found' });
    const access = signAccessToken(user.id);
    const refresh = signRefreshToken(user.id, dbUser.tokenVersion);
    setAccessCookie(res, access);
    setRefreshCookie(res, refresh);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: any) {
  try {
    const userId = req.userId!;
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: any) {
  try {
    // Invalidate refresh tokens by bumping tokenVersion
    if (req.userId) {
      await prisma.user.update({ where: { id: req.userId }, data: { tokenVersion: { increment: 1 } } });
    }
    res.clearCookie(ACCESS_TOKEN_COOKIE, { httpOnly: true, secure: IS_PROD, sameSite: IS_PROD ? 'none' : 'lax', path: '/' });
    res.clearCookie(REFRESH_TOKEN_COOKIE, { httpOnly: true, secure: IS_PROD, sameSite: IS_PROD ? 'none' : 'lax', path: '/' });
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: any) {
  try {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (user.tokenVersion !== payload.tv) return res.status(401).json({ message: 'Token invalidated' });
    const access = signAccessToken(user.id);
    setAccessCookie(res, access);
    res.json({ message: 'refreshed' });
  } catch (err) {
    next(err);
  }
}

export async function profile(req: Request, res: Response, next: any) {
  try {
    const userId = req.userId!;
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

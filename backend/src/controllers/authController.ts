import { Request, Response } from 'express';
import { createUser, getUserById, validateUser } from '../services/authService';
import { signToken } from '../utils/jwt';
import { COOKIE_NAME } from '../utils/constants';

const isProduction = process.env.NODE_ENV === 'production';

function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export async function register(req: Request, res: Response, next: any) {
  try {
    const { email, password, name } = req.body as { email: string; password: string; name?: string };
    const user = await createUser(email, password, name);
    const token = signToken(user.id);
    setAuthCookie(res, token);
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
    const token = signToken(user.id);
    setAuthCookie(res, token);
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

export async function logout(_req: Request, res: Response, next: any) {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

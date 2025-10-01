import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { createUser, getUserById, validateUser } from '../services/authService';
import {
  signAccessToken,
  signRefreshToken,
  signEmailVerificationToken,
  verifyRefreshToken,
  verifyEmailVerificationToken,
  signPasswordResetToken,
  verifyPasswordResetToken,
} from '../utils/jwt';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  IS_PROD,
  SKIP_EMAIL_VERIFICATION,
} from '../utils/constants';
import { prisma } from '../prisma';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/mailService';

function setAccessCookie(res: Response, token: string) {
  res.cookie(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax', // Use 'lax' since Vercel proxies requests (same-origin)
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax', // Use 'lax' since Vercel proxies requests (same-origin)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export async function register(req: Request, res: Response, next: any) {
  try {
    const { email, password, name } = req.body as {
      email: string;
      password: string;
      name?: string;
    };
    const user = await createUser(email, password, name);

    if (!SKIP_EMAIL_VERIFICATION) {
      // Send verification email
      const verificationToken = signEmailVerificationToken(user.id);
      await sendVerificationEmail(email, verificationToken);
    } else {
      // Mark email as verified if skipping verification
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
      // Issue auth cookies so the user is logged in immediately when skipping verification
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser) {
        const access = signAccessToken(user.id);
        const refresh = signRefreshToken(user.id, dbUser.tokenVersion);
        setAccessCookie(res, access);
        setRefreshCookie(res, refresh);
      }
    }

    res.status(201).json({
      message: SKIP_EMAIL_VERIFICATION
        ? 'User created successfully.'
        : 'User created successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: SKIP_EMAIL_VERIFICATION,
      },
      requiresVerification: !SKIP_EMAIL_VERIFICATION,
    });
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

    // Check if email is verified (skip if flag is true)
    if (!SKIP_EMAIL_VERIFICATION && !dbUser.emailVerified) {
      return res.status(403).json({
        message:
          'Please verify your email before logging in or check your email for a verification link.',
        requiresVerification: true,
      });
    }

    const access = signAccessToken(user.id);
    const refresh = signRefreshToken(user.id, dbUser.tokenVersion);
    setAccessCookie(res, access);
    setRefreshCookie(res, refresh);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: dbUser.emailVerified,
      },
    });
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
      await prisma.user.update({
        where: { id: req.userId },
        data: { tokenVersion: { increment: 1 } },
      });
    }
    res.clearCookie(ACCESS_TOKEN_COOKIE, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? 'none' : 'lax',
      path: '/',
    });
    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? 'none' : 'lax',
      path: '/',
    });
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
    if (user.tokenVersion !== payload.tv)
      return res.status(401).json({ message: 'Token invalidated' });
    const access = signAccessToken(user.id);
    setAccessCookie(res, access);
    res.json({ message: 'refreshed' });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req: Request, res: Response, next: any) {
  try {
    const { token } = req.query as { token: string };
    if (!token) return res.status(400).json({ message: 'Verification token is required' });

    const payload = verifyEmailVerificationToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.emailVerified) return res.status(400).json({ message: 'Email already verified' });

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    if (err instanceof Error && err.message === 'Invalid token type') {
      return res.status(400).json({ message: 'Invalid verification token' });
    }
    next(err);
  }
}

export async function resendVerificationEmail(req: Request, res: Response, next: any) {
  try {
    const { email } = req.body as { email: string };
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.emailVerified) return res.status(400).json({ message: 'Email already verified' });

    const verificationToken = signEmailVerificationToken(user.id);
    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'Verification email sent successfully' });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: any) {
  try {
    const { token, password } = req.body as { token: string; password: string };
    if (!token || !password)
      return res.status(400).json({ message: 'Token and password are required' });

    const payload = verifyPasswordResetToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash the new password
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password and increment token version to invalidate all existing tokens
    // Also mark email as verified since user proved ownership through reset process
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        tokenVersion: { increment: 1 },
        emailVerified: true, // Mark email as verified after successful password reset
      },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    if (err instanceof Error && err.message === 'Invalid token type') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: any) {
  try {
    const { email } = req.body as { email: string };
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        message: 'If an account with this email exists, a password reset link has been sent.',
      });
    }

    const resetToken = signPasswordResetToken(user.id);
    await sendPasswordResetEmail(email, resetToken);

    res.json({
      message: 'If an account with this email exists, a password reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
}

export async function profile(req: Request, res: Response, next: any) {
  try {
    const userId = req.userId!;
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: any) {
  try {
    const userId = req.userId!;
    const { name, email } = req.body as { name?: string; email?: string };

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) return res.status(409).json({ message: 'Email is already taken' });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email &&
          email !== existingUser.email && {
            email,
            emailVerified: false, // Reset email verification if email changed
          }),
      },
      select: { id: true, email: true, name: true, emailVerified: true },
    });

    // If email was changed, send verification email
    if (email && email !== existingUser.email && !SKIP_EMAIL_VERIFICATION) {
      const verificationToken = signEmailVerificationToken(userId);
      await sendVerificationEmail(email, verificationToken);
    }

    res.json({
      message:
        email && email !== existingUser.email && !SKIP_EMAIL_VERIFICATION
          ? 'Profile updated successfully. Please verify your new email address.'
          : 'Profile updated successfully.',
      ...updatedUser,
      requiresVerification: email && email !== existingUser.email && !SKIP_EMAIL_VERIFICATION,
    });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { currentPassword, newPassword } = req.body;

    const user = await getUserById(userId, true);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
}

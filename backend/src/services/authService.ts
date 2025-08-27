import bcrypt from 'bcrypt';
import { prisma } from '../prisma';

export async function createUser(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err: any = new Error('Email is already registered');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.create({
    data: { email, password: passwordHash, name },
    select: { id: true, email: true, name: true, createdAt: true },
  });
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, createdAt: true },
  });
}

export async function isEmailTaken(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  return !!user;
}

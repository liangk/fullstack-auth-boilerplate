import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'alice@example.com', password: 'Password123!', name: 'Alice' },
    { email: 'bob@example.com', password: 'Password123!', name: 'Bob' },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hashed, name: u.name ?? null },
      create: { email: u.email, password: hashed, name: u.name ?? null },
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});

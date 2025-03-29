import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function resetTestDatabase() {
  
  await prisma.user.deleteMany();

  const users: { id: string; email: string; password: string; role: Role }[] = [];

  for (let i = 0; i < 13; i++) {
    const isAdmin = i < 3;
    const email = isAdmin
      ? `admin${i}@example.com`
      : `user${i}@example.com`;
    const password = 'testpass123';

    const user = await prisma.user.create({
      data: {
        firstName: isAdmin ? `Admin${i}` : `User${i}`,
        lastName: 'Test',
        email,
        passwordHash: await hash(password, 10),
        role: isAdmin ? 'ADMIN' : 'USER',
      },
    });

    users.push({
      id: user.id,
      email: user.email,
      password,
      role: user.role,
    });
  }

  return users;
}

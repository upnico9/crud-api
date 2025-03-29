import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
}) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw new Error('User already exists.');

  const user = await prisma.user.create({ data });
  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function findUsersPaginated(
  page: number,
  limit: number,
  search?: string,
  sortBy: 'firstName' | 'lastName' | 'email' | 'createdAt' = 'createdAt',
  order: 'asc' | 'desc' = 'desc'
) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}


export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
}






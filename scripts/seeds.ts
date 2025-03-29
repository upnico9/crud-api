import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const defaultUser = {
    firstName: 'Nico',
    lastName: 'Origine',
    email: 'nico@example.com',
    password: 'password123',
    role: 'ADMIN' as const,
  };

  const defaultUserCreated = await prisma.user.create({
    data: {
      firstName: defaultUser.firstName,
      lastName: defaultUser.lastName,
      email: defaultUser.email,
      passwordHash: await hash(defaultUser.password, 10),
      role: defaultUser.role,
    },
  });

  const users = [
    {
      id: defaultUserCreated.id,
      email: defaultUserCreated.email,
      password: defaultUser.password,
    },
  ];

  for (let i = 0; i < 20; i++) {
    const isAdmin = i < 3;
    const password = faker.internet.password();
    const email = faker.internet.email().toLowerCase();
    const passwordHash = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email,
        passwordHash,
        role: isAdmin ? 'ADMIN' : 'USER',
      },
    });

    users.push({
      id: user.id,
      email: user.email,
      password,
    });
  }

  const outputPath = path.resolve(__dirname, '../data/users-fixtures.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(users, null, 2));

  console.log('Base de données réinitialisée');
  console.log('Fichier généré : data/users-fixtures.json');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seed :', e);
  })
  .finally(() => prisma.$disconnect());

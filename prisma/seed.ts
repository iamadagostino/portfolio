import 'colors';

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
    },
  });
}

main()
  .then(() => {
    console.info('Seed successful'.green);
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    console.error('Error: Seed failed'.red);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { User } from '@prisma/client';
import { createUser as createDbUser } from '~/.server/models/user.model';
import { faker } from '@faker-js/faker';

/**
 * Create a user specifying the role
 *
 * @param role
 * @returns
 */
const createUser = (role: User['role']) => () =>
  createDbUser({
    email: faker.internet.email(),
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role,
  });

// Create a normal user
export const createNormalUser = createUser('USER');

// Create an admin user
export const createAdminUser = createUser('ADMIN');

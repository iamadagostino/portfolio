import { afterEach, describe, expect, it } from 'vitest';

import { prisma } from '../db';
import { createUser } from '../models/user.model';

describe('Creating users', () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('User is created properly', async () => {
    const user = await createUser({
      email: 'test@test.com',
      username: 'test',
      passwordHash: 'hashedpassword',
      firstName: 'Test',
      lastName: 'User',
      profilePicture: null,
      role: 'USER',
      isActive: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(user).toBeDefined();
  });

  it("User can't be created with an existing email", async ({ integration }) => {
    const user = await integration.createNormalUser();
    await expect(() => createUser({ ...user, username: 'something_unique' })).rejects.toThrow();
  });
});

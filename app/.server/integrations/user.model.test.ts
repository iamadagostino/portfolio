import { afterEach, describe, expect, it } from 'vitest';

import { createUser } from '../models/user.model';
import { prisma } from '../db';

describe('Creating users', () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('User is created properly', async () => {
    const user = await createUser({
      email: 'test@test.com',
      username: 'test',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    });
    expect(user).toBeDefined();
  });

  it("User can't be created with an existing email", async ({ integration }) => {
    const user = await integration.createNormalUser();
    await expect(() =>
      createUser({ ...user, username: 'something_unique' })
    ).rejects.toThrow();
  });
});

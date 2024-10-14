import { User } from '@prisma/client';
import { prisma } from '../db';

export const createUser = (
  // To take everything from the user object except the ID and/or Password fields,
  // we can use the Omit utility type than the following:
  // user: Pick<User, 'email' | 'firstName' | 'lastName' | 'username' | 'role'>
  user: Omit<User, 'id'>
) => {
  return prisma.user.create({
    data: user,
  });
};

import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect, Session } from 'react-router';
import { prisma } from '~/.server/db';

// Create session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__admin_session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'default-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
});

// Session management functions
export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'));
}

export async function commitSession(session: Session) {
  return sessionStorage.commitSession(session);
}

export async function destroySession(session: Session) {
  return sessionStorage.destroySession(session);
}

// Admin authentication functions
export async function createAdminSession(userId: number, redirectTo: string = '/') {
  const session = await sessionStorage.getSession();
  session.set('adminUserId', userId);
  session.set('adminRole', 'ADMIN');
  session.set('adminTimestamp', Date.now());

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export async function getAdminUser(request: Request) {
  const session = await getSession(request);
  const adminUserId = session.get('adminUserId');
  const adminTimestamp = session.get('adminTimestamp');

  if (!adminUserId || !adminTimestamp) {
    return null;
  }

  // Check if session is older than 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  if (adminTimestamp < sevenDaysAgo) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: adminUserId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    // Ensure user still has admin role
    if (!user || user.role !== 'ADMIN') {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function requireAdminUser(request: Request, redirectTo: string = '/') {
  const adminUser = await getAdminUser(request);

  if (!adminUser) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams([['redirectTo', `${url.pathname}${url.search}`]]);
    throw redirect(`${redirectTo}?${searchParams}`);
  }

  return adminUser;
}

export async function logout(request: Request, redirectTo: string = '/') {
  const session = await getSession(request);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}

// Check if user has admin access (for backward compatibility)
export async function isAdmin(request: Request): Promise<boolean> {
  const adminUser = await getAdminUser(request);
  return adminUser !== null;
}

// Admin Section login utility (for development/testing)
export async function adminLogin(email: string, password: string) {
  // Admin login utility
  // - In development (NODE_ENV === 'development') we bypass password verification so
  //   dev helpers and seeded users can login by email only.
  // - In production we verify the provided password against the stored bcrypt hash.

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new Error('Admin user not found or insufficient permissions');
    }

    // Bypass password check in development for convenience
    if (process.env.NODE_ENV !== 'development') {
      const ok = await bcrypt.compare(password, user.passwordHash || '');
      if (!ok) {
        throw new Error('Invalid password');
      }
    }

    // Remove passwordHash before returning user object
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    return safeUser;
  } catch {
    return null;
  }
}

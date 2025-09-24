import { ActionFunctionArgs, createCookieSessionStorage, data } from 'react-router';

export const action = async ({ request, context }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const theme = formData.get('theme');

    // Validate theme value
    if (!theme || (theme !== 'dark' && theme !== 'light')) {
      return data({ error: 'Invalid theme value' }, { status: 400 });
    }

    // Access environment variables with fallback for different context structures
    const contextWithEnv = context as {
      cloudflare?: { env?: { SESSION_SECRET?: string } };
      env?: { SESSION_SECRET?: string };
    };

    const sessionSecret =
      contextWithEnv?.cloudflare?.env?.SESSION_SECRET ||
      contextWithEnv?.env?.SESSION_SECRET ||
      process.env.SESSION_SECRET ||
      'default-session-secret';

    const { getSession, commitSession } = createCookieSessionStorage({
      cookie: {
        name: '__session',
        httpOnly: true,
        maxAge: 604_800,
        path: '/',
        sameSite: 'lax',
        secrets: [sessionSecret],
        secure: process.env.NODE_ENV === 'production',
      },
    });

    const session = await getSession(request.headers.get('Cookie'));
    session.set('theme', theme);

    return data(
      { status: 'success', theme },
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      }
    );
  } catch (error) {
    console.error('Theme setting error:', error);
    return data({ error: 'Failed to set theme' }, { status: 500 });
  }
};

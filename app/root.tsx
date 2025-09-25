// Core
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createCookieSessionStorage,
  Links,
  LinksFunction,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useMatches,
  useNavigation,
  useRouteError,
} from 'react-router';

// Components, Layouts, Services, and Utilities
import clsxLib from 'clsx';
import { useChangeLanguage } from 'remix-i18next/react';
import GothamBook from '~/assets/fonts/gotham-book.woff2';
import GothamMedium from '~/assets/fonts/gotham-medium.woff2';
import { NavbarProvider } from '~/components/navbar-provider';
import { Progress } from '~/components/progress';
import { ThemeProvider, themeStyles } from '~/components/theme-provider';
import { VisuallyHidden } from '~/components/visually-hidden';
import config from '~/config/app.json';
import { Error } from '~/layouts/error';
import { Navbar } from '~/layouts/navbar';

// Styles and Assets
import { returnLanguageIfSupported } from './i18n/i18n.resources';
import styles from './root.module.css';
import i18next from './services/i18n.server';

import 'flag-icons/css/flag-icons.min.css';

import './assets/css/global.module.css';
import './assets/css/reset.module.css';
import './assets/css/tailwind.css';

export const links: LinksFunction = () => [
  {
    rel: 'preload',
    href: GothamMedium,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'preload',
    href: GothamBook,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },

  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'shortcut_icon', href: '/shortcut.png', type: 'image/png', sizes: '64x64' },
  { rel: 'apple-touch-icon', href: '/icon-256.png', sizes: '256x256' },
  { rel: 'author', href: '/humans.txt', type: 'text/plain' },
];

export const loader = async ({ request, context, params }: LoaderFunctionArgs) => {
  const requestUrl = new URL(request.url);
  const { pathname } = requestUrl;
  const pathnameSliced = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  // Check if we're on the root path and need language detection
  const isRootPath = pathname === '/';
  const language = returnLanguageIfSupported(params.lang);
  const detectedLocale = await i18next.getLocale(request);

  // Auto-redirect to detected language if:
  // 1. We're on the root path (/)
  // 2. No language is specified in the URL
  if (isRootPath && !language) {
    const supportedLocale = returnLanguageIfSupported(detectedLocale);
    if (supportedLocale) {
      // Always redirect to the language-specific path
      // For English: redirect to /en, for Italian: redirect to /it
      return new Response(null, {
        status: 302,
        headers: {
          Location: supportedLocale === 'en' ? '/en' : `/${supportedLocale}`,
        },
      });
    } else {
      // If detected language is not supported, default to English
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/en',
        },
      });
    }
  }

  const locale = language ?? detectedLocale;
  const canonicalUrl = `${config.url}${pathnameSliced}`;

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
      secure: true,
    },
  });

  const session = await getSession(request.headers.get('Cookie'));
  const theme = session.get('theme') || 'dark';

  /**
   * Using Response instead of `json` since Remix future-flags uses a single fetch for data requests
   * during client-side navigations. This simplifies data loading by treating data requests
   * the same as document requests, eliminating the need to handle headers and caching differently.
   *
   * https://remix.run/docs/en/main/start/future-flags#v3_singlefetch
   *
   */

  const responseBody = JSON.stringify({ canonicalUrl, theme, locale });

  // Serialize cookies for Cloudflare Session and Locale
  const sessionCookie = await commitSession(session);

  // Create a new Headers instance
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  // Add both cookies to the headers
  headers.append('Set-Cookie', sessionCookie);

  return new Response(responseBody, {
    status: 200,
    headers,
  });
};

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: ['common', 'navbar', 'error'],
};

export default function App() {
  const {
    canonicalUrl,
    theme: initialTheme,
    locale,
  } = useLoaderData<{
    canonicalUrl: string;
    theme: string;
    locale: string;
  }>();
  const fetcher = useFetcher();
  const { state } = useNavigation();
  const { i18n, t } = useTranslation('common');
  const matches = useMatches();
  const isAdminRoute = matches.some((match) => {
    const handle = match.handle as { layout?: string } | undefined;
    return handle?.layout === 'admin';
  });
  const hasLogged = useRef(false);

  let theme = initialTheme;

  if (fetcher.formData?.has('theme')) {
    const fetchedTheme = fetcher.formData.get('theme');
    if (fetchedTheme && typeof fetchedTheme === 'string') {
      theme = fetchedTheme;
    }
  }

  function toggleTheme(newTheme?: string) {
    fetcher.submit(
      { theme: newTheme ? newTheme : theme === 'dark' ? 'light' : 'dark' },
      { action: '/api/set-theme', method: 'post' }
    );
  }

  useEffect(() => {
    if (!hasLogged.current) {
      console.info(`${config.ascii}\n`, `\nFeeling inspired?\nExplore the source code here:\n\n${config.repo}\n`);
      hasLogged.current = true; // Set the flag to prevent future executions
    }
  }, []);

  // This is the hook that allows us to change the language
  useChangeLanguage(locale);

  return (
    <html
      lang={locale}
      dir={i18n.dir()}
      className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Theme color doesn't support oklch so I'm hard coding these hexes for now */}
        {/* Note: theme-color is not supported by Firefox, Firefox for Android, Opera - graceful degradation */}
        <meta name="theme-color" content={theme === 'dark' ? '#111' : '#F2F2F2'} />
        <meta name="color-scheme" content={theme === 'light' ? 'light dark' : 'dark light'} />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
        <link rel="canonical" href={canonicalUrl} />
      </head>
      <body data-theme={theme}>
        <ThemeProvider theme={theme as 'dark' | 'light'} toggleTheme={toggleTheme} className="">
          <Progress />
          <VisuallyHidden showOnFocus as="a" className={styles.skip} href="#main-content">
            {t('skipToMain')}
          </VisuallyHidden>
          <NavbarProvider>
            {!isAdminRoute && <Navbar locale={locale} />}

            <main
              id="main-content"
              className={clsxLib(!isAdminRoute && styles.container)}
              tabIndex={-1}
              data-loading={state === 'loading'}
            >
              <Outlet />
            </main>
          </NavbarProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  // Get the error thrown by the nearest route error boundary
  const error = useRouteError();

  // Get locale from document lang attribute since we can't use useLoaderData in error boundary
  const locale = typeof document !== 'undefined' ? document.documentElement.lang : 'en';

  return (
    <html lang={locale || 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Note: theme-color is not supported by Firefox, Firefox for Android, Opera - graceful degradation */}
        <meta name="theme-color" content="#111" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="dark light" />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
      </head>
      <body data-theme="dark">
        <Error error={error} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

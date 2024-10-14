import '../resources/css/vendors/tailwind.css';
import '../resources/css/app/reset.module.css';
import '../resources/css/app/global.module.css';
import '/node_modules/flag-icons/css/flag-icons.min.css';

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import { LoaderFunctionArgs, createCookieSessionStorage } from '@remix-run/cloudflare';
import { ThemeProvider, themeStyles } from '~/components/theme-provider';
import { useEffect, useRef } from 'react';

import { Error } from '~/layouts/error';
// import GothamBook from '~/assets/fonts/gotham-book.woff2';
// import GothamMedium from '~/assets/fonts/gotham-medium.woff2';
import type { LinksFunction } from '@remix-run/cloudflare'; // or node/deno
import { Navbar } from '~/layouts/navbar';
import { NavbarProvider } from '~/components/navbar-provider';
import { Progress } from '~/components/progress';
import { VisuallyHidden } from '~/components/visually-hidden';
import config from '~/config/app.json';
import i18next from './i18n/i18n.server';
import { returnLanguageIfSupported } from './i18n/i18n.resources';
import styles from './root.module.css'; // Contains Root styles
import { useChangeLanguage } from 'remix-i18next/react';
import { useTranslation } from 'react-i18next';

export const links: LinksFunction = () => [
  // {
  //   rel: 'preload',
  //   href: GothamMedium,
  //   as: 'font',
  //   type: 'font/woff2',
  //   crossOrigin: 'anonymous',
  // },
  // {
  //   rel: 'preload',
  //   href: GothamBook,
  //   as: 'font',
  //   type: 'font/woff2',
  //   crossOrigin: 'anonymous',
  // },

  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'shortcut_icon', href: '/shortcut.png', type: 'image/png', sizes: '64x64' },
  { rel: 'apple-touch-icon', href: '/icon-256.png', sizes: '256x256' },
  { rel: 'author', href: '/humans.txt', type: 'text/plain' },
];

interface CloudflareContext {
  env: {
    SESSION_SECRET: string;
  };
}

export const loader = async ({
  request,
  context,
  params,
}: LoaderFunctionArgs & { context: { cloudflare: CloudflareContext } }) => {
  const { url } = request;
  const { pathname } = new URL(url);
  const pathnameSliced = pathname.endsWith('/') ? pathname.slice(0, -1) : url;
  const canonicalUrl = `${config.url}${pathnameSliced}`;
  const language = returnLanguageIfSupported(params.language);
  const locale = language ?? (await i18next.getLocale(request));

  const { getSession, commitSession } = createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 604_800,
      path: '/',
      sameSite: 'lax',
      secrets: [context.cloudflare.env.SESSION_SECRET || ' '],
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
  i18n: 'common',
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
  const { i18n } = useTranslation();
  const hasLogged = useRef(false);

  let theme = initialTheme;

  if (fetcher.formData?.has('theme')) {
    const fetchedTheme = fetcher.formData.get('theme');
    if (fetchedTheme && typeof fetchedTheme === 'string') {
      theme = fetchedTheme;
    }
  }

  function toggleTheme(newTheme: string) {
    fetcher.submit(
      { theme: newTheme ? newTheme : theme === 'dark' ? 'light' : 'dark' },
      { action: '/api/set-theme', method: 'post' }
    );
  }

  useEffect(() => {
    if (!hasLogged.current) {
      console.info(
        `${config.ascii}\n`,
        `Feeling inspired? Explore the source code here: ${config.repo}\n\n`
      );
      hasLogged.current = true; // Set the flag to prevent future executions
    }
  }, []);

  // This is the hook that allows us to change the language
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Theme color doesn't support oklch so I'm hard coding these hexes for now */}
        <meta name="theme-color" content={theme === 'dark' ? '#111' : '#F2F2F2'} />
        <meta
          name="color-scheme"
          content={theme === 'light' ? 'light dark' : 'dark light'}
        />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
        <link rel="canonical" href={canonicalUrl} />
      </head>
      <body data-theme={theme}>
        <ThemeProvider theme={theme} toggleTheme={toggleTheme} className="">
          <Progress />
          <VisuallyHidden showOnFocus as="a" className={styles.skip} href="#main-content">
            Skip to main content
          </VisuallyHidden>
          <NavbarProvider>
            <Navbar />
          </NavbarProvider>
          <main
            id="main-content"
            className={styles.container}
            tabIndex={-1}
            data-loading={state === 'loading'}
          >
            <Outlet />
          </main>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { locale } = useLoaderData<{
    locale: string;
  }>();
  const { i18n } = useTranslation();

  // This is the hook that allows us to change the language
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111" />
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

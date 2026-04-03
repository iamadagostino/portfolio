import { returnLanguageIfSupported } from '@/i18n/i18n.resources';
import type { LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { DEFAULT_CANONICAL_LANGUAGE, ROUTE_SLUG_MAP } from './config';

/**
 * Development-time catch-all for localized URLs
 * Redirects /it/contatti to /it/contact but preserves language context
 */

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const lang = params.lang;
  const splat = params['*'];

  const language = returnLanguageIfSupported(lang);

  // If language is not supported, only redirect when the user requested the
  // bare language root (e.g. '/fr'). Otherwise return 404 so unknown URLs
  // don't fallback to the homepage.
  if (!language) {
    const pathname = new URL(request.url).pathname;
    const langRoot = `/${lang}`;
    const isLangRoot = pathname === langRoot || pathname === `${langRoot}/`;

    if (isLangRoot) {
      throw redirect('/');
    }

    throw new Response('Not Found', { status: 404 });
  }

  if (!splat) {
    throw new Response('Not Found', { status: 404 });
  }

  const pathSegments = splat.split('/');
  const localizedSlug = pathSegments[0];

  // Find which canonical route this localized slug maps to
  for (const [canonical, translations] of Object.entries(ROUTE_SLUG_MAP)) {
    const translationValues = Object.values(translations);
    if (!translationValues.includes(localizedSlug)) {
      continue;
    }

    // Determine the correct slug for the current language (falls back to canonical language)
    const expectedSlug =
      translations[language as keyof typeof translations] || translations[DEFAULT_CANONICAL_LANGUAGE] || canonical;

    // If we're already on the correct slug for this language, no redirect needed
    if (localizedSlug === expectedSlug) {
      break;
    }

    const remainingPath = pathSegments.slice(1).join('/');
    const redirectPath = `/${language}/${expectedSlug}${remainingPath ? `/${remainingPath}` : ''}`;

    throw redirect(redirectPath);
  }

  throw new Response('Not Found', { status: 404 });
};

export default function LocalizedRouteHandler() {
  return (
    <div>
      <h1>Redirecting...</h1>
      <p>You should be redirected to the correct page.</p>
    </div>
  );
}

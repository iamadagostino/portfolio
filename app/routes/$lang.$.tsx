import type { LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { ROUTE_SLUG_MAP } from './config';
import { returnLanguageIfSupported } from '~/i18n/i18n.resources';

/**
 * Development-time catch-all for localized URLs
 * Redirects /it/contatti to /it/contact but preserves language context
 */

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const lang = params.lang;
  const splat = params['*'];

  const language = returnLanguageIfSupported(lang);

  // If language is not supported, redirect to root
  if (!language) {
    throw redirect('/');
  }

  if (!splat) {
    throw new Response('Not Found', { status: 404 });
  }

  const pathSegments = splat.split('/');
  const localizedSlug = pathSegments[0];

  // Find which canonical route this localized slug maps to
  for (const [canonical, translations] of Object.entries(ROUTE_SLUG_MAP)) {
    if (translations[language as keyof typeof translations] === localizedSlug) {
      // Found the mapping! Redirect to canonical route
      const canonicalSlug = translations.en || canonical;
      const remainingPath = pathSegments.slice(1).join('/');
      const redirectPath = `/${language}/${canonicalSlug}${
        remainingPath ? `/${remainingPath}` : ''
      }`;

      throw redirect(redirectPath);
    }
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

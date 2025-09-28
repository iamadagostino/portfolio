import type { LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { returnLanguageIfSupported } from '~/i18n/i18n.resources';

type LocalizedLoaderArgs = LoaderFunctionArgs & { language: string };
type LoaderReturn = Record<string, unknown> | Response;
type AdditionalLoader = (
  args: LocalizedLoaderArgs
) => Promise<LoaderReturn> | LoaderReturn;

/**
 * Standard loader for localized routes
 * Validates the language parameter and redirects if unsupported
 * Does NOT redirect for URL correction - that's handled by routing
 */
export const createLocalizedLoader = (additionalLoader?: AdditionalLoader) => {
  return async (args: LoaderFunctionArgs): Promise<LoaderReturn> => {
    const { params } = args;
    const language = returnLanguageIfSupported(params.lang);

    // If language is not supported, redirect to root and let it auto-detect
    if (!language) {
      throw redirect('/');
    }

    // No URL correction redirects - the routing system handles the mapping
    // Users should see /it/contatti in address bar, not /it/contact

    // If there's additional loader logic, run it with the validated language
    if (additionalLoader) {
      return additionalLoader({ ...args, language });
    }

    // Default return for simple cases
    return { lang: language };
  };
};

/**
 * Simple localized loader for routes that only need language validation + SEO URL correction
 */
export const localizedLoader = createLocalizedLoader();

/**
 * Creates a meta function that handles locale-specific meta tags for SEO
 */
export const createLocalizedMeta = (baseMeta: Array<Record<string, string>>) => {
  return ({ data }: { data: { lang?: string } }) => {
    const lang = data?.lang || 'en-US';

    return [
      ...baseMeta,
      { property: 'og:locale', content: lang === 'it-IT' ? 'it_IT' : 'en_US' },
      { name: 'language', content: lang },
    ];
  };
};

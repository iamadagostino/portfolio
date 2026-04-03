import type { Language } from '../i18n/i18n.resources';

/**
 * Route slug mappings for different languages
 * This allows /en/articles and /it/articoli to map to the same route
 */
export const DEFAULT_CANONICAL_LANGUAGE: Language = 'en-US';

export const ROUTE_SLUG_MAP: Record<string, Record<Language, string>> = {
  // Articles mapping
  articles: {
    'en-US': 'articles',
    'it-IT': 'articoli',
  },

  // Contact mapping
  contact: {
    'en-US': 'contact',
    'it-IT': 'contatti',
  },

  // Single article mapping
  article: {
    'en-US': 'article',
    'it-IT': 'articolo',
  },

  // Details mapping
  details: {
    'en-US': 'details',
    'it-IT': 'dettagli',
  },

  // Projects mapping
  projects: {
    'en-US': 'projects',
    'it-IT': 'progetti',
  },

  // Admin routes stay the same across locales
  admin: {
    'en-US': 'admin',
    'it-IT': 'admin',
  },

  // Uses stays the same
  uses: {
    'en-US': 'uses',
    'it-IT': 'utilizzi',
  },

  // 3D experience mapping
  '3d-experience': {
    'en-US': '3d-experience',
    'it-IT': 'esperienza-3d',
  },
} as const;

/**
 * Reverse mapping from localized slug to canonical route name
 */
export const CANONICAL_ROUTE_MAP: Record<string, string> = {};
Object.entries(ROUTE_SLUG_MAP).forEach(([canonical, translations]) => {
  Object.values(translations).forEach((localizedSlug) => {
    CANONICAL_ROUTE_MAP[localizedSlug] = canonical;
  });
});

/**
 * Get the localized slug for a canonical route name
 */
export function getLocalizedSlug(canonicalRoute: string, lang: Language): string {
  return ROUTE_SLUG_MAP[canonicalRoute]?.[lang] || canonicalRoute;
}

/**
 * Get the canonical route name from a localized slug
 */
export function getCanonicalRoute(localizedSlug: string): string {
  return CANONICAL_ROUTE_MAP[localizedSlug] || localizedSlug;
}

/**
 * Check if a slug is valid for the given language
 */
export function isValidLocalizedSlug(slug: string, lang: Language): boolean {
  const canonical = getCanonicalRoute(slug);
  const expectedSlug = getLocalizedSlug(canonical, lang);
  return expectedSlug === slug;
}

/**
 * Generate redirect URL ONLY for localized slugs that should redirect to canonical English slugs
 * This is used by the locale-loader to redirect /it/contatti -> /it/contact
 * It should NOT redirect canonical slugs like /it/contact
 */
export function getCorrectLocalizedUrl(pathname: string, targetLang: Language): string | null {
  const pathParts = pathname.split('/').filter(Boolean);

  if (pathParts.length < 2) return null;

  const [, currentSlug, ...rest] = pathParts;

  if (!currentSlug) return null;

  // Get the canonical English slug for this route
  const canonical = getCanonicalRoute(currentSlug);
  const canonicalEnglishSlug = ROUTE_SLUG_MAP[canonical]?.[DEFAULT_CANONICAL_LANGUAGE] || canonical;

  // If we're already on the canonical English slug, no redirect needed
  // Example: /it/contact stays as /it/contact (correct)
  if (currentSlug === canonicalEnglishSlug) {
    return null;
  }

  // We're on a localized slug (like /it/contatti), redirect to canonical English slug
  // Example: /it/contatti -> /it/contact
  const newPath = `/${targetLang}/${canonicalEnglishSlug}${rest.length > 0 ? `/${rest.join('/')}` : ''}`;

  return newPath;
}

/**
 * Utility type for route parameters with locale support
 */
export type LocalizedRouteParams = {
  lang: Language;
  [key: string]: string | undefined;
};

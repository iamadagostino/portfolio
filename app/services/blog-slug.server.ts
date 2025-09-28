import type { Language } from '~/i18n/i18n.resources';
import { getLocalizedPath } from '~/config/routes';

/**
 * Generate locale-aware article URLs
 */
export function generateArticleUrl(
  slug: string,
  language: Language,
  useLocalizedSlug?: string
): string {
  // Get the localized article path (article -> articolo for Italian)
  const articlePath = getLocalizedPath('main', 'article', language);
  
  // Use the localized slug if provided, otherwise use the original slug
  const finalSlug = useLocalizedSlug || slug;
  
  return `/${language}/${articlePath}/${finalSlug}`;
}

/**
 * Get the article slug for a specific language from post data
 */
export function getArticleSlugForLanguage(
  post: { 
    slug: string; 
    translation?: { slug: string | null } | null 
  }
): string {
  // Use the localized slug from translation if available, otherwise fall back to main slug
  return post.translation?.slug || post.slug;
}

/**
 * Generate the correct article URL with locale-aware routing
 */
export function getArticleUrlForLanguage(
  post: { 
    slug: string; 
    translation?: { slug: string | null } | null 
  },
  language: Language
): string {
  const localizedSlug = getArticleSlugForLanguage(post);
  return generateArticleUrl(post.slug, language, localizedSlug);
}

/**
 * Convert between different slug formats for language switching
 */
export function convertSlugForLanguage(
  currentSlug: string,
  fromLanguage: Language,
  toLanguage: Language,
  postData?: { slug: string; translations?: Array<{ locale: string; slug: string | null }> }
): string {
  // If we have post data, use the translation-specific slug
  if (postData?.translations) {
    const targetTranslation = postData.translations.find(t => t.locale === toLanguage);
    
    if (targetTranslation?.slug) {
      return targetTranslation.slug;
    }
  }
  
  // Fallback to the main slug
  return postData?.slug || currentSlug;
}

/**
 * Database query helper to get posts with full locale support
 */
export function getDatabaseLanguageFilter(language: Language) {
  return {
    langEnum: language,
    whereClause: {
      locale: {
        in: language === 'it-IT' ? ['it-IT', 'en-US'] : ['en-US'],
      },
    },
    orderBy: {
      locale: language === 'it-IT' ? 'desc' : 'asc',
    } as const,
  };
}
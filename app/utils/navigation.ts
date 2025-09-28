import { useParams } from 'react-router';
import type { Language } from '~/i18n/i18n.resources';
import { getLocalizedPath } from './route-mapping';

// Hook to get the current language from the URL params
export function useCurrentLanguage(): Language {
  const params = useParams();
  return (params.lang as Language) || 'en-US';
}

// Helper to generate locale-aware URLs
export function createLocalizedPath(routeKey: string, language: Language, slug?: string): string {
  const localizedRoute = getLocalizedPath('main', routeKey, language);
  
  if (slug) {
    return `/${language}/${localizedRoute}/${slug}`;
  }
  
  return `/${language}/${localizedRoute}`;
}

// Hook for navigation that respects current language
export function useLocalizedNavigation() {
  const currentLanguage = useCurrentLanguage();
  
  return {
    getPath: (routeKey: string, slug?: string) => createLocalizedPath(routeKey, currentLanguage, slug),
    currentLanguage,
  };
}

// Static helper for creating paths (useful in loaders/actions)
export function createLocalizedPathStatic(routeKey: string, language: Language, slug?: string): string {
  return createLocalizedPath(routeKey, language, slug);
}
import type { Language } from '~/i18n/i18n.resources';
import { 
  getLocalizedPath as getLocalizedPathFromConfig,
  DOMAIN_ROUTE_MAPPINGS
} from '~/config/routes';

// Get a localized path for a given domain, route key, and language
export function getLocalizedPath(domain: keyof typeof DOMAIN_ROUTE_MAPPINGS['en-US'], routeKey: string, language: Language): string {
  return getLocalizedPathFromConfig(domain, routeKey, language);
}

// Get the route key from a localized path (reverse lookup)
export function getRouteKeyFromPath(localizedPath: string, language: Language): string {
  const languageMappings = DOMAIN_ROUTE_MAPPINGS[language];
  
  for (const [, routes] of Object.entries(languageMappings)) {
    for (const [routeKey, path] of Object.entries(routes)) {
      if (path === localizedPath) {
        return routeKey;
      }
    }
  }
  
  // If not found in the specified language, fallback to English
  if (language !== 'en-US') {
    return getRouteKeyFromPath(localizedPath, 'en-US');
  }
  
  return localizedPath; // Return as-is if no mapping found
}

// Generate all possible route variants for React Router configuration
export function generateRouteVariants(domain: keyof typeof DOMAIN_ROUTE_MAPPINGS['en-US'], routeKey: string, filePath: string): Array<{
  path: string;
  file: string;
  handle: { routeKey: string; language: string; domain: string };
}> {
  const variants: Array<{
    path: string;
    file: string;
    handle: { routeKey: string; language: string; domain: string };
  }> = [];
  
  Object.entries(DOMAIN_ROUTE_MAPPINGS).forEach(([lang, domains]) => {
    const domainMappings = domains[domain];
    const localizedPath = domainMappings?.[routeKey];
    
    if (localizedPath) {
      variants.push({
        path: localizedPath,
        file: filePath,
        // Store metadata about the original route key, language, and domain
        handle: { routeKey, language: lang, domain: domain as string },
      });
    }
  });
  
  return variants;
}
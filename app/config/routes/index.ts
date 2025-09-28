import type { Language } from '~/i18n/i18n.resources';

// Domain-specific route configurations
export interface RouteMapping {
  [routeKey: string]: string;
}

export interface DomainRoutes {
  main: RouteMapping;
  admin: RouteMapping;
  api: RouteMapping;
  '3d-experience': RouteMapping;
}

// Route mappings organized by domain and language
export const DOMAIN_ROUTE_MAPPINGS: Record<Language, DomainRoutes> = {
  'en-US': {
    main: {
      home: 'home',
      articles: 'articles',
      article: 'article',
      contact: 'contact',
      projects: 'projects',
      uses: 'uses',
      details: 'details',
    },
    admin: {
      admin: 'admin',
      dashboard: 'dashboard',
      events: 'events',
      orders: 'orders',
      settings: 'settings',
      debug: 'debug',
    },
    api: {
      'language-switch': 'language-switch',
      'blog-language-switch': 'blog-language-switch',
      'set-theme': 'set-theme',
      'upload-image': 'upload-image',
    },
    '3d-experience': {
      '3d-experience': '3d-experience',
    },
  },
  'it-IT': {
    main: {
      home: 'home', // Or 'casa' if you prefer
      articles: 'articoli',
      article: 'articolo',
      contact: 'contatti',
      projects: 'progetti',
      uses: 'uses', // Or 'utilizzi' if you prefer
      details: 'dettagli',
    },
    admin: {
      admin: 'admin', // Keep admin paths in English for consistency
      dashboard: 'dashboard',
      events: 'eventi',
      orders: 'ordini',
      settings: 'impostazioni',
      debug: 'debug',
    },
    api: {
      // API routes typically stay in English
      'language-switch': 'language-switch',
      'blog-language-switch': 'blog-language-switch',
      'set-theme': 'set-theme',
      'upload-image': 'upload-image',
    },
    '3d-experience': {
      '3d-experience': 'esperienza-3d', // Or keep as '3d-experience'
    },
  },
};

// Helper functions
export function getLocalizedPath(
  domain: keyof DomainRoutes,
  routeKey: string,
  language: Language
): string {
  return DOMAIN_ROUTE_MAPPINGS[language]?.[domain]?.[routeKey] || routeKey;
}

export function getRouteKeyFromPath(
  domain: keyof DomainRoutes,
  localizedPath: string,
  language: Language
): string {
  const domainMappings = DOMAIN_ROUTE_MAPPINGS[language]?.[domain];
  if (!domainMappings) return localizedPath;

  // Find the route key that maps to this localized path
  for (const [key, path] of Object.entries(domainMappings)) {
    if (path === localizedPath) {
      return key;
    }
  }

  return localizedPath;
}

// Legacy compatibility functions (to be used during migration)
export function getLocalizedPathLegacy(routeKey: string, language: Language): string {
  // Try main domain first, then fallback to others
  return getLocalizedPath('main', routeKey, language);
}

export function getRouteKeyFromPathLegacy(localizedPath: string, language: Language): string {
  // Special handling for articles vs article
  if (language === 'it-IT') {
    if (localizedPath === 'articoli') return 'articles';
    if (localizedPath === 'articolo') return 'article';
  }
  
  // Try main domain first
  const mainResult = getRouteKeyFromPath('main', localizedPath, language);
  if (mainResult !== localizedPath) return mainResult;
  
  // Try admin domain
  const adminResult = getRouteKeyFromPath('admin', localizedPath, language);
  if (adminResult !== localizedPath) return adminResult;
  
  return localizedPath;
}
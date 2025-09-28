import { createInstance, type i18n as I18n } from 'i18next';
import Backend from 'i18next-fs-backend';
import { availableNamespaces, defaultLanguage, supportedLanguages, resources, type Language } from '../i18n/i18n.resources';

const defaultNamespace = availableNamespaces.includes('common')
  ? 'common'
  : availableNamespaces[0] ?? 'translation';

// Create a server-side i18n instance
export function createI18nInstance(): I18n {
  const i18nInstance = createInstance();
  
  i18nInstance
    .use(Backend)
    .init({
      supportedLngs: supportedLanguages,
      fallbackLng: defaultLanguage,
      defaultNS: defaultNamespace,
      ns: availableNamespaces,
      resources,
      initImmediate: false, // Don't wait for resources to load
      backend: {
        loadPath: 'app/assets/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
    });
    
  return i18nInstance;
}

// Language detection utilities
export function getLocaleFromRequest(request: Request): string {
  // Check cookie first
  const cookieLocale = getCookieValue(request, 'i18n');
  if (cookieLocale && supportedLanguages.includes(cookieLocale as Language)) {
    return cookieLocale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLocale = parseAcceptLanguage(acceptLanguage);
    if (preferredLocale && supportedLanguages.includes(preferredLocale as Language)) {
      return preferredLocale;
    }
  }

  return defaultLanguage;
}

function getCookieValue(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const match = cookieHeader.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function parseAcceptLanguage(acceptLanguage: string): string | null {
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim())
    .filter(Boolean);

  for (const lang of languages) {
    // Convert common short codes to full locale codes
    let normalizedLang = lang;
    if (lang === 'en') normalizedLang = 'en-US';
    if (lang === 'it') normalizedLang = 'it-IT';
    
    // Try exact match first
    if (supportedLanguages.includes(normalizedLang as Language)) {
      return normalizedLang;
    }
    
    // Try partial match (e.g., 'en-GB' matches 'en-US')
    if (lang.startsWith('en')) {
      const enMatch = supportedLanguages.find(supported => supported.startsWith('en-'));
      if (enMatch) return enMatch;
    }
    if (lang.startsWith('it')) {
      const itMatch = supportedLanguages.find(supported => supported.startsWith('it-'));
      if (itMatch) return itMatch;
    }
  }

  return null;
}

// Simple server-side i18next compatibility object
const i18next = {
  getLocale: getLocaleFromRequest,
  getFixedT: (locale: string, namespace?: string) => {
    const instance = createI18nInstance();
    return instance.getFixedT(locale, namespace);
  },
};

export default i18next;
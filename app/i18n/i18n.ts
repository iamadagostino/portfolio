import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { availableNamespaces, defaultLanguage, resources, supportedLanguages } from './i18n.resources';

const defaultNamespace = availableNamespaces.includes('common') ? 'common' : (availableNamespaces[0] ?? 'translation');

// Initialize i18next for client-side use
const i18n = i18next;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // This is the list of languages your application supports
    supportedLngs: supportedLanguages,
    // Allow loading of non-explicitly supported languages (for partial matches)
    nonExplicitSupportedLngs: false,
    // The language to use when a requested language is not available
    fallbackLng: defaultLanguage,
    // The default namespace i18next uses when none is specified
    defaultNS: defaultNamespace,
    // Load all statically discovered namespaces by default
    ns: availableNamespaces,
    // Use the resources directly (no HTTP loading needed since we have them statically)
    resources,
    // Don't load resources via HTTP since we have them bundled
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Fallback for any missing resources
    },
    // Language detection configuration
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupCookie: 'i18n',
      lookupLocalStorage: 'i18nextLng',
      cookieMinutes: 10080, // 7 days
      convertDetectedLanguage: (lng: string) => {
        // Convert short language codes to full locale codes
        if (lng === 'en') return 'en-US';
        if (lng === 'it') return 'it-IT';
        if (lng.startsWith('en-')) return 'en-US';
        if (lng.startsWith('it-')) return 'it-IT';
        return lng;
      },
    },
    // React-specific options
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },
    // Development options (disable debug to reduce console noise)
    debug: false,
  });

export default i18n;

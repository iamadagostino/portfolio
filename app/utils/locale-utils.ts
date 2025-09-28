import type { Language } from '~/i18n/i18n.resources';

/**
 * Convert full locale code to short language code
 * @param fullLocale - Full locale like 'en-US' or 'it-IT'
 * @returns Short language code like 'en' or 'it'
 */
export function getShortLanguageCode(fullLocale: Language | string): 'en' | 'it' {
  const localeStr = String(fullLocale);
  return localeStr.startsWith('it') ? 'it' : 'en';
}

/**
 * Convert short language code to full locale code
 * @param shortLang - Short language code like 'en' or 'it'
 * @returns Full locale code like 'en-US' or 'it-IT'
 */
export function getFullLocaleCode(shortLang: 'en' | 'it'): Language {
  return shortLang === 'it' ? 'it-IT' : 'en-US';
}

/**
 * Check if a locale code is valid for our supported languages
 * @param locale - Any string that might be a locale
 * @returns True if it's a supported locale format
 */
export function isValidLocale(locale: string): locale is Language {
  return locale === 'en-US' || locale === 'it-IT';
}
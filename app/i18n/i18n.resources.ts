import english from '../../resources/locales/en-US/common.json';
import italian from '../../resources/locales/it-IT/common.json';

// List of supported languages
const languages = ['en', 'it'] as const;

// Export the list of supported languages
export const supportedLanguages = [...languages];

// This function is used to check if a language is supported by the application
export function isSupportedLanguage(lang: string): lang is Language {
  return languages.includes(lang as Language);
}

// Export the Language type
export type Language = (typeof languages)[number];

// Export the Resource type
export type Resource = {
  common: typeof english;
};

// Export the resources object containing all the translations
export const resources: Record<Language, Resource> = {
  en: {
    common: english,
  },
  it: {
    common: italian,
  },
};

export const returnLanguageIfSupported = (lang?: string): Language | undefined => {
  if (supportedLanguages.includes(lang as Language)) {
    return lang as Language;
  }
  return undefined;
};

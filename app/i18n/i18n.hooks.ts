import { useTranslation } from 'react-i18next';
import type { Language, Resource } from './i18n.resources';

// Type-safe translation hooks for different namespaces
export function useCommonTranslation() {
  return useTranslation('common');
}

export function useNavbarTranslation() {
  return useTranslation('navbar');
}

export function useHomeTranslation() {
  return useTranslation('home');
}

export function useArticlesTranslation() {
  return useTranslation('articles');
}

export function useContactTranslation() {
  return useTranslation('contact');
}

export function useProjectsTranslation() {
  return useTranslation('projects');
}

export function useErrorTranslation() {
  return useTranslation('error');
}

// Generic hook with namespace parameter
export function useNamespaceTranslation<T extends keyof Resource>(namespace: T) {
  return useTranslation(namespace);
}

// Helper to get current language
export function useCurrentLanguage(): Language {
  const { i18n } = useTranslation();
  return i18n.language as Language;
}

// Helper to change language
export function useLanguageChanger() {
  const { i18n } = useTranslation();

  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
  };

  return { changeLanguage, currentLanguage: i18n.language as Language };
}

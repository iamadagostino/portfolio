const readEnvValue = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && typeof process.env?.[key] === 'string') {
    return process.env[key];
  }

  const metaEnv =
    typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
      ? (import.meta.env as Record<string, unknown>)
      : undefined;
  if (metaEnv && typeof metaEnv[key] === 'string') {
    return metaEnv[key] as string;
  }

  const maybeGlobalEnv = (globalThis as unknown as { ENV?: unknown }).ENV;
  if (typeof maybeGlobalEnv === 'object' && maybeGlobalEnv !== null) {
    const globalEnv = maybeGlobalEnv as Record<string, unknown>;
    if (typeof globalEnv[key] === 'string') {
      return globalEnv[key] as string;
    }
  }

  return undefined;
};

const AVAILABLE_LANGUAGES = readEnvValue('AVAILABLE_LANGUAGES') ?? readEnvValue('VITE_AVAILABLE_LANGUAGES') ?? 'en-US,it-IT';
const DEFAULT_LANGUAGE = readEnvValue('DEFAULT_LANGUAGE') ?? readEnvValue('VITE_DEFAULT_LANGUAGE') ?? 'en-US';

const languagesFromEnv = AVAILABLE_LANGUAGES.split(',')
  .map((lang) => lang.trim())
  .filter((lang) => lang.length > 0);

if (languagesFromEnv.length === 0) {
  languagesFromEnv.push('en-US');
}

export const supportedLanguages = Object.freeze([...new Set(languagesFromEnv)]);
export type Language = (typeof supportedLanguages)[number];

type NamespaceResource = Record<string, unknown>;
export type Resource = Record<string, NamespaceResource>;
export type Resources = Record<Language, Resource>;

const localeModules = import.meta.glob('../assets/locales/**/*.json', {
  eager: true,
  import: 'default',
});

const matchSupportedLanguage = (value?: string): Language | undefined => {
  if (!value) return undefined;

  const lowerValue = value.toLowerCase();

  for (const language of supportedLanguages) {
    const lowerLanguage = language.toLowerCase();

    if (lowerValue === lowerLanguage || lowerValue.startsWith(`${lowerLanguage}-`)) {
      return language as Language;
    }
  }

  return undefined;
};

const determineNamespace = (segments: string[]): string | undefined => {
  if (segments.length === 0) return undefined;

  if (segments.length === 1) {
    return segments[0].replace(/\.json$/i, '');
  }

  return segments[0];
};

export const resources = supportedLanguages.reduce((accumulator, language) => {
  accumulator[language] = {};
  return accumulator;
}, {} as Resources);

const discoveredNamespaces = new Set<string>();

Object.entries(localeModules).forEach(([path, module]) => {
  const relativePath = path.replace('../assets/locales/', '');
  const segments = relativePath.split('/');

  const languageSegment = segments.shift();
  if (!languageSegment) return;

  const languageKey = matchSupportedLanguage(languageSegment);
  if (!languageKey) return;

  const namespaceSegments = segments;
  const namespace = determineNamespace(namespaceSegments);
  if (!namespace) return;

  const translations = module as NamespaceResource;

  const existingNamespace = resources[languageKey][namespace];
  resources[languageKey][namespace] = existingNamespace ? { ...existingNamespace, ...translations } : translations;

  discoveredNamespaces.add(namespace);
});

const fallbackLanguage = matchSupportedLanguage(DEFAULT_LANGUAGE) ?? supportedLanguages[0] ?? 'en';

const namespaceList = Array.from(discoveredNamespaces);
if (namespaceList.length === 0) {
  namespaceList.push('common');
}

namespaceList.sort();

export const availableNamespaces = Object.freeze(namespaceList);
export const defaultLanguage = fallbackLanguage as Language;

export const returnLanguageIfSupported = (lang?: string): Language | undefined => matchSupportedLanguage(lang);

export const isSupportedLanguage = (lang: string): lang is Language => Boolean(matchSupportedLanguage(lang));

export const returnLanguageIfSupportedOrDefault = (lang?: string): Language =>
  matchSupportedLanguage(lang) ?? defaultLanguage;

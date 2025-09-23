import english from '../assets/locales/en-US/common.json';
import italian from '../assets/locales/it-IT/common.json';
import englishNavbar from '../assets/locales/en-US/navbar.json';
import italianNavbar from '../assets/locales/it-IT/navbar.json';
import englishHome from '../assets/locales/en-US/home.json';
import italianHome from '../assets/locales/it-IT/home.json';
import englishArticles from '../assets/locales/en-US/articles.json';
import italianArticles from '../assets/locales/it-IT/articles.json';
import englishContact from '../assets/locales/en-US/contact.json';
import italianContact from '../assets/locales/it-IT/contact.json';
import englishProjects from '../assets/locales/en-US/projects.json';
import italianProjects from '../assets/locales/it-IT/projects.json';
import englishError from '../assets/locales/en-US/error.json';
import italianError from '../assets/locales/it-IT/error.json';

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
  navbar: typeof englishNavbar;
  home: typeof englishHome;
  articles: typeof englishArticles;
  contact: typeof englishContact;
  projects: typeof englishProjects;
  error: typeof englishError;
};

// Export the resources object containing all the translations
export const resources: Record<Language, Resource> = {
  en: {
    common: english,
    navbar: englishNavbar,
    home: englishHome,
    articles: englishArticles,
    contact: englishContact,
    projects: englishProjects,
    error: englishError,
  },
  it: {
    common: italian,
    navbar: italianNavbar,
    home: italianHome,
    articles: italianArticles,
    contact: italianContact,
    projects: italianProjects,
    error: italianError,
  },
};

export const returnLanguageIfSupported = (lang?: string): Language | undefined => {
  if (supportedLanguages.includes(lang as Language)) {
    return lang as Language;
  }
  return undefined;
};

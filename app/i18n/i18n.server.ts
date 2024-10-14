import Backend from 'i18next-fs-backend';
import { RemixI18Next } from 'remix-i18next/server';
import i18n from '~/i18n/i18n'; // your i18n configuration file
import { resources } from './i18n.resources';
// Add the Public locales route uncommenting the following line:
// import { resolve } from 'node:path';

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18n,
    backend: {
      // Add the Public locales route uncommenting the following line:
      // loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
      // We will use the resources we imported from the i18n.resources.ts file
      resources,
    },
  },
  // The i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
  // E.g. The Backend plugin for loading translations from the file system
  // Tip: You could pass `resources` to the `i18next` configuration and avoid a backend here
  plugins: [Backend],
});

export default i18next;

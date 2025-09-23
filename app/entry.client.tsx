import { I18nextProvider, initReactI18next } from 'react-i18next';
import { StrictMode, startTransition } from 'react';

import { HydratedRouter } from 'react-router/dom';
import { hydrateRoot } from 'react-dom/client';
import i18n from '~/i18n/i18n';
import i18next from 'i18next';
import { resources } from './i18n/i18n.resources';

async function main() {
  // Add error handling and validation for resources
  if (!resources || typeof resources !== 'object') {
    console.error('i18n resources not properly loaded');
    return;
  }

  // Get the language from the HTML lang attribute (set by server)
  const serverLanguage = document.documentElement.lang || 'en';

  // Use fallback namespaces instead of getInitialNamespaces to avoid hydration issues
  const namespaces = [
    'common',
    'navbar',
    'home',
    'articles',
    'contact',
    'projects',
    'error',
  ]; // All available namespaces

  // eslint-disable-next-line import/no-named-as-default-member
  await i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .init({
      ...i18n,
      lng: serverLanguage, // Explicitly use the server-detected language
      fallbackLng: serverLanguage, // Also set fallback to server language
      ns: namespaces,
      // Disable language detection completely on client
      detection: {
        order: [],
        caches: [],
      },
      // Use local resources instead of trying to fetch from server
      resources,
      // Ensure we don't change language on client
      updateMissing: false,
      saveMissing: false,
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      </I18nextProvider>
    );
  });
}

main().catch(error => console.error(error));

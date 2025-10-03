import { startTransition } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import * as i18next from 'i18next';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import i18nConfig from '~/i18n/i18n';
import { availableNamespaces, resources, returnLanguageIfSupportedOrDefault } from './i18n/i18n.resources';

async function main() {
  // Add error handling and validation for resources
  if (!resources || typeof resources !== 'object') {
    console.error('i18n resources not properly loaded');
    return;
  }

  // Get the language from the HTML lang attribute (set by server) and normalize it
  const serverLanguage = returnLanguageIfSupportedOrDefault(document.documentElement.lang);

  // Create a concrete i18n instance so it matches the i18n type expected by react-i18next
  const i18nInstance = i18next.createInstance();

  await i18nInstance
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .init({
      ...i18nConfig,
      lng: serverLanguage, // Explicitly use the server-detected language
      fallbackLng: serverLanguage, // Also set fallback to server language
      ns: availableNamespaces,
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
    // Always hydrate the entire document. The server renders a full HTML document
    // (including <html> and <body>), so hydrating a nested element (like a
    // <div id="root">) can cause invalid nesting (e.g. <html> as a child of
    // a div) and hydration mismatch errors. Use document to match server render.

    hydrateRoot(
      document,
      <I18nextProvider i18n={i18nInstance}>
        <HydratedRouter />
      </I18nextProvider>
    );
  });
}

main().catch((error) => console.error(error));

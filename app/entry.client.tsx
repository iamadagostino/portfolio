import { startTransition } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import * as i18next from 'i18next';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import i18nConfig from '@/i18n/i18n';
import { availableNamespaces, resources, returnLanguageIfSupportedOrDefault } from './i18n/i18n.resources';

// Suppress TensorFlow.js semver validation errors that occur during WebGL context initialization
// When @react-three/fiber creates a Canvas and WebGL context, TensorFlow.js automatically
// detects it and attempts to register as a backend. During this process, it validates the
// WebGL renderer version, but receives an empty string, causing a semver validation error.
// This error is benign and does not affect application functionality.
const originalError = console.error;
console.error = (...args) => {
  const errorMessage = String(args[0]);
  // Suppress only the specific TensorFlow.js semver validation error
  if (errorMessage.includes('Invalid argument not valid semver') && errorMessage.includes("'' received")) {
    return;
  }
  originalError(...args);
};

// Also handle uncaught errors from TensorFlow.js backend detection
window.addEventListener('error', (event) => {
  const errorMessage = String(event.error?.message || '');
  if (errorMessage.includes('Invalid argument not valid semver') && errorMessage.includes("'' received")) {
    // Suppress this benign TensorFlow.js error - it doesn't affect functionality
    event.preventDefault();
  }
});

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

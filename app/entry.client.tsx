import { I18nextProvider, initReactI18next } from 'react-i18next';
import { StrictMode, startTransition } from 'react';

import Fetch from 'i18next-fetch-backend';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { RemixBrowser } from '@remix-run/react';
import { getInitialNamespaces } from 'remix-i18next/client';
import { hydrateRoot } from 'react-dom/client';
import i18n from '~/i18n/i18n';
import i18next from 'i18next';
import { resources } from './i18n/i18n.resources';

async function main() {
  // eslint-disable-next-line import/no-named-as-default-member
  await i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .use(Fetch) // Tell i18next to use the Fetch backend
    .use(I18nextBrowserLanguageDetector) // Setup a client-side language detector
    .init({
      ...i18n,
      ns: getInitialNamespaces(),
      detection: {
        // Here only enable htmlTag detection, we'll detect the language only
        // server-side with remix-i18next, by using the `<html lang>` attribute
        // we can communicate to the client the language detected server-side
        order: ['htmlTag'],
        // Because we only use htmlTag, there's no reason to cache the language
        // on the browser, so we disable it
        caches: [],
      },
      backend: {
        // We will configure the backend to fetch the translations from the
        // resource route /api/locales and pass the lng and ns as search params
        // to the route.
        // Add the API locales route uncommenting the following line:
        // loadPath: '/api/locales?lng={{lng}}&ns={{ns}}',

        // We will use the resources we imported from the i18n.resources.ts file
        resources,
      },
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      </I18nextProvider>
    );
  });
}

main().catch(error => console.error(error));

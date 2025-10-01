import type { LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { returnLanguageIfSupported } from '~/i18n/i18n.resources';
import i18next from '~/services/i18n.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Detect the user's preferred locale and redirect to the localized 404
  // If detection fails, fall back to 'en-US'
  let detected = 'en-US';
  try {
    detected = await i18next.getLocale(request);
  } catch {
    detected = 'en-US';
  }

  const supported = returnLanguageIfSupported(detected) || 'en-US';

  throw redirect(`/${supported}/404`);
};

export default function TopLevel404() {
  // This component will never render since loader always redirects.
  return null;
}

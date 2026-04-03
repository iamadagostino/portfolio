import { returnLanguageIfSupported } from '@/i18n/i18n.resources';
import type { LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const language = returnLanguageIfSupported(params.lang);

  // If language is not supported, redirect to root and let it auto-detect
  if (!language) {
    throw redirect('/');
  }

  // Language is supported, continue with normal rendering
  return { lang: language };
};

// Re-export everything from home
export { Hero as default, handle, meta } from './home/hero';

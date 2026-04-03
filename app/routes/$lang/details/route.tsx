import { redirect } from 'react-router';
import { getLocalizedSectionAnchor } from '@/config/menus/nav-menu';
import { createLocalizedLoader } from '../../locale-loader';

// Redirect /:lang/details to the details section on the home page
export const loader = createLocalizedLoader(({ language, request }) => {
  const url = new URL(request.url);
  const search = url.search;
  const anchor = getLocalizedSectionAnchor('details', language) || 'details';

  return redirect(`/${language}${search}#${anchor}`);
});

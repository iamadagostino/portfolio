import { redirect } from 'react-router';
import { createLocalizedLoader } from '../../locale-loader';

// Redirect /:lang/projects to the projects section on the home page
export const loader = createLocalizedLoader(({ language, request }) => {
  const url = new URL(request.url);
  const search = url.search;

  return redirect(`/${language}${search}#project-1`);
});

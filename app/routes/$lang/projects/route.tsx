import { getLocalizedSectionAnchor } from '@/config/menus/nav-menu';
import { getLocalizedPath } from '@/config/routes';
import { Outlet, redirect } from 'react-router';
import { createLocalizedLoader } from '../../locale-loader';

// Redirect /:lang/projects to the projects section on the home page
// Only redirect if this is the exact /projects path, not nested routes
export const loader = createLocalizedLoader(({ language, request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only redirect if we're at the exact /projects path (not nested routes)
  const projectsSlug = getLocalizedPath('main', 'projects', language);
  const projectsPath = `/${language}/${projectsSlug}`;
  if (pathname === projectsPath || pathname === `${projectsPath}/`) {
    const search = url.search;
    const anchor = getLocalizedSectionAnchor('projects', language);
    return redirect(`/${language}${search}#${anchor}`);
  }

  // For nested routes, return empty data (they handle themselves)
  return {};
});

// Component for nested routes
export default function ProjectsLayout() {
  return <Outlet />;
}

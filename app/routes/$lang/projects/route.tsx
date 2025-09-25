import { Outlet, redirect } from 'react-router';
import { createLocalizedLoader } from '../../locale-loader';

// Redirect /:lang/projects to the projects section on the home page
// Only redirect if this is the exact /projects path, not nested routes
export const loader = createLocalizedLoader(({ language, request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only redirect if we're at the exact /projects path (not nested routes)
  const projectsPath = `/${language}/projects`;
  if (pathname === projectsPath || pathname === `${projectsPath}/`) {
    const search = url.search;
    return redirect(`/${language}${search}#project-1`);
  }

  // For nested routes, return empty data (they handle themselves)
  return {};
});

// Component for nested routes
export default function ProjectsLayout() {
  return <Outlet />;
}

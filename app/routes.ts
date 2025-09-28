import { type RouteConfig } from '@react-router/dev/routes';
import { generateMainRoutes } from './config/routes/main-routes';
import { generateAdminRoutes } from './config/routes/admin-routes';
import { generateApiRoutes } from './config/routes/api-routes';
import { generateExperienceRoutes } from './config/routes/experience-routes';

export default [
  // Root catch-all route for non-localized paths
  {
    id: 'catchall',
    path: '*',
    file: './routes/$lang.$.tsx',
  },

  // Language-prefixed routes
  {
    id: 'lang-layout',
    path: '/:lang',
    file: './layouts/main-layout.tsx',
    children: [
      // Home route
      {
        index: true,
        file: './routes/$lang/_index.tsx',
      },

      // 3D Experience routes
      ...generateExperienceRoutes(),

      // Main application routes (articles, contact, projects, etc.)
      ...generateMainRoutes(),

      // Admin routes
      ...generateAdminRoutes(),
    ],
  },

  // API routes (non-localized)
  ...generateApiRoutes(),
] satisfies RouteConfig;
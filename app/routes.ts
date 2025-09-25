import { type RouteConfig } from '@react-router/dev/routes';
import { remixRoutesOptionAdapter } from '@react-router/remix-routes-option-adapter';
import { ensureRootRouteExists, getRouteIds, getRouteManifest } from 'remix-custom-routes';

import { glob } from 'glob';
import path from 'path';

const routesFunction = async () => {
  const appDirectory = path.resolve(process.cwd(), 'app');
  ensureRootRouteExists(appDirectory);

  // Get all potential route files
  const files = glob.sync('routes/**/*.{js,jsx,ts,tsx,md,mdx}', {
    cwd: appDirectory,
  });

  // Filter out non-route files (components, styles, etc.)
  const routeFiles = files.filter((file) => {
    const fileName = path.basename(file);
    const dirName = path.dirname(file);

    // Always include route files (route.*, _route.*, index.*, _index.*)
    if (
      [
        'route.js',
        'route.jsx',
        'route.ts',
        'route.tsx',
        '_route.js',
        '_route.jsx',
        '_route.ts',
        '_route.tsx',
        'index.js',
        'index.jsx',
        'index.ts',
        'index.tsx',
        '_index.js',
        '_index.jsx',
        '_index.ts',
        '_index.tsx',
      ].includes(fileName)
    ) {
      return true;
    }

    // Include top-level route files (not in subdirectories)
    if (!dirName.includes('/')) {
      return true;
    }

    // Exclude known component files and utility files
    const componentFiles = [
      'armor.jsx',
      'articles.jsx',
      'config.ts', // Utility file, not a route
      'contact.jsx',
      'displacement-sphere.jsx',
      'earth.jsx',
      'home.jsx',
      'intro.jsx',
      'locale-loader.ts', // Utility file, not a route
      'posts.server.js',
      'profile.jsx',
      'project-summary.jsx',
      'slice.jsx',
      'smart-sparrow.jsx',
      'uses.jsx',
      'volkihar-knight.jsx',
      'volkihar-logo.jsx',
    ];

    return !componentFiles.includes(fileName) && !fileName.includes('.module.');
  });

  const rawRouteIds = getRouteIds(routeFiles, {
    indexNames: ['index', 'route', '_index', '_route'],
  });

  // Convert to mutable array for manipulation
  const routeIdArray: [string, string][] = Array.from(rawRouteIds) as unknown as [string, string][];

  const routeIds = routeIdArray.map(([id, filePath]) => {
    // Handle special routes that should not be prefixed with ($lang)
    if (filePath.includes('$lang.$.') || filePath.includes('$lang/_index.')) {
      return [id, filePath];
    }

    // Fix route ID collisions by using more specific IDs for nested routes
    let routeId = id;

    // Handle all admin nested routes properly
    if (filePath.includes('routes/$lang/admin/') && !filePath.endsWith('routes/$lang/admin.tsx')) {
      const adminPath = filePath.split('routes/$lang/admin/')[1];

      if (adminPath.includes('/')) {
        // Handle nested admin routes with subdirectories
        const pathParts = adminPath.split('/');
        if (pathParts.length >= 2 && pathParts[1] === '$id' && pathParts[2] === 'route.tsx') {
          // This is a $id/route.tsx pattern - make the ID more specific
          routeId = `admin.${pathParts[0]}.$id`;
        } else if (pathParts[1] && pathParts[1] !== 'route.tsx') {
          // Other nested patterns
          routeId = `admin.${pathParts[0]}.${pathParts[1].replace('.tsx', '')}`;
        } else {
          // Standard nested route
          routeId = `admin.${pathParts[0]}`;
        }
      } else {
        // Direct admin child route (like debug.tsx)
        const routeName = adminPath.replace('.tsx', '').replace('/route.tsx', '');
        routeId = `admin.${routeName}`;
      }
    }

    // Handle project nested routes properly
    if (filePath.includes('routes/$lang/projects/') && !filePath.endsWith('routes/$lang/projects/route.tsx')) {
      const projectPath = filePath.split('routes/$lang/projects/')[1];

      if (projectPath.includes('/')) {
        // Handle nested project routes with subdirectories
        const pathParts = projectPath.split('/');
        if (pathParts.length >= 2 && (pathParts[1] === 'route.ts' || pathParts[1] === 'route.tsx')) {
          // This is a project/route.ts pattern - make the ID more specific
          routeId = `projects.${pathParts[0]}`;
        } else if (pathParts[1] && !pathParts[1].startsWith('route.')) {
          // Other nested patterns
          routeId = `projects.${pathParts[0]}.${pathParts[1].replace('.ts', '').replace('.tsx', '')}`;
        } else {
          // Standard nested route
          routeId = `projects.${pathParts[0]}`;
        }
      }
    }

    // Prefix all routes with ($lang)
    return [`($lang).${routeId}`, filePath];
  }) as [string, string][];

  return getRouteManifest(routeIds);
};

export default remixRoutesOptionAdapter(routesFunction) satisfies RouteConfig;

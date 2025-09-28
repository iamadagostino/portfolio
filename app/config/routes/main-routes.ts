import { DOMAIN_ROUTE_MAPPINGS } from './index';

interface RouteConfig {
  id?: string;
  path: string;
  file: string;
  children?: RouteConfig[];
}

// Generate main application routes with locale awareness
export function generateMainRoutes(): RouteConfig[] {
  const routes: RouteConfig[] = [];

  // Articles routes - use dynamic matching in the loader instead of separate routes
  routes.push(
    // Articles list - handle both 'articles' and 'articoli' in the loader
    {
      id: 'articles',
      path: 'articles',
      file: './routes/$lang/articles/route.ts',
    },
    {
      id: 'articoli',
      path: 'articoli',
      file: './routes/$lang/articles/route.ts',
    },
    // Single article - handle both 'article' and 'articolo' in the loader
    {
      id: 'article',
      path: 'article/:slug',
      file: './routes/$lang/article.$slug/route.tsx',
    },
    {
      id: 'articolo',
      path: 'articolo/:slug', 
      file: './routes/$lang/article.$slug/route.tsx',
    }
  );

  // Contact routes
  routes.push(
    {
      id: 'contact-en',
      path: DOMAIN_ROUTE_MAPPINGS['en-US'].main.contact, // 'contact'
      file: './routes/$lang/contact/route.ts',
    },
    {
      id: 'contact-it',
      path: DOMAIN_ROUTE_MAPPINGS['it-IT'].main.contact, // 'contatti'
      file: './routes/$lang/contact/route.ts',
    }
  );

  // Projects routes
  routes.push(
    {
      id: 'projects-layout-en',
      path: DOMAIN_ROUTE_MAPPINGS['en-US'].main.projects, // 'projects'
      file: './routes/$lang/projects/route.tsx',
      children: [
        {
          id: 'projects-slice-en',
          path: 'slice',
          file: './routes/$lang/projects/slice/route.ts',
        },
        {
          id: 'projects-smart-sparrow-en',
          path: 'smart-sparrow',
          file: './routes/$lang/projects/smart-sparrow/route.ts',
        },
        {
          id: 'projects-volkihar-knight-en',
          path: 'volkihar-knight',
          file: './routes/$lang/projects/volkihar-knight/route.ts',
        },
      ],
    },
    {
      id: 'projects-layout-it',
      path: DOMAIN_ROUTE_MAPPINGS['it-IT'].main.projects, // 'progetti'
      file: './routes/$lang/projects/route.tsx',
      children: [
        {
          id: 'projects-slice-it',
          path: 'slice',
          file: './routes/$lang/projects/slice/route.ts',
        },
        {
          id: 'projects-smart-sparrow-it',
          path: 'smart-sparrow',
          file: './routes/$lang/projects/smart-sparrow/route.ts',
        },
        {
          id: 'projects-volkihar-knight-it',
          path: 'volkihar-knight',
          file: './routes/$lang/projects/volkihar-knight/route.ts',
        },
      ],
    }
  );

  // Other main routes (non-localized for now)
  routes.push(
    {
      path: 'home',
      file: './routes/$lang/home/route.ts',
    },
    {
      path: 'uses',
      file: './routes/$lang/uses/route.ts',
    },
    {
      path: 'details',
      file: './routes/$lang/details/route.tsx',
    }
  );

  return routes;
}
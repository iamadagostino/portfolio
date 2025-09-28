import { DOMAIN_ROUTE_MAPPINGS } from './index';

// Generate 3D experience routes
export function generateExperienceRoutes() {
  return [
    {
      path: DOMAIN_ROUTE_MAPPINGS['en-US']['3d-experience']['3d-experience'], // '3d-experience'
      file: './routes/$lang/3d-experience/route.tsx',
    },
  ];
}
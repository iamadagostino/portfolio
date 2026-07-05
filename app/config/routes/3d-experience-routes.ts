import { DOMAIN_ROUTE_MAPPINGS } from './index';

// Generate 3D experience routes
export function generateExperienceRoutes() {
  return [
    {
      path: DOMAIN_ROUTE_MAPPINGS['en-US']['3d-experience']['3d-experience'], // '3d-experience'
      file: './routes/$lang/3d-experience/route.tsx',
    },
    {
      path: DOMAIN_ROUTE_MAPPINGS['it-IT']['3d-experience']['3d-experience'], // 'esperienza-3d'
      file: './routes/$lang/esperienza-3d/route.tsx',
    },
    // Room routes
    {
      id: 'room-en',
      path: '3d-experience/room',
      file: './routes/$lang/3d-experience/room/route.tsx',
    },
    {
      id: 'room-it',
      path: 'esperienza-3d/stanza',
      file: './routes/$lang/3d-experience/room/route.tsx',
    },
    // City routes (flying DeLorean experience)
    {
      id: 'city-en',
      path: '3d-experience/city',
      file: './routes/$lang/3d-experience/city/route.tsx',
    },
    {
      id: 'city-it',
      path: 'esperienza-3d/citta',
      file: './routes/$lang/3d-experience/city/route.tsx',
    },
  ];
}

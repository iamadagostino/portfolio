import { DOMAIN_ROUTE_MAPPINGS } from './index';

// Generate admin routes with locale awareness
export function generateAdminRoutes() {
  return [
    {
      id: 'admin-layout',
      path: DOMAIN_ROUTE_MAPPINGS['en-US'].admin.admin, // Keep 'admin' consistent
      file: './routes/$lang/admin.tsx',
      children: [
        {
          path: DOMAIN_ROUTE_MAPPINGS['en-US'].admin.dashboard, // 'dashboard'
          file: './routes/$lang/admin/dashboard/route.tsx',
        },
        {
          path: DOMAIN_ROUTE_MAPPINGS['en-US'].admin.debug, // 'debug'
          file: './routes/$lang/admin/debug/route.tsx',
        },
        {
          path: DOMAIN_ROUTE_MAPPINGS['en-US'].admin.events, // 'events'
          file: './routes/$lang/admin/events/route.tsx',
        },
        {
          path: 'event/:id',
          file: './routes/$lang/admin/event.$id/route.tsx',
        },
        {
          path: DOMAIN_ROUTE_MAPPINGS['en-US'].admin.orders, // 'orders'
          file: './routes/$lang/admin/orders/route.tsx',
        },
        {
          path: 'order/:id',
          file: './routes/$lang/admin/order.$id/route.tsx',
        },
        {
          path: 'order/:id/refund',
          file: './routes/$lang/admin/order.$id/refund.tsx',
        },
        {
          id: 'admin-settings-layout',
          path: DOMAIN_ROUTE_MAPPINGS['en-US'].admin.settings, // 'settings'
          file: './routes/$lang/admin/settings/route.tsx',
          // Admin settings sub-routes
          children: [
            // Settings index (default view)
            {
              index: true,
              file: './routes/$lang/admin/settings/index.tsx',
            },
            // Account
            {
              path: 'account',
              file: './routes/$lang/admin/settings/account/route.tsx',
            },
            // Address
            {
              path: 'address',
              file: './routes/$lang/admin/settings/address.tsx',
            },
          ],
        },
      ],
    },
  ];
}

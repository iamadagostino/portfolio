import type { Config } from '@react-router/dev/config';

export default {
  // SSR configuration
  ssr: true,
  // Opt into React Router v8 behavior early to silence future-flag warnings.
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
} satisfies Config;

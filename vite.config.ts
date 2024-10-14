import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';

import { defineConfig } from 'vite';
import { envOnlyMacros } from 'vite-env-only';
import { installGlobals } from '@remix-run/node';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import rehypeImgSize from 'rehype-img-size';
// import rehypePrism from '@mapbox/rehype-prism';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
// import { remixDevTools } from 'remix-development-tools';
import { routes } from './app/config/routes';
import tailwindcss from '@tailwindcss/vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import tsconfigPaths from 'vite-tsconfig-paths';

const isStorybook = process.argv.some(arg => arg.includes('storybook'));

installGlobals();

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
  build: {
    target: 'es2022', // Use ES2022 for modern environments
    assetsInlineLimit: 1024, // Inline assets below this size
  },
  server: {
    open: true, // Open the development server in the browser
    port: 7777, // Define the development server port
  },
  ssr: {
    noExternal: ['remix-i18next'],
  },
  optimizeDeps: {},
  plugins: [
    tailwindcss(), // Tailwind CSS support
    mdx({
      rehypePlugins: [
        [rehypeImgSize, { dir: 'public' }], // Handle image sizes
        rehypeSlug, // Add slugs to headings
        // rehypePrism, // Syntax highlighting for code blocks
      ],
      remarkPlugins: [
        remarkFrontmatter, // Support for YAML frontmatter
        remarkMdxFrontmatter, // Parse MDX frontmatter
      ],
      providerImportSource: '@mdx-js/react', // Import React provider for MDX
    }),
    remixCloudflareDevProxy(), // Proxy for Remix Cloudflare dev
    isStorybook &&
      react({
        jsxRuntime: 'automatic',
      }), // React Support for Storybook excluding Remix
    !isStorybook &&
      remix({
        ignoredRouteFiles: ['**/*.css'], // Ignore CSS files in route detection
        // routes(defineRoutes) {
        //   return defineRoutes(route => {
        //     route('/', 'routes/home/route.ts', { index: true }); // Define home route
        //     localizedRoutes(); // Define all Localized Routes
        //   });
        // },
        routes,
        future: {
          v3_fetcherPersist: true, // Persist fetcher state
          v3_lazyRouteDiscovery: true, // Enable lazy route discovery
          v3_relativeSplatPath: true, // Use relative splat paths
          v3_singleFetch: true, // Enable single fetch mode
          v3_throwAbortReason: true, // Enable abort reason throwing
        },
      }), // Remix support exclusively for non-Storybook builds
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`,
    }),
    envOnlyMacros(), // Enable environment-only macros
    tsconfigPaths(), // Resolve paths from jsconfig.json
  ],
});

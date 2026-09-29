import { reactRouter } from '@react-router/dev/vite';

import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import rehypeImgSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig, ViteDevServer } from 'vite';
import { envOnlyMacros } from 'vite-env-only';

const isStorybook = process.argv.some((arg) => arg.includes('storybook'));

// Simple plugin to add UTF-8 charset to .txt files
const cloudflareHeaders = () => ({
  name: 'cloudflare-headers',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
      const url = req.url || '';

      // Apply headers for .txt files based on _headers config
      if (url.endsWith('.txt')) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      }

      next();
    });
  },
});

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
  build: {
    assetsInlineLimit: 1024, // Inline assets below this size
  },
  server: {
    open: true, // Open the development server in the browser
    port: 7777, // Define the development server port
  },
  plugins: [
    cloudflareHeaders(), // Apply Cloudflare _headers file during development
    tailwindcss(), // Tailwind CSS support
    mdx({
      rehypePlugins: [
        [rehypeImgSize, { dir: 'public' }], // Handle image sizes
        rehypeSlug, // Add slugs to headings
      ],
      remarkPlugins: [
        remarkFrontmatter, // Support for YAML frontmatter
        remarkMdxFrontmatter, // Parse MDX frontmatter
      ],
      providerImportSource: '@mdx-js/react', // Import React provider for MDX
    }),
    isStorybook &&
      react({
        jsxRuntime: 'automatic',
      }), // React Support for Storybook excluding Remix
    !isStorybook && reactRouter(), // React Router support exclusively for non-Storybook builds
    envOnlyMacros(), // Enable environment-only macros
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './app'),
    },
  },
});

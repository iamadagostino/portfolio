import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.unit.ts'],
    include: ['./app/**/*.test.{ts,tsx}'],
    exclude: ['./app/**/integrations/*.test.{ts,tsx}'],
  },
});

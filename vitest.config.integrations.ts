import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    maxWorkers: 1,
    isolate: false,
    setupFiles: ['./tests/setup.integrations.ts'],
    include: ['./app/**/integrations/*.test.{ts,tsx}'],
  },
});

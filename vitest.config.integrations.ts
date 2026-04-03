import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    maxWorkers: 1,
    isolate: false,
    setupFiles: ['./tests/setup.integrations.ts'],
    include: ['./app/**/integrations/*.test.{ts,tsx}'],
  },
});

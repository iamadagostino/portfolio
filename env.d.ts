/// <reference types="@react-router/node" />
/// <reference types="vite/client" />
/// <reference types="vitest" />

import * as integration from './tests/factory';

declare module 'vitest' {
  export interface TestContext {
    integration: typeof integration;
    request: Request;
  }
}

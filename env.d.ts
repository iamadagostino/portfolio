/// <reference types="@react-router/node" />
/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="@react-three/fiber" />

import * as integration from './tests/factory';

declare module 'vitest' {
  export interface TestContext {
    integration: typeof integration;
    request: Request;
  }
}

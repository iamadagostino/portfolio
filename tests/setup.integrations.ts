import * as integration from './factory';

import { beforeEach } from 'vitest';

beforeEach(ctx => {
  ctx.integration = integration;
  ctx.request = new Request('http://localhost');
});

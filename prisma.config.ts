import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { defineConfig } from 'prisma/config';

// Environment file precedence (lowest -> highest):
// 1. .dev.vars (Cloudflare/auxiliary)
// 2. .env
// 3. .env.production
// 4. .env.development
// 5. .env.local
// process.env (system) has its own precedence and should not be overwritten by files.

const envFilesInOrder = ['.dev.vars', '.env', '.env.production', '.env.development', '.env.local'];

for (const file of envFilesInOrder) {
  if (!existsSync(file)) continue;

  // For higher-priority files we want to allow overriding previously set values.
  // dotenv's `override` option is supported in recent versions.
  const isHighPriority = file === '.env.local' || file === '.env.development' || file === '.env.production';
  try {
    dotenv.config({ path: file, override: isHighPriority });
  } catch {
    // Fall back to non-override load if dotenv version doesn't support override.
    dotenv.config({ path: file });
  }
}

export default defineConfig({
  migrations: {
    // Use the package script that runs the TypeScript seed via `tsx` (defined in package.json as "db:seed").
    // This avoids using the experimental --loader flag and keeps the seed invocation simple and cross-platform.
    seed: 'pnpm run db:seed',
  },
});

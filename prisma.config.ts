import * as dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
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

// Fallback: parse DATABASE_URL directly from .env files if process.env didn't pick it up
// (Prisma CLI may evaluate the config in an isolated context)
function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    const match = readFileSync(file, 'utf-8').match(/^DATABASE_URL\s*=\s*["']?(.+?)["']?\s*$/m);
    if (match) return match[1];
  }
  throw new Error('DATABASE_URL is not set in environment or .env files');
}

export default defineConfig({
  // Database URL for migrations (moved from schema.prisma per Prisma 7 requirements)
  datasource: {
    url: getDatabaseUrl(),
  },
  migrations: {
    // Use the package script that runs the TypeScript seed via `tsx` (defined in package.json as "db:seed").
    // This avoids using the experimental --loader flag and keeps the seed invocation simple and cross-platform.
    seed: 'pnpm run db:seed',
  },
});

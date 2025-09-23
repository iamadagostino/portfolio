import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  migrations: {
    // Use the package script that runs the TypeScript seed via `tsx` (defined in package.json as "db:seed").
    // This avoids using the experimental --loader flag and keeps the seed invocation simple and cross-platform.
    seed: 'pnpm run db:seed',
  },
});

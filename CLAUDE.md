# CLAUDE.md

Personal portfolio site. **React Router v7 (framework mode, SSR) + React 19 + TypeScript 5 + Vite 7**, deployed on Cloudflare Pages.

> ⚠️ The README is stale — it says "Remix 2.17 / Vite 6" and lists scripts that don't exist
> (`dev:storybook`, `db:up`, `deploy`). Trust `package.json`, not the README.

## Commands
- `pnpm dev` — **also runs `docker compose up`** (Postgres 14) then serves on **http://localhost:7777**
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm typecheck` — runs `react-router typegen && tsc` (run typegen after route changes)
- `pnpm lint` — eslint (note: exits 0 even on errors; use `pnpm lint-nc` for a clean run)
- **Tests have no npm script.** Run directly:
  - Unit: `pnpm vitest` (config: `vitest.config.ts`, happy-dom, `app/**/*.test.{ts,tsx}`)
  - Integration: `pnpm vitest --config vitest.config.integrations.ts` (`app/**/integrations/*.test.tsx`, serial)
- DB: `pnpm db:migrate`, `db:seed`, `db:reset`, `db:studio`, `db:generate`

## Architecture
- **Routes are generated programmatically**, not file-based. `app/routes.ts` composes generators in
  `app/config/routes/*.ts` (main, admin, api, 3d-experience). Add/change routes there — dropping a file
  in `app/routes/` does nothing on its own.
- **Localized routing** (`app/routes/config.ts`): `ROUTE_SLUG_MAP` maps canonical routes to per-language
  slugs (`/en/articles` ↔ `/it/articoli`). Localized slugs redirect to the canonical English slug
  (`/it/contatti` → `/it/contact`). Supported languages: en-US, it-IT.
- **Server-only code**: `app/.server/` and `*.server.ts` files (e.g. `app/services/*.server.ts`).
  DB access via Prisma 7 (`@prisma/adapter-pg` + Accelerate) in `app/.server/db.ts`.
- **Path alias**: `@/*` → `./app/*` (tsconfig + vite).
- Blog is MDX-driven and multilingual (`app/services/blog.server.ts`).
- 3D via Three.js / React Three Fiber (`app/components/3d-experience/`).

## Environment
Local dev needs `.env` (see `.env`) and, for Cloudflare/email features, `.dev.vars` (see `.dev.vars.example`):
`DATABASE_URL`, `SESSION_SECRET` (`pnpm key:generate-session-secret`), AWS SES keys, `FROM_EMAIL`.

## Gotchas
- After editing routes or loaders, run `pnpm typecheck` to regenerate `.react-router/types`.
- `postinstall` runs `draco:copy` + `prisma generate` + `patch-package` — patched deps live in `patches/`.
  If you hit `Cannot find module '.prisma/client/default'`, the client wasn't generated: run `pnpm db:generate`.
- **pnpm 11+ ignores the `pnpm` field in `package.json`.** `overrides`, `allowedDeprecatedVersions`, and
  build approvals (`allowBuilds`, formerly `onlyBuiltDependencies`) live in `pnpm-workspace.yaml`.
- Deploy target is Cloudflare Pages (wrangler); Express/Node adapters are also present in deps.

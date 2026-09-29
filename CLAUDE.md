# CLAUDE.md

Personal portfolio site. **React Router v8 (framework mode, SSR) + React 19 + TypeScript 6 + Vite 8 (Rolldown)**, deployed on Cloudflare Pages.

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
- **Version pins on purpose:** TypeScript 6 (typescript-eslint caps `<6.1`), ESLint 9 (react/import/jsx-a11y
  plugins lack ESLint 10 support), Prisma 7 (npm `latest` tag points at 8.0 RC), `@cloudflare/workers-types` 4
  (peer of `@react-router/cloudflare`). `pnpm run update` excludes them (bare `pnpm update` is pnpm's builtin and does not) — keep that list in sync when a pin is lifted.
- `pnpm start` (react-router-serve) does not load `.env`; source it first.

## Releases (ported from auth.parcelabs.com)
- Annotated git tags are the source of truth; `CHANGELOG.md` is generated from them — never hand-edit it.
- `pnpm release` (on clean `master`) derives the bump from conventional commits since the last tag:
  breaking → major, `feat` → minor, `fix`/`security`/`refactor`/`perf`/`chore(deps)` → patch.
  It tags, bumps `package.json`, regenerates the changelog, commits `chore(release): vX.Y.Z`. Then `git push --follow-tags`.
  `--dry-run` previews; `pnpm changelog` regenerates without releasing.
- **Dependency updates are tracked**: commit them as `chore(deps): …` with a body listing what moved,
  what was pinned and why, and code changes the upgrade forced. The body is copied into the changelog verbatim.
- Other `chore`/`docs`/`test`/`style` commits don't trigger a release or appear in the changelog.

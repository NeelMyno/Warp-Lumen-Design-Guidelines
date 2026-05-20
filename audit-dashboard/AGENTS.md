<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent onboarding — audit-dashboard

> [!note]
> This file is the agent contract for the audit-dashboard subdirectory. Read [the root `AGENTS.md`](../AGENTS.md) first — its **20 hard rules** are the system-wide contract. This file adds dashboard-specific operating notes on top.

## What this directory is

The Next.js 16 + React 19 + Tailwind v4 + shadcn surface that exercises every Lumen primitive in dark + light + every mood + every breakpoint. It's the **rendered layer of the design system**. When in doubt about how to compose a Lumen primitive on web, look here first.

## Stack snapshot

- Next.js 16.2.4 + Turbopack, App Router only (no `pages/` directory).
- React 19.2, concurrent features.
- Tailwind v4. **No** `tailwind.config.{js,ts}` — config lives in `src/app/globals.css` via `@theme inline`.
- shadcn primitives at `src/components/ui/` (vendor-grade).
- Lumen wrappers at `src/components/primitives/` (the Lumen-API layer — this is where Lumen-specific chrome + variants live).
- Radix for interactive widgets.
- next/font/local for Satoshi VF (regular + italic, both subset per ADR 0027).
- `experimental.inlineCss: true` for build-time critical-CSS inlining (ADR 0028).

## Where to find things

| Need | Path |
|---|---|
| Route entry | `src/app/{slug}/page.tsx` |
| App layout + fonts | `src/app/layout.tsx` |
| Global CSS + tokens | `src/app/globals.css` (~3300 lines, edit with care) |
| Sticky shell + nav | `src/components/dashboard-shell.tsx` |
| Tab strip | `src/components/tab-nav.tsx` |
| Theme/Mood toggles | `src/components/{theme,mood}-{toggle,switcher}.tsx` |
| Lazy-mount primitive | `src/components/lazy-mount.tsx` (R8c — wrap below-the-fold sections on DOM-heavy routes) |
| Routes catalog | `src/lib/tabs.ts` — adding a route? wire it here for the tab strip |
| Version constant | `src/lib/version.ts` — see root AGENTS.md hard rule 13 |
| Lumen primitives | `src/components/primitives/` — Stat, Card, Button, Field, etc. |
| Shadcn primitives | `src/components/ui/` — vendor + Lumen-rewritten button.tsx, card.tsx, etc. (see lint:no-white-on-accent for the rewritten allowlist) |
| Storybook (scaffold) | `.storybook/` — see "Storybook" section below |

## Commands (DX surface)

```bash
# Install
pnpm install

# Dev server (kill before heavy file-editing — see warning below)
pnpm dev                        # default port 3000

# Production build + start (REQUIRED before Playwright tests)
pnpm build
pnpm start                      # --port 3000 by default

# Type check (strict — no any)
pnpm exec tsc --noEmit

# Lint (run from repo root — 7 rules)
cd ..
pnpm lint

# Playwright (server must be running)
pnpm exec playwright test                              # all tests, both projects
pnpm exec playwright test smoke                        # smoke only
pnpm exec playwright test a11y                         # a11y baseline only
pnpm exec playwright test --project=chromium           # desktop only
pnpm exec playwright test --project=mobile-chrome      # mobile only

# With a foreign server URL
PLAYWRIGHT_BASE_URL=http://localhost:3100 pnpm exec playwright test
```

> [!warning]
> **Do not run `pnpm dev` during heavy file-editing work.** Turbopack + many open files has OOMed kernels on Apple silicon. Boot when actively viewing; kill before batch edits.

## Tests — what's covered

| File | Purpose |
|---|---|
| [`tests/smoke.spec.ts`](tests/smoke.spec.ts) | Every route loads + renders the expected hero heading + `/` redirect + shell renders on every route. 19 tests. |
| [`tests/a11y.spec.ts`](tests/a11y.spec.ts) | a11y baseline per route: focusable elements present, Tab navigation reaches non-body, `lang` attribute set, headings exist. 16 tests + 2 skipped (gated on `@axe-core/playwright` install). |

Both run against the production server (`pnpm start`). Smoke + a11y together = 36 tests + 2 skipped — the v0.14 baseline.

**To enable the axe-core scan**: `pnpm add -D @axe-core/playwright`, then unskip the test block at the bottom of `tests/a11y.spec.ts`. Until then, the wiring sits ready behind `.skip`.

## Storybook (scaffold, not yet wired)

`.storybook/main.ts` + `preview.tsx` are present. One story exists at `src/components/primitives/button.stories.tsx`. There's no `package.json` script yet — to run, invoke directly:

```bash
pnpm exec storybook dev -p 6006
```

This scaffold is a v0.14 starting point — expanding it to cover every primitive is a future round.

## How to add a new route

1. Create `src/app/{slug}/page.tsx` with an exported `metadata` and a default-export `Page` component.
2. Wire the route into `src/lib/tabs.ts` (group: `"system"` or `"platform"`).
3. Add a `ROUTES.md` entry describing purpose, audience, primitives, audit-cycle cross-ref.
4. Add a smoke test entry to `tests/smoke.spec.ts` (add route + expected heading).
5. Build + start + run Playwright to verify.

## How to add a new primitive

1. Read the relevant `design-system/02-components/{name}/component.md` + `component.json` at the repo root — those are the SSoT.
2. Create `src/components/primitives/{name}.tsx`. Token-bound (no hardcoded values per root AGENTS.md hard rule 1).
3. If the primitive needs floating UI — see root AGENTS.md **hard rule 10** (portal to `document.body` from day one; never inline `<div absolute>`).
4. If it has position math (thumbs, swipes, calendar nav) — see hard rule 12 (inline `style.left`, not `translate-x-[Npx]` arbitrary).
5. If it has its own `:focus-visible` rule — outline + box-shadow, never box-shadow alone (hard rule 11).
6. Add a Storybook story under `src/components/primitives/{name}.stories.tsx`.

## Performance posture

- **LCP geo-mean R7 → v0.14: 3030 → 2068 ms** (−31.7%) across 9 routes at Moto G4 4G profile.
- **CLS 0.000** on every route, every theme, every test run — ADR 0010 metric-aligned fallback contract holds.
- Heaviest route: `/foundations` (DOM ~1737 nodes — eligible for LazyMount if it grows further).
- LazyMount budget: wrap below-the-fold sections when DOM > ~1500 nodes / > 30 primitive showcases / > 60 cards. Above-the-fold sections stay eager. Reserve placeholder height for zero CLS. See hard rule 17.

## What's NOT in this dashboard

- Real backend data. Every metric, name, email is a synthetic fixture. Real names were retired in v0.12.5 — see root CLAUDE.md "synthetic names only" rule.
- Auth. `/landing` + `/saas` login surfaces are visual references; they don't authenticate.
- Multi-tenancy. Theme + mood are per-browser local state.

## When in doubt

Read in this order: root [`AGENTS.md`](../AGENTS.md) (system contract, 20 hard rules) → this file → [`README.md`](README.md) (human-flavored stack notes) → [`ROUTES.md`](ROUTES.md) (per-route map) → component-level `component.md` files at the repo root.

# audit-dashboard

> **Lumen's canonical web reference implementation.** The Next.js 16 + React 19 + Tailwind v4 + shadcn surface that exercises every component, every token, every state, every mood, every breakpoint of the design system. The audit dashboard is *the actual design system at the rendered layer* — when in doubt about how to compose Lumen on web, look here first.

## Stack

- **Next.js 16** App Router. (`audit-dashboard/AGENTS.md` notes that Next 16 has breaking changes from older training data — read `node_modules/next/dist/docs/` before assuming an API. Heed deprecation notices.)
- **React 19.2** with concurrent features.
- **Tailwind v4** (no `tailwind.config.js` — config lives in [`src/app/globals.css`](src/app/globals.css) via `@theme`).
- **shadcn/ui** components wrapped in `src/components/ui/` (the shadcn primitives) and `src/components/primitives/` (Lumen wrappers around them — this is where Lumen-specific API + chrome lives).
- **Radix primitives** for every interactive widget.
- **recharts** for production-grade chart rendering (in addition to the pure-SVG Lumen `charts.tsx` showcase set).
- **react-hook-form + zod** for forms.
- **lucide-react** for icons.
- **sonner** for toasts.
- **cmdk** for the ⌘K command palette.

## Run

```bash
# from repo root, or use `pnpm docs:dev` from root which delegates
cd audit-dashboard
pnpm install
pnpm dev               # default port 3000; pass --port 3100 for the audit-cycle default
```

Then open [http://localhost:3000](http://localhost:3000) (or `:3100`).

**Do not run dev server during heavy file-editing work** — Turbopack + many open files has OOMed kernels on Apple silicon. Boot when actively viewing; kill before batch edits.

## Routes

Nine routes — see [`ROUTES.md`](ROUTES.md) for the per-route breakdown of what each demonstrates, who it's for, and which primitives are exercised.

| Route | Purpose |
|---|---|
| [`/`](src/app/page.tsx) | Index / landing redirect to the catalog. |
| [`/foundations`](src/app/foundations/page.tsx) | The system's first principles — color ramps, typography, spacing, motion, micro-interactions, density modes. Read this route to understand the system. |
| [`/library`](src/app/library/page.tsx) | Every primitive in every state. The component gallery — the canonical "is this how a Lumen X is supposed to look?" reference. |
| [`/landing`](src/app/landing/page.tsx) | Marketing template — hero, pricing, FAQ. Tests the marketing-density mood. |
| [`/saas`](src/app/saas/page.tsx) | SaaS app template — sidebar nav, dashboard cards, table, command palette. |
| [`/tool`](src/app/tool/page.tsx) | Operator tool template — dense workflow surface, builder UI, preset panel. |
| [`/commerce`](src/app/commerce/page.tsx) | E-commerce template — PDP with variant pickers, cart drawer, checkout. |
| [`/mobile`](src/app/mobile/page.tsx) | Mobile mockup — iOS phone frame with native chrome (status bar, bottom nav, sheets, swipe actions). |
| [`/desktop`](src/app/desktop/page.tsx) | Native desktop mockup — macOS / Windows window chrome. |

## How the runtime version label works

[`src/lib/version.ts`](src/lib/version.ts) is the **single source of truth** for every user-facing version label rendered in the audit dashboard. Three exports for three rendering contexts:

```ts
import { LUMEN_VERSION, LUMEN_VERSION_MAJOR_MINOR, LUMEN_VERSION_MAJOR_MINOR_UPPER } from "@/lib/version";
// LUMEN_VERSION                  = "v0.13.1"   — patch-level chips (header pill, footer)
// LUMEN_VERSION_MAJOR_MINOR      = "v0.13"     — inline mono-cap references
// LUMEN_VERSION_MAJOR_MINOR_UPPER = "V0.13"    — brand-voice tokens (SYSTEM V0.13 · LIVE)
```

Adding a new version label anywhere in the audit dashboard? **Import from `@/lib/version`, never hardcode the literal.** The release script (`scripts/release.mjs` at repo root) bumps `lib/version.ts` in lockstep with the root `VERSION` file. See AGENTS.md hard rule 13.

## How theme toggling works

The runtime theme attribute lives on `<html>`. Two switches drive it:
- [`theme-toggle.tsx`](src/components/theme-toggle.tsx) — dark / light toggle. Writes `data-theme="dark"|"light"` and the `.dark` class to `<html>`.
- [`mood-switcher.tsx`](src/components/mood-switcher.tsx) — mood selector. Writes `data-mood="..."`.

Tailwind v4 reads both via `@variant` declarations in [`globals.css`](src/app/globals.css). The `.dark` class is the canonical selector for `dark:` variant; `data-theme` exists for symmetry with the iOS / Android / desktop side of the system but the cascade is driven by the class.

## How the responsive safety net works (v0.13.1, ADR 0024)

Every Lumen route relies on this rule in [`globals.css`](src/app/globals.css):

```css
html, body { overflow-x: clip; }
```

Without it, any descendant whose intrinsic min-content exceeds the device viewport (display typography at 128 px, library showcase Cards at ~484 px) silently inflates `window.innerWidth`, and every `sm:` + `md:` Tailwind utility breaks because the matchMedia evaluator reads the inflated viewport, not the device viewport. **`clip`, not `hidden`** — `hidden` establishes a new scroll container and breaks the sticky-header anchor contract. See [ADR 0024](../_meta/decisions/0024-responsive-safety-net-v0131.md) for the full investigation.

## Debugging

| Symptom | Likely cause | Fix |
|---|---|---|
| `.next/types/validator.ts: TS2307 Cannot find module '../../src/app/X/page.js'` | Stale Next.js cache referencing a removed route | `rm -rf .next && pnpm dev` |
| `pnpm dev` won't start, port in use | Previous dev server still running | `lsof -nP -i:3000` then `kill -9 PID` |
| Floating panel (combobox, popover, calendar) clipped by ancestor | Inline `<div absolute>` instead of `createPortal` | See AGENTS.md hard rule 10; portal to `document.body` |
| White text on spring green button (~1.4:1) | Shadcn bridge utility (`bg-primary`) dropped by Tailwind v4 scanner | Use `.lumen-btn-primary` defensive class; see AGENTS.md hard rule 9 |
| `<button role="switch">` announces nameless to screen reader | HTML implicit-label doesn't propagate through Radix host-role override | Pass `aria-label` / `aria-labelledby` prop (v0.13.1 added these to Switch + Checkbox) |
| Mobile viewport reports `innerWidth=509` at 320 px | Layout-viewport inflation by wide descendant | Already fixed by the `overflow-x: clip` root rule; if a new wide element regresses this, add `min-w-0 overflow-hidden` to its grid cell |
| Display typography "Stop re-designing." cuts off at right edge | Intentional — display-2xl ceiling at 128 px IS big enough to crop; that's the visual statement | Not a bug |

## What's NOT in this dashboard

- **Real backend data.** Every metric, every name, every email address is a synthetic fixture. Real names were retired in v0.12.5 — see [AGENTS.md → Privacy](../AGENTS.md) and CLAUDE.md "synthetic names only" rule.
- **Auth.** The login screens on `/landing` and `/saas` are visual references; they don't authenticate.
- **Real e-commerce.** The `/commerce` PDP is a layout demo.
- **Multi-tenancy.** Theme + mood are per-browser local state, not per-user.

## Where to start as a contributor

1. Read the foundations: walk [`/foundations`](http://localhost:3000/foundations) in dark + light at desktop, then walk it at 320 px (use Chrome DevTools device emulation).
2. Read the gallery: walk [`/library`](http://localhost:3000/library) in dark + light. Every Lumen primitive is exercised in at least one state.
3. Read [`../AGENTS.md`](../AGENTS.md) (14 hard rules) + [`../CLAUDE.md`](../CLAUDE.md) (Claude-specific addenda).
4. Read [`../USING-LUMEN.md`](../USING-LUMEN.md) for the unified narrative.
5. Read recent [`.audit-runs/`](../.audit-runs/) reports — they're the live log of "what broke last cycle."

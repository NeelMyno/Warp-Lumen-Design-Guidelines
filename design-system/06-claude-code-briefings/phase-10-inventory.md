# Phase 10 — v0.13.4 Surface-Page Mode Retrofit — Inventory

> Per master doc §10.3 + Phase 10 prompt §"Group A — Inventory the seven surface pages". Stamped 2026-05-17. Executor: Claude (Opus 4.7 1M context). Branch: `v0.13.0`. Operator: Neel.

The inventory below maps each surface page's hero panel, canvas, and glass surface count, plus the current vs. target background token. Total routes: **8** (the prompt's "seven" is shorthand for the preserved set excluding the Phase 6 new routes; `/desktop` is the eighth peer and is included).

## Findings — 8 routes

| Route | Primary file | Hero panel JSX | Canvas / page bg | Glass surfaces | Current bg (token / class) | Target bg (restrained / expressive) | Retrofit path |
|---|---|---|---|---|---|---|---|
| `/foundations` | [page.tsx](../../audit-dashboard/src/app/foundations/page.tsx) | `<div className="lumen-frame-brutalist">` containing `Foundations. Tuned.` H1 + system-at-a-glance row (color anchors, Live indicator, Aa swatch) — lines ~45–86 | parent `<div className="grid gap-12 lg:grid-cols-[1fr_200px]">` (no explicit bg — inherits dashboard chrome canvas) | 0 (no popover / sheet / command palette on this route) | `lumen-frame-brutalist` (border + radius + padding; no `background` set) | restrained: flat obsidian (inherits) · expressive: `mesh.aurora-spring` via `lumen-hero` | **Direct edit** — add `lumen-hero overflow-hidden` to the `.lumen-frame-brutalist` element + insert `.lumen-atmosphere` + `.lumen-noise-overlay` as absolute siblings + wrap inner content in `.relative.z-10`. Frame border + padding preserved verbatim. |
| `/library` | [client.tsx](../../audit-dashboard/src/app/library/client.tsx) | `<PageHeader eyebrow="Component library" title="Library" ...>` (line ~123) | inherits dashboard chrome canvas | 0 directly on hero (component grid has its own hover surfaces but not in the hero) | `<header className="mb-12 md:mb-16">` (no bg) | restrained: flat obsidian (inherits) · expressive: `mesh.aurora-spring` via `lumen-hero` | **PageHeader edit** — cascade via shared component. |
| `/saas` | [page.tsx](../../audit-dashboard/src/app/saas/page.tsx) | `<PageHeader eyebrow="Application surface" title="SaaS Dashboard" ...>` (line ~22) | dashboard mockup body uses `bg-[var(--surface-page)]` + sidebar `bg-[var(--surface-raised)]` — **stays restrained-only per Phase 10 prompt** | 0 in hero (Sidebar + TopBar use solid surface.raised) | `<header className="mb-12 md:mb-16">` (no bg) | restrained: flat obsidian · expressive: mesh | **PageHeader edit only** — dense dashboard mockup below stays restrained per prompt rule. |
| `/landing` | [page.tsx](../../audit-dashboard/src/app/landing/page.tsx) | **TWO hero panels:** (a) `<PageHeader eyebrow="Marketing surface" title="Marketing & Landing" ...>` (line ~19) — page intro; (b) `<section className="relative bg-[var(--surface-canvas)] px-10 pt-24 pb-20 lumen-grid-architectural overflow-hidden">` (line ~33) — the **marketing-page hero** inside browser chrome with `The freight network for builders.` headline | the marketing-page surrounding wrapper at `bg-[var(--surface-page)]` (line ~25) | 0 (Light-mode CTA preview is `surface.inverse`, not glass) | (a) `<header className="mb-12 md:mb-16">` · (b) `bg-[var(--surface-canvas)] + lumen-grid-architectural` | (a + b) restrained: flat obsidian · expressive: `mesh.aurora-spring` | **PageHeader edit** (a) + **direct edit** of the marketing hero (b) — swap `bg-[var(--surface-canvas)]` for `lumen-hero overflow-hidden`, add atmosphere + noise as absolute siblings, KEEP `lumen-grid-architectural` lattice by moving it to an absolute overlay child so it composes on top of the mesh in expressive instead of overriding `background-image`. Per the Phase 10 prompt: "marketing surface is allowed up to three hero panels with mesh treatment, separated by canvas-flat sections" — two hero panels meet that quota. |
| `/tool` | [page.tsx](../../audit-dashboard/src/app/tool/page.tsx) | `<PageHeader eyebrow="Single-purpose surface" title="Web Tool" ...>` (line ~21) | tool dashboard body uses `bg-[var(--surface-page)]` + 3-col layout — **stays restrained-only** | 0 in hero (Title bar + sidebar use surface.raised) | `<header className="mb-12 md:mb-16">` (no bg) | restrained: flat obsidian · expressive: mesh | **PageHeader edit only** — tool dashboard mockup body stays restrained per prompt rule. |
| `/commerce` | [page.tsx](../../audit-dashboard/src/app/commerce/page.tsx) | `<PageHeader eyebrow="Storefront surface" title="Commerce" ...>` (line ~17) | storefront body uses `bg-[var(--surface-page)]` + product cards on `bg-[var(--surface-raised)]` — **stays restrained-only** | 0 in hero | `<header className="mb-12 md:mb-16">` (no bg) | restrained: flat obsidian · expressive: mesh | **PageHeader edit only** — product card grids + checkout flow stay restrained per prompt rule. |
| `/mobile` | [page.tsx](../../audit-dashboard/src/app/mobile/page.tsx) | `<PageHeader eyebrow="Mobile surfaces" title="Mobile" ...>` (line ~16) | device frame mockups (iOS + Android) use hardcoded `#0d0e10` device shell + `var(--surface-page)` screen — **stays as-is** | iOS + Android frame shells are technically "hero device shells" — an allowed glass surface per Phase 1 master-doc spec; not retrofitted | `<header className="mb-12 md:mb-16">` (no bg) | restrained: flat obsidian · expressive: mesh | **PageHeader edit only** — device frames preserved verbatim per prompt rule. |
| `/desktop` | [page.tsx](../../audit-dashboard/src/app/desktop/page.tsx) | `<PageHeader eyebrow="Native desktop" title="Native Desktop" ...>` (line ~16) | macOS + Windows frame mockups use `bg-[var(--surface-page)]` + sidebar with `color-mix` (vibrancy fake) — **stays as-is** | macOS sidebar vibrancy via `color-mix` is the closest thing to glass; not retrofitted per "leave device frame mockups as-is" rule | `<header className="mb-12 md:mb-16">` (no bg) | restrained: flat obsidian · expressive: mesh | **PageHeader edit only** — device frame contents preserved verbatim. |

## Retrofit surface (delta from current state)

| Action | Files changed | Routes affected |
|---|---|---|
| Edit `audit-dashboard/src/components/section.tsx` — `PageHeader` gets `lumen-hero overflow-hidden rounded-[var(--radius-xl)]` + `.lumen-atmosphere` + `.lumen-noise-overlay` overlays + content wrapped in `.relative.z-10` | 1 file | 7 routes (library, saas, landing intro, tool, commerce, mobile, desktop) |
| Edit `audit-dashboard/src/app/foundations/page.tsx` — wrap the `.lumen-frame-brutalist` element with `lumen-hero` composition | 1 file | 1 route (foundations) |
| Edit `audit-dashboard/src/app/landing/page.tsx` — swap marketing hero `<section>` to `lumen-hero` + atmosphere + noise; move architectural grid to absolute overlay child | 1 file | 1 route (landing — the marketing hero inside browser chrome — already covered by PageHeader for the intro) |

**Total file edits: 3.** Surface area covers 8 routes / 9 hero panels (landing has 2).

## Utility classes verified (all present in [`lumen-scoping.css`](../../audit-dashboard/src/app/lumen-scoping.css))

| Class | Behavior in restrained | Behavior in expressive | Defined |
|---|---|---|---|
| `.lumen-hero` | `background: var(--surface-hero)` → flat obsidian (invisible against page canvas) | `background: var(--surface-hero)` → `mesh.aurora-spring` recipe; `animation: var(--motion-atmosphere)` runs `mesh-drift 24s` keyframe | ✓ line 152 |
| `.lumen-atmosphere` | `position: absolute; inset: 0; background: var(--surface-atmosphere)` → transparent (invisible) | `background: rgba(0, 250, 138, 0.08)` → faint 8% Spring Green wash | ✓ line 163 |
| `.lumen-noise-overlay` | `opacity: 0` (invisible) | `opacity: 1` via `[data-mode="expressive"] .lumen-noise-overlay` rule; paints SVG feTurbulence at 8% over the hero bounds | ✓ line 171 + line 183 |
| `prefers-reduced-motion` fallback | n/a | mesh-drift animation freezes (mesh stays at @property initial rest positions) | ✓ line 256 |
| `prefers-reduced-transparency` fallback | n/a | mesh collapses to solid obsidian; noise opacity reset to 0; glass alphas bump ≥ 0.85 | ✓ line 280 |
| `@supports not (backdrop-filter)` fallback | n/a | glass surfaces fall back to opaque fallback color | ✓ line 314 |

**Zero new tokens, zero new components, zero new utility classes — pure consumption retrofit.**

## Out of scope (explicit non-targets — preserved verbatim)

- `/library/registry`, `/tokens`, `/prompts` — Phase 6 new routes; mode-aware-by-design via chrome's `data-mode` attribute already
- `/examples/landing-hero` — the Phase 1 proof-of-concept; already mode-aware verbatim
- iOS/Android device frame mockups in `/mobile` — hero device shells are allowed glass per master-doc Phase 1; preserved
- macOS/Windows frame mockups in `/desktop` — same rationale; preserved
- Component card grid in `/library`, dashboard mockup in `/saas`, tool dashboard in `/tool`, product card grids + checkout in `/commerce` — dense operator surfaces; restrained-only by master-doc principle
- Light-mode preview CTA band in `/landing` (`<section className="bg-[var(--surface-inverse)] ...">`) — explicit "Light mode preview" framing; would conflict with mesh treatment

## Verification approach

After retrofit, three signals confirm success:

1. **Manual** — open `/foundations` in a browser, click the ModeToggle in the chrome utility row. The hero panel transitions from flat obsidian to aurora-spring mesh + Spring Green tint + grain in ≤ 200ms. Verified per route.
2. **Playwright pixel-diff** — `audit-dashboard/tests/mode-toggle-visual.spec.ts` asserts ≥ 5000 changed pixels in the viewport between modes per route. Operator-side execution (Playwright needs `pnpm install` to materialize).
3. **Screenshot pairs** — 16 PNGs (8 routes × 2 modes) at `design-system/06-claude-code-briefings/phase-10-screenshots/`. Operator-side capture via `tools/capture-mode-screenshots.ts` (needs dev server running).

---
adr: 0015
title: shadcn token-bridge fragility in Tailwind v4 — pin direct semantic refs
date: 2026-05-03
status: accepted
supersedes: []
superseded_by: []
related: [0001, 0002, 0003, 0005, 0009, 0012, 0014]
version: 0.8.1
---

# 0015 · shadcn token-bridge fragility in Tailwind v4

## Context

The **v0.4 Obsidian Lime** overhaul set the primary action surface contract:

- `--lumen-accent-4: #4ade80` (lime, brand)
- `--lumen-accent-fg: #0a0a0d` (obsidian-leaning near-black)
- Pair contrast on `#4ade80`: **12.6:1 (AAA)** — well above WCAG AA's 4.5:1 floor.

The **v0.5-alpha shadcn migration** introduced a token bridge in [`audit-dashboard/src/app/globals.css`](../../audit-dashboard/src/app/globals.css) that maps shadcn's expected variable names onto Lumen semantics so installed shadcn primitives wear Lumen colors automatically:

```css
/* :root (dark theme) */
--primary:            var(--lumen-accent-4);
--primary-foreground: var(--text-on-accent);   /* → var(--lumen-accent-fg) → #0a0a0d */

/* @theme inline */
--color-primary:            var(--primary);
--color-primary-foreground: var(--primary-foreground);
```

The shadcn vendor `cva` button variant in [`audit-dashboard/src/components/ui/button.tsx`](../../audit-dashboard/src/components/ui/button.tsx) shipped as:

```tsx
default: "bg-primary text-primary-foreground font-semibold ..."
```

On paper, the chain is sound: `text-primary-foreground` → `color: var(--color-primary-foreground)` → `var(--primary-foreground)` → `var(--text-on-accent)` → `var(--lumen-accent-fg)` → `#0a0a0d`.

**The user reported white text on the lime primary button on 2026-05-03** — a ~1.66:1 contrast WCAG AA fail. Investigation surfaced two things:

1. **Dev-cache fragility.** The `.next/dev/static/chunks/0gke_…globals_css_…single.css` file dated 2026-05-02 had `grep -c 'bg-primary'` = 0 and `grep -c 'primary-foreground'` = 0. The bridge utilities were missing from that compiled chunk. Turbopack's incremental dev cache had drifted from the source.
2. **Prod build is correct.** A fresh `next build` on 2026-05-03 emits both `.bg-primary{background-color:var(--primary)}` and `.text-primary-foreground{color:var(--primary-foreground)}` in the production chunk — and the var chain resolves all the way to `#0a0a0d`. So the ROOT cause of the user's visual bug was almost certainly a stale dev or Vercel cache reading the older chunk, not a bug in the live source.

Both findings argue for the same fix. **The shadcn token bridge is a 3-hop indirection** (`text-primary-foreground` → `var(--primary-foreground)` → `var(--text-on-accent)` → `var(--lumen-accent-fg)`) routed through `@theme inline`. Even when prod compiles it correctly, the dev cycle can drop it; even when both compile it, debugging "why did my AAA contrast pair render as a 1.66:1 contrast pair?" is a multi-step investigation.

**Direct refs (`bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]`) are single-hop, dev-stable, and trivially debuggable.** Tailwind v4's arbitrary-value utilities (the bracket syntax) are guaranteed to compile every time and the var chain is one level deep. The same pinning closes the equivalent risk for `bg-card`, `text-card-foreground`, `bg-popover`, `text-popover-foreground`, `bg-secondary` (Sheet close hover), and the Badge / Progress / Slider primary variants.

## Decision

**Pin direct Lumen semantic refs in vendor primitives.** Replace the shadcn token-bridge utilities with arbitrary-value Tailwind classes that reference the underlying Lumen primitives or aliases directly:

| Surface | Before | After |
|---|---|---|
| Button primary bg + fg | `bg-primary text-primary-foreground` | `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]` |
| Badge primary | `bg-primary text-primary-foreground` | `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]` |
| Progress indicator | `bg-primary` | `bg-[var(--lumen-accent-5)]` |
| Slider range / thumb | `bg-primary / border-primary` | `bg-[var(--lumen-accent-5)] / border-[var(--lumen-accent-4)]` |
| Card | `bg-card text-card-foreground` | `bg-[var(--surface-raised)] text-[var(--text-primary)]` |
| Popover | `bg-popover text-popover-foreground` | `bg-[var(--surface-popover)] text-[var(--text-primary)]` |
| Sheet close hover | `bg-secondary` | `bg-[var(--surface-sunken)]` |
| Button destructive bg | `bg-destructive text-destructive-foreground` | `bg-[var(--lumen-red-5)] text-[#ffffff]` |
| Badge destructive | `bg-[var(--lumen-red-5)] text-white` | `bg-[var(--lumen-red-5)] text-[#ffffff]` (lint normalization) |

Three reinforcing layers of enforcement protect against regression:

1. **Direct refs in vendor primitives** (above). Single-hop variable resolution. Arbitrary-value utilities compile every time.
2. **`AGENTS.md` Hard rule #9** — never white/near-white text on lime; never use shadcn bridge utilities (`bg-primary`, `text-primary-foreground`, etc.) in product code.
3. **Lint rule [`lint:no-white-on-accent`](../../scripts/lint-no-white-on-accent.mjs)** — flags both the bridge utilities and the white-on-lime pairing in `className` strings. Wired into `pnpm lint` main chain. The four rewritten vendor files are explicitly whitelisted in the script's `VENDOR_REWRITTEN` set; new files in `audit-dashboard/src/components/ui/` are NOT exempt and must use direct refs from day one.

A `.lumen-btn-primary` defensive class in `globals.css` ships as a single-class shorthand for any non-Button consumer that needs the same contrast guarantee (raw `<a>` CTAs, templated buttons, custom action surfaces).

## Consequences

### Positive

- **Bug fixed.** Primary buttons render `#0a0a0d` text on `#4ade80` lime — 12.6:1 AAA, exactly what v0.4 specified.
- **Bridge fragility neutralized.** Other surfaces affected by the same Tailwind-v4 quirk (Card, Popover, Sheet close, Slider thumb border) are also pinned; the dashboard renders consistently regardless of build cache state.
- **Forward-compatible with Style Dictionary wiring (v0.9 follow-up).** When `_build/tailwind/theme.css` lands and `--color-action-primary-bg-rest` etc. become real CSS variables, vendor primitives migrate from `--lumen-accent-4` (audit-dashboard internal) to `--color-action-primary-bg-rest` (canonical semantic) with no contract change. The lint rule and AGENTS.md rule still hold.
- **Single source of truth preserved.** The token contract still says `color.action.primary.fg` = `{color.accent.fg}` = `#0a0a0d`; the implementation just doesn't go through the shadcn bridge to reach it.

### Negative

- **`audit-dashboard/src/components/ui/*` is now non-vanilla shadcn.** Future shadcn upstream upgrades require manual reconciliation: the vendor files were rewritten away from upstream's class names. Acceptable cost — shadcn is a copy-paste distribution model; non-vanilla forks are normal.
- **Direct refs to the audit-dashboard's `--lumen-accent-*` palette tie ui/* to that specific palette layer.** Once Style Dictionary's `_build/tailwind/theme.css` is wired, we should re-migrate to the canonical `--color-action-primary-*` semantic refs.

### Tradeoffs not chosen

- **Fix the @theme inline declarations to make Tailwind v4 always emit the bridge utilities.** Tried briefly: declaring `--color-primary` and `--color-primary-foreground` directly in `@theme inline` (without the `var()` indirection through `--primary` / `--primary-foreground`) might generate the utilities reliably, but breaks the dark/light theme switching mechanism (the `:root:not([data-theme])` and `[data-theme="light"]` blocks rely on the indirection). Direct-ref pinning is simpler and removes the dependency entirely.
- **Migrate to a custom CSS layer (`@layer components`) for primary action styling.** Would work but proliferates surfaces beyond Tailwind utility composition, breaking the rest of the codebase's idiom.
- **Wait for a Tailwind v4 patch.** Open-ended; user-visible AA-fail bug; not acceptable to defer.

### Verification gates

All gates green at v0.8.1:
- `pnpm validate:tokens --strict` — 741 tokens, all aliases resolve.
- `pnpm validate:components` — 30/30 schema-valid (Button contract `rules.dont` extended).
- `pnpm validate:contrast` — WCAG AA pairs pass (no token values changed; only utility class wiring).
- `pnpm lint:no-white-on-accent` — 0 violations after rewrites.
- `pnpm lint` (full chain, 5 gates) — clean.
- `tsc --noEmit` (audit-dashboard) — exit 0.
- Fresh `next build` — compiled CSS contains the direct-ref utilities (`.bg-\[var\(--lumen-accent-4\)\]`, `.text-\[var\(--lumen-accent-fg\)\]`).

## Follow-ups for v0.9

- **Wire Style Dictionary's `_build/tailwind/theme.css` build pipeline** (carried from v0.7 ADR 0012 and v0.8 ADR 0014). Generate `--color-action-primary-{bg-rest,bg-hover,bg-press,fg}` etc. from `01-tokens/semantic/color.{light,dark}.tokens.json`. Migrate vendor primitives to those canonical refs.
- **Decide on shadcn bridge retention.** Either:
  - (a) Keep the bridge declarations in `globals.css` for any newly-installed shadcn primitive consumer, knowing they'll silently no-op until we add direct refs in the vendor file, OR
  - (b) Delete the bridge entirely and document that `_meta/prompts/new-component.md` MUST use direct refs for any vendor `cva` variant.
- **Re-introduce a dynamic Tailwind safelist** if Style Dictionary wiring still doesn't surface the bridge utilities in compiled CSS. `tailwind.config.{ts,mjs}` is not used in v4; the equivalent is `@source` directives in CSS.

## Appendix — files touched

```
audit-dashboard/src/app/globals.css                       (+22 lines, .lumen-btn-primary)
audit-dashboard/src/components/ui/button.tsx              (-3 lines, +12 lines)
audit-dashboard/src/components/ui/badge.tsx               (-3 lines, +5 lines)
audit-dashboard/src/components/ui/progress.tsx            (-1 line,  +2 lines)
audit-dashboard/src/components/ui/slider.tsx              (-2 lines, +4 lines)
audit-dashboard/src/components/ui/card.tsx                (-1 line,  +2 lines)
audit-dashboard/src/components/ui/popover.tsx             (-1 line,  +2 lines)
audit-dashboard/src/components/ui/sheet.tsx               (-1 line,  +2 lines)
design-system/02-components/button/component.json         (+2 lines)
design-system/02-components/button/examples/primary.tsx   (+9 lines, comment block)
design-system/00-foundations/accessibility.md             (+13 lines, "Primary action contrast" §)
AGENTS.md                                                 (+5 lines, hard rule #9)
CHANGELOG.md                                              (v0.8.1 entry)
VERSION                                                   (0.8.0 → 0.8.1)
package.json                                              (lint chain extended)
scripts/lint-no-white-on-accent.mjs                       (new, ~150 lines)
_meta/decisions/0015-shadcn-token-bridge-direct-refs-v081.md  (this file)
```

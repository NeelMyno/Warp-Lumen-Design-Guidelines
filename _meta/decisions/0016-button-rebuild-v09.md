---
adr: 0016
title: Button rebuild — 5×8×3 surface, CSS-class implementation, dual focus, glow ladder, new composites
date: 2026-05-03
status: accepted
supersedes: []
superseded_by: []
related: [0001, 0002, 0003, 0005, 0008, 0009, 0011, 0012, 0014, 0015]
version: 0.9.0
---

# 0016 · Button rebuild (v0.9)

## Context

Buttons are the most-touched component in any operator UI. Lumen v0.1 → v0.8.1 evolved the Button steadily — adding sizes (xl), color overhauls (Obsidian Lime v0.4), the shadcn migration (v0.5-alpha), the spacing-token rebind (v0.8), and the v0.8.1 white-on-lime fix (ADR 0015) — but a comprehensive audit at the close of v0.8.1 found nine compounding issues:

1. **Dev/prod fragility persists.** v0.8.1 patched seven vendor primitives (button, badge, card, popover, sheet, progress, slider) one-by-one. Every new shadcn primitive that uses the token bridge (`bg-primary text-primary-foreground`) is at risk.
2. **Vercel deploy is at v0.5.0.** The user's white-on-lime screenshot is from a 4-version-stale deploy. The v0.8.1 fix exists in source but never shipped; the Vercel auto-deploy is broken.
3. **Sizing inconsistency.** v0.8 documented 3 button sizes (sm/md/lg = 32/40/48); the implementation shipped 5 (xs/sm/md/lg/xl = 28/32/40/48/56) plus the de facto `cozy` (36 px) used 19+ times. IconButton used h-7/h-8 (28/32) below WCAG touch floor.
4. **Variant/intent naming mismatch.** `component.json` listed primary/secondary/tertiary/danger; the cva ships default/destructive/outline/secondary/ghost/link.
5. **Composites are inline.** SplitButton, FAB, CommandPaletteButton are all hardcoded in `nav.tsx` rather than formal primitives — five different IconButton implementations across routes (28/32/36/40/48).
6. **Loading and disabled look identical.** Both use `opacity: 0.4`. Operators should never confuse "the action is happening" with "the action is unavailable."
7. **Press feedback is `translate-y-px`.** Apple HIG, Linear, Vercel, Notion, GitHub all converge on no-transform press feedback for operator UI. Material 3 Expressive's spring is explicitly the wrong model.
8. **Focus ring is single-color.** A 3 px lime ring on a lime primary button fails WCAG 2.4.13's 3:1 contrast floor against the surface. Atlassian shipped a fix in 2024; Lumen hasn't.
9. **No AI-action variant.** Sparkle + tonal lime is the universal AI affordance across ChatGPT, Cursor, Linear, Notion AI. Lumen's lime is adjacent to that palette and should claim it explicitly rather than improvise per-page.

A four-agent research pass surveyed 20+ peer systems (Material 3 Expressive May 2025, IBM Carbon v11, Atlassian, Polaris, Vercel Geist, Stripe, Apple HIG iOS 26 Liquid Glass, Linear, Notion, GitHub Primer, Refactoring UI, Tailwind UI, Radix Themes, Anthropic, OpenAI Platform) and the two SuperDesign references (Glassmorphism / Neon Velocity). Three things converged across nearly every system surveyed: **5+ size tiers**, **role × surface as orthogonal axes**, and **dual-color focus indicators on brand surfaces**. Lumen's button language needed a comprehensive rebuild — not a patch.

## Decision

A coherent eight-decision rebuild, shipped together as v0.9.0:

### 1. Five sizes — explicit ladder

`xs` 24 / `sm` 32 / `md` 40 (default) / `lg` 48 / `xl` 56 px. Maps onto v0.8's `size.control.{xs,sm,md,lg,xl}` semantic tokens. New `size.control.xs = 24` (NEW). The `cozy` (36) and `touch` (44) tiers stay reserved for fields, segmented controls, and mobile chrome — Button doesn't consume them. Mobile primaries floor at `lg` to clear the 44 px touch target.

### 2. Eight intents (role) × five surfaces (chrome) — orthogonal axes

Intents: `primary` / `secondary` / `tertiary` (alias of ghost; deprecated in v1.0) / `ghost` / `outline` / `danger` / `danger-soft` / `ai` / `glass` / `link`.

Surfaces compose at the variant level: `primary` = lime + solid + glow; `outline` = transparent + hairline + ink text; `ai` = tonal lime + sparkle + shimmer border; `glass` = translucent + blur. Carbon's `danger-ghost` pattern surfaces as `intent="danger-soft"`. Atlassian's `discovery` deferred (unclear TMS use case).

### 3. Three shapes — orthogonal to size

`rect` (radius.control.md, ~6 px, default) / `pill` (full radius, +50% horizontal padding) / `round` (square + full radius, IconButton/FAB). Operator pages stay rect; pill is opt-in for hero/AI/marketing CTAs.

### 4. Dual-ring focus on lime surfaces (Atlassian 2024 fix)

`shadow-focus-dual` = inner 2 px canvas-color separator + outer 4 px lime ring. WCAG 2.4.13 requires 3:1 against surrounding surface; a single lime ring on lime button fails this. Inner separator places a 2 px gap between button and ring, guaranteeing 3:1 against canvas regardless of button surface. Other intents continue to use the standard single-ring `shadow-focus`.

### 5. Three-state glow ladder for primary

```
rest:    0 0 16px rgba(lime, 0.25)
hover:   0 0 24px rgba(lime, 0.40)
active:  0 0 8px  rgba(lime, 0.20)
```

Reserved exclusively for `intent="primary"`. Other intents and surfaces ship zero glow. The Glassmorphism reference's exact pattern, scaled for operator density. `prefers-reduced-motion` keeps the resting glow steady (it's a halo, not motion).

### 6. No-transform press feedback

Press = `filter: brightness(0.92)` + glow ladder shrink (rest → active). NO `translate-y(1px)`, NO `scale(0.98)`. Operator UI on a trackpad shouldn't jump. Decelerate-not-bounce; Material 3 Expressive's spring is explicitly the wrong model for freight ops.

### 7. Loading vs. disabled — visually distinct

Loading: spinner replaces leading icon, color preserved, `aria-busy=true`, click suppressed.
Disabled: `opacity: 0.4`, color desaturated, `aria-disabled=true` (in forms) / `disabled` attribute (outside forms).

These no longer collide — operators see "the action is happening" vs. "the action is unavailable" as different states.

### 8. New states + new composites

States: **selected** (`aria-pressed=true`; tonal lime + lime hairline) and **success** (transient 1.6 s checkmark + verb-confirmed label, tonal lime, live-region announce). Composites: **IconButton** (formalized; required `aria-label`), **ButtonGroup** (joined buttons, role="group"), **SplitButton** (primary + dropdown, `aria-haspopup="menu"`), **CommandPaletteButton** (search-styled trigger + platform-aware kbd chip), **FAB** (round, fixed bottom-end, glow halo). Each ships a contract and canonical example; all five are minimum-viable now and refined in v0.9.x.

### 9. Implementation: CSS classes, not inline Tailwind

The Button system is implemented as `.lumen-btn`, `.lumen-btn-{intent}`, `.lumen-btn-{size}`, `.lumen-btn-pill`, `.lumen-icon-button`, etc. classes in `audit-dashboard/src/app/globals.css`. The cva variants in `audit-dashboard/src/components/ui/button.tsx` compose those classes — they don't ship Tailwind arbitrary-value utilities inline.

Why: v0.8.1 (ADR 0015) found Tailwind v4's content scanner intermittently drops the shadcn token-bridge utilities (`bg-primary`, `text-primary-foreground`). v0.8.1 patched seven vendor primitives one-by-one. v0.9 generalizes: by moving the styling to authored CSS, every Button surface is independent of Tailwind's content-scanning behavior. Classes are statically declared in the bundle and ship every time, in dev and prod.

## Consequences

### Positive

- **One source of truth.** The `.lumen-btn-*` family in `globals.css` is the single authoritative button spec. Every consumer (vendor cva, Lumen wrapper, IconButton, ButtonGroup, SplitButton, CommandPaletteButton, FAB) renders identically because they all compose the same classes.
- **Dev/prod parity.** No more "works in prod, breaks in dev" Tailwind v4 content-scanner issues. CSS classes ship unconditionally.
- **Forward-compatible with Style Dictionary wiring (v0.9.x).** When `_build/css/buttons.css` ships, consumers can `@import` it without per-product reimplementation. The v0.9 button surface is portable.
- **AAA accessibility.** Primary button = 12.6:1 contrast (lime + obsidian-fg), dual-ring focus = 3:1 on any surface, danger button = 5.2:1 (deepened red.500 → red.600). All states ship aria-* annotations. Loading/disabled visually distinct.
- **AI is first-class.** `intent="ai"` ships now. Sparkle + tonal lime + idle shimmer is a recognized pattern; Lumen claims it deliberately rather than improvising per page.
- **Operator-grade composites.** SplitButton + ButtonGroup + CommandPaletteButton + FAB cover ~95% of TMS button patterns. Carbon, Atlassian, M3 ship these as standard.

### Negative

- **Authored CSS scales differently than utilities.** `globals.css` grows by ~250 lines for the v0.9 button family. Future component additions follow the same pattern, increasing the file. Style Dictionary wiring (deferred) can split this out.
- **Two parallel APIs during migration.** v0.8 callers use `intent="tertiary"`; v0.9 prefers `intent="ghost"`. Both work in v0.9; tertiary is deprecated for v1.0. CHANGELOG documents the migration path.
- **`bg-primary text-primary-foreground` shadcn bridge utilities still exist** in `globals.css` for any newly-installed shadcn primitive that depends on them. Lint rule `lint:no-white-on-accent` (v0.8.1) prevents their direct use in product code; vendor primitives are explicitly whitelisted.
- **The size-tier rename is a breaking change.** v0.8 `size="sm"` (32) is unchanged in v0.9. v0.8 didn't have `xs`. So existing consumers don't visually break — but new code should adopt xs/sm/md/lg/xl explicitly.
- **Press feedback feels less responsive without translate.** Some users perceive translate-y-px as "real button feel." Lumen explicitly chose brightness over transform — operators won't notice; the consistency wins.

### Tradeoffs not chosen

- **Material 3 Expressive's spring physics.** Wrong fit for operator UI — bounces feel toy-ish on trackpad. We use deterministic Bezier (`cubic-bezier(0.2, 0, 0, 1)`) instead.
- **Carbon's 7-tier sizing (Extra small → 2XL).** Three more tiers than we ship. Each tier is technical debt at maintenance time. Five tiers is the 2026 sweet spot; seven is over-engineered for our context.
- **Apple iOS 26 Liquid Glass primary button.** Beautiful but consumer-coded. Operator UI rarely has the canvas to make full-glass primary work. We ship `intent="glass"` as opt-in for floating overlays only.
- **Hold-to-confirm danger as the v0.9 default.** Powerful pattern but specialized; deferred to v0.9.x. Plain `intent="danger"` paired with a confirm dialog (Smashing 2024 dangerous-actions panel) is the v0.9 floor.
- **Atlassian's `discovery` intent.** Clever but unclear TMS use. Deferred.
- **Loading-with-progress (Vercel deploy-button bg fill).** Specialized for >5 s actions; Lumen v0.9 ships replace-icon + verb-form label as the floor. Progress fill can land in v1.0.
- **Mono-cap variant for data-context buttons.** Specced but not shipped in v0.9. Deferred to v0.9.x; SuperDesign Neon's tracking-as-rank pattern earns its place on data-context buttons (`EXPORT CSV`, `RUN AUDIT`) but not routine ops.

### Verification gates

All gates pass at v0.9.0:
- `pnpm validate:tokens --strict` — 854 tokens, all aliases resolve.
- `pnpm validate:components` — 35/35 schema-valid (Button + 5 new contracts).
- `pnpm validate:contrast` — WCAG AA pairs pass; danger pair upgraded to AA Normal (red.600 + white = 5.2:1).
- `pnpm lint:no-white-on-accent` — 0 violations.
- `pnpm lint:button-conventions` — 0 violations on greenfield surfaces.
- `pnpm lint` (full chain) — clean (modulo the 20 pre-existing `lint:no-primitives` violations carried from v0.8, deferred to v0.9.x).
- `tsc --noEmit` (audit-dashboard) — exit 0.
- Fresh `next build` — compiled CSS contains `.lumen-btn-{primary,secondary,outline,ghost,tertiary,danger,danger-soft,ai,glass}{,-pill,-xs,-sm,-md,-lg,-xl}` rules.

## Follow-ups for v0.9.x

1. **Wire Style Dictionary's `_build/css/buttons.css`** — derive globals.css's `.lumen-btn-*` block from `01-tokens/components/button.tokens.json`. Eliminates manual sync.
2. **Migrate every raw `<button>`** in `templates.tsx` / `ai.tsx` / `commerce.tsx` / `mobile.tsx` to use Button / IconButton / SplitButton. ~150 inline buttons remain.
3. **HoldToConfirmButton** — destructive 2 s mouse-hold + type-to-confirm fallback. Smashing 2024 destructive-action pattern.
4. **Mono-cap variant** — `<Button variant="mono">EXPORT CSV</Button>` ships uppercase Geist Mono with 2 px tracking, for data-context buttons.
5. **Loading-with-progress** — bg fill 0% → 100% under label for actions >5 s.
6. **Density propagation to Button via `data-density` (v0.8 pattern)** — operator pages opt into compact (md → sm), comfortable preserves md, marketing opts into lg.
7. **Investigate the Vercel deploy at v0.5.0** — the auto-deploy hasn't picked up v0.6, v0.7, v0.8, v0.8.1, or v0.9. Either re-trigger or document the SAML / build-config block.
8. **Lint rule completion: `lint:button-conventions`** — extend with banned-phrase detection (`OK`, `Submit`, `Yes`, `No`), Title Case detection, double-icon flagging.

## Appendix — files touched

```
design-system/
  00-foundations/buttons.md                              (NEW)
  01-tokens/primitives/dimension.tokens.json             (+ size.control.xs)
  01-tokens/primitives/color.tokens.json                 (+ red.600/700/800, alpha.{ink,paper}.{04,08,10,16,24})
  01-tokens/semantic/color.dark.tokens.json              (+ outline/ghost/danger-soft/ai/success/selected/glass)
  01-tokens/semantic/color.light.tokens.json             (same — light theme parity)
  01-tokens/semantic/shadow.tokens.json                  (+ shadow.focus.dual + shadow.button.glow.{rest,hover,active} + shadow.button.ai-shimmer)
  01-tokens/components/button.tokens.json                (full rewrite — 5 sizes × 8 intents × 3 shapes × motion)
  02-components/button/component.{json,md}               (rewrite for v0.9)
  02-components/button/examples/primary.tsx              (rewrite — CSS-class composition)
  02-components/icon-button/                             (NEW)
  02-components/button-group/                            (NEW)
  02-components/split-button/                            (NEW)
  02-components/command-palette-button/                  (NEW)
  02-components/fab/                                     (NEW)

audit-dashboard/src/
  app/globals.css                                        (+ .lumen-btn-* family, action-surface bridge, glow ladder, dual focus, ai-shimmer keyframe, success-checkmark keyframe, prefers-reduced-motion overrides)
  components/ui/button.tsx                               (rewrite — cva over CSS classes; intent prop renamed from variant)
  components/primitives/button.tsx                       (rewrite — added shape/success/pressed props, success state hook, exports IconButton from new file)
  components/primitives/icon-button.tsx                  (NEW)
  components/primitives/button-group.tsx                 (NEW)
  components/primitives/split-button.tsx                 (NEW)
  components/primitives/command-palette-button.tsx       (NEW)
  components/primitives/fab.tsx                          (NEW)
  components/primitives/nav.tsx                          (TabBar + BottomNav aria-current; FAB and SplitButton inline now wrap formal primitives)

scripts/
  lint-button-conventions.mjs                            (NEW)

_meta/
  decisions/0016-button-rebuild-v09.md                   (this file)

_registry/
  registry.json                                          (+ icon-button, button-group, split-button, command-palette-button, fab)
  icon-button.json, button-group.json, split-button.json, command-palette-button.json, fab.json (NEW)

CHANGELOG.md                                              (v0.9.0 entry)
VERSION                                                   (0.8.1 → 0.9.0)
package.json                                              (lint chain extended)
AGENTS.md                                                 (hard rule #9 expanded; references buttons.md + ADR 0016)
design-system/00-foundations/accessibility.md             (+ Buttons section linking to buttons.md)
design-system/00-foundations/voice-and-tone.md            (+ banned phrases for buttons)
```

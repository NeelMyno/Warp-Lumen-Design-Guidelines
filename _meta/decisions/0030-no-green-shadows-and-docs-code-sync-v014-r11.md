# ADR 0030 — Green retired from every shadow + docs↔code sync mandate (v0.14 R11)

**Status.** Accepted.
**Date.** 2026-05-20.
**Authors.** Neel Tengariya (mandate); Claude Opus 4.7 (implementation).
**Supersedes.** R10's categorical split between "elevation shadows (neutral)" and "halo/glow shadows (accent)" — codified in [ADR 0029 v0.14 omnibus](0029-v014-omnibus-systemic-gap-closure.md) §17–18 and AGENTS.md hard rule 20 (pre-R11).
**Cascades from.** [ADR 0016 v0.9 button rebuild](0016-button-rebuild-v09.md) (the glow ladder), [ADR 0018 v0.11 Premium Psychology recolor](0018-premium-psychology-recolor.md) (the brand-defining green halo), [ADR 0021 v0.12.1 card corner-clip contract](0021-card-corner-clip-contract-v0121.md), [ADR 0022 v0.12.2 hover-glow retune](0022-hover-glow-ladder-retune-v0122.md).

## Context

The earlier R10 ship (ADR 0029) carved Lumen `box-shadow` tokens into two categorical kinds:

1. **Elevation shadows** — `shadow.xs / sm / md / lg / xl / 2xl / inset / popover / menu / modal / toast / floating / lifted / card / kbd` — colors NEUTRAL (`color.alpha.shadow.04..10`).
2. **Halo / glow shadows** — `shadow.focus`, `shadow.focus.dual.*`, `shadow.accent-glow`, `shadow.glow.accent`, `shadow.button.glow.{rest,hover,active}`, `shadow.button.ai-shimmer`, `shadow.input.focus`, `shadow.input.success` — colors ACCENT (spring green alpha at various opacities).

R10 added `lint:elevation-no-accent` to enforce category 1; category 2 was DESIGNED to be green by the brand contract per ADR 0016 + ADR 0018 — the lime halo under primary CTAs has been "Warp's signature" since v0.4.

The user reviewed R10's foundations Elevation showcase, the live command palette focus ring, and the live primary CTA halo, and explicitly rejected the R10 carve-out: **green should NEVER appear in any shadow color value, in the dashboard, in the foundations docs, or in the live token system.** The R10 categorical split — where elevation was neutral but halo/glow was accent — was the wrong abstraction. The rule should be flat: **all shadows are neutral; the accent appears in backgrounds, borders, text, leading dots, and atmospheric gradients only.**

## Decision

### Part A — Retire green from every `box-shadow` color value

1. **Global `:focus-visible`** outline color changes from `var(--lumen-lime-a64)` to `var(--border-frame)` (40 %-alpha theme-aware paper/ink). Box-shadow halo (`--shadow-focus`) changes from `var(--lumen-lime-a32)` to `var(--border-frame)` (dark mode) / `var(--lumen-ink-a08)` (light mode).
2. **`--shadow-focus-dual`** outer ring changes from `var(--lumen-accent-4)` (full-saturation spring green) to `var(--border-frame)`. Inner 2 px canvas-colored separator preserved (Atlassian 2024 pattern stays — it guarantees 3:1 on green-bg buttons).
3. **`--shadow-glow-accent`** — was `0 14px 40px -8px var(--lumen-lime-a40)`. Now `var(--shadow-lg)`. Token name preserved for backwards-compat; the value aliases the neutral elevation tier.
4. **`--shadow-glow-accent-strong`** — was a 3-layer lime composition. Now `var(--shadow-xl)`. Same rationale.
5. **`--shadow-button-glow-rest`** — was `0 0 16px var(--lumen-lime-a25)`. Now `none`. Primary CTAs no longer cast a green halo at rest.
6. **`--shadow-button-glow-hover`** — was `0 0 20px var(--lumen-lime-a28)`. Now `var(--shadow-md)` (neutral elevation lift). Hover still feels different from rest; the difference is now lift, not glow.
7. **`--shadow-button-glow-active`** — was `0 0 8px var(--lumen-lime-a20)`. Now `none`. Press feedback comes from `filter: brightness(0.92)` (unchanged) + bg-color shift (unchanged), not from shadow.
8. **`--shadow-button-ai-shimmer`** — was `0 0 0 1px var(--lumen-lime-a32)`. Now `0 0 0 1px var(--border-frame)`. The animation keyframe also retuned to cycle between `--border-frame` and `--border-strong` with a neutral paper-alpha peak halo (was lime alpha-64 + lime alpha-18 layered).
9. **`--shadow-input-focus`** + **`--shadow-input-success`** — were lime alpha-32. Now `var(--border-frame)`. Error halo (`--shadow-input-error`) keeps red — validation tones are exempt per the carve-out below.
10. **`.lumen-cmd-row[data-active]`** inset box-shadow — was `var(--lumen-lime-a32)`. Now `var(--border-frame)`. The background-tint stays green (it's a background, not a shadow).
11. **`.lumen-mark-link:hover` ring/core box-shadows** — were lime alpha-18/a64/a32. Now paper-alpha 08/16/08 + `filter: brightness(1.05)` on hover (replaces the colored-shadow lift).
12. **Slider thumb** `hover:ring` + `focus-visible:ring` colors changed from `lumen-lime-a14/a32` to `border-frame` (both states).
13. **@media (hover: hover) layered halos** on primary buttons retired — the layered lime atmosphere (3 box-shadow stops) is gone; primary hover now ships `var(--shadow-button-glow-hover)` alone (which itself is `shadow.md`).
14. **`@keyframes lumen-btn-ai-shimmer`** — the animation cycle pulses between `border-frame` and `border-strong` instead of between lime alphas.
15. **DTCG sources** (`01-tokens/primitives/shadow.tokens.json` + `01-tokens/semantic/shadow.tokens.json` + `01-tokens/components/button.tokens.json`) all updated so the runtime CSS and the published tokens stay aligned. `shadow.accent-glow` aliases `{shadow.lg}`. `shadow.focus` is theme-aware neutral. `shadow.button.glow.{rest,hover,active}` are `none` / `{shadow.md}` / `none`. `shadow.input.focus` + `shadow.input.success` are `var(--border-frame)`.

### Part B — Three explicit carve-outs

The mandate is "no green in any shadow color value." But three nearby things ARE allowed:

1. **Validation halos** — `shadow.input.error` (red), `shadow.input.warning` (amber) are tone-coded for the validation surface. Red ≠ green, amber ≠ green, so the no-GREEN-in-shadows rule doesn't catch them. They remain. (This is also why the lint scans for accent / lime / spring-green / 00FA8A specifically, not "any colored shadow.")
2. **`--aurora-glow-color` radial-gradient backgrounds** — used in `.lumen-aurora` hero surfaces via `background-image: radial-gradient(...)`. NOT a `box-shadow`. May retain its lime tint.
3. **Backgrounds and borders** — `--surface-tint-accent`, `--surface-tint-strong`, `--border-accent`, `--status-success-bg`, `--status-info-bg`, `--pill-accent-bg`, `--pill-accent-border`, `--pill-success-bg`, `--pill-success-border`, plus the LumenMark `bg-[var(--lumen-accent-4)]` core fill, plus primary-CTA `--color-action-primary-bg-rest`. All BACKGROUNDS or BORDERS. The accent stays in these.

### Part C — Lint enforcement broadens

`scripts/lint-elevation-no-accent.mjs` is renamed to `scripts/lint-shadow-no-accent.mjs` and its scan broadens from "only elevation-named tokens" to "every shadow token, regardless of name". The earlier ELEVATION_PREFIXES whitelist is retired. The lint now fails CI for ANY shadow leaf whose color references `color.alpha.accent.*` / `lumen-accent` / `lumen-lime` / `spring-green` / `00FA8A`.

### Part D — Docs↔code sync mandate (project-level CLAUDE.md)

The user explicitly added a meta-rule on R11: **documentation and dashboard implementation must stay in sync at all times. This is non-negotiable.**

Concretely:

- When a foundation document (`design-system/00-foundations/*.md`) changes, the audit-dashboard rendering (`audit-dashboard/src/app/foundations/page.tsx`, `audit-dashboard/src/components/primitives/*`, `audit-dashboard/src/app/globals.css`) MUST be updated in the same change so the live render demonstrates the new rule.
- When a dashboard primitive changes its visual or contract (`audit-dashboard/src/components/primitives/*`, `audit-dashboard/src/app/globals.css`, `_build/` outputs), the corresponding doc (`design-system/00-foundations/*.md`, `02-components/{name}/component.md`, `02-components/{name}/component.json`) MUST be updated in the same change.
- When a token JSON file changes (`design-system/01-tokens/**/*.tokens.json`), both the doc that prose-describes it AND the runtime CSS that applies it MUST be updated in the same change.

The mandate is now codified in [`CLAUDE.md`](../../CLAUDE.md) at the top of the project-level rules so Claude (and any agent reading the project CLAUDE.md) treats sync as a precondition for landing any change. R11 itself is the first ship to satisfy this mandate end-to-end: every shadow token, every CSS variable, every doc page, every foundations showcase card, every hard rule, and every lint were updated in one milestone.

## Consequences

### Visual

- Primary CTAs lose the surrounding green halo at rest, hover, and active. The brand identity now lives entirely in the green BACKGROUND FILL.
- Focus rings are theme-aware neutral instead of brand-green. Still WCAG 2.4.13 compliant (border-frame at 40 % alpha = ~4.5:1 against canvas, comfortably above the 3:1 floor).
- The AI shimmer animation reads as a slow neutral pulse instead of a green heartbeat.
- The foundations Elevation showcase loses its two "Hero CTA halo" and "Focus ring" green-halo demo cards; they now demonstrate the new neutral tokens with prose explaining the R11 shift.
- Command palette active-row inset border is now neutral; the background tint stays green so the selection remains accent-anchored.
- Brand mark hover halo (the small green ring around the Lumen logo) is now a neutral paper-alpha glow + brightness lift. The lime nucleus stays green at rest (it's a background fill).

### Contract

- AGENTS.md hard rule 7 narrows: green is in BACKGROUNDS / BORDERS / TEXT / LEADING DOTS / FILLS / GRADIENTS, never SHADOWS.
- AGENTS.md hard rule 11 amends: focus ring composes outline + box-shadow, both NEUTRAL (was lime).
- AGENTS.md hard rule 20 supersedes R10's categorical split with the flat rule "no green in any shadow."
- The R10 lint (`lint:elevation-no-accent`) is replaced by R11 (`lint:shadow-no-accent`).
- Three docs (`elevation.md` §3 §6 §7, `accessibility.md` Focus-ring section, `micro-interactions.md` button + input rows) updated to reflect the new colors.
- ADR 0016's "primary buttons carry their brand via halo" is amended: primary buttons carry their brand via BACKGROUND FILL (unchanged) PLUS the dual-ring outline (now neutral) PLUS the optional neutral lift on hover. The atmospheric green halo retires.
- ADR 0018's "Warp glow signature" — the rest-state halo under primary CTAs — retires. The premium-psychology brand voice now reaches the user through the green fill itself, the neutral elevation, and the typography ladder; not through the surrounding halo.

### Trade-offs accepted

- **Brand recognition might soften.** The lime halo was a strong "this is Lumen" signal across screenshots, marketing renders, and side-by-side comparisons with other dashboards. R11 trades that signature for a more disciplined "the accent appears only where action happens, and even then only as a fill, never as light." The user's mandate is the dispositive input here — discipline wins.
- **The hover state is now quieter.** Pre-R11 the green halo expanded on hover, providing a strong "you're about to click" affordance. Post-R11 the affordance is a neutral elevation lift. Test users may want a more pronounced hover; if so, the next round should consider an animated outline thickness change or a brightness lift, not a return to colored shadow.
- **Existing screenshots in `_audit-runs/` are now stale visually.** All R1–R10 captures show green halos that no longer exist. They remain in git history as a record of the v0.4–v0.13 brand visual.

### What was NOT changed

- The lime alpha primitives (`--lumen-lime-a08..a64`) remain defined. They're still used for backgrounds, borders, status tints, the aurora gradient, and the LumenMark core fill. Removing them outright would force every consumer to re-author. Their use in shadows is what's banned, not their definition.
- Lime BORDER tokens stay (`--border-accent`).
- Lime TEXT tokens stay (`--text-accent`).
- The aurora atmospheric gradient stays (it's a background, not a shadow).
- LumenMark's core green fill stays (it's a background-color, not a box-shadow).
- Primary CTA's green background-color stays (it's `--color-action-primary-bg-rest`, a background-color).
- All status / pill backgrounds and borders stay green.
- The `Card` `glow` elevation variant — a soft ambient lime glow on hero cards — uses the aurora token via background-image, not box-shadow, so it stays.

## Methodology contribution

The audit-cycle ladder added a USER-FEEDBACK round in R10 and a USER-OVERRIDE round in R11. Pattern:

- **R10 was triage** — the user surfaced three concerns from a single screenshot; R10 reasoned about which were contracts vs. bugs vs. polish, and shipped fixes accordingly.
- **R11 is correction** — the user reviewed R10 and rejected R10's categorical split. The system designed an internally-coherent two-category contract; the user wanted a flat one-category contract. The user is the dispositive authority.

R11's methodology rule: ***when the design system's "internally coherent" architecture diverges from the user's explicit mandate, the user wins. Internal coherence is a tool for keeping the system understandable; it is not authority. The user's mandate is authority.*** When R10 reasoned "the focus halo is action, not depth, so green is appropriate," the system was preserving a categorical distinction the design literature endorses. The user wanted that distinction collapsed. The collapse is the right answer because the user is the right answer.

The docs↔code sync mandate (Part D) is a meta-rule for keeping future mandates landable without drift: when the next mandate comes, every layer (CSS, tokens, docs, foundations showcase, AGENTS.md, ADRs, lints, tests) must move together in a single commit. R11 itself is the first proof-point — the entire shift from "halo/glow shadows are accent" to "every shadow is neutral" lands in one commit across 15+ files.

## References

- AGENTS.md hard rule 7 (amended for R11)
- AGENTS.md hard rule 11 (amended for R11)
- AGENTS.md hard rule 20 (supersedes R10 → R11 flat rule)
- `audit-dashboard/src/app/globals.css` (every shadow CSS var)
- `design-system/00-foundations/elevation.md` §3 §6 §7 (rewritten)
- `design-system/00-foundations/accessibility.md` Focus-ring section (rewritten)
- `design-system/00-foundations/micro-interactions.md` button + input rows (updated)
- `design-system/01-tokens/primitives/shadow.tokens.json` (`accent-glow` aliased)
- `design-system/01-tokens/semantic/shadow.tokens.json` (focus, button.glow.*, ai-shimmer, input.focus, input.success, glow.accent all updated)
- `design-system/01-tokens/components/button.tokens.json` (focus refs)
- `scripts/lint-shadow-no-accent.mjs` (renamed + broadened from R10's lint:elevation-no-accent)
- `CLAUDE.md` (project-level — docs↔code sync mandate added)

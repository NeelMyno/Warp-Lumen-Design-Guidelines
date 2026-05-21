---
title: "ADR 0035 — v0.15.0 R16: TMS-consumer friction closure (token canonicalization + defensive-class expansion + 4th/5th-tier lints + foundation prose)"
status: accepted
date: 2026-05-20
deciders: design-systems, warp-eng
context: chat 36-A
supersedes: []
superseded-by: []
related:
  - 0015-shadcn-token-bridge-direct-refs-v081
  - 0016-button-rebuild-v09
  - 0023-llm-docs-version-lockstep-v013
  - 0025-audit-cycle-ladder-r6-llm-docs-ssot-v0132
  - 0029-v014-omnibus-systemic-gap-closure
  - 0033-r14-docs-tokens-drift-lint-v0143
  - 0034-r15-tsx-prose-lint-third-tier-v0144
---

# ADR 0035 — v0.15.0 R16: TMS-consumer friction closure

## Context

On May 20, 2026, a Claude Code session (chat 36-A) ran an audit of the Lumen v0.14.4 design system from the perspective of a CONSUMER project — a TMS (transportation management system) demo at `Warp-TMS-Builder-Neel` that had wholesale-copied Lumen's `audit-dashboard/src/app/globals.css` and built a 7-page operator console on top.

The audit surfaced a contrast failure across 11+ sites in the consumer app: every active Spring-Green filter chip, mode pill, and segmented-control button painted `rgb(230, 230, 230)` text (the cascade-inherited `--text-primary` = `#E6E6E6`) on `#00FA8A` Spring Green — 1.66:1 contrast, WCAG AA fail. Across `/app/upcoming`, `/app/cost`, `/app/accounting`, `/app/autopilot`, `/app/orders`, `/app/recurring`, `/app/quote` the same bug class repeated. The consumer author was a competent LLM agent writing well-formed Tailwind v4 arbitrary classes — `<span className="bg-[var(--color-accent-500)] text-[var(--color-text-on-accent,white)]">` — and getting a contrast failure they couldn't see, because the rendered pixel color didn't match the source token name.

The trace led to **five overlapping bug classes**, ALL within Lumen rather than the consumer code:

1. **Token-name sprawl with confusing lookalikes.** Lumen v0.14 shipped 6 names for "text on accent" (`--text-on-accent`, `--primary-foreground`, `--color-fg-on-accent`, `--color-primary-foreground`, `--color-accent-foreground`, `--color-action-primary-fg`). Five resolved correctly; one (`--color-accent-foreground`) was a confusing lookalike — bound to `--text-accent` (the GREEN TEXT color used on soft tinted surfaces), NOT to text-on-accent-fill. An author picking one had a 5-in-6 chance of choosing right; the 6th choice was a silent visual bug.

2. **The consumer-intuitive name didn't exist.** The author wrote `--color-text-on-accent` (matching the longer `--color-*` Tailwind v4 @theme convention) but only `--color-fg-on-accent` was defined. The `var()` lookup silently fell through to the cascade.

3. **Tailwind v4 dropped the comma-fallback.** The author wrote `text-[var(--color-text-on-accent,white)]` with a `white` fallback as a defensive measure. Tailwind v4's content scanner has been observed to drop comma-fallbacks in arbitrary-class compile (a known v4 bug class). The compiled output had `color: var(--color-text-on-accent)` with no fallback — and the var() couldn't resolve.

4. **No canonical defensive class for chips / segments.** `.lumen-btn-primary` existed for buttons. There was nothing for filter chips, segmented controls, mode pickers, or any other "selected from a small set" affordance. Every consumer reinvented the active-state visual; the TMS consumer's reinvention happened to be the inline arbitrary-class form that hit bugs 1-3.

5. **The R11/R14/R15 lint trio didn't cover this bug class.** R11 caught retired-token references in `box-shadow` values (token-source layer). R14 caught retired-token references in `.md` / `.txt` prose (doc layer). R15 caught retired phrases in `.tsx` / `.ts` prose (TSX layer). All three caught RETIREMENT drift. NONE caught ACTIVE-token misuse expressed as an inline Tailwind arbitrary class on a CURRENTLY-VALID token reference. The TMS bug was using current tokens incorrectly, not stale ones — the existing lint trio was structurally blind to it.

Beyond the contrast failure, the audit surfaced 11 additional consumer-friction items the chat report enumerated as #1–#16:
- **#3** No canonical `<EmptyState>` primitive — every consumer reinvents.
- **#4** No canonical `KpiTile` with tone-gating-at-zero — consumers ship `OVERDUE $0` in warning amber.
- **#5** USING-LUMEN.md §11 didn't name the comma-in-`var()`-fallback trap.
- **#8** No PageHeader pattern, so consumer authors ship multi-line marketing taglines on every operator page.
- **#9** No "one primary action per view" enforcement — header CTA + empty-state CTA both visible.
- **#10** `displayFullName()` fallback chain ends at the company name (`Good afternoon, Warp`).
- **#11** Eyebrow-string drift across surfaces (`PAID (LAST 30 DAYS)` vs `PAID LAST 30 DAYS`).
- **#12** Color-as-key-in-prose anti-pattern not explicitly named in `color.md`.
- **#13** Foundation rules in prose with no lint enforcement.
- **#14** USING-LUMEN.md component count drifted from 35 → 98.
- **#15** No `MIGRATION.md` for per-minor consumer-action notes.
- **#16** Defensive-class family undiscoverable — `.lumen-btn-primary` exists but no single page enumerates the family.

These were all variations of the same meta-pattern: **Lumen had the contract in prose but didn't make it structural, didn't make it discoverable, didn't make it enforceable.**

## Decision

Ship **v0.15.0 — R16: TMS-consumer friction closure** as a single MINOR release organized along four parallel axes:

### Axis 1 — Token canonicalization (~70 new `--color-*` aliases)

Add `--color-text-on-accent` to `:root` as THE canonical name for text-on-accent-fill (matches consumer intuition + the longer `--color-*` Tailwind v4 @theme convention). Add `--color-on-accent` as a terse alias. Mark the other 5 lookalike names with prominent deprecation comments explaining the confusion.

Then close the broader `--color-*` namespace gap that the same audit surfaced: ~70 new aliases across text family (`--color-text-{primary,secondary,tertiary,placeholder,disabled,inverse,accent,link,error,success,warning,on-avatar}`), surface family (17 names), border family (11 names), status family (15 names — bg/fg/border × 5 tones + Tailwind-style `-500` numeric tier), accent ladder (`--color-accent-{400,500,600,fg}`), avatar palette (1-8), chart palette extension (6-8), alpha namespace (`--color-alpha-{accent,ink,paper}-{N}`), action-tertiary alias.

Each new name is an alias of a v0.14 semantic token — same resolved value, intuitive consumer-facing name. One definition in `:root` cascades through both themes (the aliased target is theme-overridden, so the alias follows). NOTHING retired.

### Axis 2 — Defensive-class expansion (4 new families)

Ship 4 new defensive-class families in `globals.css`, modeled on the `.lumen-btn-*` precedent:

- **`.lumen-pill-strip` / `.lumen-pill-{active,inactive,count}`** — filter chips, segments, mode pickers. The active state consumes the SAME `--color-action-primary-*` tokens `.lumen-btn-primary` uses, guaranteed 14.7:1 AAA contrast.
- **`.lumen-kpi-tile` / `.lumen-kpi-{label,value,delta,context}`** — single-metric dashboard tiles. Tone-gates at zero via `data-value-zero="true"` (warning at zero retires to neutral).
- **`.lumen-empty-state` / `.lumen-empty-state-{icon,headline,supporting,actions}`** — type-led zero-state. Coordinates with `PageHeader` via `data-cta-suppressed`.
- **`.lumen-page-header` / `.lumen-page-header-{content,title,tagline,actions}`** — title + ≤80ch tagline + one CTA. CTA hides on `data-cta-suppressed="true"`; tagline drops on `data-onboarding="false"`.

Each class composes a documented contract that the inline Tailwind arbitrary-class equivalent is one typo away from breaking.

### Axis 3 — 4th + 5th-tier lints (the "active token misuse" gap)

- **`lint:no-inline-accent-text`** — flags inline accent BG + text-arbitrary-class WITH a comma-fallback OR a white literal. The bug class is the comma-fallback (Tailwind v4 drops it) and the white literal (1.66:1 fail). The "use defined token + no comma-fallback" inline pattern (`bg-[var(--color-action-primary-bg-rest)] text-[var(--color-action-primary-fg)]`) is the documented vendor-button form and is NOT flagged.

- **`lint:no-undefined-token-vars`** — asserts every `var(--color-*)` / `var(--lumen-*)` reference is defined in `globals.css :root`. The 5-in-6 token-name guess problem becomes impossible because wrong guesses fail CI loudly with a hint pointing to the canonical name.

Together with the existing R11/R14/R15 trio, these two close the active-token-misuse gap. The lint architecture grows from three tiers to FIVE:

| Layer | Surface | Lint | Catches |
|---|---|---|---|
| Token source | `01-tokens/**/*.tokens.json` | `lint:shadow-no-accent` | green in shadow values |
| Doc prose | `*.md` / `*.txt` | `lint:docs-no-retired-tokens` | retired tokens in prose |
| TSX prose | `*.{tsx,ts}` | `lint:tsx-no-retired-prose` | retired phrases in code/JSDoc |
| **Inline anti-pattern** | `*.{tsx,ts}` | **`lint:no-inline-accent-text`** | accent BG + text WITH comma-fallback/white |
| **Token resolution** | `*.{tsx,ts,css,md,txt}` | **`lint:no-undefined-token-vars`** | references to non-existent token names |

Wired into `pnpm lint` umbrella as rules 11 + 12 (umbrella now runs 12 lint rules).

### Axis 4 — Foundation prose + discoverability

- **New foundation doc**: `design-system/00-foundations/defensive-classes.md` — single-page enumeration of every `.lumen-*` defensive class, the failure mode each prevents, the canonical example, the inline anti-pattern it replaces. The discoverability fix.
- **New pattern doc**: `design-system/05-patterns/page-header.md` — the one-CTA-per-view contract.
- **MIGRATION.md** — per-minor consumer-action notes (v0.12 → v0.13 → v0.14 → v0.15), so consumer apps know what to re-sync when bumping.
- **EmptyState component beef-up** — from 56-line prose-only contract to full spec (props / states / a11y / one-primary-action-per-view / defensive-class shorthand).
- **Foundation prose updates**:
  - `color.md` — "color is not a legend in prose" rule + worked anti-example for the "covered / uncovered" pattern.
  - `hierarchy.md` — new §8 "One primary action per view" + section-header tagline cap (80ch + `data-onboarding="false"` for repeat-visit retirement).
  - `data-visualization.md` — "Tone gates at zero" rule with polarity table for KPI deltas.
  - `microcopy.md` — `displayName()` fallback chain (preferred → firstName → fullName → email-local-part-with-denylist → "there", never the company name).
  - `USING-LUMEN.md §11 anti-patterns` — 6 new entries covering the bug classes above with worked code.
- **AGENTS.md hard rules 23, 24, 25** — codify the lint contracts (rule 23: no inline accent-text conjunction; rule 24: every `var(--color-*)` resolves; rule 25: one primary action per view).

### What's intentionally OUT of scope for v0.15

- **Component count drift announcement** (#14 in the chat report) — partially addressed by MIGRATION.md, full closure via a `lumen://meta/counts` MCP resource is deferred to v0.16.
- **Eyebrow-string registry** (#11) — drift between `PAID (LAST 30 DAYS)` vs `PAID LAST 30 DAYS` is a consumer concern; v0.15 documents the rule in `microcopy.md` but doesn't ship a string-constants module.
- **FileInput `file:` pseudo defensive class** (#6) — the `file:` pseudo can't consume external classes; a future round may ship `<FileInput variant="button">` primitive.
- **Active-chip visual-language unification** (#7) — `/carriers` (green-outline-hollow) + `/quote` (green-outline + green-text) ship pre-R16 patterns; retirement to `.lumen-pill-active` is scheduled for v0.16.

## Consequences

### Positive

- **The TMS-class contrast bug becomes structurally impossible**: the canonical token exists, the defensive class exists, two lints catch the inline anti-pattern at CI time, the docs enumerate the canonical path.
- **600+ undefined-token references in existing example files now resolve**: the `--color-*` alias namespace closes the silent-fallback class system-wide. The lint asserts this stays true for every future change.
- **Five-tier lint architecture** (token source + doc prose + TSX prose + inline anti-pattern + token resolution) now covers all known drift classes — retired tokens, retired phrases, active-token misuse, undefined-token references. Each layer is necessary; the five together are sufficient for the current bug classes.
- **Discoverability gap closed**: `defensive-classes.md` + `MIGRATION.md` + 6 new USING-LUMEN.md anti-pattern entries + 3 new AGENTS.md hard rules + beefed-up EmptyState contract + new PageHeader pattern give consumer authors a single place to look for the right answer.
- **Future contract additions follow the pattern**: when v0.16 adds a new defensive class, the same closure shape applies — defensive class + lint + foundation-doc enumeration + AGENTS.md hard rule + MIGRATION.md entry. The shape is repeatable.

### Negative

- **`globals.css` grew by ~250 lines** (token alias block + 4 defensive-class families). Audit-dashboard's CSS payload grew proportionally; the inlineCss (ADR 0028) inlining means every prerendered page ships a slightly bigger `<style>` block. Lighthouse re-run pending in v0.15.1.
- **`pnpm lint` runtime grew** from 10 to 12 rules. The new `lint:no-undefined-token-vars` walks every `.tsx` / `.ts` / `.css` / `.md` / `.txt` in the relevant trees; current runtime is ~3-4 seconds (acceptable).
- **The 5-name "text on accent" deprecation is documentation-only**, not lint-enforced. Removing the aliases for real is a v1.0 MAJOR — current consumers still using `--color-fg-on-accent` etc. continue to work. The lint discourages but does not block.
- **AGENTS.md hard rules grew from 22 to 25** — onboarding burden for new contributors is higher. The trade-off is that the rules are now structural (lint-enforced) rather than vigilant (review-enforced).

### Carry-forward to v0.16

- **R16-001** — audit the audit-dashboard's own surfaces (not just consumer apps) for inline accent BG + text patterns. The R16 lints caught 1 violation in `bottom-nav/examples/primary.tsx`; spot-check whether `library/client.tsx` or any other primitive showcase carries similar inline patterns that the lint missed because they don't combine specific BG + FG vars.
- **R16-002** — retire the green-outline-hollow active-chip pattern on `/carriers` + the green-outline-text pattern on `/quote`. Migrate to `.lumen-pill-active`. This is a visual-language unification that requires a Lighthouse re-run + side-by-side review.
- **R16-003** — ship the `lumen://meta/counts` MCP resource so LLM consumers always pull live component / token / ADR / pattern counts. Closes the chat report #14 historical drift.
- **R16-004** — KpiCard component contract beef-up parallel to EmptyState (add `data-value-zero` prop docs, tone-gating in `component.json`, refresh example).
- **R16-005** — PageHeader formal component primitive (currently only a pattern doc + defensive class; promote to `design-system/02-components/page-header/`).

## Methodology contribution to the audit-cycle ladder

The audit-cycle ladder (R1 visual chrome → R6 LLM-docs SSoT → R11 token-source docs↔code sync → R14 doc-prose lint → R15 TSX-prose lint) reaches **R16 — consumer-friction closure**:

> **R15's rule**: every contract retirement adds entries to all three lint scripts' retire-lists in the same commit.
>
> **R16's extension**: every CONSUMER bug class becomes a LINT, a DEFENSIVE CLASS, and a FOUNDATION-DOC enumeration in the same commit. The consumer's failure is the system's signal — the closure must be structural (lint + defensive class) and discoverable (foundation doc + hard rule + MIGRATION.md).

The signal that this is the right shape: chat 36-A surfaced 16 distinct consumer-friction items, and 9 of them collapsed into a single closure shape (token canonicalization + defensive class + lint + doc). The 9-into-1 collapse is the structural pattern; the remaining 7 are individual closures (component contracts, MIGRATION.md, foundation prose, deferred items).

## Verification

- `pnpm validate:tokens` → 956 tokens valid (unchanged from R15).
- `pnpm lint` → all 12 lint rules pass (was 10 in R15; +2 new rules in R16).
- `pnpm exec tsc --noEmit` (audit-dashboard) → PASS.
- `pnpm build` → 12 routes prerender.
- `pnpm exec playwright test` → 56 / 58 pass (2 skipped on axe-core gate; unchanged).
- 35 ADRs total (this one is #0035).

## Files touched

- **New**:
  - `_meta/decisions/0035-r16-tms-consumer-friction-closure-v015.md` (this file)
  - `design-system/00-foundations/defensive-classes.md`
  - `design-system/05-patterns/page-header.md`
  - `scripts/lint-no-inline-accent-text.mjs`
  - `scripts/lint-no-undefined-token-vars.mjs`
  - `MIGRATION.md`
- **Substantially extended**:
  - `audit-dashboard/src/app/globals.css` (+~250 lines: alias block + 4 defensive-class families)
  - `AGENTS.md` (+3 hard rules: 23, 24, 25)
  - `USING-LUMEN.md` §11 (+6 anti-pattern entries with worked code)
  - `design-system/00-foundations/color.md` (color-not-a-legend-in-prose rule)
  - `design-system/00-foundations/hierarchy.md` (new §8 one-primary-action-per-view + tagline cap)
  - `design-system/00-foundations/data-visualization.md` (tone-gates-at-zero section)
  - `design-system/04-content/microcopy.md` (displayName fallback chain)
  - `design-system/02-components/empty-state/component.md` (beefed contract)
  - `design-system/02-components/empty-state/component.json` (props extended)
  - `package.json` (+2 lint scripts in umbrella)
- **Bug fixes**:
  - `design-system/02-components/bottom-nav/examples/primary.tsx` (migrated to `.lumen-pill-active`)

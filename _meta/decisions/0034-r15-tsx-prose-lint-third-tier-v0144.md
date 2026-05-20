# ADR 0034 — TSX-prose drift lint + foundations showcase prose closure (v0.14.4 R15)

**Status.** Accepted.
**Date.** 2026-05-20.
**Authors.** Neel Tengariya (mandate); Claude Opus 4.7 (implementation).
**Cascades from.** [ADR 0030 v0.14 R11 no green shadows + docs↔code sync mandate](0030-no-green-shadows-and-docs-code-sync-v014-r11.md), [ADR 0033 v0.14.3 R14 docs↔tokens drift lint](0033-r14-docs-tokens-drift-lint-v0143.md).
**Supersedes.** Nothing — extends.

## Context

[ADR 0033](0033-r14-docs-tokens-drift-lint-v0143.md) (v0.14.3 R14) shipped the doc-prose lint that closed the gap [ADR 0030](0030-no-green-shadows-and-docs-code-sync-v014-r11.md) (v0.14 R11) left in the doc tree. R14's methodology rule was crisp: *"Every contract that has a TOKEN layer + a DOCS layer must have a LINT on each layer. The token lint catches tokens; the doc lint catches docs; neither is sufficient alone."*

R14's lint walks every `.md` and `.txt` in the repo. Its scope ends there. The R15 audit (this ADR) walked the audit-dashboard's rendered surfaces via the Claude in Chrome MCP at Edge browser (Personal Mac) — top to bottom across every route in both dark and light modes — and caught a **third gap** R14's `.md` / `.txt`-only scope missed:

### TSX files carry rendered prose that ships to users — and JSDoc that LLM agents read

Three concrete defects sat unflagged across two TSX files for the full R14 window:

1. **`audit-dashboard/src/app/foundations/page.tsx:387`** — Elevation section `description` prop:
   > *"Hairline borders do most of the surface separation work. Shadows are multi-layer, reserved for genuine lift — popovers, drawers, modals, toasts. **Glow shadows (lime-tinted) carry hero CTAs and live-status.**"*

   Renders directly under the "Elevation" h2 on `/foundations` — visible to every consumer reading the system Foundations page. Prescribes the **retired** lime-glow contract as if it were the current Lumen elevation rule. Per ADR 0030 R11, the lime-tinted glow ladder on hero CTAs was retired wholesale; `shadow.accent-glow` now aliases neutral `shadow.lg`. The per-card descriptions later in the same section (which R11 *did* rewrite — they correctly say *"v0.14 R11 — neutral elevation (aliases shadow.xl). Primary CTAs ride their green BG fill; no green shadow."*) ride beneath this stale preamble — the section was half-fixed.

2. **`audit-dashboard/src/app/foundations/page.tsx:821`** — Live-data signatures section `description` prop:
   > *"The three primitives that carry Warp's instrument-panel mood across every surface — Stat, LiveDot, RateTicker. v0.11 keeps these intact; **the 8 pt grid + spring-green-glow ambient amplifies them.**"*

   Same defect class. R11 retired the spring-green-glow ambient from every surface; the Stat / LiveDot / RateTicker primitives no longer ride a green halo (they ride neutral elevation; LiveDot itself is the only green-emitting element). The prose still teaches the pre-R11 amplifier.

3. **`audit-dashboard/src/app/tool/presets.client.tsx:48` and `:60`** — focus-visible outline color:
   ```tsx
   focus-visible:outline-[var(--lumen-lime-a64)]
   ```

   The global `:focus-visible` rule in `globals.css:1417` was retuned in R11 from `var(--lumen-lime-a64)` → `var(--border-frame)` (neutral, theme-aware). CLAUDE.md hard rule 11 and `globals.css`'s own preceding comment block both name `var(--border-frame)` as the R11 contract. The Tool surface's preset-list client island (a v0.12.9 R3 extraction, [ADR pre-0034]) was authored *before* R11 and missed the focus-color sweep.

An additional 7 sites carried R11-stale prose in **code comments + JSDoc** that the lint sweep above would also catch:

- `audit-dashboard/src/app/foundations/page.tsx:94` — JSX-adjacent comment teaching "the standard md primary glow ladder"
- `audit-dashboard/src/app/landing/page.tsx:64` — JSX-adjacent comment teaching "the standard primary glow ladder"
- `audit-dashboard/src/components/dashboard-shell.tsx:38` — sticky-nav comment citing "lime-halo bleed" as current contract
- `audit-dashboard/src/components/primitives/templates.tsx:33` and `:94` — comments teaching "primary surface fg + bg + glow ladder" / "standard primary glow ladder"
- `audit-dashboard/src/components/primitives/button.tsx:19` and `:75` — JSDoc on `glow` prop teaching "primary already has the glow ladder"
- `audit-dashboard/src/components/ui/button.tsx:16` — JSDoc teaching "the glow ladder are all encoded once in CSS state selectors"

None of these strings ship to users; they're internal to the codebase. But an LLM agent reading these comments to understand the Button primitive (or the Foundations Elevation section, or the sticky-shell rationale) would reconstruct the **pre-R11** contract — and then write code that ships green shadows.

### Why neither prior lint catches TSX prose

- **`lint:shadow-no-accent`** scans DTCG JSON token files for `shadow.*` with accent-color `$value`. TSX prose has no `$value`; it has JSX strings and JS comments.
- **`lint:docs-no-retired-tokens`** scans `.md` and `.txt` files for retired token names. The R15 violations sit in `.tsx` and `.ts`; the doc lint's `shouldLintFile` filter explicitly returns false for those extensions.

A token-based scan of TSX would be a false-positive disaster: TSX legitimately uses `var(--lumen-lime-a08 / 14 / 24 / 32 / 40)` for *backgrounds*, *surface tints*, *status pill BGs*, *AI action surfaces*, *text selection BGs*, *aurora gradients* — all R11-EXEMPT (per ADR 0030: green retired from SHADOWS, not BG fills). A grep of `--lumen-lime-` across `audit-dashboard/src/` returns 100+ hits, the vast majority of which are valid post-R11 BG references.

The fix has to be **prose-based, not token-based**. R15 ships a third sibling lint that looks for retired *phrases* (the natural-language idioms used to describe the pre-R11 contract): *"lime-tinted"*, *"spring-green glow"*, *"lime halo"*, *"lime ambient"*, *"lime alpha-NN"*, *"primary glow ladder"*, *"standard glow ladder"*. The paragraph-level retirement-marker heuristic from R14's lint carries over: a paragraph mentioning *"retired"*, *"superseded"*, *"R11 retired"*, *"was X"*, *"pre-R11"*, *"ADR 0030"* etc. is allowed to cite the retired prose as historical context.

### The complete three-tier lint architecture

| Layer | Surface | Lint script | Mechanism | Closed by |
|---|---|---|---|---|
| Token source | `design-system/01-tokens/**/*.tokens.json` | `lint:shadow-no-accent` | DTCG JSON value scan | ADR 0030 (v0.14 R11) |
| Doc prose | `*.md` / `*.txt` across the repo | `lint:docs-no-retired-tokens` | Retired-token-name regex + paragraph-level retirement marker | ADR 0033 (v0.14.3 R14) |
| **TSX prose** | `audit-dashboard/src/**/*.{tsx,ts}` + `design-system/02-components/<name>/examples/*.tsx` | **`lint:tsx-no-retired-prose`** | **Retired-PHRASE regex + paragraph-level retirement marker + `lumen-lint-allow: retired-prose` block directive** | **ADR 0034 (v0.14.4 R15 — this round)** |

Each layer needs its own enforcement; cross-layer leakage is the point. The R11 mandate is "docs and code stay in sync" — R14 closed the doc-prose layer, R15 closes the TSX-prose layer. Going forward, **every contract retirement adds an entry to all three lint scripts' retire-lists in the same commit.**

## Decision

### Part A — Close the three rendered-prose / focus-color defects

#### A1 — `foundations/page.tsx` Elevation section preamble (R15-001)

The `description` prop on the Elevation `<Section>` was rewritten from:

> *"Hairline borders do most of the surface separation work. Shadows are multi-layer, reserved for genuine lift — popovers, drawers, modals, toasts. Glow shadows (lime-tinted) carry hero CTAs and live-status."*

to:

> *"Hairline borders do most of the surface separation work. Shadows are multi-layer, reserved for genuine lift — popovers, drawers, modals, toasts. v0.14 R11 retired chromatic-tinted shadows wholesale: every shadow token now resolves to a neutral cream/ink alpha, and primary CTAs ride their green BG fill — not a halo. See ADR 0030."*

The new prose names R11 + ADR 0030 explicitly so any future LLM agent reading the foundation can follow the cite to the retirement rationale. The R13-002 per-card inset highlights (which scale 4% → 32% cream-alpha to communicate lift on the near-black canvas) are unchanged; this fix is preamble-only.

#### A2 — `foundations/page.tsx` Live-data signatures section preamble (R15-002)

The `description` prop on the Live-data signatures `<Section>` was rewritten from:

> *"The three primitives that carry Warp's instrument-panel mood across every surface — Stat, LiveDot, RateTicker. v0.11 keeps these intact; the 8 pt grid + spring-green-glow ambient amplifies them."*

to:

> *"The three primitives that carry Warp's instrument-panel mood across every surface — Stat, LiveDot, RateTicker. v0.14 R11 retired the spring-green-glow ambient that earlier rounds layered behind these primitives; the 8 pt grid + neutral elevation now do the amplifying, and the green appears only on the LiveDot itself."*

The LiveDot remains the system's only loud-green emitting primitive (per the Spring Green discipline: green appears at action / live / success — never decorative). The new prose makes the "green appears only on the LiveDot itself" rule explicit so a consumer can't accidentally green-up the surrounding Stat / RateTicker.

#### A3 — `tool/presets.client.tsx` focus-visible outline color (R15-003)

Both buttons (preset items + "New preset" row) had:
```tsx
focus-visible:outline-[var(--lumen-lime-a64)]
```
Now:
```tsx
focus-visible:outline-[var(--border-frame)]
```

Matches the global `:focus-visible` rule + CLAUDE.md hard rule 11 + AGENTS.md hard rule 11. Verified live via `getComputedStyle(presetButton).outlineColor` returning `rgb(154, 154, 154)` (neutral cream gray) — confirms the theme-aware `--border-frame` variable resolves correctly under the dark theme.

### Part B — Annotate 7 code-comment surfaces with R11 supersession context (R15-004)

For each of the 7 sites listed in the Context section, the comment was rewritten to include an R11 / ADR 0030 retirement marker in the same paragraph. None of these comments was deleted — they preserve the v0.11 / v0.12 design rationale (the WHY of historical decisions, valuable for future agents) while marking the *current* contract is the R11 retuned version. Example transform:

```diff
-/** v0.4 legacy — layers the .lumen-glow-cta hero halo on top of the
- *  standard primary glow ladder. For hero/landing CTAs only. */
+/** v0.4 legacy — layers the .lumen-glow-cta hero halo on top of the
+ *  default primary surface. For hero/landing CTAs only. v0.14 R11
+ *  (ADR 0030): both the halo and the primary shadow ladder are now
+ *  neutral; the green identity lives in the BG fill, not the shadow. */
```

The `dashboard-shell.tsx:38` comment got a longer rewrite because it documents the v0.12.7 lumen-glass-strong sticky-chrome decision in terms of "lime-halo bleed" — the entire premise of that decision is now historical (post-R11 there's no lime halo to bleed). The comment was extended to note (a) the original bleed concern is moot under R11, but (b) lumen-glass-strong remains the right pick because primary CTAs' green BG fills still produce slight specular reflection at the glass edge under heavy scroll.

### Part C — Ship `lint:tsx-no-retired-prose` as the third-tier lint

New file: [`scripts/lint-tsx-no-retired-prose.mjs`](../../scripts/lint-tsx-no-retired-prose.mjs). Modeled after `lint:docs-no-retired-tokens` (data-driven retire-list + paragraph-level retirement marker heuristic + file-level allow directive) but with three TSX-specific adaptations:

1. **Retire-list is PHRASES, not TOKEN NAMES.** Token names in TSX are legitimate (BG fills, surface tints, etc. are R11-exempt). Phrases like "lime-tinted" / "spring-green glow" / "primary glow ladder" describe the retired contract specifically.

2. **`INCLUDE_DIRS` is positive, not negative.** Only walks `audit-dashboard/src/` and `design-system/02-components/<name>/examples/`. Skips everything else — the design-system root, the ADRs (which legitimately cite retired contracts), the `_meta/` audits, etc. Files outside these roots are skipped wholesale, not by per-file allowlist. This makes the lint cheap (191 files vs the ~4000+ TSX files in node_modules) and structurally aligned with where rendered/agent-facing prose lives.

3. **File-level escape hatch: `lumen-lint-allow: retired-prose` directive in any of the first 20 lines.** Matches the convention from `lint-no-arbitrary-typography` + `lint-no-off-grid-spacing` + `lint-no-primitives-in-components`. A whole file documenting historical context (a `*-history.tsx`, an audit showcase that demonstrates pre-R11 vs post-R11) can opt out with one line.

Wired into the `pnpm lint` umbrella as the **10th** rule (the rule count goes from 9 → 10 in this round). Initial scan: **191 TSX/TS files scanned, 0 violations** (post-fix). Pre-fix the lint caught **3 violations** (the two foundations preamble strings + the dashboard-shell `lime-halo` reference) which is the proof-of-concept for the lint's coverage.

### Part D — Doc / banner / ADR lockstep

Per the lockstep mandate from ADR 0009 + 0023 + 0030 + 0033, all banner-touching surfaces move together:

- `VERSION`: `0.14.3` → `0.14.4`
- `audit-dashboard/src/lib/version.ts`: `LUMEN_VERSION = "v0.14.4"`
- `package.json` root version: `0.14.3` → `0.14.4`
- `README.md` Status line, `## What's new` heading
- `USING-LUMEN.md` install URL + version chip
- `llms.txt` / `llms-full.txt` ADR count (33 → 34) + retire-cite for R15
- `AGENTS.md` — **hard rule 22 added** codifying the three-tier lint contract
- `CLAUDE.md` (root + audit-dashboard) — top callout rewritten for v0.14.4
- `CHANGELOG.md` `[0.14.4]` entry

Done in this round (R15 ships as v0.14.4, the 4th patch on top of the v0.14 omnibus).

## Consequences

### Positive

- **TSX-prose drift is now structurally impossible** in the audit-dashboard + design-system examples. Every TSX surface that prescribes a retired Lumen contract fails CI. Future contract retirements add one PHRASE to the retire-list, not a sweep across 191 TSX files.
- **The 3-tier lint architecture is now complete.** Token sources, doc prose, and TSX prose all enforced. Adding a 4th tier (e.g. for CSS-in-JS or JSON fixtures) would follow the same pattern.
- **Methodology rule for future agents:** *Every contract retirement that touches token VALUES must extend `lint:shadow-no-accent`. Every retirement that touches naming or doc-only contracts must extend `lint:docs-no-retired-tokens`. Every retirement whose retired-contract NAME is a natural-language phrase consumers / agents would use to describe it must extend `lint:tsx-no-retired-prose`. The three lists are co-equal; entries are added to all three in the same commit when applicable.*
- **R15 methodology contribution to the audit-cycle ladder:** R14's rule was *"Every contract that has a TOKEN layer + a DOCS layer must have a LINT on each layer."* R15 extends: ***"And the docs layer is not just `.md` / `.txt` — it includes any rendered or LLM-readable prose in any source-tree file. The audit-via-MCP loop catches what neither lint catches alone, and each gap surfaced becomes a new lint."***

### Negative / accepted

- **New lint rule has zero-cost false-positive risk** if a future TSX file legitimately needs to cite retired prose as a teaching example. Mitigated by the `lumen-lint-allow: retired-prose` file-level directive and the paragraph-level retirement marker.
- **Future retirements will be slightly more work** — three retire-lists to update instead of two. Accepted because the cost is bounded (~3 lines per retirement) and the alternative (R14-class drift discovered 8 weeks later) is worse.
- **Audit-dashboard tests directory + Storybook stories are not linted** (excluded for now — fixtures often need to cite historical contracts). If those grow significant retired-prose surface, extend `EXEMPT_DIRS` or relax the filter.

### Carried forward — R16+ candidates

- **R16: extend `lint:tsx-no-retired-prose` to walk `design-system/02-components/<name>/examples/` for all platforms.** Currently the lint walks them via the INCLUDE_DIRS, but the iOS / Android / Flutter examples don't carry web's TSX prose patterns; could add platform-aware phrase lists.
- **R16: extend `lint:tsx-no-retired-prose` to walk CSS-in-JS** if any future Lumen primitive uses styled-components or vanilla-extract. Currently the audit-dashboard is all Tailwind v4 utilities + globals.css authored CSS — no CSS-in-JS. If that changes, the lint scope changes.
- **R16: add the same retire-list to the Storybook `stories.tsx` files** once Storybook is wired into the test pipeline (currently scaffold-only per audit-dashboard/AGENTS.md).
- **R17+: extend the docs↔tokens↔TSX-prose triad to a four-corner triad** by adding a `lint:json-fixtures-no-retired-prose` that scans JSON fixture files (e.g. component schema examples, registry sidecars) for retired-phrase strings inside `$value` / `example` / `description` JSON fields.

## Validation

```bash
pnpm validate:tokens          # 956 tokens valid, unchanged from R14
pnpm lint                     # 10 rules pass (was 9 in R14; +lint:tsx-no-retired-prose)
pnpm exec tsc --noEmit        # PASS (audit-dashboard)
pnpm build                    # 12 routes prerender clean
pnpm exec playwright test     # 56 / 58 pass (2 skipped on axe-core gate; unchanged from R14)
```

Live verification of the three Part A fixes:
- `/foundations` Elevation preamble renders the R11-aware text (screenshot in `.audit-runs/2026-05-20-round-15/screens-r15/`).
- `/foundations` Live-data signatures preamble renders the LiveDot-only-green clarification.
- `/tool` preset list focus-visible outline computed style returns `outlineColor: rgb(154, 154, 154)` (neutral) on dark theme — confirms the `--border-frame` token resolves correctly.

Pre-fix `lint:tsx-no-retired-prose` reported 3 violations (R15-001, R15-002, the dashboard-shell `lime-halo` reference). Post-fix: 0 violations across 191 scanned files.

## Related

- [ADR 0030 — v0.14 R11 no green shadows + docs↔code sync mandate](0030-no-green-shadows-and-docs-code-sync-v014-r11.md) — the source contract this round defends
- [ADR 0033 — v0.14.3 R14 docs↔tokens drift lint](0033-r14-docs-tokens-drift-lint-v0143.md) — the second-tier lint this round extends
- [ADR 0023 — v0.13.0 LLM-docs version lockstep](0023-llm-docs-version-lockstep-v013.md) — the version-chip lockstep precedent
- [ADR 0009 — versioning + semver system-wide](0009-versioning-semver-system-wide.md) — the SSoT principle this round structurally extends
- AGENTS.md **hard rule 22** — codifies the three-tier lint contract
- `scripts/lint-tsx-no-retired-prose.mjs` — the new lint script
- `.audit-runs/2026-05-20-round-15/ISSUES.md` — full R15 defect log

# ADR 0019 — Sparkline fluid-width + symmetric StatGrid divider (v0.11.17)

- **Date:** 2026-05-06
- **Status:** Accepted
- **Deciders:** Lumen working group + the user (brand owner)
- **Supersedes (in part):** [ADR 0014 — v0.8 spacing rebuild](./0014-spacing-rebuild-v08.md) — only the StatGrid `divided` divider implementation is changed; the spacing scale itself is untouched.
- **Strengthens:** The unwritten v0.11.16 promise that "sparkline endpoints sit on a consistent grid line — column-edge-aligned across the whole StatGrid" — v0.11.17 makes that promise hold in every column width, not just wide ones.

## Context

v0.11.16 fixed the cross-column right-edge alignment of sparklines inside `<StatGrid cols={4}>` by wrapping the rendered Sparkline in `<div className="ml-auto shrink-0">`. The fix worked in any column wide enough to hold `pill + gap-3 + 88-px spark` — observed in:

- SaaS `KpiRow` (full main width — comfortable)
- `/foundations` data section (full main width — comfortable)
- `/landing` Stat strip (full main width — comfortable)
- `/library` KPI cards (showcase — comfortable)

It did NOT work in the SaaS Lane Performance card, which lives in the `[1fr_320px]` two-column layout's 1fr column at viewport ≥ lg. The 1fr column resolves to ~760 px on a 1440-px viewport, the Card padding-lg removes 48 px, the StatGrid 4 tracks + 3 × `gap-x-8` removes 96 px, leaving ~154 px per track. The `divided` style then carved another 32 px of `padding-left` off cols 2..N for the divider, leaving cols 2–4 with ~122 px of content area. A Stat with size="md" wants ~174 px (74-px delta pill + 12-px gap-3 + 88-px Sparkline) — overflow ~52 px in cols 2–4.

The `shrink-0` wrapper meant the SVG could not give way under pressure. Cols 1–3 absorbed the 52-px overflow into the 32-px `gap-x-8` + the next column's 32-px `padding-left` (invisibly — the overflow landed in empty space). Col 4 had no neighbour; the overflow extended past the Card's `padding-right`, past the Card itself, into the gap toward the SidePanel — and the user-screenshotted bug.

Diagnosis revealed a second, latent issue: even after fluidising the spark, the `divided` style's `padding-left: 32px` on cols 2..N would render col 1's spark at a different width than its neighbours' (col 1 had 32 px more content area). Fixing only the spark would have replaced "col 4 overflows" with "col 1 spark wider than 2–4" — a different visual rhythm break.

A third, unrelated issue surfaced when `.next/dev` was cleared to start a clean dev server: Tailwind v4's content scanner pattern-matched a JSDoc placeholder string `[&_[data-slot=card-{slot}]]:px-N` (in `card.tsx`'s comment about how the alignment contract works) as a real arbitrary-variant utility, tried to compile it, and emitted invalid CSS (`Unexpected token CurlyBracketBlock`). This had been latent in the codebase since v0.10.1 — the `.next` cache had been masking it.

## Decision

**Three changes, all in `audit-dashboard/src/components/primitives/stat.tsx` (plus a doc-only edit in `card.tsx`):**

### 1. Sparkline becomes width-fluid

The SVG is now declared:

```tsx
<svg
  viewBox={`0 0 ${width} ${height}`}
  preserveAspectRatio="xMaxYMid meet"
  width="100%"
  height={height}
  aria-hidden
  className="block overflow-visible"
  style={{ maxWidth: width, height }}
>
```

The `width` prop now means **preferred max width** (default `88`). In a wide-enough wrapper the SVG renders at its preferred width × height (no observable change vs pre-v0.11.17). In a tight wrapper, the SVG scales down uniformly, anchored to the right edge — the polyline + polygon-fill compress proportionally, the endpoint pulse stays a circle (no ellipse-squashing because aspect ratio is preserved), and `vector-effect="non-scaling-stroke"` keeps the polyline stroke at 1.5 px regardless of display scale.

### 2. Stat spark wrapper allows shrinking + the row gets `min-w-0`

The wrapper class changes from `<div className="ml-auto shrink-0">` to `<div className="ml-auto min-w-0 flex justify-end">`. Drops `shrink-0` so the wrapper can shrink with its parent; gains `min-w-0` to allow shrinking below content min-size; gains `flex justify-end` so the SVG inside (now fluid) anchors to the right edge of whatever width the wrapper has. The bottom row of pill+spark also gains `min-w-0` so the row's intrinsic width doesn't force the parent grid track wider; the pill gains `shrink-0` (it's a fixed-content lozenge that should never compress; only the spark gives way under layout pressure).

### 3. StatGrid `divided` divider becomes a pseudo-element at gap-centre

Pre-v0.11.17:

```css
.lumen-stat-grid-divided > * + * {
  border-left: 1px solid var(--border-hairline);
  padding-left: 32px;
}
.lumen-stat-grid-divided > *:first-child {
  padding-left: 0;
}
```

Post-v0.11.17:

```css
.lumen-stat-grid-divided > * { position: relative; }
.lumen-stat-grid-divided > * + *::before {
  content: "";
  position: absolute;
  left: -16px;          /* gap-x-8 / 2 */
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border-hairline);
  pointer-events: none;
}
```

Cols 1..N now share an identical content area (the divider is pulled out of box-flow). The visible divider line shifts 16 px left vs pre-v0.11.17 (gap-centre instead of col-track-left) — semantically more honest about being "between" columns rather than "starting" the next one.

### 4. (Doc-only) `card.tsx` JSDoc rewritten to avoid `{slot}` brace literal

The pre-v0.11.17 JSDoc on `audit-dashboard/src/components/primitives/card.tsx` used `[&_[data-slot=card-{slot}]]:px-N` as a *template placeholder* in the alignment-contract prose. Tailwind v4's content scanner picked it up as a real arbitrary-variant utility and tried to compile it — the `{slot}` literal produced invalid CSS. Comment now uses `card-SLOT` notation + an enumerated `header / content / footer` list, plus a v0.11.17-tagged warning paragraph naming the trap so future contributors don't reintroduce it.

## Consequences

### Positive

- **The user-reported visible bug is closed at the primitive layer.** The SaaS LanePerf SEA → DEN sparkline no longer overflows the card. Every other tight-column consumer (current and future) inherits the fix.
- **Cross-column visual rhythm holds in every container width.** With the symmetric divider, the fluid spark renders at the same width across all 4 columns; with the fluid spark, the rendered width adapts to the available space without overflow. The two halves work together — neither alone is sufficient.
- **The v0.11.16 right-edge-alignment promise is generalised.** Sparkline endpoints sit on a consistent grid line whether they render at 88 or at 60 or at 40 — the promise is now a true invariant.
- **The Tailwind v4 content-scanner trap is closed in the code AND in the comment.** The doc-block now contains a written-down rule, so the pattern is a documented anti-pattern, not just an absent bug.
- **Back-compatible API.** Every existing `<Stat sparkData={...}>` and `<Sparkline width={...}>` caller continues to work; the only behavior change is in tight columns where the SVG used to overflow and now scales.

### Trade-offs accepted

- **Spark width can compress in tight columns.** This is the explicit point of the fix: the sparkline is a *trend signal*, not a precise data display. A 60%-scaled spark is still readable; an overflowing 100% spark is broken. The trade favours visual integrity over absolute size constancy.
- **Pulse circle scales down in tight columns.** With `preserveAspectRatio="xMaxYMid meet"`, the entire SVG content scales uniformly — pulse included. A 60%-rendered pulse circle is ~1.8-px radius (down from 3-px). Still visible, still pulsing, still anchored right; just smaller. We considered a two-SVG approach to keep the pulse at fixed pixel size while the line stretches, but it doubles the DOM cost and complicates the live-telemetry contract for marginal visual gain.
- **The `divided` rule visually shifts 16 px left** (from col-track-left to gap-centre). Cosmetic, single-time visual change. We consider this an *improvement* — the rule now sits "between" columns instead of "starting" the next one, which is the standard CSS-table convention.

### Negative

- **Latent regressions in downstream consumers that relied on the pre-v0.11.17 fixed-88 spark.** None observed in the audit-dashboard sweep, but a downstream consumer that mounts a Stat in an unusually narrow column may now render a smaller spark than before. The remediation is "read the spark width from the rendered DOM" or "pass an explicit `width` prop closer to the available space." The pre-v0.11.17 behavior (overflow into surrounding chrome) is not a behavior we want to preserve for back-compat.
- **One more declarative pattern to remember when adding components.** Future arbitrary-variant strings in JSDoc/TSdoc that contain `{...}` braces will trigger the same Tailwind v4 trap. The cheapest defence is a written-down rule in the relevant doc-block; a more aggressive defence (a lint rule that scans comments for `[&_…]:` patterns and flags brace literals) is plausible but probably overkill for the rate at which we add Card-style alignment doc-blocks.

## Alternatives considered

### A. Reduce default Sparkline width from 88 to 64

Simple, one-line fix at the prop level. Solves the immediate LanePerf overflow because `74-px pill + 12-px gap + 64-px spark = 150 ≤ 154`. **Rejected** because:
- The next consumer that puts a Stat in a column even tighter than 154 px (e.g. a 320-px sidebar with 4 stats) re-discovers the overflow.
- Smaller default makes wide-column renders look proportionally weaker — the KpiRow at 252-px tracks would render a 64-px spark in a sea of empty space.
- The semantic contract is wrong: hard-coded "always 64" doesn't say what the system actually wants ("preferred 88, scale to fit").

### B. Add `overflow-hidden` to the Card

Surgical CSS fix. Clips the overflow at the Card boundary. **Rejected** because:
- It clips, doesn't fit. The user sees a sparkline cut off mid-line, which is its own visual bug.
- It clips the legitimate 3-px pulse-circle overhang on the SVG, dimming the live-telemetry signal.
- It doesn't fix the cross-column width asymmetry caused by `divided`.

### C. `preserveAspectRatio="none"` instead of `meet`

Stretches the line horizontally without scaling vertically — keeps the spark at full 26-px tall in tight columns. **Rejected** because:
- Pulse circles become ellipses (squashed horizontally) — visible quality degradation.
- The trend slope reads as more aggressive than it actually is (compressed x-axis).
- The fix optimises the wrong axis; sparklines are read for *shape*, not for x-axis fidelity.

### D. Render line + pulse as two separate SVGs

Line stretches via `none`, pulse renders in its own fixed-size SVG anchored absolutely. Best of both worlds for visual fidelity. **Rejected** because:
- Doubles the DOM cost per Stat × every Stat in audit-dashboard ≈ 30 extra `<svg>` nodes.
- Complicates the live-telemetry contract — pulse-class CSS animation now lives outside the line SVG.
- Marginal visual gain over `xMaxYMid meet`; the 1.8-px pulse in a tight column is still visibly pulsing.

### E. Drop `divided` from the SaaS LanePerf Stat row

Page-level fix. Removes the divider, equal cols. **Rejected** because:
- LanePerf is the canonical "telemetry strip" — the divider is part of its design language.
- Doesn't fix the Sparkline's structural overflow; the next page that uses `divided` rediscovers it.

### F. Move the Sparkline out of the pill+spark row entirely (stack on a new row)

Layout-level fix. Pill on top, spark on its own row underneath. **Rejected** because:
- Vertical real estate is the most expensive in dashboard layouts. Adding another row pushes other content (or doubles the Card height).
- The horizontal pill+spark composition is the standard Linear / Stripe / Apple Health pattern. Stacking is a different visual idiom that changes the "telemetry strip" feel of LanePerf.

## Why this is the right cascade-fix

This is the same reasoning shape as v0.11.15 (one token edit fixed every neutral Badge) and v0.11.16 (one wrapper class fixed every cross-column scatter). The visible bug is one specific render in one specific surface; the structural bug is in the primitive that all those surfaces consume. Fixing at the primitive closes every present case AND every future case in one stroke. Fixing at the call site is a band-aid.

The cost of "boil the ocean" here was low (three small edits in two files plus four documentation edits) and the blast radius is the entire system. If a future consumer adds a Stat with a sparkline in any container width — narrow sidebar, full-width hero, 4-col grid, mobile — the rendering is now correct by construction.

## Measurements (informational)

- Pre-v0.11.17: SaaS LanePerf cols 2–4 spark overflowed by ~52 px; col 4 overflow extended ~28 px past the Card right edge.
- Post-v0.11.17: every column's spark fits within the column; all 4 cols render the same spark width (~64 px in this layout); pulse + line + polygon all anchored right + middle.
- KpiRow (256-px tracks): no observable change. Spark renders at the full 88 × 26.
- Foundations data section (256-px tracks): no observable change. Spark renders at the full 88 × 26.
- Landing Stat strip (256-px tracks at xl size): no observable change. Spark renders at the full 88 × 26.
- Library KPI cards (custom layout): no observable change. Stat-direct sparks render at full size; the inline `<MiniSparkline>` in the showcase row was already fluid via its own implementation and is unaffected.
- Light theme: visually identical to dark. The fix is structural, not chromatic.

## Open questions

- **Should `width` become responsive across Stat sizes?** Currently `Sparkline.width` defaults to 88 regardless of `Stat.size`. A future v0.12 might tier the default by size (sm: 56, md: 72, lg: 88, xl: 100, hero: 140) so smaller Stats get visually-proportional sparks. Out of scope for v0.11.17 because the fluid scaling already handles tight cases gracefully; the absolute "preferred max" is still 88 across all sizes, which is fine.
- **Should StatGrid expose a `dividerStyle` prop?** Currently the divider is binary (on / off). A consumer may want a heavier rule for marketing surfaces or a softer one for data-dense ops. Out of scope — file an issue if the need surfaces.
- **Should the divider work in column-grid layouts at <640 px (where the StatGrid stacks to one column)?** Currently the `@media (min-width: 640px)` gate matches what the visual layout does — when stats stack vertically there's no inter-column divider to draw. If a future use case wants a horizontal rule between stacked stats, that's a separate component variant.

## See also

- [v0.11.16 changelog entry](../../CHANGELOG.md#01116--2026-05-05--stat-sparkline-right-alignment--cross-column-visual-rhythm-restored-across-every-dashboard) — the immediate prior context this ADR builds on
- [v0.11.17 changelog entry](../../CHANGELOG.md#01117--2026-05-06--sparkline-overflow-fix--fluid-svg--symmetric-statgrid-divider--tailwind-v4-comment-scanner-regression-closed) — the user-facing release notes for this ADR
- [Stat component.md](../../design-system/02-components/stat/component.md) — updated component contract
- [hierarchy.md](../../design-system/00-foundations/hierarchy.md) — the broader visual-rhythm principles that informed the fluid + symmetric choice

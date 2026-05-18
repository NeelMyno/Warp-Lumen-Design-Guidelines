# ADR 0024 — Responsive safety net: `html, body { overflow-x: clip }` (v0.13.1)

**Status:** Accepted
**Date:** 2026-05-18
**Author:** R5 audit cycle
**Related:** ADR 0009 (versioning), ADR 0023 (LLM-docs lockstep)
**Supersedes:** —
**Amended by:** —

## Context

R4 (v0.13.0) closed the LLM-docs version drift via the release-script lockstep. It explicitly carried forward one blocker: **sub-768 px responsive sweep**. R1–R4 all reported they could not exercise mobile breakpoints because `claude-in-chrome`'s `resize_window` MCP resizes the outer browser window but does not propagate to `window.innerWidth`. R5's first move was switching to `chrome-devtools-mcp` `emulate`, which sets the viewport at the CDP level — `innerWidth` then correctly reports the emulated width.

What the unblocked sweep surfaced — and what this ADR codifies — is **mobile-viewport inflation**: at 320 px and 375 px viewports, every Lumen route reports `innerWidth = 508–509`, with `(max-width: 639px)` media queries inactive, breaking every `sm:` and `md:` Tailwind utility silently.

## Investigation

Reproduced consistently on `/foundations` at emulated 320 × 568 (devicePixelRatio = 2):

| Measurement | Expected | Actual |
|---|---|---|
| `window.innerWidth` | 320 | **509** |
| `document.documentElement.scrollWidth` | 320 | **509** |
| `document.body.getBoundingClientRect().width` | 320 | 320 |
| `matchMedia('(max-width: 639px)').matches` | `true` | **`false`** |
| `matchMedia('(max-width: 767px)').matches` | `true` | **`false`** |

`body.width` is correct (320), but `body.scrollWidth` inflates to ~509 because the layout engine measures content past the box. The CSS Working Group spec on visual-vs-layout viewport: when any descendant's intrinsic content extends past the layout viewport's box, the layout viewport **expands** to fit, and `innerWidth` returns the expanded width.

Three categories of content trigger this on Lumen surfaces:

1. **Display-typography samples on `/foundations`** — `<TypeRow role="display.xxl" sample="Stop re-designing." ...>` has intrinsic min-content of ~440 px because Satoshi cannot break "Stop re-designing." at 96 px without word-break. R4 documented the display crop AT the viewport edge as by-design; what neither R4 nor prior rounds caught is that the crop's *layout cost* extends past the viewport even though the *visual cost* doesn't.

2. **Showcase Cards on `/library`** — Inline-tabs / Pill-tabs / Breadcrumb showcases render Card bodies that hold horizontally-stacked primitives. Each Card has `bg-[var(--surface-raised)]` + `flex` content; the flex children have min-content widths summing to ~484 px, which propagates up.

3. **Page-nav chip rail** in `dashboard-shell.tsx` — `<UL class="max-w-max">` sizes to its 8 chips' aggregate content (~699 px). The parent `<NAV class="overflow-x-auto">` correctly clips this to its own width, so the rail itself doesn't inflate. (R5 ruled this out; not a contributor.)

The first two categories are the real inflators. Both are showcase contexts; both have intrinsic content that cannot fit at 320 px without word-break or media-query smaller variants.

## Considered (and rejected)

### Option A — fix each inflating element individually

Per-element fixes (`overflow: hidden` on the typography sample div, `min-width: 0` on grid cells, mobile-only smaller font sizes for display-xxl, etc.). R5 applied two of these (`TypeRow` grid + cell `min-w-0 overflow-hidden`, `dashboard-shell` `max-w-max` → `max-w-screen-2xl`). They help, but **the body scrollWidth still inflated to 508** after both — there are 16+ overflow-contributing descendants in `/foundations` alone. Whack-a-mole, with each new component being a new potential inflator.

### Option B — `overflow-x: hidden` on `<html>`

Works structurally — `hidden` truncates `scrollWidth` to the viewport box. But establishes a new scroll container on `<html>`, which can break `position: sticky` anchored to the document scroll root (the v0.12.6 header chrome contract). Also creates a hard horizontal scrollbar in some edge cases where the page genuinely needs horizontal scroll (e.g. wide tables with `overflow-x: auto` clipped by an `overflow: hidden` ancestor get visually trapped).

### Option C — `overflow-x: clip` on `<html>` and `<body>` (chosen)

`overflow-x: clip` was added in CSS Overflow Module Level 3 (Chrome 90+, Safari 16+, Firefox 81+). Behavior:
- **Clips visual overflow** at the box edge (same as `hidden`).
- **Does NOT establish a scroll container** (unlike `hidden`).
- **Does NOT affect `scroll-padding`, `position: sticky` anchors, or scroll-snap behavior** on descendants.
- **Allows the corresponding `overflow-y` to remain `visible`** without forcing the other axis. (Pre-`clip`, `overflow: hidden auto` was the closest workaround, but `hidden` was already a scroll container.)

Applied on both `<html>` and `<body>` because some descendants' overflow bubbles up to `<body>` and stops there (before reaching `<html>`); clipping at both layers explicitly. The corresponding `overflow-y` stays at the default `visible` so vertical scrolling continues to work normally.

## Decision

Add to `audit-dashboard/src/app/globals.css` immediately after the Tailwind imports:

```css
/* v0.13.1 R5-011 — Responsive safety net. (See ADR 0024.) */
html, body { overflow-x: clip; }
```

## Consequences

### Positive

- **Mobile breakpoints work.** `sm:` (max-width 639px) and `md:` (max-width 767px) Tailwind utilities now fire correctly because `innerWidth` reports the actual viewport, not an inflated layout viewport. This unlocks every consumer of those utilities — header chrome collapsing to icon-only, sidebars stacking vertically, hero displays clamping to viewport-safe sizes.
- **Catches future regressions.** Any new component that ships with content > viewport width on mobile is contained at the root layer. Authors get a free safety net.
- **No `position: sticky` regression.** Verified that the v0.12.6 sticky-header chrome contract continues to function — `clip` does not establish a scroll container, so the header still anchors to the document root.
- **No horizontal-scroll regression for in-page widgets.** Components that intentionally use `overflow-x: auto` (TabNav route chips, MarkdownTable, RateTicker marquee) continue to work — their `overflow-x: auto` establishes a local scroll container that is independent of the root `overflow-x: clip`.

### Negative

- **Browser support floor moves to Chrome 90 / Safari 16 / Firefox 81** (April 2021 / September 2022 / August 2020). All modern. Older browsers fall back to no horizontal clipping at the root; behavior matches pre-v0.13.1.
- **Content past the viewport is invisible.** This is the intent, but it does mean a future bug "X content is cut off on mobile" might be obscured by the safety net. Mitigation: keep the per-element fixes from Option A as defense-in-depth — fix the inflators at the source AND clip at the root.

### Neutral

- **Does not affect desktop.** At ≥ 1024 px viewports, all surfaces fit naturally; `overflow-x: clip` has nothing to clip.
- **Does not interact with the `<html>` `overflow-y` contract.** `overflow-y` remains `visible` on `<html>` and `<body>`; vertical scroll is unaffected.

## Lessons

- **Layout-viewport inflation is invisible to a desktop walk.** R1, R2, R3, R4 all walked at 1500 × 812 and found nothing wrong; the same pages on a 320-px emulated viewport report `innerWidth = 509` with mobile breakpoints inactive. The class of bug only exists at mobile breakpoints AND only when something else (a display heading, a wide card) inflates the layout viewport.
- **Mobile breakpoints aren't just a CSS concern; they're a viewport-measurement concern.** A `sm:` utility that doesn't fire on a 320 px viewport because `innerWidth` reports 509 isn't a Tailwind bug — it's an upstream layout-viewport bug. The fix has to land at the viewport-measurement layer (root `overflow-x: clip`), not at the utility layer.
- **`overflow: clip` is newer than most developers think.** It generalizes "I want `hidden`'s visual effect without `hidden`'s scroll-container side-effect." Worth reaching for whenever the goal is "draw the cut and forget about it."

## See also

- [ADR 0023](./0023-llm-docs-version-lockstep-v013.md) — the v0.13.0 ship that carried the responsive-sweep blocker.
- `audit-dashboard/src/app/globals.css` — the implementation site.
- `.audit-runs/2026-05-18-round-5/ISSUES.md` — R5 audit log with the investigation that surfaced this.
- [MDN: `overflow-x: clip`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x) — browser support.
- [CSS Overflow Module Level 3 §3](https://www.w3.org/TR/css-overflow-3/#overflow-properties) — spec.

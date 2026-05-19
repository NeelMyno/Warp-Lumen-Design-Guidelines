# Responsive behavior

> **Lumen's breakpoints, layout-viewport contract, sub-768 px authoring rules, and what to do when something looks wrong at mobile.** Authored v0.13.2 — codifies ADR 0024 (responsive safety net) for consumer / agent reference. The ADR explains *the fix*; this doc explains *the contract you must follow when authoring against Lumen*.

## Breakpoints (Tailwind v4 defaults — unchanged in Lumen)

| Breakpoint | Min width | Lumen meaning |
|---|---|---|
| **`sm`** | 640 px | Smallest "tablet-portrait" tier. Cards stack to 2-up where they were 3-up on mobile. |
| **`md`** | 768 px | Tablet-landscape / small-laptop. Sidebar nav appears; mobile bottom nav disappears. |
| **`lg`** | 1024 px | Default desktop. Full sidebar + main + inspector layouts. |
| **`xl`** | 1280 px | Wide desktop. Cards go 4-up; chart legends move from bottom to right. |
| **`2xl`** | 1536 px | Audit-dashboard mode (`size.container.max` = 1440 px; the wrapper caps before `2xl`). |

**No custom breakpoints in Lumen.** If you find yourself reaching for `@media (min-width: 900px)` or `lg:hidden xl:block` to special-case a layout, the design is wrong, not the breakpoints.

## The four density tiers (orthogonal to breakpoint)

- **Marketing** (96 px hero rhythm, 24-48 px section rhythm) — `landing`-style pages. Hero is 80+ vh.
- **Operator** (24 px section rhythm, dense table rows) — `saas` / `tool` surfaces. Section transitions are quiet; the content density is the brand.
- **Cozy** (36 px row height) — settings panels, profile editors. The space.9 (36 px) sweet spot.
- **Compact** (28-32 px row height) — power-user surfaces like `data-grid` rows or `kanban` cards. Touch target floor is `size.control.touch` (44 px) for any interactive child even when the row itself is shorter.

Breakpoint and density compose. A `/saas` route stays operator-dense at every breakpoint; a `/landing` route stays marketing-spaced.

## The layout-viewport contract (the v0.13.1 invariant)

Lumen ships a single root rule in `globals.css`:

```css
html, body {
  overflow-x: clip;
}
```

This rule exists for one reason: **CSS's layout viewport inflates when any descendant's intrinsic min-content exceeds the device viewport**. Without `overflow-x: clip` at the root, `window.innerWidth` at 320 px reports `509` (the widest descendant's intrinsic min-width), `(max-width: 639px)` evaluates `false`, and *every `sm:` and `md:` Tailwind utility breaks*.

**Why `clip`, not `hidden`** — `overflow-x: hidden` creates a new scroll container, which breaks the sticky-header anchor chain. `clip` paints overflow as invisible without establishing a container. (Both are part of [CSS Overflow Module Level 3](https://www.w3.org/TR/css-overflow-3/).) Modern browsers (Chrome 90+, Firefox 81+, Safari 16+) support `clip`.

**The contract for authors:**

1. **Don't override `overflow-x: clip` on `<html>` or `<body>`.** The safety net at the root is non-negotiable.
2. **You may set `overflow-x: clip` on inner containers** for the same reason (e.g. a wide `<table>` inside a narrow `<Card>` should clip horizontally — apply at the Card layer).
3. **When you ship a component with intrinsic min-content > 320 px**, add per-element defense: `min-w-0 overflow-hidden` on its grid cell, or `truncate` on its text, or a deliberate `max-w-` on its container.

## When `max-w-max` is wrong

`max-w-max` sizes the container to its widest child's max-content — which means a single 128 px display heading anywhere inside makes the container ~512 px wide, even at 320 px viewport. The `dashboard-shell.tsx` originally used `max-w-max` on header / main / footer; v0.13.1 swapped all three to `max-w-screen-2xl`. **Rule:** never use `max-w-max` at a layout-shell layer.

## Authoring rules for sub-768 px surfaces

These rules apply when the route is rendered at `sm:` or below, OR when a route should "just work" at mobile without bespoke `sm:hidden` overrides.

### Layout

- **Single-column at `sm:` and below.** Multi-column grids (`grid-cols-2`, `grid-cols-3`, etc.) get an unprefixed `grid-cols-1` default, then `sm:grid-cols-2` / `md:grid-cols-3`.
- **Stack actions vertically below `sm:`.** A row of buttons becomes a column (`flex-col sm:flex-row`); a sidebar becomes a `Drawer` trigger; a top toolbar becomes a `BottomSheet`.
- **No fixed-width interior elements.** No `w-[400px]` on a card. Use `max-w-md` or `max-w-screen-sm` so the element shrinks at narrow viewports.
- **Avoid `min-width` on text containers.** A `min-w-[300px]` div is fine at 1200 px; at 320 px, it overflows. If the inner content needs 300 px to be readable, the design is wrong, not the device.

### Touch targets

- **44 × 44 px floor** for any interactive element (Apple HIG). The Lumen `size.control.touch` semantic token (`space.11` = 44 px) is the canonical reference.
- **Spacing between targets** — `space.2` (8 px) horizontal, `space.3` (12 px) vertical. Two adjacent buttons at 44×44 + 8 px gap stay tappable.
- **Hit-area expansion** — a 16 × 16 px icon inside a 44 × 44 px button is correct; don't shrink the button to the icon. Use `padding` (or `<IconButton>`'s built-in `size="md"` which ships 40 px).

### Typography

- **Don't shrink type below body-md (16 px) at mobile.** iOS Safari zooms inputs < 16 px font-size when focused — disruptive and a sign of disrespect for the reader.
- **Display type wraps to second line gracefully.** `text-wrap: balance` is opt-in via `text-balance` utility; reserve for hero text that's intentionally allowed to wrap (`type.display.2xl`, `type.display.xl`).
- **Lumen never uses viewport-relative typography (`vw` units).** Tokens are pixel-based; scale comes from breakpoint-prefixed utilities (`text-base sm:text-lg lg:text-xl`).

### Navigation

- **Top navbar collapses to hamburger at `sm:`.** The full navbar reappears at `md:` and above. Use `<Navbar>` with its built-in responsive contract.
- **Sidebars become drawers at `sm:`.** A persistent left rail (`<Sidebar>`) collapses to a hamburger button + `<Drawer>` at `sm:`.
- **Bottom nav at `sm:`, top nav at `md:`+.** Mobile users expect thumb-reachable nav at the bottom; desktop users expect it at the top.

### Tables

Tables are the hardest responsive surface. Three patterns, pick one per use case:

1. **Stack** — at `sm:`, render each row as a stacked label : value list. Use for small tables (≤ 6 rows visible at once).
2. **Horizontal scroll** — wrap the `<table>` in `overflow-x-auto` so it scrolls horizontally on narrow viewports. Use for wide data tables that can't be meaningfully truncated. Pair with sticky first column (`<th class="sticky left-0">`).
3. **Card grid** — at `sm:`, convert rows to `<Card>`s in a 1-column grid. Use for tables where each row is conceptually a record (user, order, ticket).

### Charts

- **Sparklines** scale to their container (the `MiniSparkline` uses `width="100%"`). No special mobile handling.
- **Full charts (Line / Bar / Heatmap)** should declare a fixed `viewBox` and scale to container width. The Lumen `ChartFrame` does this via `<svg width="100%" viewBox={...}>`.
- **Heatmaps** — at `sm:`, reduce the number of columns shown (e.g. 7 days × 24 hours becomes 7 days × 8 sample hours).
- **Legends** at `sm:` move to below the chart (was top-right at `md:`+). Long legends wrap.

## Testing responsive at every cycle

The audit-cycle ladder (per ADR 0024 + this doc):

| Round | Viewport(s) | Tool |
|---|---|---|
| Desktop static | 1500 × 812 | `claude-in-chrome` against user's browser |
| Desktop interaction | 1500 × 812 | `claude-in-chrome` clicks + hovers |
| Mobile small | 320 × 568 | `chrome-devtools-mcp emulate` |
| Mobile standard | 375 × 667 | `chrome-devtools-mcp emulate` |
| Tablet portrait | 768 × 1024 | `chrome-devtools-mcp emulate` |
| Tablet landscape | 1024 × 768 | `chrome-devtools-mcp emulate` |
| Wide desktop | 1920 × 1080 | `chrome-devtools-mcp emulate` |

**Why two tools** — `claude-in-chrome` walks the user's actual browser (Edge / Chrome / Safari with the user's profile + extensions). `chrome-devtools-mcp emulate` is CDP-level and propagates the requested viewport to `window.innerWidth` correctly. Use the first for desktop visual fidelity, the second for sub-768 px metrics.

## Common mistakes

- **Adding `overflow-x: hidden` to fix a clipping issue.** This breaks the sticky-header anchor chain. The right fix is `min-w-0 overflow-hidden` on the offending grid cell, or restructure the layout so the descendant doesn't exceed device viewport.
- **Hand-rolling a custom `@media` query for "mobile."** Use Tailwind's prefixes (`sm:`, `md:`, etc.). If they don't fit, the design is wrong.
- **`vw` units for typography.** No. Pixel-based scale with breakpoint-prefixed utilities.
- **Fixed widths in pixels (`w-[400px]`).** Use `max-w-md` or `max-w-screen-sm` so the element shrinks responsibly.
- **Inline-positioned floating UI (`<div absolute>`).** Per AGENTS.md hard rule 10, portal to `document.body`. Inline-absolute gets clipped at narrow viewports because the ancestor's `overflow-hidden` (corner-clip, glass surface, scroll container) hides the panel.

## Related

- [ADR 0024 — Responsive safety net (v0.13.1)](../../_meta/decisions/0024-responsive-safety-net-v0131.md)
- [`.audit-runs/2026-05-18-round-5/ISSUES.md`](../../.audit-runs/2026-05-18-round-5/ISSUES.md) — the live audit log that caught the layout-viewport inflation bug
- [AGENTS.md hard rule 10](../../AGENTS.md) — floating UI portals
- [AGENTS.md hard rule 12](../../AGENTS.md) — inline-style for position math
- [`density.md`](density.md) — the four density tiers
- [`spacing.md`](spacing.md) — the 4-pt base + the `space.section.*` scale

---
name: Stat
type: component
status: stable · Warp signature
version: 0.2.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [LiveDot, RateTicker, Card]
spec: ./component.json
last_updated: 2026-05-06
---

# Stat

> A big bold number with a small mono unit and an optional delta. **Warp signature primitive.** The Stat is what makes the system feel like an instrument panel. Used in marketing heroes (`655K+ shipments`), KPI rows, mobile stat tiles, and embedded inside `Card`s.

## When to use
- KPI / metric callouts ("On time 98.2%").
- Marketing stat bands ("655K+ shipments routed").
- Quote results ("$262 / 1d transit").
- Anywhere a single number deserves emphasis.

## When NOT to use
- Inline body numbers — keep tabular `dash-tnum` mono for those, but don't use the full Stat layout.
- Counters that change every second — use a separate `Counter` component (with `aria-live`).

## Anatomy
1. Eyebrow label (`type.label.eyebrow`, uppercase, widest tracking)
2. Value (`type.display.{xl,lg,md}` depending on size, **always tabular monospace** via `dash-tnum`)
3. Optional unit (small, mono, `text-tertiary`)
4. Optional delta + sparkline row (small)
   - Delta pill on the LEFT (column-start aligned, `whitespace-nowrap shrink-0`)
   - Sparkline on the RIGHT (column-end aligned via `ml-auto`, fluid via SVG viewBox)
   - When only one of `{delta, spark}` renders, `ml-auto` degenerates correctly (spark-only → right; delta-only → left)

## Variants
| Prop | Values | Default |
|---|---|---|
| `size` | `sm` / `md` / `lg` / `xl` | `md` |
| `trend` | `up` / `down` / `flat` | — |
| `polarity` | `good-up` / `good-down` / `neutral` | `good-up` |
| `unit` | string | — |
| `delta` | string | — |
| `sparkData` | `number[]` | — |
| `pulse` | boolean | `true` when `sparkData` present |

The Sparkline accepts a `width` prop (default `88`) which acts as a **preferred max width**. The SVG renders at that width when the parent allows; in tight columns it scales down uniformly anchored to the right edge (`preserveAspectRatio="xMaxYMid meet"`) so the trend line + endpoint pulse stay readable and column-end-aligned. `vector-effect: non-scaling-stroke` keeps the polyline at 1.5 px regardless of scale.

## States
Static; the delta and sparkline are informational only. The endpoint pulse on the sparkline reads as live telemetry (v0.11.12 — see `micro-interactions.md` § Pulse).

## Accessibility
- Eyebrow label is `<div>` (semantic eyebrow), not `<h*>`.
- Value is plain text. Read aloud as "On time, 98.2 percent, up 0.4 points."
- Trend arrow uses `aria-hidden`; the trend meaning is in the delta string.
- Sparkline is `aria-hidden` — the trend is duplicated in the delta pill text.
- For a Stat that updates in real time, wrap in `aria-live="polite"`.

## Do
- Always tabular numerics so columns align across multiple Stats.
- Pair with a unit in `text-tertiary` so the number reads as the hero.
- For a row of Stats, use `StatGrid` to enforce uniform sizing.
- Use `sparkData={...}` for live KPIs — Stat owns the Sparkline, derives tone from `polarity + trend`, and adds the live endpoint pulse.
- Trust the fluid sparkline. Pass `width={88}` (the default) and the SVG will fit whatever column it lands in.

## Don't
- Don't bold the unit. The number is the hero.
- Don't put the delta inside the value. It's a separate line.
- Don't change the size between Stats in the same row.
- Don't pass a custom `<Sparkline>` via the legacy `spark={…}` escape hatch unless you genuinely need a non-line shape (heatmap, scatter). For lines, `sparkData` is correct.
- Don't manually wrap the sparkline with `shrink-0` to "lock" its width — the v0.11.17 fluid layout is the contract; locking it re-introduces the column overflow it was built to fix.

## StatGrid
A row of Stats. Pass `cols={2|3|4}` and optionally `divided` for an inter-column hairline rule.

`divided` renders the rule as a 1-px `::before` pseudo-element absolutely positioned at the gap-centre (v0.11.17). All columns share an identical content area, so the fluid sparkline inside each Stat renders at the same width across the row — the cross-column visual rhythm holds in any container width.

## Code
- [Web React](./examples/primary.tsx)

## Related
- [LiveDot](../live-dot/component.md) — pairs with Stat for "live KPI" pattern
- [RateTicker](../rate-ticker/component.md) — for streaming numerics
- [ADR 0019](../../../_meta/decisions/0019-sparkline-fluid-and-stat-grid-divider-v01117.md) — Sparkline fluid-width + symmetric StatGrid divider rationale

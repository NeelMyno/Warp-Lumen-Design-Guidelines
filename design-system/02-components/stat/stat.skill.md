---
name: lumen-stat
description: Use for hero KPI tiles — On-time index, Active lanes, Avg cost/pallet, Revenue. Always pass `polarity` so the pill tone + spark color agree. Six sizes (xs/sm/md/lg/xl/hero). For grids of stats use StatGrid (handles cross-column sparkline alignment). NEVER render two simultaneous SIGNATURES per surface — Stat is precious.
---

# Lumen Stat

Warp signature primitive. Big bold numeric (tabular monospace + slashed zero) + small mono unit + optional delta pill with polarity-aware trend arrow + optional Sparkline endpoint pulse. Polarity ('good-up' | 'good-down' | 'neutral') unifies pill tone with spark color so the chart never contradicts the pill. v0.11.16/.17 cross-column alignment + fluid spark.

## Use when

- Hero KPI tiles (OTD, Active lanes, Avg cost/pallet, Revenue).
- Top-of-dashboard summary row (StatGrid).
- Side panel metrics next to a chart.

## NEVER

- NEVER render two SIGNATURES (Stat + LiveDot pulse + RateTicker marquee) on the same surface simultaneously.
- NEVER hardcode the polarity — derive from the metric's domain semantics (revenue good-up vs cost good-down).
- NEVER skip lumen-tnum on the value (tabular numerics for cross-row alignment).
- NEVER use plain Title Case for the label — eyebrow is mono-uppercase tracked.

## Tokens consumed

- text.primary
- text.secondary
- text.tertiary
- status.success.bg
- status.success.fg
- status.danger.bg
- status.danger.fg
- status.neutral.bg
- status.neutral.fg
- type.20
- type.25
- type.31
- type.39
- type.49
- type.72
- type.13
- type.11
- tracking.tighter
- tracking.tight
- leading.flat
- space.1_5
- radius.full

## Anatomy

1. Label (lumen-eyebrow)
2. Value row — big numeric (tnum + tracking-tighter + leading-flat) + small mono unit
3. Delta + spark row — polarity-aware delta pill (radius-full) + endpoint-pulse Sparkline (ml-auto right-edge anchor)

## API

- `label` — string (eyebrow above the value).
- `value` — string (the numeric).
- `unit` — string (e.g. '%', 'pallets', 'days').
- `delta` — string ('+12.4%') — drives pill display.
- `trend` — 'up' | 'down' | 'flat'.
- `polarity` — 'good-up' (revenue, OTD) | 'good-down' (cost, errors) | 'neutral' (counts).
- `size` — xs | sm | md | lg | xl | hero.
- `sparkData` — number[] (Stat owns the Sparkline).
- `spark` — ReactNode (legacy escape hatch for custom content).
- `pulse` — override endpoint pulse (default: true when sparkData).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Pill icon (▲ / ▼ / →) is aria-hidden — the delta string already conveys direction.
- Sparkline is aria-hidden (decorative — the value carries the story).
- Use Stat inside a labeled region (Card, section) for screen-reader context.

## Code (canonical)

```tsx
import { Stat, StatGrid } from "@/components/ui/stat";

export function Example() {
  return (
    <StatGrid cols={4}>
      <Stat label="On-time index" value="98.2" unit="%" delta="+0.4pp" trend="up" polarity="good-up" sparkData={[94,95,96,97,98,98,98.2]} />
    </StatGrid>
  );
}
```

## Related

- StatGrid
- Sparkline
- LiveDot
- RateTicker
- KpiCard
- Trend

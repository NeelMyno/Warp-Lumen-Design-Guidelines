---
name: Stat
category: data
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react", "ios", "android"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["StatGrid", "Sparkline", "LiveDot", "RateTicker", "KpiCard", "Trend"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/stat"
---

# Stat

Warp signature primitive. Big bold numeric (tabular monospace + slashed zero) + small mono unit + optional delta pill with polarity-aware trend arrow + optional Sparkline endpoint pulse. Polarity ('good-up' | 'good-down' | 'neutral') unifies pill tone with spark color so the chart never contradicts the pill. v0.11.16/.17 cross-column alignment + fluid spark.

## When to use

- Hero KPI tiles (OTD, Active lanes, Avg cost/pallet, Revenue).
- Top-of-dashboard summary row (StatGrid).
- Side panel metrics next to a chart.

## Anatomy

1. Label (lumen-eyebrow)
2. Value row — big numeric (tnum + tracking-tighter + leading-flat) + small mono unit
3. Delta + spark row — polarity-aware delta pill (radius-full) + endpoint-pulse Sparkline (ml-auto right-edge anchor)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Pill icon (▲ / ▼ / →) is aria-hidden — the delta string already conveys direction.
- Sparkline is aria-hidden (decorative — the value carries the story).
- Use Stat inside a labeled region (Card, section) for screen-reader context.

## Tokens consumed

- `text.primary`
- `text.secondary`
- `text.tertiary`
- `status.success.bg`
- `status.success.fg`
- `status.danger.bg`
- `status.danger.fg`
- `status.neutral.bg`
- `status.neutral.fg`
- `type.20`
- `type.25`
- `type.31`
- `type.39`
- `type.49`
- `type.72`
- `type.13`
- `type.11`
- `tracking.tighter`
- `tracking.tight`
- `leading.flat`
- `space.1_5`
- `radius.full`

## Do

- Always pass polarity.
- Use StatGrid for multi-stat rows.
- Pair value with unit when ambiguous (98.2% vs 98.2).

## Don't

- Don't stack two signatures per surface.
- Don't hardcode polarity.
- Don't render Stat without a label.

## Related

- StatGrid
- Sparkline
- LiveDot
- RateTicker
- KpiCard
- Trend

## Code

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

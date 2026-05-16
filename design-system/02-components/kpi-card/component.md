---
name: KpiCard
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Stat, Trend, Sparkline, Card]
spec: ./component.json
last_updated: 2026-05-16
---

# KpiCard

> Single-metric card. Label → value → delta → sparkline → context.

## Anatomy

1. Label (eyebrow-mono uppercase).
2. Value (heading-h2, tabular-nums).
3. Delta (Trend, polarity-aware).
4. Sparkline (optional).
5. Context line (optional).

## Accessibility

- `role="region"`, `aria-label` includes label + value + delta + period.
- Interactive → button.

## Do

- One headline per card.
- Tabular-nums.
- Period reference on delta.

## Don't

- Don't pack two metrics.
- Don't oversize value.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

---
name: Trend
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Stat, KpiCard, Sparkline]
spec: ./component.json
last_updated: 2026-05-16
---

# Trend

> Numeric delta indicator. Polarity-aware tone, tabular alignment.

## When to use

- KPI cards.
- Stat block deltas.
- Table cells showing change vs a baseline.
- AI summary deltas.

## When NOT to use

- Absolute values — use **Stat**.
- Time series — use **Sparkline**.

## Polarity

| `polarity` | Use |
|---|---|
| `positive-is-good` | Revenue, conversions (default) |
| `negative-is-good` | Churn, latency, time-to-resolve |
| `neutral` | Direction only |

## Accessibility

- `aria-label` spells out delta + period.
- Always glyph + label + color.
- Tabular-nums alignment.

## Do

- Pair with period: "vs last 7 days".
- Use polarity for lower-is-better metrics.

## Don't

- Don't override tone by hand — use polarity.
- Don't render without a baseline reference.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

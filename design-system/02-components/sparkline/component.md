---
name: Sparkline
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Chart, Stat, KpiCard, Trend]
spec: ./component.json
last_updated: 2026-05-16
---

# Sparkline

> Inline micro-chart for a single series. 24-48 px tall. Pair with a Stat.

## Accessibility

- `role="img"`, `aria-label` includes value + trend.

## Do

- Pair with KpiCard / Stat.
- 24-32 px in KPI rows, 48 px in table cells.
- Last-point dot when latest value matters.

## Don't

- Don't render alone.
- Don't add axes / grid.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

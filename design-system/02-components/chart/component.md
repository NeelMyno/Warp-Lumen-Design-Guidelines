---
name: Chart
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Sparkline, KpiCard, Stat, Trend]
spec: ./component.json
last_updated: 2026-05-16
---

# Chart

> Generic chart wrapper. Eleven kinds, Lumen palette + axis tokens + tooltip skin.

## Kinds

`line`, `area`, `bar`, `stacked-bar`, `donut`, `pie`, `scatter`, `heatmap`, `sparkline`, `funnel`, `waterfall`.

## Palette

`CHART_PALETTE` — 8 stops. `chart.1` is the brand accent (primary series). `chart.2-8` are neutral / status hues.

## Accessibility

- `role="img"`, `aria-label`.
- `aria-describedby` → prose summary OR offscreen `<table>` of data.
- Never color-only differentiation.

## Do

- Palette in order; accent = primary metric.
- Tabular-nums on tick labels.
- Pair with ariaSummary.

## Don't

- Don't paint every series in accent.
- Don't drop the summary.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

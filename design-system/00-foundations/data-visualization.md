---
name: Data visualization
type: foundation
version: 0.14.2
last_updated: 2026-05-20
audience: [designer, engineer, llm-agent]
target: WCAG-2.2-AA
related:
  - ./principles.md
  - ./color.md
  - ./typography.md
  - ./accessibility.md
  - ./state-matrix.md
  - ../02-components/chart/
  - ../02-components/sparkline/
  - ../02-components/kpi-card/
  - ../02-components/stat/
  - ../02-components/trend/
---

# Data visualization

> **The Lumen rules for charts, sparklines, gauges, KPI cards, and any visual representation of numbers.** Authored v0.13.2 — closes the audit-cycle gap where `charts.tsx` shipped 18 chart types but no foundation doc said how to pick one, label one, color one, or fall back when data is missing.

## The discipline

Lumen visualization is **operator-console first**. Charts are read by people deciding what to do next — what carrier to dispatch, what cohort to retain, what tier to upgrade. Optimize for *fast, correct reading*, not decoration. Three rules above all:

1. **One job per chart.** Don't combine a bar chart with a trend line "for variety." If you need to compare cohorts AND show a trend, render two charts side by side. The reader's eye should know which question each chart answers.
2. **Numbers are the data.** A 6-digit revenue figure renders in tabular-nums Satoshi. Sparkline + Stat composes the visual + the value; never hide the value behind only the chart.
3. **Color carries meaning, never decoration.** The Lumen palette `CHART_PALETTE` is six positions; use them in order. Don't repaint a single-series chart with five colors to "make it pop." Spring Green is reserved for the current/active/most-important series — exactly one per chart, ever.

## When to use which chart

| Chart | Lumen primitive | Use when | Don't use when |
|---|---|---|---|
| **Line** | `LineChart` | Trend over time across 1-4 series, continuous data | Categorical comparisons (use Bar) |
| **Area** | `AreaChart` (line with `area={true}`) | Volume + trend; emphasizing absolute magnitude | More than 2 series (overplotting) |
| **Bar** | `BarChart` | Categorical comparison ≤ 12 categories | Trend over time (use Line) |
| **Stacked bar** | `StackedBar` | Composition + total across categories | Composition alone (use 100% stacked or Donut) |
| **Donut** | `DonutChart` | Part-to-whole, 2-6 segments, total displayed in center | Many segments (use Treemap) |
| **Pie** | `PieChart` | Part-to-whole, exactly 2-3 segments, no center value | Avoid — Donut is preferred per Cleveland-McGill perception order |
| **Heatmap** | `Heatmap` | Density across two dimensions (day × hour, region × day) | Sparse data (Scatter is better) |
| **Sparkline** | `MiniSparkline` (inline) | Inline-with-text micro-trend (KPI cards, table cells) | Standalone — pair with a value |
| **Scatter** | `Scatter` | Correlation between two continuous variables | Pure trend over time (Line) |
| **Radar** | `Radar` | Multi-dimensional comparison (skill profile, vendor scorecard) | More than 8 axes (overload) |
| **Treemap** | `Treemap` | Hierarchical proportional composition | Strict ordering or fine-grained comparison |
| **Funnel** | `Funnel` | Conversion stages, drop-off visualization | Categorical comparison (use Bar) |
| **Histogram** | `Histogram` | Distribution of a single continuous variable | Trend over time (Line) |
| **Waterfall** | `Waterfall` | Sequential additive/subtractive contributions to a total | Categorical comparison |
| **Bullet** | `Bullet` | Single value vs target with optional bands | Multi-series (use Bar) |
| **KPI card** | `KpiCard`, `Stat` | Hero numeric with delta + optional sparkline | Comparing > 1 KPI side-by-side (use multiple KpiCards) |
| **Cohort** | `Cohort` | Retention / churn over relative time periods | Absolute-time trend (Line) |

## Axes, gridlines, labels

- **X axis labels** — when categorical, every value. When time-series, sample the axis (every Nth tick) so labels don't overlap. The horizontal `space.4` between ticks is the minimum.
- **Y axis** — Lumen charts show gridlines, not axis ticks, by default. Gridlines use `var(--border-hairline)` (6% alpha) — present but not loud. Origin (0) gridline can be slightly stronger via `var(--border-subtle)` (8%).
- **Y axis labels** — only when the magnitude isn't self-evident. Sparklines have no axis. KPI cards have no axis (the big number IS the y axis). Full LineCharts get labels at min, max, and 2-3 intermediate stops.
- **Always include units** — "$" in the prefix, "ms" / "%" / "/ mo" in the suffix. Never make the reader guess.
- **Tabular nums** — every numeric label uses `font-feature-settings: 'tnum'` (via the `var(--type-data-md)` preset). The 1.25 modular type scale + tabular nums means columns of numbers align right-edge with no manual padding.

## Legends

- **Single-series chart** → no legend. The title says what it is.
- **Multi-series chart (2-4 series)** → `ChartLegend` at top-right or bottom. Each entry is a colored dot + label + (optional) current value.
- **Many-series chart (5+ series)** → reconsider whether this is one chart. If it must be, legend top-aligned with the chart; consider an interactive legend that filters on click.

## Color rules

The Lumen palette in [`charts.tsx`](../../audit-dashboard/src/components/primitives/charts.tsx#L9):

```ts
export const CHART_PALETTE = [
  "var(--lumen-accent-5)",   // Spring Green — current / active / primary series
  "var(--lumen-cream-5)",    // Cream — secondary series (warm-neutral, low-contrast against green)
  "var(--lumen-amber-5)",    // Amber — tertiary (warning-tier hue, distinguishable from green)
  "var(--lumen-red-4)",      // Red — quaternary (use for "negative" or "loss" series)
  "var(--lumen-obsidian-5)", // Obsidian — quinary (rarely needed)
  "var(--lumen-accent-7)",   // Deep accent — senary (return to green family at darker stop)
];
```

**Hard rules:**

- **One green per chart.** Spring Green `#00FA8A` is the action/live/success accent — it carries semantic weight. Use it for *one* series only — the "current," "active," or "most-important" one. Painting two series in green confuses the brand contract and breaks color-blind users (deuteranopia → both reads as gray).
- **No red/amber together without a meaning contract.** If both appear, one is "danger" and the other is "warning"; never use them as arbitrary distinguishers.
- **Status colors are separate from chart colors.** `var(--color-status-danger-500)` (refined red `#E5484D`) and `var(--color-status-warning-500)` (refined amber `#F5B118`) are for textual status (Alert, Badge tone). Chart series colors come from `CHART_PALETTE`. Don't mix.
- **Color-blind safe.** The palette has been verified for deuteranopia + protanopia + tritanopia distinguishability via tools like Sim Daltonism. New series colors must be checked against the existing palette before merge.

## Empty / loading / error states

Every chart in production code MUST handle three states beyond the happy path. Lumen `charts.tsx` showcase versions don't ship these by default — consumer code wires them.

| State | Pattern | Lumen primitive |
|---|---|---|
| **Empty** (no data) | `EmptyState` with chart icon + "No data for this period" + suggested action (e.g. "Try a wider date range") | `<EmptyState icon={<BarChart3 />} heading="No data" />` |
| **Loading** | `Skeleton` rectangle at the chart's intrinsic dimensions; do not show a spinner inside a 360×180 chart frame (spinner reads as "broken") | `<Skeleton className="h-[180px] w-full" />` |
| **Error** | `Alert tone="danger"` with the error message + a retry button | `<Alert tone="danger">Failed to load. <Button onClick={retry}>Retry</Button></Alert>` |
| **Partial** (some series loaded, some missing) | Render what loaded with a `Toast` informing about the missing series | render partial + inline `<ValidationMessage tone="warning">2 of 5 series missing</ValidationMessage>` |
| **Stale** (last refresh > N minutes) | `LiveDot` next to the chart turns from green pulse to amber static; tooltip "Last refreshed N min ago" | `<LiveDot tone={stale ? "warning" : "live"} />` |

## Accessibility

- **Every `<svg>` chart needs `aria-label`** describing what it shows ("Revenue by month — last 12 months"). The Lumen `ChartFrame` accepts a `label` prop; pass it.
- **For dense charts, also provide `aria-describedby`** pointing to a paragraph that names key values ("Highest revenue: May at $134k. Lowest: January at $58k. Current month tracking 12% above prior.").
- **Color is never the sole encoder.** Pair color with shape (dotted line, filled vs hollow circle), with text (legend), or with position (bar height) — never just color.
- **Keyboard reachability** — interactive chart elements (tooltip triggers, legend toggles) must be focusable via Tab. Non-interactive charts get `role="img"`.
- **Reduced motion** — animated chart transitions honor `prefers-reduced-motion: reduce`. Bar growth animations, line drawing, area fills all opt out under reduce.

## Tooltips

- **Hover-revealed value** — the canonical pattern: hover/tap snaps to the nearest data point and reveals a `Popover`-style label with the value + axis position.
- **Portal the tooltip** — per AGENTS.md hard rule 10. Inline `<div absolute>` gets clipped inside Card / Showcase / scroll containers.
- **Snap, don't track** — the tooltip should anchor to the nearest data point, not float with the cursor between points. Reader's eye expects discrete.
- **Use `Trend` for delta lines** — when a tooltip shows a delta vs prior period, compose `<Trend delta={...} />` so the visual language matches the rest of the system.

## Composition with KPI cards

The canonical operator pattern: a KPI card with the metric, the delta, and an inline `MiniSparkline`:

```tsx
<KpiCard
  title="Active loads"
  value="1,284"
  delta={+8.4}
  sparkline={<MiniSparkline data={trend} />}
/>
```

The card communicates three things at three scales: the headline number (big), the delta (small + colored), the trend (visual but no value). This is the **peak-end pattern** from Premium Psychology principle 3 — the headline number is the peak, the trend is the end (the lingering impression that the number is moving in a direction).

## Common mistakes

- **Painting series 2 in green to "match the brand."** No. Green is the *primary* series only. Series 2 is cream.
- **Adding a dashed line "for visual interest" when only one series exists.** Decoration. Remove.
- **Putting the chart inside a `<Card padding="md">` that's narrower than the chart's intrinsic min-content.** The chart overflows. Use `<Card padding="none">` (per ADR 0021, auto-clips edge-touching children) or give the card enough width.
- **Inline tooltip in an overflow-clipped ancestor.** Per AGENTS.md hard rule 10, portal it.
- **Sparkline without a paired numeric value.** Useless. Always show the value (rule 2 above).
- **Pie chart with > 4 segments.** Use Treemap or Donut. Pie's angular comparison degrades fast past 3-4 wedges per Cleveland-McGill.
- **Warning / danger tone on a value of zero.** See "Tone gates at zero" below — color-as-signal credibility erodes when warning colors shout at calm states.

## Tone gates at zero (v0.15 R16)

**A warning at zero is no warning. A danger at zero is no danger.**

When a KPI tile's underlying value is `0` / `null` / `[]` / empty, the warning / danger tone retires to neutral. The tone color signals "there's something to act on" — when there isn't, the color is wrong.

The TMS consumer (chat 36-A) hit this on the Accounting page: `OVERDUE $0` rendered in warning amber — a calm state styled as a warning. The dashboard's `InvoiceKpiStrip` rendered the same data correctly (neutral on zero) because it gated amber on `overdue_cents > 0`. The "amber means there's something to act on" contract lived in author folklore, not in a primitive. v0.15 R16 bakes the contract into `.lumen-kpi-tile`.

### The defensive class

```tsx
<span
  className="lumen-kpi-value"
  data-tone="warning"
  data-value-zero={overdueCents === 0 ? "true" : undefined}
>
  {formatCurrency(overdueCents)}
</span>
```

The CSS rule `.lumen-kpi-value[data-tone="warning"]:not([data-value-zero="true"]) { color: var(--status-warning-fg); }` enforces the tone-gate. When `data-value-zero="true"` is set, the warning tone retires and the value renders in `--text-primary` (neutral).

### The polarity rule

For delta values (% change vs last period), tone follows polarity AND the "what's good" direction:

| Value | Polarity | Tone |
|---|---|---|
| `+12%` on revenue (positive-is-good) | up-good | `--status-success-fg` |
| `+12%` on churn (negative-is-good) | up-bad | `--status-danger-fg` |
| `-12%` on revenue | down-bad | `--status-danger-fg` |
| `-12%` on churn | down-good | `--status-success-fg` |
| `0%` on anything | neutral | `--text-secondary` |

Apply via `data-tone="positive|negative"` on the `.lumen-kpi-delta` span. Zero (or near-zero — within ±0.5%) reads as neutral, NOT as success or danger.

### Status-as-supplement extends to KPI values

The rule from [color.md §6](color.md#6-status-palette--color-is-supplement-not-signal) ("color is supplement, not signal — pair every status color with a label or icon") applies to KPI values too. The amber `OVERDUE $X` value is _supplemented_ by:
- The numeric value itself (the operator reads "$0" as zero, regardless of color).
- The label "OVERDUE" (the operator knows what the field means).
- The status icon (when one exists).

Tone-gating at zero means the color disappears when the supplement says "nothing to act on" — the operator's attention stays available for the values that DO need it.

## Related

- [`charts.tsx`](../../audit-dashboard/src/components/primitives/charts.tsx) — implementation.
- [`design-system/02-components/chart/component.md`](../02-components/chart/component.md) — Chart primitive contract.
- [`design-system/02-components/sparkline/component.md`](../02-components/sparkline/component.md) — Sparkline contract.
- [`design-system/02-components/kpi-card/component.md`](../02-components/kpi-card/component.md) — KpiCard contract.
- [`design-system/02-components/stat/component.md`](../02-components/stat/component.md) — Stat contract.
- [`design-system/00-foundations/color.md`](color.md) — full palette, including the dark + light alpha ladders.
- [`design-system/00-foundations/typography.md`](typography.md) — tabular-nums + `type.data.*` + `type.metric.*` presets.
- [`design-system/00-foundations/accessibility.md`](accessibility.md) — keyboard + screen-reader + reduced-motion contracts.

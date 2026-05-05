---
title: Data Viz audit — 2026-05-04
type: audit
created: 2026-05-04
last_updated: 2026-05-04
source: original
tags: [audit, data-viz, premium-psychology]
---

# Data Viz audit · v0.11.11 · live deployment

Live audit of charts, KPIs, sparklines, donuts, rate-ticker, live-dot, heatmap, treemap, funnel, customer-rating, and other data-affordances against:

1. **Halo effect** — 50ms first impression
2. **Cognitive fluency** — clarity over noise
3. **Peak-end rule** — micro-interaction craft
4. **Aggressive hierarchy** — one focal point per section
5. **Restraint** — what you leave out
6. **Care in details** — pixel craft

## P0 — semantic correctness (must fix)

### F1. AVG COST/PALLET sparkline tone contradicts trend pill

**Where:** SaaS dashboard top KPI strip + Foundations live-data section.

**Bug:** The "Avg cost / pallet" Stat renders a RED trend pill (`▼ -3.6%`) but a GREEN sparkline. The two visuals contradict each other for the same metric.

**Root cause:** `Stat` has no notion of metric polarity. `trend="down"` always paints the pill in danger colors, ignoring that for cost, lower is better. Sparkline `tone="success"` is set manually, but the pill can't be overridden the same way.

**Fix:** Add `polarity?: "good-up" | "good-down" | "neutral"` to `Stat`. When `trend` matches `polarity`, both pill and sparkline render success (green). When they oppose, render danger (red). Drop manual `tone` overrides on the dashboard.

### F2. Cohort grid uses `text-white` over Spring Green

**Where:** `audit-dashboard/src/components/primitives/charts.tsx:545` (Cohort).

**Bug:** Cells with `color-mix(... var(--lumen-accent-6) X% ...)` background use `text-white` foreground. At high X (≥70%), background is near-pure spring green and white text contrast drops to ~1.4:1 (WCAG fail). This is also the EXACT pattern that ADR 0018 banned in v0.9 — `accent-fg` must be paired with the accent ramp.

**Fix:** Replace `text-white` with `text-[var(--lumen-accent-fg)]` (`#07120D`, AAA on accent). Verify low-X cells still read since they fade toward `surface-sunken` — accent-fg on surface-sunken is fine in dark mode but borderline in light.

### F3. Treemap uses `text-white` over CHART_PALETTE

**Where:** `audit-dashboard/src/components/primitives/charts.tsx:360`.

**Bug:** Same as F2 — `text-white` over palette colors that include spring green (`var(--lumen-accent-5)`). Renders at ~1.4:1 on accent.

**Fix:** Use `text-[var(--lumen-accent-fg)]` for accent tile, semantic fg tokens for others. Better: derive fg from bg lightness via a small helper.

## P1 — premium polish (high impact, ship now)

### F4. KPI cards have no hover affordance

**Where:** SaaS dashboard `<KpiRow>` + Lane performance + side-panel "On-time index".

**Bug:** Cards render fully static. Per peak-end rule, the user gets zero "this is alive" signal when interacting.

**Fix:** Add a soft hover state: `hover:bg-[var(--surface-sunken)/40]` plus a hairline border tint, with `transition-colors duration-[var(--motion-fast)]`. Honor `prefers-reduced-motion` (handled via the existing motion tokens).

### F5. Lane-performance trend pill wraps onto 2 lines

**Where:** SaaS dashboard `<LanePerf>`. Zoom shows `+1.2 pts` rendering as `+1.2` (in pill) then `pts` (underneath).

**Bug:** Stat trend pill in `stat.tsx:74-86` doesn't whitelist `whitespace-nowrap`. Combined with the narrow column from `StatGrid cols={4}`, the unit "pts" spills out.

**Fix:** Add `whitespace-nowrap` to the pill's class list and `inline-flex` to keep the arrow + text + suffix inline.

### F6. On-time donut center value is undersized vs. its meaning

**Where:** SaaS dashboard `<SidePanel>` "On-time index" card → `<ProgressRing value={98} … />`.

**Bug:** The "98%" floating inside the ring reads visually smaller than the "+0.4 pts" text outside, inverting the hierarchy. The donut IS the metric; it should command the eye.

**Fix:** Bump `ProgressRing` center text size to `text-[var(--type-25)]` (or larger), `font-bold`, `lumen-tnum`. Make the surrounding "+ 0.4 pts" the supporting text, not the lead.

### F7. Rate ticker arrows are visually weak

**Where:** `rate-ticker.tsx`. Arrow glyph is 10px text. At small marquee size on landing/foundations, the arrows nearly disappear.

**Fix:** Bump arrow to `text-[11px]`, `font-medium`, and pad an extra 2px gap so the arrow reads cleanly next to the price.

### F8. Sparklines have no live "endpoint pulse"

**Where:** All Stat sparklines.

**Bug:** Lines feel like static png stand-ins. A small breathing pulse at the last data point would amplify the "live" character of these dashboards (peak moment).

**Fix:** Add an optional `pulse` prop (default true when used inside `Stat`). Renders a 3px `circle` with a CSS-driven `radius` pulse at the line's endpoint. Honors `prefers-reduced-motion`.

## P2 — refined craft (would ship in next pass)

### F9. Customer-Rating histogram uses generic gray bars

**Where:** Commerce page customer rating block.

**Bug:** Rating bars are mid-neutral. Information density would improve if 5★/4★ used accent (positive) and 1★/2★ used a muted danger.

**Fix:** Use `--lumen-accent-5` for 5★, accent-4 for 4★, neutral for 3★, danger-3 for 2★, danger-4 for 1★ (subtle, not loud).

### F10. Landing-stat strip is flat (no sparklines, no deltas)

**Where:** `<HomeStrip>` on landing page.

**Bug:** "655K+, 98.2%, 27%, 1,547" stand naked. The transcript's halo principle says the hero must communicate "alive premium product." Static numbers don't.

**Fix:** Add tiny sparklines and `▲ wow` deltas to each, mirroring the SaaS dashboard primitives exactly. This is the same Stat component re-deployed for the marketing surface. (Risk of clutter — keep deltas tiny, the sparklines as ghosts.)

### F11. Chart legend has no hover affordance

**Where:** `<ChartLegend>` in charts.tsx.

**Bug:** Legend items are static text + dot. Hover should at minimum show pointer + slight bg tint, even if click-to-filter isn't wired in this audit dashboard.

**Fix:** Wrap in a button-shaped surface with `hover:bg-[var(--surface-sunken)]` and `cursor-pointer`.

### F12. Donut center stacking — `centerLabel` reads as label, not delta

**Where:** `DonutChart` in charts.tsx.

**Fix:** Tighten center spacing; `centerLabel` should sit closer (current y offset = +12 px, looks loose at small donut sizes).

## Non-issues (audited and approved)

- Spring Green accent restraint is intact — only one loud color across the system.
- LiveDot states (TRACKING LIVE, API HEALTHY, QUOTE REFRESHING, NETWORK SLOW, CARRIER OFFLINE, BETA CHANNEL) read clearly. Pulse animation is subtle and respects `prefers-reduced-motion`.
- Tabular numbers (`lumen-tnum`) used everywhere financial — good craft.
- Dark mode default is correct for an instrument-panel dashboard.
- Light mode parity holds across the data viz components.

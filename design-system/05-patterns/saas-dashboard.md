# saas-dashboard — the canonical Warp operator console

> The shape of every Warp internal dashboard, ops console, and customer-facing analytics surface. 240 px sidebar + 56 px top bar + dense main with a KPI row, a primary table, and a side panel. Operator density (24 px section rhythm). Live telemetry signals (sparkline endpoint pulse, RateTicker arrows). Reference implementation: [`audit-dashboard/src/app/saas/page.tsx`](../../audit-dashboard/src/app/saas/page.tsx).

This pattern is the contract for the surfaces a Warp operator opens at 9 AM and reads in scan mode for the rest of the day. It is the most-used pattern in the system — the freight Bloomberg terminal Warp's brief promised — and the one that diverges most aggressively from a marketing-template default. Get density wrong and the page reads as a marketing site with a sidebar; get hierarchy wrong and the operator can't find the one number they came for.

---

## 1. The shape

```
DashboardShell                            ← outer 1100–1440px frame
├── Sidebar (240px fixed)
│   ├── WorkspaceSwitcher                 → 28px tile + name + caret, hover surface.sunken
│   ├── NavSection × N                    → eyebrow + 3–6 nav links
│   │   └── NavLink                       → 15px icon + label-sm + optional badge
│   └── StatusFooter                      → LiveDot "API healthy" + version + p50 latency
│
├── Main column
│   ├── TopBar (56px)
│   │   ├── PageTitle + LiveBadge         → heading-h3 + "Live" badge + date strip
│   │   ├── CommandPaletteButton          → search affordance with ⌘K kbd
│   │   ├── NotificationsIconButton       → Bell with accent dot
│   │   ├── AvatarGroup                   → max 3 stacked
│   │   └── PrimaryAction                 → Button intent=primary size=sm
│   │
│   └── Main (p-6 = 24px page padding)
│       ├── KpiRow (Card padding=lg, .lumen-stat-card)
│       │   └── StatGrid cols=4 divided
│       │       └── 4× Stat size=lg with sparkData + delta + polarity
│       │
│       ├── ContentGrid (lg:grid-cols-[1fr_320px])
│       │   ├── PrimaryColumn
│       │   │   ├── PrimaryTable          → Card padding=none, hairline rows, 32–40px tall
│       │   │   │   ├── TableHeaderBar    → title + InlineTabs (pill) + Filter/Open queue
│       │   │   │   ├── <table>           → Th lumen-eyebrow / Td body-xs / mono numerics
│       │   │   │   └── PaginationFooter  → "7 of 1,284" + Prev/Next
│       │   │   └── TelemetryStrip        → LanePerf — 4 secondary Stats
│       │   │
│       │   └── SidePanel (320px fixed)
│       │       ├── ActivityCard          → CardHeader + lumen-row-divider list
│       │       ├── QuoteLaneCard         → CardHeader + 3 Field + Button primary fullWidth
│       │       ├── OnTimeIndexCard       → ProgressRing + delta + target
│       │       └── EmptyTaskCard         → CardHeader + body-xs + Button secondary
│       │
│       └── EmptyState (when zero data)
│           └── icon + heading + description + Button primary
```

The shape is a 240 + 1fr column. The right side panel is a 320 px column inside the main flow, not a third sibling — it's the "context" lane and it scrolls with the page. The KPI row spans full width; the table + side panel split below it. This is the audit-dashboard reference exactly; deviations need a reason.

---

## 2. Density mode

**Operator density.** Section rhythm is `space.section.dense` (24 px) between Card blocks, page padding is `p-6` (24 px), table rows are 32–40 px, KPI cards are 16 px inset, sidebar nav links are 6 px vertical padding. This is the dense tier from [`density.md`](../00-foundations/density.md) §2 and the `compact` mode from §5 — the operator default.

**Why operator density on operator surfaces.** An operator looking at 200 shipments at 9 AM does not want a 64 px row. They want 32 px rows, tight cells, scannable margin, a scrollbar that earns its keep, and a sidebar that doesn't waste 240 px on padding. Per the Warp brief D-007: "Dense over airy. Long single-column pages with 12+ sections are acceptable as long as each section is typographically composed."

**The single biggest mode mistake** is bringing marketing density (96 px section rhythm) onto a dashboard. The page becomes a "marketing site with a sidebar" — wrong tier, broken trust. Conversely, putting operator density on a landing page reads as cluttered. Both directions are wrong. Pick by surface intent, not aesthetic preference.

**Mobile nuance.** Compact mode (32 px) is below the 44 × 44 px touch floor. Mobile clients auto-bump compact controls to ≥ 48 px under `pointer: coarse` — the dashboard pattern is desktop-first; the iOS app uses a different shape from [`mobile-primary.md`](./mobile-primary.md).

---

## 3. Tokens for wrappers

Wrappers are the dashboard's skeleton. Every container reaches for `space.*` semantic tokens, never primitives.

| Wrapper | Token | Pixels | Notes |
|---|---|---|---|
| Sidebar width | fixed `240px` (literal) | 240 | The sidebar is a navigation chrome dimension, not a content one. Don't tokenize this; it's a spec. |
| Sidebar vertical padding | `space.3` | 12 | Tight at the top — workspace switcher reads as identity, not section. |
| Sidebar nav link padding | `space.2` horizontal / `space.1_5` vertical | 8 / 6 | Nav rhythm; below the touch floor on desktop, auto-bumped on mobile. |
| Sidebar nav section gap | `space.5` | 20 | Between section groups (Operate / Build / Settings). |
| TopBar height | `h-14` (56 px literal) | 56 | Standard chrome height across operator portals (Linear, Plaid, Notion). |
| TopBar horizontal padding | `space.6` | 24 | Same as page padding — the bar reads as the top edge of the main column. |
| Main page padding | `p-6` → `space.6` | 24 | Operator page margin. The most common drift is to use `p-10` (40 px) here — that's marketing. |
| Block-to-block gap (KPI → grid → table) | `gap-6` → `space.6` | 24 | `space.section.dense` — the operator section rhythm. |
| Card inset (default) | `space.inset.lg` | 24 | Card's `padding="lg"`. The KPI row card uses lg; nested table cards use `padding="none"` (table paints its own). |
| KPI grid divider | `divided` prop on `StatGrid` | — | Renders the column hairlines internally; no extra wrapper. |
| Side panel column | fixed `320px` | 320 | Content lane width, not chrome. Aligns with the typical card layout — title + 280px content + 16px right gutter. |
| Side panel inter-card gap | `gap-4` → `space.4` | 16 | Tighter than block-to-block — these cards are siblings, not sections. |
| Table row inset | `px-4 py-3` → `space.4` / `space.3` | 16 / 12 | 40 px row floor with body-xs typography. Compact tables can drop to `py-2` for 32 px. |
| Container width | `size.container.max` | 1440 | Audit dashboard ceiling. Operator-specific consoles can use `size.container.ultra` (1920) on 32" ops monitors. |

Notice what's missing: no `space.section.lg`, no `space.section.xl`, no `space.section.hero`. Those are marketing tokens. If you reach for them on a dashboard, the page has drifted into marketing mode.

---

## 4. Component recipe

### Sidebar

| Role | Component | Variant | Why |
|---|---|---|---|
| Container | `<aside>` on `surface.raised` with right border-hairline | — | Raised surface separates nav chrome from page content; the hairline carries the structural break, not a shadow. |
| Workspace switcher | plain `<button>` | 28 px tile (`bg-color-accent`, `text-on-accent`) + name + caret | The accent tile is the only place the lime touches the nav — it's the workspace identity, not decoration. |
| Nav section | flex column with `lumen-eyebrow` + nav links | — | Eyebrow at 12 px uppercase tracked, `text-tertiary`. Section labels are tertiary; nav items are secondary; active is primary. |
| Nav link | `<a>` with conditional active class | active: `surface.tint.accent` + `text.primary` font-semibold; rest: `text.secondary` | Active uses the accent-tint surface (a 4–8% accent wash) — readable, not loud. Per `color.md` §1, the accent-tint surface is the legal way to signal selection without a second color. |
| Badge on nav link | inline mono span with `lumen-tnum` | `text-micro` | Counts on Shipments, Tasks. Not a `<Badge>` component — too heavy for nav. |
| Status footer | inline card with `<LiveDot label="API healthy" />` + version + p50 latency | — | Live, version, latency. The canonical Warp operator footer. |

### TopBar

| Role | Component | Variant | Why |
|---|---|---|---|
| Container | `<header>` on `surface.raised` with bottom border-hairline | `h-14` | Same surface as sidebar — they read as connected chrome. |
| Page title | `<h1>` + `<Badge status="accent" leadingDot>Live</Badge>` + date | `text-heading-h3` | h3 (20 px) not display — this is app structure, not marketing. |
| Search | `<CommandPaletteButton>` | — | Reads as a button, opens ⌘K palette. The `<kbd>` shortcut hint is the canonical operator move. |
| Notifications | `<IconButton>` | `intent="tertiary"` with `Bell` + accent dot | The dot signals unread without a count badge — quieter than `<Badge>`, louder than nothing. |
| Avatar group | `<AvatarGroup>` | `size="sm"` `max={3}` | Three faces stacked; presence signal. |
| Primary action | `<Button>` | `intent="primary" size="sm" leadingIcon={<Plus />}` | sm (32 px) — operator default. The "New shipment" action lives here, not in the page body. |

### KPI row

| Role | Component | Variant | Why |
|---|---|---|---|
| Container | `<Card padding="lg" className="lumen-stat-card">` | — | The `.lumen-stat-card` class (added v0.11.12) gives the KPI hover lift — the "this is interactive" affordance. |
| Grid | `<StatGrid cols={4} divided>` | — | Four columns is the operator default. Three feels marketing; five overflows on the typical 1280 px display. |
| Each stat | `<Stat>` | `size="lg"`, `sparkData`, `delta`, `trend`, `polarity` (when needed) | size=lg (49 px metric) — louder than the marketing band's xl, because the dashboard has no "hero band" to top it. |
| Cost / latency / error stat | `<Stat polarity="good-down">` | — | The v0.11.12 fix. Cost-down is good — without `polarity="good-down"` the trend pill paints red while the spark paints green; visible contradiction. Audit cost / latency / error / churn / refund stats explicitly. |

### Primary table

| Role | Component | Variant | Why |
|---|---|---|---|
| Container | `<Card padding="none">` | — | Table paints its own padding; card just supplies the hairline border + radius. |
| Header bar | flex row with title + tab switcher + filter button | `border-b border-hairline px-4 py-3` | Title at heading-h5 (15 px); count via `<Badge status="neutral">`; tab switcher via `<InlineTabs variant="pill" size="sm">`. |
| Filter button | `<Button>` | `intent="tertiary" size="sm" leadingIcon={<Filter/>}` | Tertiary button — quiet, scannable. |
| Open-queue button | `<Button>` | `intent="secondary" size="sm" trailingIcon={<ArrowRight/>}` | Secondary on the right edge of the header — the escape hatch. |
| Header row | `<th>` with `lumen-eyebrow font-semibold` | — | Column labels are eyebrow-styled — 12 px uppercase tracked. Differentiates from cell text. |
| Body row | `<tr>` with `border-t border-hairline hover:surface-sunken cursor-pointer` | — | Hairline rows, not striped. Hover shifts to sunken for the affordance. Cursor-pointer signals "click into detail." |
| Numeric cells | `<td>` with `lumen-mono lumen-tnum text-right` | — | Tabular figures right-aligned. Non-negotiable for ETA, weight, cost. Lining figures via `tnum`. |
| ID cells | `<code className="lumen-mono">` | — | Mono for IDs — operator pattern. Reads as "this is a key, not prose." |
| Status cells | `<Badge status="success|info|warning|danger|neutral" leadingDot>` | — | Status pills with leading dot. Accent dot is the live signal. |
| Pagination footer | flex row with count + Prev/Next ghost buttons | `border-t border-hairline px-4 py-2 surface.raised text-micro` | Tertiary xs buttons — paginate is supporting, not primary. |

### Side panel

| Role | Component | Variant | Why |
|---|---|---|---|
| Activity card | `<Card>` + `<CardHeader title="Activity" action={<Badge accent leadingDot>Live</Badge>}>` | `lumen-row-divider` list | The accent badge in the header reads as "live data." Items are flex rows with 24 px icon tile + message + relative time. |
| Quote-a-lane card | `<Card>` + `<CardHeader>` + 3 `<Field>` + `<Button primary fullWidth>` | size=sm, mono | The miniature form: From / To / Weight. Stateful affordance — operator can quote without leaving the page. |
| On-time index card | `<Card className="lumen-stat-card">` + `<ProgressRing value=98 tone="success" size=64 stroke=5>` + delta + target | — | The `.lumen-stat-card` lift signals "this is a metric." ProgressRing with success tone is the canonical Warp KPI ring. |
| Empty task card | `<Card>` + `<CardHeader title="No tasks today" />` + body-xs + `<Button secondary>` | — | The fourth side-panel slot is reserved for state-aware content — when there *are* tasks, this becomes a task list; when there aren't, it becomes a soft CTA. |

### Empty state (zero data)

| Role | Component | Variant | Why |
|---|---|---|---|
| Container | `<EmptyState>` | — | Component owns the icon + heading + description + primary action shape. Don't hand-roll one. |
| Icon | 24 px monoline | `text-tertiary` | Per [`04-content/iconography.md`](../04-content/iconography.md): 1.5 px stroke, rounded line caps, 24 px grid. |
| Heading | `text-heading-h3` | — | One bold piece of guidance. What is the *one* thing the operator should do first? |
| Description | `text-body-md text-secondary` | — | Two lines max. Not a tutorial. |
| Primary action | `<Button intent="primary" size="md">` | — | Empty-without-action is a dead end per [`first-impression.md`](../00-foundations/first-impression.md) §5 and [`04-content/empty-states.md`](../04-content/empty-states.md). Always ship a CTA. |

### The `.lumen-stat-card` affordance

Added in v0.11.12. Applied to any Card that should signal "this is interactive metric data" via a hover-lift micro-interaction. KPI row uses it; the on-time-index card uses it; the lane-performance strip uses it. Don't apply it to passive content cards (Activity feed, Quote-a-lane form) — the lift is a promise of click-to-drill, and applying it where there's no drill breaks the contract.

---

## 5. Anti-patterns

The wrong-feeling compositions to avoid. Most of these are LLM-default mistakes — porting a marketing dashboard template into an operator surface, over-decorating with shadows, getting polarity wrong on cost metrics.

- **Marketing density (96 px section) on a dashboard.** The single biggest mistake. The page becomes a "marketing site with a sidebar" — operators read it as not-for-them. Use `space.section.dense` (24 px) and `p-6` page padding. If you find yourself reaching for `py-section-xl`, you're on the wrong pattern.

- **Cards everywhere.** The dashboard hairline-grid is dense; cards-in-cards bloats space. The KPI row is *one* card containing the StatGrid; the table is *one* card with `padding="none"`; the side panel is *separate* cards because each is a discrete content unit. Don't wrap the page header in a card. Don't wrap the sidebar nav in cards. Don't put each KPI in its own card.

- **Polarity bug — default `good-up` on a cost / error / latency metric.** The canonical example fixed in v0.11.12. The AVG COST card with `trend="down"` and `delta="-3.6%"` was painting the trend pill red (because down = bad by default) and the sparkline green (because the sparkData declined and auto-derived "improving"). Visible contradiction. Fix: `polarity="good-down"` on cost, latency, errors, churn, refunds, time-to-resolution, and any metric where "less is better."

- **Pure-black shadows everywhere.** Lumen uses hairline borders + minimal shadow. The KPI card has a hairline + the `.lumen-stat-card` lift; the side-panel cards have hairlines and no shadow; the table card has a hairline. Drop-shadow-on-everything is brutalist-misread — Warp's brutalism is *typographic* and *structural*, not chrome-heavy.

- **Hidden Settings button or no breadcrumb.** Operators need spatial orientation. The sidebar's status footer carries identity (workspace + version + API health); the top-bar carries page title + date strip; the page header carries the section eyebrow. If a new operator can't tell where they are in 5 seconds, the orientation chrome failed.

- **Sidebar that collapses on hover (modal-like).** Lumen sidebars stay fixed at 240 px. A hover-collapse turns the sidebar into a peekaboo modal — the operator's spatial map breaks every time the sidebar moves. If you need a collapsed mode for a 1280 px viewport, ship a *toggle* (sticky 60 px rail) — not a hover behavior.

- **A primary lime CTA in the page header AND in the side panel.** Two primary CTAs compete for the operator's eye. The page-level primary lives in the top bar (e.g., "New shipment"); the side-panel form ends in a fullWidth primary button (e.g., "Get rates") — these are different actions in different contexts and don't compete *visually* because they're far apart. But two primary CTAs on the same KPI row, or two on the same card, breaks the single focal point rule.

- **Tab switcher with > 4 tabs.** `InlineTabs` works at 2–4. Five tabs require a second pattern (segmented dropdown, or a sub-nav). If you have five sections, consider whether they're really tabs or whether two of them belong elsewhere.

- **Numerics not aligned tabular.** Right-aligned ETA, Weight, Cost columns *must* use `lumen-mono` + `lumen-tnum` (the `tnum` OpenType feature). Lining figures align across rows; proportional figures stagger and read as cheap. Same for the side-panel deltas (`+0.4 pts`) and the sparkline-adjacent numbers in the KPI row.

- **Status badge without `leadingDot` on live states.** "On time" / "Pickup" / "At risk" / "Late" all carry `leadingDot` — the dot is the live-state signal. "Delivered" doesn't (terminal state). If every badge has a dot, the dot stops meaning anything; if no badge has one, the live signal is missing.

- **Side panel that's wider than 360 px.** 320 px is the operator default. Going wider eats the table's column count and forces horizontal overflow on the primary content. If the side panel needs more room, the layout has shifted from "table + context" to "two-column reading" and that's a different pattern.

- **Empty-state copy that apologizes.** "Sorry, no data yet." or "Oops! Looks like there's nothing here." Both violate [`04-content/microcopy.md`](../04-content/microcopy.md) banned phrases. Operator voice is direct: "No tasks today. When a shipment needs your attention it appears here." Then a CTA.

- **A dashboard hero image.** No hero photography on operator surfaces, ever. The KPI row *is* the dashboard's hero. Numbers earn the trust marketing photography pretends to.

- **Too many activity items.** The Activity card holds 4–6 items. Beyond that the user has to scroll inside the side panel — that breaks the "context lane" model. Pagination or a "View all" link is the right escape.

- **`text-white` on a `bg-primary` button.** The Tailwind v4 content scanner can drop the shadcn bridge utilities, leaving white-on-spring-green at ~1.4:1 (WCAG fail). Use `.lumen-btn-primary` or direct `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]`. AGENTS.md hard rule #9.

- **Reaching for `space.section.lg/xl/hero` on the dashboard.** Those are marketing tokens. The dashboard's section ladder is `space.section.dense` (24) only. If a block needs more breathing room, you've usually got the wrong pattern (likely [`web-tool.md`](./web-tool.md) or [`settings-page.md`](./settings-page.md)).

---

## 6. Working reference

[`audit-dashboard/src/app/saas/page.tsx`](../../audit-dashboard/src/app/saas/page.tsx) is the end-to-end web implementation.

It exercises every primitive in this pattern: `Sidebar` (with workspace switcher + nav sections + status footer), `TopBar` (heading + LiveBadge + CommandPaletteButton + AvatarGroup + primary action), `Stat` (size=lg, sparkData, polarity="good-down" on AVG COST), `StatGrid` (cols=4, divided), `Card` (padding=lg / padding=none / `.lumen-stat-card`), `CardHeader` (title + description + action slot), `Badge` (status=success / warning / danger / info / neutral / accent, leadingDot), `Avatar` + `AvatarGroup`, `IconButton`, `Tooltip`, `InlineTabs` (variant=pill, size=sm), `Field` (size=sm, mono), `Button` (intent=primary / secondary / tertiary, size=sm/xs, fullWidth, leadingIcon, trailingIcon), `LiveDot` (with and without label), `ProgressRing` (tone=success), and the `.lumen-eyebrow` / `.lumen-mono` / `.lumen-tnum` / `.lumen-row-divider` / `.lumen-kbd` / `.lumen-stat-card` utility classes.

Cross-reference foundations:

- [`density.md`](../00-foundations/density.md) — the operator default (compact, 32 px field-height), per-component density behavior, mobile auto-bump rule.
- [`hierarchy.md`](../00-foundations/hierarchy.md) §4 — the operator-dashboard-section pattern (eyebrow + heading, no subhead, dense table).
- [`spacing.md`](../00-foundations/spacing.md) — `space.section.dense`, `size.control.sm` (32 px operator default), `size.container.max` (1440 px ceiling).
- [`color.md`](../00-foundations/color.md) — the accent-tint surface for active nav, status palette for badges.
- [`elevation.md`](../00-foundations/elevation.md) — hairline borders + minimal shadow, the `.lumen-stat-card` micro-lift.
- [`micro-interactions.md`](../00-foundations/micro-interactions.md) — hover affordances on table rows, `.lumen-stat-card` lift, the peak-end rule for completed actions (toast on shipment-booked).
- [`02-components/stat/component.md`](../02-components/stat/component.md) — the `sparkData` API, polarity rules, size variants.
- [`02-components/table/component.md`](../02-components/table/component.md) — hairline rows, header eyebrow style, mono numerics.
- [`02-components/card/component.md`](../02-components/card/component.md) — `padding`, `elevation`, the `.lumen-stat-card` class.
- [`02-components/empty-state/component.md`](../02-components/empty-state/component.md) — zero-data state when the table is empty.
- [`04-content/empty-states.md`](../04-content/empty-states.md) — the four empty-state classes and worked examples.
- [`04-content/error-messages.md`](../04-content/error-messages.md) — operator-direct tone, never apologetic.
- [`research/lumen-brief.md`](../../research/lumen-brief.md) D-007 — content density rationale.

When in doubt about how to compose this pattern on web, run the audit dashboard locally (`cd audit-dashboard && pnpm dev`) and open `/saas` next to whatever you're building. If the section weights, density, hover affordances, or polarity don't match — the audit reference wins. The dashboard is the de-facto source of truth for the operator-density compositions; tokens and components compose into it, not the other way around.

---
title: Defensive classes
type: foundation
version: 0.15.0
status: stable
since: 0.15.0
last_updated: 2026-05-20
related: [buttons, color, accessibility, hierarchy]
---

# Defensive classes

> Single-class shorthands for the patterns where inline Tailwind arbitrary classes silently fail. Each class consumes audited tokens internally and carries the contrast / focus / motion / a11y contract the corresponding inline pattern is one typo away from breaking.

## Why this page exists

The v0.15 R16 closure ([ADR 0035](../../_meta/decisions/0035-r16-tms-consumer-friction-closure-v015.md)) traced the TMS consumer's contrast failure to a five-axis discoverability gap:

1. **`.lumen-btn-primary`** existed but the family wasn't enumerated anywhere
2. **`.lumen-pill-active`** (chips / segments / mode pickers) didn't exist
3. **`.lumen-kpi-tile`** (single-metric tiles with tone-gating at zero) didn't exist
4. **`.lumen-empty-state`** (type-led zero-state pattern) didn't exist
5. **`.lumen-page-header`** (one-CTA-per-view contract) didn't exist

Consumer authors reached for inline Tailwind arbitrary classes because they couldn't find a defensive equivalent. The inline patterns are brittle in three independent ways:

- **Tailwind v4 comma-fallback drop** — `text-[var(--token, white)]` may compile without the fallback, leaving an undefined-token reference that inherits `--text-primary` (#E6E6E6) from the cascade. On Spring Green BG that's 1.66:1 contrast — WCAG AA fail.
- **Token-name sprawl** — the v0.14 token bridge had 6 names for "text on accent" (`--text-on-accent`, `--primary-foreground`, `--color-fg-on-accent`, `--color-primary-foreground`, `--color-accent-foreground`, `--color-action-primary-fg`). Five of them resolved correctly; one was a confusing lookalike (`--color-accent-foreground` = green TEXT, not text on green BG). Authors picked the wrong one without warning.
- **Active-state pattern fragmentation** — every consumer reinvented the active-chip / active-segment visual: green-outline-hollow vs solid-green vs underline-bar vs raised-shadow. No canonical reference meant no consistency.

The defensive classes below close all three. Each one consumes the same `--color-action-*` tokens internally and is contrast-audited at the system level. **Reaching for these classes is strictly safer than writing the equivalent inline.**

## The defensive-class family

### `.lumen-btn-*` — buttons (v0.9, ADR 0016)

The canonical primary-action class. Eight variants: `primary`, `secondary`, `outline`, `ghost` / `tertiary`, `danger`, `danger-soft`, `ai`, `success`, `selected`, `glass`. Five size tiers: `xs` / `sm` / `md` (default) / `lg` / `xl`. Pill shape via `.lumen-btn-pill`.

**Failure mode prevented**: white text on Spring Green (1.66:1 AA fail). The shadcn-bridge `bg-primary` + `text-primary-foreground` utilities are unreliable under Tailwind v4 (sometimes compile, sometimes don't); the `.lumen-btn-*` family uses direct `--color-action-*` refs that always compile.

**Canonical usage**:

```tsx
<button className="lumen-btn lumen-btn-primary lumen-btn-md">
  Get rates
</button>
```

**Inline anti-pattern this replaces**:

```tsx
{/* DO NOT WRITE — the comma-fallback drops, the cascade paints #E6E6E6 on Spring Green */}
<button className="bg-[var(--color-accent-500)] text-[var(--color-text-on-accent,white)] h-10 px-4">
  Get rates
</button>
```

### `.lumen-pill-*` — filter chips, segments, mode pickers (v0.15 R16)

Canonical active-state class for filter chips (in a `FilterBar`), segmented-control buttons, mode pills (LTL / FTL / Box truck), and any "selected from a small set" affordance. Four classes: `.lumen-pill-strip` (container, inline-flex + gap + wrap), `.lumen-pill` (base — sizing, focus, transitions), `.lumen-pill-active`, `.lumen-pill-inactive`, `.lumen-pill-count` (optional trailing count badge).

**Failure mode prevented**: same as `.lumen-btn-primary` — white text on Spring Green at 1.66:1. The TMS consumer (chat 36-A) hit this 11+ times across an operator console because no canonical pill class existed; every page reinvented the active state.

**Canonical usage**:

```tsx
<div className="lumen-pill-strip" role="tablist">
  {modes.map((mode) => (
    <button
      key={mode}
      role="tab"
      aria-selected={mode === active}
      className={`lumen-pill ${mode === active ? "lumen-pill-active" : "lumen-pill-inactive"}`}
      onClick={() => setActive(mode)}
    >
      {mode}
      {counts[mode] !== undefined && (
        <span className="lumen-pill-count">{counts[mode]}</span>
      )}
    </button>
  ))}
</div>
```

**Inline anti-pattern this replaces** — the exact TMS bug class:

```tsx
{/* DO NOT WRITE */}
<button
  className={`px-3 py-1 rounded-full text-sm ${
    active === mode
      ? "bg-[var(--color-accent-500)] text-[var(--color-text-on-accent,white)]"
      : "bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
  }`}
>
  {mode}
</button>
```

**Three visual languages retired**: pre-R16, the system shipped (a) green-outline-hollow active chips on `/carriers`, (b) green-outline + green text on `/quote` mode pills, (c) solid green + white-ish text on the new Ascend pages. R16 makes `.lumen-pill-active` the canonical treatment; the other two are documented historical patterns scheduled for retirement in v0.16.

### `.lumen-kpi-*` — single-metric tiles (v0.15 R16)

For dashboard KPI tiles with the label → value → optional delta → optional context pattern. Five classes: `.lumen-kpi-tile`, `.lumen-kpi-label`, `.lumen-kpi-value`, `.lumen-kpi-delta`, `.lumen-kpi-context`. Tone modifiers via `data-tone="warning|danger|success|accent"` on the value, `data-tone="positive|negative"` on the delta.

**Failure mode prevented**: color-as-signal credibility erosion. The TMS consumer (chat 36-A item #4) shipped `OVERDUE $0` in warning amber on the Accounting page — a calm state styled as a warning. The same data source rendered correctly on the dashboard's `InvoiceKpiStrip` because that component gates amber on `overdue_cents > 0`. The "amber means there's something to act on" contract lived in author folklore, not in a primitive.

**Tone-gating rule** (data-visualization.md formalizes this):

> A warning at zero is no warning. When the underlying value is 0 / null / empty, the warning / danger tone retires to neutral. Apply `data-value-zero="true"` on the value span to opt the tile out of the tone color — `.lumen-kpi-value[data-tone="warning"]:not([data-value-zero="true"])` is the selector.

**Canonical usage**:

```tsx
function KpiTile({ label, value, valueRaw, tone, delta, deltaPolarity, period, context }) {
  return (
    <div className="lumen-kpi-tile" role="region" aria-label={`${label}, ${value}`}>
      <span className="lumen-kpi-label">{label}</span>
      <span
        className="lumen-kpi-value"
        data-tone={tone}
        data-value-zero={valueRaw === 0 ? "true" : undefined}
      >
        {value}
      </span>
      {delta !== undefined && (
        <span className="lumen-kpi-delta" data-tone={deltaToneFor(delta, deltaPolarity)}>
          {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}% <span aria-hidden>·</span> {period}
        </span>
      )}
      {context && <span className="lumen-kpi-context">{context}</span>}
    </div>
  );
}
```

### `.lumen-empty-state` — type-led empty collections (v0.15 R16)

For zero-state messaging on lists, search results, dashboards, onboarding moments. Four classes: `.lumen-empty-state`, `.lumen-empty-state-icon` (optional 40 × 40 framed slot), `.lumen-empty-state-headline` (max 40ch), `.lumen-empty-state-supporting` (max 60ch).

**Failure mode prevented**: every consumer reinvents the empty state. The TMS consumer (chat 36-A item #3) shipped 5 different empty-state visuals across Cost / Orders / Autopilot / Recurring / Accounting — ranging from "dim single-line paragraph" to "dashed-border card with title + 3-line body + orphan CTA". Visual drift hurt operator trust more than the missing data did.

**Contract**:
- Type-led, NEVER illustration-led (no character "looking sad", no smiley-face SVG).
- One headline (max 40ch). One supporting line (max 60ch).
- Optional one primary action — when the empty state owns the page's primary CTA, the `PageHeader`'s CTA hides (set `data-cta-suppressed="true"` on `.lumen-page-header`). See hierarchy.md "one primary action per view".
- Never two equal-weight actions. One primary + optional tertiary link.
- Never say "Oops" or "Uh-oh."

**Canonical usage**:

```tsx
<div className="lumen-empty-state" role="region" aria-labelledby="empty-headline">
  <span aria-hidden className="lumen-empty-state-icon">
    <InboxIcon size={20} strokeWidth={1.5} />
  </span>
  <h2 id="empty-headline" className="lumen-empty-state-headline">
    No active shipments yet
  </h2>
  <p className="lumen-empty-state-supporting">
    Quote a lane to see it appear here. Each shipment carries the operator team
    that owns it and a timeline of status changes.
  </p>
  <div className="lumen-empty-state-actions">
    <button className="lumen-btn lumen-btn-primary lumen-btn-md">
      Quote a lane
    </button>
  </div>
</div>
```

### `.lumen-page-header` — one-CTA-per-view contract (v0.15 R16)

For page-level headers with title + optional tagline + optional primary CTA. Three classes: `.lumen-page-header`, `.lumen-page-header-content`, `.lumen-page-header-title`, `.lumen-page-header-tagline` (max 80ch), `.lumen-page-header-actions`.

**Failure mode prevented**: competing CTAs. The TMS consumer (chat 36-A item #9) shipped Autopilot + Recurring pages with a top-right "New rule" CTA AND a dashed empty-state card with its own CTA — two competing greens for the same task. The user's eye couldn't decide.

**Contract**:
- One primary CTA in the header — when an `EmptyState` owns the primary CTA, the header CTA hides via `data-cta-suppressed="true"`.
- Tagline cap: 80ch. For repeat-visit apps, the tagline drops after onboarding via `data-onboarding="false"`.
- The header sits at the top of the page-content column, NOT in the page chrome / sticky shell.

**Canonical usage**:

```tsx
<header
  className="lumen-page-header"
  data-cta-suppressed={items.length === 0 ? "true" : undefined}
  data-onboarding={isFirstVisit ? "true" : "false"}
>
  <div className="lumen-page-header-content">
    <h1 className="lumen-page-header-title">Carriers</h1>
    <p className="lumen-page-header-tagline">
      Add carriers, manage rates, and track performance over time.
    </p>
  </div>
  <div className="lumen-page-header-actions">
    <button className="lumen-btn lumen-btn-primary lumen-btn-md">
      Add carrier
    </button>
  </div>
</header>
```

When `items.length === 0`, the header CTA hides and the `EmptyState` below owns the call to action. When `isFirstVisit === false`, the tagline drops to give returning users their information density back.

## What the defensive classes do NOT cover (intentionally)

- **Full Lumen component contracts** — use the primitives at `audit-dashboard/src/components/primitives/` when the surface needs full state management (loading / error / focus-trap / keyboard-roving). The defensive classes are the consumer-app fallback for when shipping the full primitive is too heavy.
- **Form-input shells** — the `.lumen-field` family (ADR 0011) is the canonical defensive class for input shells. See forms-and-inputs.md.
- **Position math** — for thumbs, swipes, calendar nav, anything where the math is exact — see AGENTS.md hard rule 12 (inline `style.left` / `style.transform`, never Tailwind arbitrary `translate-x-[Npx]`).
- **Floating UI panels** — combobox / popover / dropdown / tooltip / calendar dropdowns — see AGENTS.md hard rule 10 (portal to `document.body`, never inline `<div absolute>`).

## Lints that enforce this

| Lint | What it catches | Wired in `pnpm lint` |
|---|---|---|
| `lint:no-white-on-accent` (v0.8.1) | `text-white` / `text-[#fff]` / `text-[var(--lumen-paper-*)]` on Spring Green BG | ✓ |
| `lint:no-inline-accent-text` (v0.15 R16) | Inline accent BG + text-arbitrary-class WITH comma-fallback OR white literal | ✓ |
| `lint:no-undefined-token-vars` (v0.15 R16) | Any `var(--color-*)` / `var(--lumen-*)` reference to a name that isn't defined in `globals.css` :root | ✓ |
| `lint:no-primitives` (v0.4) | References to primitive tokens (`--lumen-accent-*`, `--lumen-cream-*`) outside the token layer | ✓ |
| `lint:shadow-no-accent` (v0.14 R11) | Any green color value inside a shadow / focus halo / glow | ✓ |

The five lints together close the inline-Tailwind brittleness from five angles. **Reach for the defensive class first; the lints catch you if you forget.**

## Related foundations

- [color.md](color.md) — Spring Green plays one role: action. Color is not a legend in prose.
- [buttons.md](buttons.md) — `.lumen-btn-*` family contract.
- [accessibility.md](accessibility.md) — focus rings (`outline + box-shadow`), contrast floors, the WCAG 2.2 AA hard floor.
- [hierarchy.md](hierarchy.md) — one primary action per view.
- [data-visualization.md](data-visualization.md) — tone gates at zero (warning at zero is no warning).
- [forms-and-inputs.md](forms-and-inputs.md) — `.lumen-field` defensive class for input shells.

## Related ADRs

- [0015](../../_meta/decisions/0015-shadcn-token-bridge-direct-refs-v081.md) — direct-token-ref pattern (the `.lumen-btn-*` precedent)
- [0016](../../_meta/decisions/0016-button-rebuild-v09.md) — `.lumen-btn-*` family
- [0022](../../_meta/decisions/0022-hover-glow-ladder-retune-v0122.md) — primary-button hover lift
- [0030](../../_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md) — no green in shadows
- [0035](../../_meta/decisions/0035-r16-tms-consumer-friction-closure-v015.md) — v0.15 R16 closure: defensive-class expansion + token canonicalization + 4th/5th-tier lints

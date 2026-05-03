---
name: Segmented
type: component
status: beta
version: 0.7.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [RadioGroup, Toggle, Select, Field, Form]
spec: ./component.json
last_updated: 2026-05-03
---

# Segmented

> 2–4 mutually exclusive options on one row. The "tabs but for a control" pattern. Built on `<button>` elements (not radio inputs — that's `RadioGroup`'s job). One sunken bar; the active segment lifts above with a subtle shadow.

## When to use
- 2–4 mutually exclusive choices that all fit on one row.
- View-mode toggles (Day / Week / Month).
- Density toggles (Compact / Comfortable).
- Period selectors (Today / 7d / 30d / 90d).

## When NOT to use
- More than 4 options → `Select` or `RadioGroup` (Segmented stops being scannable past 4).
- Long labels — Segmented assumes short scannable words.
- Non-mutually-exclusive multi-select (e.g. filter chips that combine) → use chip-row buttons or `TagsInput`.
- Single binary toggle → `Toggle` / `Switch`.

## Anatomy

```
┌──────────────────────────────────────────────┐
│ [ Day ]  [ Week ]  [ Month ]  [ Year ]      │
│   ↑       ↑          ↑          ↑           │
│ active  inactive  inactive   inactive       │
└──────────────────────────────────────────────┘
   bar (sunken bg, hairline border)
```

The bar is a `<div role="group">`; each segment is a `<button>` with `aria-pressed`. The active segment fills with `surface.raised` + `shadow.xs` to lift above the bar; inactive segments are transparent text-tertiary.

## States
Per segment: rest (active vs inactive), hover (color-only on inactive), focus-visible, disabled. Whole bar: disabled.

## Accessibility
- Bar carries `role="group"` with an `aria-label` describing what's being chosen.
- Each segment is a real `<button type="button">` with `aria-pressed`.
- Tab focuses the FIRST segment; Tab again leaves the bar.
- Inside the bar, ArrowLeft / ArrowRight move between segments AND change the value (toolbar pattern, not radio-roving).

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.3, 2.4.7, 2.5.8, 4.1.2.

## Do
- Limit to 2–4 options. Past 4, the bar overflows or the labels truncate.
- Use short, scannable labels — single nouns or 1-word verbs.
- Pair with a Field if you need a label or hint.
- Animate the active-segment shift with `motion.transition.fast` — but honor `prefers-reduced-motion`.

## Don't
- Don't use Segmented for booleans — use Toggle / Switch.
- Don't use Segmented for radio semantics (form submission with `name`/`value`) — use RadioGroup.
- Don't put icon-only segments without an `aria-label` per segment.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitive in `inputs.tsx` to a contract. `<button>`-based (not radio); single bar with lift-and-shadow active state.

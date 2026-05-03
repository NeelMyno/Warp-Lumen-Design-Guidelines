---
name: TimePicker
type: component
status: beta
version: 0.7.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [DatePicker, Field, Form, Segmented]
spec: ./component.json
last_updated: 2026-05-03
---

# TimePicker

> Hours / minutes input with an am/pm pill toggle, all on one row inside a `.lumen-field` shell. Two narrow numeric inputs, a colon separator, and a two-state segmented pill at the trailing edge.

## When to use
- Single-time entry where the user knows the value (meeting start, pickup window, deadline).
- Pair with `DatePicker` for date-and-time selection.
- Any control where the time is more useful as numerals than as a slider.

## When NOT to use
- Duration entry ("how long" rather than "when at") → `NumberInput` with a `min` suffix.
- Time ranges → compose two TimePickers OR a single bar-style range control.
- Date-only entry → `DatePicker`.

## Anatomy

```
┌─ lumen-field ───────────────────────────────┐
│  14 : 30                       │ am │ pm │  │
│  ↑    ↑                          ↑   ↑      │
│  HH   MM                       segmented    │
└─────────────────────────────────────────────┘
```

The shell holds two narrow `<input>` fields (HH and MM), a non-interactive colon separator, and a two-state pill toggle. The pill uses the same recipe as `Segmented` but only ever has two segments.

For 24-hour locales, omit the am/pm pill. The contract supports both modes via the `format` prop.

## States
Per input: rest, hover, focus-visible, filled, error, disabled. Pill: per-segment active / inactive / hover.

## Accessibility
- HH `aria-label="Hours"`; MM `aria-label="Minutes"`.
- Each numeric input enforces `inputMode="numeric"` and `maxLength={2}`.
- Auto-pad on blur (`9` → `09`).
- Auto-advance from HH to MM after two digits.
- The am/pm pill carries `role="radiogroup"` (a 2-option mutually exclusive choice); each segment is `role="radio"` with `aria-checked`.

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.7, 2.5.8, 3.3.1, 4.1.2.

## Do
- Auto-pad single digits on blur (`9` → `09`).
- Auto-advance from HH to MM after two digits typed.
- Clamp HH to 0–23 (24h) or 1–12 (12h with am/pm); clamp MM to 0–59.
- Default 12h vs 24h based on `navigator.language` locale.

## Don't
- Don't ship a TimePicker that lets the user enter `99` minutes — clamp on blur.
- Don't show am/pm in 24h locales — render the pill conditionally on `format="12h"`.
- Don't render the pill as a Select dropdown — the two-state pill is the right affordance for a binary choice.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitive in `inputs.tsx` to a contract. Two-numeric-input shell + two-state am/pm pill (segmented-style); locale-aware 12h vs 24h.

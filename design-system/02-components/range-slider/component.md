---
name: RangeSlider
type: component
status: beta
version: 0.7.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [NumberInput, Field, Form]
spec: ./component.json
last_updated: 2026-05-03
---

# RangeSlider

> Single-handle OR dual-handle bar slider. Sunken track with a lime fill between min and the handle (or between the two handles). Handles are white circles with a hairline border for grip affordance.

## When to use
- Bounded continuous values where the magnitude matters more than the exact number (volume, price filter, window size).
- Numeric range filters in a dashboard ("from $X to $Y").
- Time-of-day or duration windows when the range is short and interactive.

## When NOT to use
- Exact numeric entry — `NumberInput` is faster for typing a precise value.
- Unbounded ranges — sliders need known min and max.
- Multi-handle (3+) — the affordance breaks past 2.

## Anatomy

```
single-handle:
   ━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━
       value: 32

dual-handle:
   ━━━━━━━●━━━━━━━━━━━━━━━━●━━━━━
       low: 32           high: 88
```

The track is a 4 px sunken bar. The active range (between min and the single handle, or between the two handles) is filled lime. Handles are 16 px white circles with a 1 px `border-strong` border. For dual-handle, two `<input type="range">` elements are overlaid; the visual track is positioned absolutely between them.

## States
Track: rest, disabled. Handle: rest, hover, dragging (cursor changes), focus-visible (lime ring around the thumb), disabled.

## Accessibility
- Each handle is a native `<input type="range">` so screen readers announce role + value + min / max.
- Single-handle: `aria-label` describes the value's meaning ("Volume").
- Dual-handle: each handle gets its own label ("Minimum price", "Maximum price").
- Arrow keys step by `step`; PageUp / PageDown step by 10×.
- Honor the lime focus ring on the thumb — never `outline: none` without replacement.

WCAG: 1.3.1, 1.4.3, 1.4.11, 2.1.1, 2.4.7, 2.5.8, 4.1.2.

## Do
- Use dual-handle only when the user is genuinely bracketing a range. Single-handle covers most cases.
- Render value labels beneath the track (not floating on the handle) so they don't fight the cursor.
- Format value labels with the relevant unit ($32, 14 lb, 88%).
- Set sensible step (e.g. step=5 for a 0–100 percentage; step=10 for currency).

## Don't
- Don't ship a slider without min / max.
- Don't use a slider for high-precision values — typing is faster than nudging the handle to 47.
- Don't allow the dual-handle handles to cross — clamp `low <= high` on every change.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitive in `inputs.tsx` to a contract. Single + dual-handle modes; native `<input type="range">` overlay with custom thumb / track via webkit-thumb pseudo-element.

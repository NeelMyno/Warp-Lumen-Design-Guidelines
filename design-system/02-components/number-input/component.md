---
name: NumberInput
type: component
status: beta
version: 0.7.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Input, Field, Form, Stat, RangeSlider]
spec: ./component.json
last_updated: 2026-05-03
---

# NumberInput

> Stepper-flanked numeric input. Minus button on the left, mono numeric value in the center, plus button (and optional unit suffix) on the right — all bonded inside a single `.lumen-field` shell.

## When to use
- Quantity entry (cases, pallets, weight, count, percentage).
- Bounded numeric ranges where stepping by a known increment is faster than typing.
- Settings sliders' partner ("X minutes", "Y items per page").

## When NOT to use
- Continuous bounded ranges where the value is more useful than the keystroke → `RangeSlider`.
- Free-text where a number happens to be acceptable → `Input` with `type="number"`.
- Money entry — use `Input` with currency leading slot for proper locale formatting.
- Display-only number → `Stat`.

## Anatomy

```
┌─ lumen-field ───────────────────────────────┐
│ [−]      14                  [STD]      [+] │
│  ↑       ↑                    ↑         ↑   │
│ stepper  value (mono)         addon   stepper│
└─────────────────────────────────────────────┘
```

The shell still owns focus and chrome. The minus / plus buttons are interactive children inside the shell (`data-interactive`); they get their own scoped focus outline. The numeric `<input>` renders bare and centered, mono, with tabular numerics so digits don't jitter on stepping.

## States
Rest, hover, focus-visible, filled, error, disabled. Stepper buttons: rest, hover, press, disabled (when at min / max).

## Accessibility
- Native `<input type="number">` so screen readers announce role + value + min / max.
- Stepper buttons set `aria-label="Decrement" / "Increment"` and `aria-controls` pointing at the input id.
- Disable the minus button at `min`; disable the plus button at `max`. Don't just no-op them.
- ArrowUp / ArrowDown step the value (native behavior). PageUp / PageDown should step by 10× when meaningful.

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.7, 2.5.8, 3.3.1, 4.1.2.

## Do
- Wrap in a Field for label / hint / error orchestration.
- Pass `suffix` for unit chips (`%`, `lb`, `STD`, `min`).
- Use `step={5}` or `step={0.5}` to match the user's mental increment.
- Mono numeral (default) so digits stay column-aligned across multiple NumberInputs in a form.

## Don't
- Don't ship a NumberInput without `min` / `max` if the domain is bounded — it lets users overshoot.
- Don't use NumberInput for money — use a currency-aware Input. NumberInput's stepping is wrong for cents.
- Don't disable the stepper to communicate validity — disable only at the actual min / max bound.

## Roadmap (v0.6.x)
- **Animated digit roll** — NumberFlow-style per-digit slide on programmatic value change. Honors `prefers-reduced-motion`.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitive in `inputs.tsx` to a contract. Single-shell stepper composition; mono tabular numerals; suffix slot for unit chips.

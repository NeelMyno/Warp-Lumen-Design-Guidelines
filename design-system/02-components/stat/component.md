---
name: Stat
type: component
status: stable · Warp signature
version: 0.1.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [LiveDot, RateTicker, Card]
spec: ./component.json
last_updated: 2026-05-02
---

# Stat

> A big bold number with a small mono unit and an optional delta. **Warp signature primitive.** The Stat is what makes the system feel like an instrument panel. Used in marketing heroes (`655K+ shipments`), KPI rows, mobile stat tiles, and embedded inside `Card`s.

## When to use
- KPI / metric callouts ("On time 98.2%").
- Marketing stat bands ("655K+ shipments routed").
- Quote results ("$262 / 1d transit").
- Anywhere a single number deserves emphasis.

## When NOT to use
- Inline body numbers — keep tabular `dash-tnum` mono for those, but don't use the full Stat layout.
- Counters that change every second — use a separate `Counter` component (with `aria-live`).

## Anatomy
1. Eyebrow label (`type.label.eyebrow`, uppercase, widest tracking)
2. Value (`type.display.{xl,lg,md}` depending on size, **always tabular monospace** via `dash-tnum`)
3. Optional unit (small, mono, `text-tertiary`)
4. Optional delta (small, with trend arrow ↑ ↓ → and color coding)

## Variants
| Prop | Values | Default |
|---|---|---|
| `size` | `sm` / `md` / `lg` / `xl` | `md` |
| `trend` | `up` / `down` / `flat` | — |
| `unit` | string | — |
| `delta` | string | — |

## States
Static; the delta is informational only.

## Accessibility
- Eyebrow label is `<div>` (semantic eyebrow), not `<h*>`.
- Value is plain text. Read aloud as "On time, 98.2 percent, up 0.4 points."
- Trend arrow uses `aria-hidden`; the trend meaning is in the delta string.
- For a Stat that updates in real time, wrap in `aria-live="polite"`.

## Do
- Always tabular numerics so columns align across multiple Stats.
- Pair with a unit in `text-tertiary` so the number reads as the hero.
- For a row of Stats, use `StatGrid` to enforce uniform sizing.

## Don't
- Don't bold the unit. The number is the hero.
- Don't put the delta inside the value. It's a separate line.
- Don't change the size between Stats in the same row.

## Code
- [Web React](./examples/primary.tsx)

## Related
- [LiveDot](../live-dot/component.md) — pairs with Stat for "live KPI" pattern
- [RateTicker](../rate-ticker/component.md) — for streaming numerics

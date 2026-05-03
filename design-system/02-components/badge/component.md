---
name: Badge
type: component
status: stable
version: 0.1.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Tag, StatusDot, LiveDot]
spec: ./component.json
last_updated: 2026-05-02
---

# Badge

> A small pill that labels status, category, or count. Always paired with a label or shape — color alone never carries the meaning (Apple HIG rule).

## When to use
- Status of a record (On time, At risk, Late, Delivered).
- Category tags on a list row.
- Counts on icons or tabs.
- "Live" / "Beta" / "New" markers.

## When NOT to use
- For interactive selection — use `Chip` (interactive) instead.
- For destructive confirmation — use `Dialog`, never a badge.
- For long text — keep badges to ≤2 words.

## Anatomy
1. Container (`radius.full`, `space.1` × `space.2` padding)
2. Leading dot (optional, default `true` for status variants)
3. Label

## Variants
| Prop | Values | Default |
|---|---|---|
| `status` | `neutral` / `accent` / `success` / `warning` / `danger` / `info` | `neutral` |
| `leadingDot` | boolean | `true` for status variants, `false` for `neutral` |
| `size` | `sm` / `md` | `sm` |

## States
Static; no hover or active state.

## Accessibility
- Status meaning lives in the label, not the color. The dot reinforces.
- For `aria-live` regions (e.g. status that changes in real time), wrap the badge in an element with `aria-live="polite"`.

## Do
- Always include a label, even when the dot color is "obvious."
- Use sentence case ("On time", not "On Time" or "ON TIME").
- Pair with `LiveDot` (animated) for real-time states; static dot for resting states.

## Don't
- Don't use the accent green for non-action statuses. Reserve `accent` for "live"/"action" indicators.
- Don't use red for non-error contexts (it isn't "important," it's specifically "danger").
- Don't put 4+ badges in a row. Use a `BadgeGroup` with overflow.

## Code
- [Web React](./examples/primary.tsx)

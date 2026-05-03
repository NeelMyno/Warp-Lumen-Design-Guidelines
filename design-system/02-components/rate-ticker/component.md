---
name: RateTicker
type: component
status: stable · Warp signature
version: 0.1.0
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Stat, LiveDot, Marquee]
spec: ./component.json
last_updated: 2026-05-02
---

# RateTicker

> Horizontal marquee of freight lane rates (`LAX → SFO  $262`). **Warp signature primitive.** Used on landing pages, dashboards, and anywhere the system wants to feel like a live trading floor.

## When to use
- Marketing landing — between hero and trust strip.
- Dashboard top — for live rate awareness.
- Anywhere "the network is alive" needs to feel true.

## When NOT to use
- In product chrome where it would compete with focus.
- Inside a `Card` (it's a full-width element).
- For non-rate data — make a different marquee component.

## Anatomy
1. Container (`bg-sunken`, hairline border top + bottom)
2. Track (horizontal `flex` of rate items, looped via duplication for seamless scroll)
3. Rate item: from • to • price (all monospace)
4. Separator dot between items

## Animation
- Default duration: 60 s linear infinite.
- Honors `prefers-reduced-motion: reduce` — track stops, rates display statically.

## Variants
| Prop | Values | Default |
|---|---|---|
| `rates` | array of `{from, to, price}` | sample 10 lanes |
| `speed` | `slow` (90 s) / `normal` (60 s) / `fast` (40 s) | `normal` |
| `direction` | `left` / `right` | `left` |

## Accessibility
- Animation honors `prefers-reduced-motion`.
- Rates are inside an aria-label `Live freight rates` region.
- Not focusable; not interactive (rates are display only).

## Do
- Use ≥ 8 rates so the loop feels continuous.
- Place between hero and trust strip on landing pages.
- Use `aria-label` to describe what the marquee shows.

## Don't
- Don't put interactive elements inside a marquee.
- Don't autoplay sound or auto-scroll faster than 60 s.
- Don't use as the only signal of live data — pair with a `LiveDot` somewhere on the page.

## Code
- [Web React](./examples/primary.tsx)

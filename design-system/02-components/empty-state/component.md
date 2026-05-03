---
name: EmptyState
type: component
status: stable
version: 0.1.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Card, Button]
spec: ./component.json
last_updated: 2026-05-02
---

# EmptyState

> A composed message that appears when a collection has no items yet. Type-led, never illustration-led. One headline, one supporting line, one primary action.

## When to use
- A list with zero items ("No active shipments yet").
- A search result with zero matches.
- A first-run onboarding moment ("There are no quotes here. Quote a lane.").

## When NOT to use
- An error state — use `Banner` or `ErrorState` instead.
- A loading state — use `Skeleton` or `Spinner`.
- A page that should not be empty (a system bug requires a fix, not an empty state).

## Anatomy
1. Optional icon (24 × 24, in a 40 × 40 framed circle, `color.text.tertiary`)
2. Headline (`type.heading.h3`, primary color)
3. Supporting line (`type.body.sm`, secondary color, max 2 lines)
4. Optional primary action (`Button` with verb-led label)

## Variants
| Prop | Values | Default |
|---|---|---|
| `align` | `start` / `center` | `center` |
| `compact` | boolean | `false` (compact = no icon, smaller padding) |

## Accessibility
- Wraps in a region with `role="region"` and an `aria-labelledby` pointing to the headline.
- The icon is decorative (`aria-hidden`).
- The action's label carries the meaning.

## Do
- Two lines max. Headline + supporting line.
- Lead the action with a verb.
- Use the same icon language as the rest of the system (1.5px stroke, 24px grid).

## Don't
- Don't illustrate the empty state (no character "looking sad").
- Don't say "Oops" or "Uh-oh."
- Don't put two actions of equal weight. One primary + optional tertiary link.

## Code
- [Web React](./examples/primary.tsx)

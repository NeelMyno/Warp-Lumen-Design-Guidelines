---
name: Spinner
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Progress, Skeleton, Button]
spec: ./component.json
last_updated: 2026-05-16
---

# Spinner

> Pure CSS rotating-arc indicator. **Indeterminate, ≤ 5 s only.** Past 5 s, switch to **Progress** with a named label.

## When to use

- Button `loading=true`.
- Inline next to "Loading transactions…" text.
- A small region awaiting an XHR response.

## When NOT to use

- > 5 s loads — upgrade to Progress.
- Initial page load — use Skeleton.
- Single-cell table refresh — use a CellSkeleton.

## Variants

| `size` | Diameter |
|---|---|
| `xs` | 12 px |
| `sm` | 14 px |
| `md` | 16 px (default) |
| `lg` | 20 px |

| `tone` | Color |
|---|---|
| `default` | `text.primary` |
| `accent` | `text.accent` |
| `on-action` | `action.primary.fg` |
| `subtle` | `text.tertiary` |

## Accessibility

- `role="status"`. Spinner with no nearby label carries `aria-label="Loading"`.
- When next to visible loading text, `aria-hidden` the spinner.
- `prefers-reduced-motion`: pause spin; fall back to a dim ring + sr-only label.

## Do

- Pair with text past a button-sized interaction.
- Use `accent` inside Live feeds.
- Use `on-action` inside Button `loading=true`.

## Don't

- Don't spin past 5 s — Progress.
- Don't stack multiple spinners.
- Don't color-shift the stroke.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

---
name: Card
type: component
status: stable
version: 0.1.0
platforms: [web-react, react-native, ios-native, android-native, shopify-liquid]
a11y_level: WCAG-2.2-AA
related: [Section, Surface]
spec: ./component.json
last_updated: 2026-05-02
---

# Card

> A bounded surface with a hairline border and optional subtle shadow. Used for grouping related content. Default state uses border-only; reach for shadow only when the card is genuinely lifting (hover on interactive cards, popovers).

## When to use
- Grouping a related set of fields, stats, list items.
- A KPI tile with a `Stat` inside.
- A list row that needs its own boundary.

## When NOT to use
- Inline content blocks within a paragraph — use `<aside>` semantics or just type rhythm.
- Whole-page layout shells — those are `<main>` with padding, not a Card.
- Elements that should feel inline with the surface — use `Surface` with `padding=none`.

## Anatomy
1. Container (`surface.raised`, `border.subtle`, `radius.card.default`, `shadow.card`)
2. Optional `CardHeader` (title + description + action)
3. Body
4. Optional `CardFooter`

## Variants
| Prop | Values | Default |
|---|---|---|
| `padding` | `none` / `sm` / `md` / `lg` | `md` |
| `interactive` | boolean | `false` (adds hover state and focus-visible) |
| `selected` | boolean | `false` (adds 1px accent border + accent tint bg) |

## States
Rest, hover (interactive only), focus-visible (interactive only), selected.

## Accessibility
- Non-interactive cards do not receive a `role`.
- Interactive cards render as `<button>` if they trigger an action, or `<a>` if they navigate. Never a `<div>` with `onClick`.
- Selection state announces via `aria-pressed` (button) or `aria-selected` (in a listbox).

## Do
- Default to no shadow, hairline border only.
- Pair with `CardHeader` when the card has a title.
- Use `padding="none"` when the body controls its own padding (e.g. table inside a card).

## Don't
- Don't stack four shadows of increasing intensity for "depth." One shadow per card.
- Don't put a card inside a card inside a card.
- Don't add a heavy border for emphasis. Use `selected` or a status badge instead.

## Code
- [Web React](./examples/primary.tsx)

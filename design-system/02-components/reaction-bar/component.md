---
name: ReactionBar
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [CommentThread, ChatBubble]
spec: ./component.json
last_updated: 2026-05-16
---

# ReactionBar

> Emoji reaction row. Each chip = emoji + count + toggle.

## Accessibility

- Each chip is `<button aria-pressed>`.
- `aria-label` spells out meaning.

## Do

- Tabular-nums count.
- Mine = action.selected.bg.
- Cap visible at 6, "+N" overflow.

## Don't

- Don't lime / danger chip fills.
- Don't allow infinite distinct reactions.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

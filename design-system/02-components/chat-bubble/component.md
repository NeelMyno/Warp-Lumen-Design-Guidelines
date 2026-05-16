---
name: ChatBubble
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [AIPromptInput, AIBadge, ReactionBar, Avatar]
spec: ./component.json
last_updated: 2026-05-16
---

# ChatBubble

> Chat message row. Four speakers — you / them / ai / system.

## Accessibility

- `<li>` inside `<ol role="log" aria-live="polite">`.
- AI streaming: `aria-busy="true"` until complete.
- `<time datetime>`.

## Do

- Right-align you, left them/ai.
- Avatar adjacent, not inside.
- AI variant uses action.ai surface + shimmer.

## Don't

- Don't lime-fill you-bubble.
- Don't auto-scroll on every keypress (sticky-bottom).

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

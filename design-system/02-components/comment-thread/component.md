---
name: CommentThread
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [ChatBubble, ReactionBar, Avatar, PresenceIndicator]
spec: ./component.json
last_updated: 2026-05-16
---

# CommentThread

> Threaded discussion attached to an entity. One reply level deep.

## Accessibility

- `<region aria-label>`.
- Comments in `<ol role="log" aria-live="polite">`.
- Resolved state announces.

## Do

- One reply level.
- Resolve at thread header.
- Dim resolved (don't hide).

## Don't

- Don't infinite-nest.
- Don't lime resolved.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

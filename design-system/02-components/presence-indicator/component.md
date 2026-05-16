---
name: PresenceIndicator
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Avatar, LiveDot]
spec: ./component.json
last_updated: 2026-05-16
---

# PresenceIndicator

> Live state for users on a surface. Dot / inline / avatar-group.

## Accessibility

- Aggregate aria-label.
- Activity line `aria-live="polite"`.

## Do

- Cap visible at 3-4; +N overflow.
- Online=accent, idle=warning, dnd=danger.

## Don't

- Don't show offline by default.
- Don't ring-pulse presence dots.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

---
name: SwipeAction
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [List, ActionSheet, DropdownMenu]
spec: ./component.json
last_updated: 2026-05-16
---

# SwipeAction

> Mobile-only row wrapper that reveals trailing (and optionally leading) actions on horizontal swipe.

## When to use

- Inbox / chat / list rows where Archive + Delete are common.
- Mobile mail / messaging clients.

## When NOT to use

- Desktop — `DropdownMenu trigger='context'`.
- Multi-action row — collapse to a kebab + DropdownMenu.

## Accessibility

- **WCAG 2.5.7**: ALWAYS pair swipe with non-drag alternative (long-press → ActionSheet, or visible IconButton).
- Each revealed action is a button with `aria-label`.
- Keyboard: Arrow keys reveal, Enter / number keys activate.

## Do

- Most-destructive farthest, full-swipe-fires.
- 3 trailing actions max.
- Decelerate snap, not bounce.

## Don't

- Don't ship without non-drag fallback.
- Don't use on desktop.
- Don't lime the destructive surface.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

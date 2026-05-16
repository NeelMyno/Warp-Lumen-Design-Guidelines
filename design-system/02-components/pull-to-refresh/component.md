---
name: PullToRefresh
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Spinner, Toast]
spec: ./component.json
last_updated: 2026-05-16
---

# PullToRefresh

> Mobile-only refresh-on-pull gesture wrapper.

## When to use

- Mobile feeds, inboxes, lists where freshness matters.
- iOS / Android list shells.

## When NOT to use

- Desktop — Refresh button.
- Nested scroll containers.

## Accessibility

- WCAG 2.5.7 — non-drag alternative required (Toolbar Refresh IconButton or 'R' shortcut).
- `aria-live="polite"` announces "Refreshing" / "Updated {timestamp}".

## Indicators

- `arrow` — rotates as pull progresses (iOS).
- `spinner` — appears once committed.

## Do

- Pair with Refresh IconButton fallback.
- Resolve fast; Toast at 5 s.
- Decelerate snap-back.

## Don't

- Don't use on desktop.
- Don't nest inside another scroll container.
- Don't reset scroll on refresh.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

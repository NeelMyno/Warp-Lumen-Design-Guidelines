---
name: Timeline
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [NotificationCenter, Stepper, List]
spec: ./component.json
last_updated: 2026-05-16
---

# Timeline

> Chronological sequence. Audit logs, activity feeds, order tracking.

## Anatomy

1. `<ol>` root.
2. Marker (dot / icon / thumbnail).
3. `<time>` timestamp.
4. Actor.
5. Title.
6. Optional body.
7. Connector line.

## Accessibility

- `<ol role="list">`.
- Each item has `<time datetime="ISO">`.
- Markers are `aria-hidden`.
- Streaming updates announce via `aria-live="polite"`.

## Do

- WHEN · WHO · WHAT order.
- Status-tone markers.
- Stable chronological sort.

## Don't

- Don't lime every marker.
- Don't omit connector line.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

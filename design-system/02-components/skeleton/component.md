---
name: Skeleton
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Spinner, Progress]
spec: ./component.json
last_updated: 2026-05-16
---

# Skeleton

> Layout-preserving placeholder. Renders the shape of the eventual content while it loads.

## When to use

- First-paint loads (lists, tables, dashboards, cards).
- Predictable layouts you can mock.
- Anywhere a Spinner would feel visually noisy.

## When NOT to use

- Single-line inline loads — Spinner.
- Determinate loads — Progress.
- Streaming chat — leave the line empty + typing indicator.

## Shapes

`text`, `circle`, `rect`, `card`, `row` — choose the one that matches the eventual content's bounding box within 10%.

## Accessibility

- `role="presentation"` / `aria-hidden="true"`.
- Parent surface sets `aria-busy="true"` and announces "Loading…" once.
- Shimmer paused under `prefers-reduced-motion`.

## Do

- Match the eventual bounding box.
- `aria-busy` on the parent + one sr-only "Loading".
- Multi-line text via `shape="text" lines=3`.

## Don't

- Don't combine with Spinner.
- Don't paint shimmer in lime.
- Don't shift layout when content arrives.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

---
name: Drawer
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Dialog, Sheet, Popover]
spec: ./component.json
last_updated: 2026-05-16
---

# Drawer

> Side-anchored panel that slides over the page. Long-form detail / multi-step forms / side editors.

## When to use

- Detail view tied to a list/table row.
- Multi-step form with breathing room.
- Side editor / inspector.

## When NOT to use

- Short confirmation — **Dialog**.
- Bottom-anchored mobile sheet — **Sheet**.
- Floating panel — **Popover**.

## Sides

`right` (desktop detail view, default) / `left` (sidebar editor) / `top` / `bottom` (full-width banners-as-panels).

## Sizes

`sm` 400 / `md` 520 / `lg` 720 / `full` 100vw.

## Modal vs non-modal

- `modal=true` (default): focus trap, scrim, page inert.
- `modal=false`: non-modal inspector; page stays interactive.

## Accessibility

- `role="dialog"`, `aria-modal`.
- Focus trap when modal.
- Escape closes (dismissible).
- Returns focus to trigger.

## Do

- Right on desktop, bottom on mobile.
- Sticky footer with primary + secondary actions.
- Close on route change.

## Don't

- Don't stack two Drawers.
- Don't use for short confirmations.
- Don't nest a Drawer trigger inside a Drawer.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

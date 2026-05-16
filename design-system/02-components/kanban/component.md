---
name: Kanban
type: component
status: beta
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [List, Drawer, DataGrid]
spec: ./component.json
last_updated: 2026-05-16
---

# Kanban

> Horizontal board of columns + cards. Drag-and-drop with keyboard equivalent.

## Anatomy

1. Board (horizontal scroll).
2. KanbanColumn — header (title + count + WIP), scrollable card track.
3. KanbanCard — title + body + meta row (Avatar / due / tags / severity).

## Accessibility

- WCAG 2.5.7 — Space-to-pick-up + Arrow-to-move + Space-to-drop required.
- `aria-live` announces moves and WIP-limit hits.
- Each column labelled.

## Do

- WIP limit "N / M".
- Open Drawer for card detail.
- Sparse column accent.

## Don't

- Don't auto-scroll on every move.
- Don't omit keyboard drag equivalent.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release (beta).

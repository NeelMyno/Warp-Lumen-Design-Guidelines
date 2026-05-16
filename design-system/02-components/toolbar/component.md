---
name: Toolbar
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [ButtonGroup, DropdownMenu, IconButton, Divider]
spec: ./component.json
last_updated: 2026-05-16
---

# Toolbar

> Grouped row of interactive controls sharing a single tab stop. Page-level command bars, rich-text editors, dialog footers.

## When to use

- Above a Table (filter, sort, bulk actions).
- Rich text editor (bold / italic / link).
- Dialog footer (primary + secondary).

## When NOT to use

- A single button — just use Button.
- A nav rail — Sidebar / Navbar.
- A menu — DropdownMenu.

## Anatomy

1. `<div role="toolbar" aria-label>`.
2. Items — Button, IconButton, ToggleButton, DropdownMenu trigger, Divider.
3. Group dividers with `role="separator"` + `aria-orientation`.

## Accessibility

- `role="toolbar"`, `aria-label`.
- Roving tabindex.
- Arrow keys cycle within.

## Do

- Group with vertical dividers.
- IconButton + Tooltip for icon-only.
- Overflow → "More" DropdownMenu.

## Don't

- Don't render without aria-label.
- Don't stack two toolbars.
- Don't lime the surface.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

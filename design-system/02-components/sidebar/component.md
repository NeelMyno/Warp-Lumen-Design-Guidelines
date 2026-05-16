---
name: Sidebar
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Navbar, BottomNav, Drawer]
spec: ./component.json
last_updated: 2026-05-16
---

# Sidebar

> Vertical primary navigation rail. Operator / admin dashboards.

## Modes

| Mode | Width | Use |
|---|---|---|
| `expanded` | 240 px | Label + icon, default desktop |
| `rail` | 56 px | Icon-only + Tooltip per item |
| `auto` | toggles by viewport | mobile drawer for < 768 px |

## Anatomy

1. Brand mark (pinned top).
2. Item groups with SidebarLabel headers.
3. Footer — account + workspace switcher + version.

## Accessibility

- `<nav aria-label="Sidebar">`.
- Active item `aria-current="page"`.
- Rail mode: every item Tooltip + `aria-label`.

## Do

- Group into 2-3 sections.
- Lead with lucide icon.
- Active = selected.bg + text.accent + left-edge accent stroke.
- Persist user preference.

## Don't

- Don't pack > 12 top-level items.
- Don't lime-fill active row.
- Don't show rail without tooltips.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

---
name: Navbar
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Sidebar, BottomNav, DropdownMenu, Breadcrumbs]
spec: ./component.json
last_updated: 2026-05-16
---

# Navbar

> Top app bar — the single highest-level navigation. One per page.

## Variants

| Variant | Height | Use |
|---|---|---|
| `marketing` | 64 px (scroll-aware translucent) | Landing, pricing, docs marketing |
| `operator` | 48 px (hairline border) | Dashboards, admin (default) |
| `mobile` | 40 px (hamburger drawer) | Mobile shells |

## Anatomy

1. Brand mark (left).
2. Destinations (inline operator/marketing, collapsed mobile).
3. Trailing — search trigger, NotificationCenter, account, theme.
4. Skip link (first focusable inside, visible on focus).

## Accessibility

- `<nav aria-label="Primary">`.
- Active item `aria-current="page"`.
- Skip link → `<main id="main-content">`.
- Mobile hamburger `aria-label`, `aria-expanded`.

## Do

- Brand → /.
- Marketing translucent glass on scroll.
- Operator: ⌘K command palette trigger.
- Skip link inside.

## Don't

- Don't stack two Navbars.
- Don't lime-fill active item.
- Don't put destructive actions inside.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

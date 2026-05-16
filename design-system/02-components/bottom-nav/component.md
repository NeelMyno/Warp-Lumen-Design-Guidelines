---
name: BottomNav
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Navbar, Sidebar, Tabs]
spec: ./component.json
last_updated: 2026-05-16
---

# BottomNav

> Mobile-only bottom-anchored navigation rail. 3-5 destinations.

## When to use

- Mobile app shells.
- Tablet portrait when the bottom-of-thumb-reach matters.

## When NOT to use

- Desktop — **Sidebar**.
- In-page tabs — **Tabs**.
- > 5 destinations — group into More.

## Anatomy

1. `<nav>` strip, 56 px tall + safe-area-inset-bottom pad.
2. 3-5 items: icon-on-top + tiny label.
3. Active = top-edge 2 px accent stroke + filled icon + text.accent label.
4. Badges on items align icon top-right.

## Accessibility

- `<nav aria-label="Bottom navigation">`.
- `aria-current="page"` on active.
- ≥ 44 px touch target.
- safe-area-inset-bottom respected.

## Do

- 3-5 items only.
- Most common left.
- 5th = "More" opening Sheet / DropdownMenu.

## Don't

- Don't auto-hide on scroll.
- Don't lime-fill background.
- Don't render with Sidebar.
- Don't include destructive actions.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

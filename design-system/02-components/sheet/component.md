---
name: Sheet
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Drawer, Dialog, ActionSheet]
spec: ./component.json
last_updated: 2026-05-16
---

# Sheet

> Mobile-flavor bottom-anchored modal with optional detents. Apple HIG sheet pattern.

## When to use

- Mobile / tablet portrait detail views.
- Bottom-anchored mobile forms.
- Map / share / chooser bottom panels.

## When NOT to use

- Desktop — **Drawer**.
- Short confirmation — **Dialog**.
- Mobile action list — **ActionSheet**.

## Detents

| Detent | Heights |
|---|---|
| `large` | 70vh single |
| `medium-large` | 50vh + 90vh (drag to switch) |
| `full` | 100vh (route-equivalent) |

## Accessibility

- `role="dialog"`, `aria-modal="true"`.
- Handle: `aria-label="Drag to resize"`, Arrow keys step detents.
- Safe-area-inset-bottom respected.

## Do

- Show handle by default.
- Pin primary action in footer.
- One detent unless content genuinely warrants two.

## Don't

- Don't use on desktop.
- Don't put primary actions in scroll.
- Don't stack Sheets.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

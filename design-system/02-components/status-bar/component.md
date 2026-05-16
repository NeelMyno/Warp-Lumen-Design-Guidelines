---
name: StatusBar
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [PhoneFrame]
spec: ./component.json
last_updated: 2026-05-16
---

# StatusBar

> Decorative mobile-platform status-bar row. Companion to PhoneFrame.

## When to use

- Inside PhoneFrame for marketing mockups.
- Onboarding screens that mimic a real shell.

## When NOT to use

- Real PWA in fullscreen — the OS owns the real status bar.

## Accessibility

- `aria-hidden="true"` inside PhoneFrame.
- Never focusable.

## Do

- 9:41 default.
- Tabular nums for time.

## Don't

- Don't use real carrier brands in marketing.
- Don't mislead battery state.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

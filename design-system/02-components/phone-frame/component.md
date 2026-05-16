---
name: PhoneFrame
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [StatusBar, BottomNav, Sheet]
spec: ./component.json
last_updated: 2026-05-16
---

# PhoneFrame

> Decorative phone-shell chrome for marketing / showcase / docs. Stylized silhouette, not a brand skin.

## Variants

`ios-notch` / `ios-island` (Dynamic Island) / `android-pin-hole`.

## Accessibility

- `role="img"`, `aria-label="Phone mockup, {platform}"`.
- Inner content stays SR-readable.

## Do

- Pair with **StatusBar** for realism.
- Use only in marketing / docs / onboarding.
- Stylized silhouette — no Apple / Pixel brand marks.

## Don't

- Don't ship real interactive flows inside.
- Don't replicate trademarked device skins.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

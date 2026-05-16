---
name: LogoCloud
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [TestimonialCard]
spec: ./component.json
last_updated: 2026-05-16
---

# LogoCloud

> Social-proof strip. 5-12 partner / customer logos. Monochrome by default.

## Accessibility

- `aria-label="Trusted by"`.
- Each `<img alt="Partner name">`.
- Marquee pauses on hover / focus / reduce-motion (WCAG 2.2.2).

## Do

- 5-12 logos.
- Monochrome default.
- Eyebrow label.

## Don't

- Don't use real logos without permission.
- Don't auto-play marquee without pause.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

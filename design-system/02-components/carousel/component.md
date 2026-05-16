---
name: Carousel
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Tabs, ProductGallery]
spec: ./component.json
last_updated: 2026-05-16
---

# Carousel

> Horizontally paginated content scroller. Autoplay OFF by default per WCAG 2.2.2.

## Indicators

`dots` (≤ 6) / `progress` / `fraction` (> 6) / `none`.

## Accessibility

- `role="region"`, `aria-roledescription="carousel"`.
- Each slide: `role="group"`, `aria-roledescription="slide"`, `aria-label="Slide N of M"`.
- Off-screen slides `aria-hidden`.
- Autoplay → Pause control + pause on hover/focus + reduced-motion respect.

## Do

- Autoplay OFF by default.
- Dots ≤ 6, fraction > 6.
- Render prev/next.

## Don't

- Don't autoplay without Pause.
- Don't loop CTA carousels.
- Don't lime inactive dots.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

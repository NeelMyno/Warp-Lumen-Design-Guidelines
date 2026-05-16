---
name: Slider
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [RangeSlider, NumberInput]
spec: ./component.json
last_updated: 2026-05-16
---

# Slider

> Single-value slider. One thumb. Volume / threshold / opacity / scrubber.

## Accessibility

- `role="slider"`, `aria-valuemin/max/now`, `aria-valuetext`.
- Inline-style thumb math (hard rule 12).
- 44 px thumb hit area on touch.

## Do

- Pair with value label.
- Marks at common stops.
- Inline style.left for thumb.

## Don't

- Don't use for ranges (→ RangeSlider).
- Don't omit value when precision matters.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

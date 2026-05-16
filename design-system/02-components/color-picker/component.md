---
name: ColorPicker
type: component
status: beta
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Combobox, Popover, Input]
spec: ./component.json
last_updated: 2026-05-16
---

# ColorPicker

> Color selection. Swatches (restricted palette) and full (saturation pad + hue slider + hex input).

## Accessibility

- Each swatch `aria-label="Hex {value}"`.
- Selected `aria-pressed`.
- Hex input always available.

## Do

- Default swatches.
- Pair with hex text + Tooltip.
- Restrict palette to brand stops.

## Don't

- Don't render full picker for brand selection.
- Don't omit text input.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release (beta).

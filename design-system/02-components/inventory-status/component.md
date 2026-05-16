---
name: InventoryStatus
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, shopify-liquid, bigcommerce-stencil, woo-wordpress]
a11y_level: WCAG-2.2-AA
related: [Badge, Tag]
spec: ./component.json
last_updated: 2026-05-16
---

# InventoryStatus

> Stock state chip. Five tones: in-stock / low-stock / backorder / preorder / sold-out.

## Accessibility

- Always glyph + label + color.
- compact mode requires `aria-label`.
- Tabular-nums on quantities.

## Do

- Show low-stock quantity for urgency.
- Sold-out → "Notify me" CTA.
- Info tone for preorder / backorder + ETA.

## Don't

- Don't lime-fill in-stock.
- Don't show quantity over 10.
- Don't hide sold-out.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

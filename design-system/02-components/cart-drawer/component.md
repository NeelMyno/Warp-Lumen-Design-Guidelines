---
name: CartDrawer
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, shopify-liquid, bigcommerce-stencil, woo-wordpress]
a11y_level: WCAG-2.2-AA
related: [Drawer, InventoryStatus, Button, Progress]
spec: ./component.json
last_updated: 2026-05-16
---

# CartDrawer

> Commerce-flavor side Drawer. Cart line items + totals + sticky Checkout CTA.

## Anatomy

1. Drawer (side=right, size=md).
2. Header — Title "Your cart" + dismiss.
3. Optional free-shipping progress.
4. Cart line items.
5. Totals (`<dl>`).
6. Sticky footer Checkout.

## Accessibility

- Drawer semantics (role=dialog, aria-modal, focus trap, Escape).
- Items as `<li>` with `aria-label`.
- Qty changes + removes announced via `aria-live`.

## Do

- Sticky Checkout.
- Tabular-nums prices.
- Undo Snackbar on Remove.

## Don't

- Don't center-modal the cart.
- Don't auto-scroll on qty change.
- Don't lime-fill the total.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

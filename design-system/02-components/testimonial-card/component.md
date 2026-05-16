---
name: TestimonialCard
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Card, Avatar]
spec: ./component.json
last_updated: 2026-05-16
---

# TestimonialCard

> Customer quote. Operator-compact and marketing-large variants.

## Accessibility

- `<figure>` + `<blockquote>` + `<figcaption>`.
- Rating `aria-label="4.6 of 5 stars"`.

## Do

- Quote in h3.
- One metric when quantifiable.
- Synthetic operator names in fixtures.

## Don't

- Don't lime the card.
- Don't use real customer names without permission.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

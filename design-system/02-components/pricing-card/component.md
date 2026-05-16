---
name: PricingCard
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Card, Button, Tag]
spec: ./component.json
last_updated: 2026-05-16
---

# PricingCard

> One tier on a pricing page. Name → price → features → CTA. Highlight variant uses v0.12.5 peak-end lift.

## Anatomy

1. Badge (top-right, optional — "Most popular").
2. Plan name (h3).
3. Price (h1, tabular-nums) + cadence + subline.
4. Description.
5. Feature list (Check / X glyphs).
6. CTA (Button).

## Accessibility

- `<article aria-labelledby>`.
- Highlight = sr-only "Recommended plan".
- Features list `aria-label="Included"` / "Not included".

## Do

- One highlight per surface.
- Tabular-nums price.
- v0.12.5 peak-end lift on highlight: glow + -1 px Y.

## Don't

- Don't lime the entire card.
- Don't highlight two tiers.
- Don't marketing-speak features.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

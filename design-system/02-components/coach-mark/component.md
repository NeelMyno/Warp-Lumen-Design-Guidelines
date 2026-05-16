---
name: CoachMark
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Tooltip, Popover, Banner]
spec: ./component.json
last_updated: 2026-05-16
---

# CoachMark

> Onboarding tooltip with backdrop spotlight. Sequenced via tour (3-6 steps).

## When to use

- First-visit onboarding tour.
- New-feature reveal on a single visit.
- Account-setup walkthrough.

## When NOT to use

- Hover hint — **Tooltip**.
- Click-revealed content — **Popover**.
- Persistent system state — **Banner**.

## Anatomy

1. Scrim with a cut-out around the anchor.
2. Bubble — title + description + step counter + Skip + Next.
3. 2 px `text.accent` stroke around the cut-out.

## Accessibility

- `role="dialog"`, `aria-modal="false"`.
- Spotlight visual only — SR access to anchor preserved.
- Skip ALWAYS visible.

## Do

- Benefit-led copy.
- 3-6 steps max.
- Step counter "2 of 5".
- First-visit only.

## Don't

- Don't auto-start every login.
- Don't gate.
- Don't lime-fill the spotlight ring.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

---
name: Banner
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Alert, Toast, Navbar]
spec: ./component.json
last_updated: 2026-05-16
---

# Banner

> Page-level system state strip. Sticky above the page header. Six tones — info / success / warning / danger / promo / sandbox.

## When to use

- Maintenance window announcements.
- Outage / degraded-service notices.
- Trial countdowns ("3 days left in Pro trial").
- Account suspension banners.
- Sandbox / test-mode environment indicators.
- Marketing launch announcements (promo tone, sparingly).

## When NOT to use

- Region-scoped state — **Alert**.
- Transient confirmation — **Toast**.
- A modal interrupt — **Dialog**.

## Tones

| Tone | Fill | Use |
|---|---|---|
| `info` | `status.info.bg` | Generic info |
| `success` | `status.success.bg` | "Service restored" |
| `warning` | `status.warning.bg` | Trial countdown, soft limit |
| `danger` | `status.danger.bg` | Outage, suspension |
| `promo` | `surface.tint-accent` (faint lime) | Launch, GA — sparingly |
| `sandbox` | Pinstripe lime/canvas | Non-prod env indicator |

## Accessibility

- `role="region"` + `aria-label`.
- Danger also sets `role="alert"`.
- Sandbox stays non-dismissible.
- Glyph + label — never color alone.

## Do

- Sticky above the Navbar.
- Always pair with an action when actionable.
- One Banner at a time.
- Pinstripe fill on sandbox so the indicator doesn't fade.

## Don't

- Don't use for region-scoped state.
- Don't make danger dismissible.
- Don't promo for blog posts. Promo is for launches.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

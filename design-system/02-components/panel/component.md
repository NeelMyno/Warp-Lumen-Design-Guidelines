---
name: Panel
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Card, Accordion, Drawer]
spec: ./component.json
last_updated: 2026-05-16
---

# Panel

> In-flow collapsible content container. Labeled section with optional collapse + optional resize.

## When to use

- Settings groups (Profile, Notifications, Security).
- Docked right rail (variant='inspector').
- Docs body sections with Card chrome (variant='bordered').

## When NOT to use

- No heading — just a **Card**.
- Disclosure list — **Accordion**.
- Modal — **Dialog** / **Drawer**.

## Variants

| Variant | Use |
|---|---|
| `plain` | In-page sections (default) |
| `bordered` | Card-flavored content section |
| `inspector` | Docked right rail (resizable) |

## Accessibility

- `<section>` + `aria-labelledby`.
- Collapsible uses `<details>` + `.lumen-summary` (hard rule 14).
- Inspector resize handle is keyboard-resizable.

## Do

- Pair with Form for grouped fields.
- Inspector for collaboration / kanban surfaces.
- Bordered for docs.

## Don't

- Don't replace Card with Panel.
- Don't make every Panel collapsible.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

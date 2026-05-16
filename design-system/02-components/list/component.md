---
name: List
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Table, Divider, Card, Skeleton]
spec: ./component.json
last_updated: 2026-05-16
---

# List

> Vertical sequence primitive. Three variants — `plain` (prose), `structured` (settings rows), `interactive` (navigable).

## When to use

- Settings / property pairs (`structured`).
- Account / file / member lists (`interactive`).
- Bulleted / numbered prose (`plain`).
- Definition lists (`description`).

## When NOT to use

- Tabular data with columns — **Table**.
- Free-form prose with mixed media — **Card** body.
- Kanban-style ordered states — **Kanban**.

## Variants

| Variant | Use |
|---|---|
| `plain` | Bullets / numbered prose |
| `structured` | leading icon + label + trailing value rows |
| `interactive` | Navigable rows with hover + focus chrome |

## Densities

`compact` (32 px) / `regular` (44 px touch floor) / `comfortable` (56 px mobile primary).

## Accessibility

- Always render semantic `<ul>` / `<ol>` / `<dl>`.
- Interactive lists use roving tabindex.
- Each interactive ListItem is `role="button"` or `<a>`.

## Do

- Plain for prose bullets.
- Structured for settings.
- Interactive for navigable rows.
- Inset divider when rows have leading Avatars.

## Don't

- Don't role="list" on a div.
- Don't paint selected rows in lime fill.
- Don't nest interactive children inside an interactive row.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

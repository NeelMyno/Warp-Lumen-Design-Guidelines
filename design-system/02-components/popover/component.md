---
name: Popover
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Tooltip, Dialog, Drawer, DropdownMenu, Combobox]
spec: ./component.json
last_updated: 2026-05-16
---

# Popover

> Floating panel anchored to a trigger. Hosts richer content than Tooltip — a form, a mini-detail card, a filter group, a date pad.

## When to use

- Filter pads, sort pads.
- Quick edit forms ("Set due date", "Edit assignee").
- Mini detail card on hover ("preview this row").
- Color pickers, date pickers, time pickers.
- Profile / object peek.

## When NOT to use

- Text-only hint — use **Tooltip**.
- Modal interrupt — use **Dialog**.
- Long-form content — use **Drawer** or route to a page.
- Action menu — use **DropdownMenu**.

## Anatomy

1. **Trigger** — any focusable element.
2. **Content** — `role="dialog"`, portaled to `document.body` (hard rule 10).
3. **Arrow** — optional 6 px chevron.
4. **Body** — your form, list, or card.

## Width modes

| Mode | Behavior | Use |
|---|---|---|
| `trigger` | Match trigger width | Date / Select-style panels |
| `auto` | Shrink to content | Mini menus |
| `sm` (240 px) | Filter pad | Quick filter |
| `md` (320 px) | Form panel | Edit assignee |
| `lg` (420 px) | Detail card | Object preview |

## Accessibility

- `role="dialog"`, `aria-label` when content is interactive.
- Portaled. Re-tracked on scroll / resize.
- Returns focus to trigger on close.
- Escape dismisses.
- `modal=true` traps focus and makes the rest of the page inert.

## Do

- Click trigger by default; hover only for preview cards.
- Set `width='trigger'` when anchored under an input.
- Wrap interactive content in a labeled form section.

## Don't

- Don't render inline as `<div absolute>` — portal.
- Don't make modal=true the default — that's a Dialog.
- Don't open on hover without an Escape / outside-click escape hatch.
- Don't use Popover for prose.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

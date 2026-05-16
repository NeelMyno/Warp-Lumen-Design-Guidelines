---
name: Tag
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Badge, TagsInput, FilterBar]
spec: ./component.json
last_updated: 2026-05-16
---

# Tag

> Compact, often-closable chip for categorizing or filtering. Not a Badge (status/count) — not a TagsInput (the form control).

## When to use

- Filter chips on a list / table / FilterBar.
- Categorization on a row ("Refrigerated", "LTL", "Hazmat").
- Selected facets in a Combobox.
- "Members" / "Tags" lists.

## When NOT to use

- Status/count — **Badge**.
- Action — **Button**.
- Multi-value form control — wrap Tags in **TagsInput**.

## Tones

| Tone | Surface | Fg |
|---|---|---|
| `subtle` | hairline pill (default) | `text.primary` |
| `neutral` | `surface.sunken` | `text.primary` |
| `accent` | `surface.tint-accent` | `text.accent` |
| `info / success / warning / danger` | `status.*.bg` | `status.*.fg` |

## Sizes

`sm`=22 px (operator) / `md`=28 px (interactive filter).

## Interactive states

| Prop | Becomes |
|---|---|
| `onClick` | `role="button"`, Enter/Space activates |
| `asLink` | `<a>` route |
| `selected` | `aria-pressed=true`, `action.selected.*` tokens |
| `dismissible` | trailing X with `aria-label="Remove {label}"` |

## Accessibility

- Static tags carry no role; interactive tags get `role="button"`.
- Selected: `aria-pressed`.
- Dismiss button has accessible label.
- Color is never the only signal.

## Do

- Default to subtle.
- Lead with value, not category.
- Pair with TagsInput for forms.
- Cap label at 24ch + Tooltip on truncation.

## Don't

- Don't use as a CTA.
- Don't solid-lime fill.
- Don't pack interactive + dismissible together.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

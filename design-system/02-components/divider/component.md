---
name: Divider
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Toolbar, Menu, Spacer]
spec: ./component.json
last_updated: 2026-05-16
---

# Divider

> Hairline rule that separates content. Horizontal (default) or vertical. Optional inline label for section breaks ("OR").

## When to use

- Between list rows.
- Between menu groups.
- Between toolbar action groups (vertical).
- Between form sections (with an inline "OR" label between alternative auth paths).
- Between dashboard rows on a Card surface.

## When NOT to use

- As a structural border on Cards — Cards have their own border.
- For vertical-centering tricks — use Stack / Spacer.
- To visually separate two equally-weighted columns — use Grid gap.

## Variants

| `weight` | Token | Use |
|---|---|---|
| `hairline` | `color.border.hairline` | Default — in-list / in-section |
| `subtle` | `color.border.subtle` | Settings groups |
| `default` | `color.border.default` | Semantic separator (between menu groups) |
| `strong` | `color.border.strong` | Marketing section break |

## Inset modes (list rows)

- `none` — full width.
- `sm` — 16 px inset, both sides.
- `md` — 16 px leading inset only (under-content alignment).
- `lg` — 56 px leading inset (aligns under text in avatar-prefixed list rows — Apple HIG inset divider).

## Accessibility

- Decorative by default — `role="presentation"`.
- Semantic separators (between menu groups, toolbar groups) set `role="separator"` + `aria-orientation`.

## Do

- Default to hairline.
- Use `label="OR"` between alternative paths in forms.
- Inset to align under text rather than under leading icons in list rows.

## Don't

- Don't stack two visible weights.
- Don't paint in lime.
- Don't use Divider where Cards already define a boundary.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

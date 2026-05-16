---
name: SearchField
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Input, Combobox, Kbd]
spec: ./component.json
last_updated: 2026-05-16
---

# SearchField

> Search input. Leading Search icon, trailing Clear, submit-on-Enter, optional suggestions.

## Variants

`inline` (toolbar) / `prominent` (search page) / `command` (⌘K trigger).

## Accessibility

- `<form role="search">`, `<input type="search">`.
- Clear button `aria-label="Clear search"`.
- Suggestions: `aria-autocomplete="list"`.

## Do

- inline in toolbars, prominent on search pages.
- command variant for ⌘K — opens CommandPalette.
- Debounce or submit on Enter.

## Don't

- Don't use for non-search input.
- Don't auto-submit on every keystroke.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.

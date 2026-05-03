---
name: Select
type: component
status: stable
version: 0.6.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Field, Combobox, RadioGroup, Segmented]
spec: ./component.json
last_updated: 2026-05-03
---

# Select

> Single-choice dropdown from a known list. Built on Radix Select. Trigger adopts the field shell; the listbox is a portaled popover with keyboard nav, type-ahead, and screen-reader semantics.

## When to use
- Known, stable list of options (≤ ~12).
- Mutually exclusive single choice that doesn't all fit on one row.

## When NOT to use
- Searchable / dynamic / large list → `Combobox`.
- 2–3 mutually exclusive options that all fit on one row → `Segmented`.
- Many independent boolean flags → `Checkbox` group.
- Boolean (on/off) → `Switch`.

## Anatomy

- **Trigger** — adopts `.lumen-field` shell. Carries the selected value text (or placeholder) plus a trailing chevron.
- **Listbox** — portaled popover. Hairline border, popover shadow, lime tint on hovered/active item.
- **Item** — 32 px row, 13 px text (lumen body-sm), checkmark indicator on selected.

## Variants

| Prop | Values | Default |
|---|---|---|
| `size` | `sm` / `default` | `default` (40 px) |

## Accessibility

Radix handles the heavy lifting:
- Keyboard: Tab to trigger, Space/Enter to open, Arrow keys to navigate, type-ahead, Escape to close.
- Listbox is portaled (escapes `overflow: hidden` ancestors) and `aria-activedescendant` is wired.
- Selected item carries an indicator glyph + `aria-selected="true"`.

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.3, 2.4.7, 3.3.2, 4.1.2.

## Do

- Always pair with a visible label via Field.
- Order options alphabetically OR by frequency — never random.
- For native form submission, set `name`; Radix renders a hidden `<input>` tied to the form.

## Don't

- Don't use Select for booleans — use Switch.
- Don't use Select for 2–3 mutually exclusive options that all fit on a single row — use Segmented.
- Don't disable items without an explanation — consider hiding them.

## Code

- [Web React](../../../audit-dashboard/src/components/ui/select.tsx)

## Changelog
- 0.6.0 — Initial release. Replaces the v0.5 dual-implementation drift (custom native `<select>` in inputs.tsx, unused shadcn Radix Select). Radix Select is now canonical. Bug fix: removed `bg-transparent` that was clobbering the field-shell bg color.

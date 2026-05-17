---
name: lumen-filter-builder
description: Use to build composable queries — Linear/Asana-style filter editor. Each row is { field, operator, value }. Stack rows under AND or OR groups. Pair with @lumen/saved-view to save the resulting query state.
---

# Lumen FilterBuilder

Query-DSL editor — operator/field/value chip rows. Each row is a (field, operator, value) triple. Composable AND/OR groups. Add-condition button + Save-as-view CTA.

## Use when

- Lane filter — origin = LAX AND destination IN (SFO, OAK) AND status != cancelled.
- Shipment filter — pickup-date BETWEEN x AND y AND lane = LAX→SFO.
- Saved query state via SavedView.

## NEVER

- NEVER allow ambiguous operators (e.g. don't use 'is' for both equality and is-defined — split them).
- NEVER hide the remove-row button.
- NEVER let one row collapse the layout — use min-widths.

## Tokens consumed

- surface.raised
- surface.sunken
- text.primary
- text.secondary
- text.tertiary
- border.hairline
- border.default
- radius.md
- space.2
- space.3

## Anatomy

1. FilterBuilder root
2. FilterRow × N — { field-select, operator-select, value-input/combobox, remove-button }
3. FilterGroup — wraps rows; AND/OR connector chip
4. Add condition button
5. Save-as-view button

## API

- `fields` — { value: string, label: string, type: 'text' | 'number' | 'date' | 'select', options?: ComboboxOption[] }[].
- `value` — Filter[] (controlled).
- `onChange` — (v: Filter[]) => void.
- `operators` — per field type.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Each row is a labeled group with role=group + aria-label='Filter row N'.
- Add/remove buttons have descriptive aria-labels.
- Use semantic HTML — <fieldset> for the whole builder.

## Code (canonical)

```tsx
import { FilterBuilder } from "@/components/ui/filter-builder";

export function Example() {
  return <FilterBuilder fields={[{ value: "lane", label: "Lane", type: "text" }]} />;
}
```

## Related

- FilterChip
- SavedView
- Combobox
- DatePicker

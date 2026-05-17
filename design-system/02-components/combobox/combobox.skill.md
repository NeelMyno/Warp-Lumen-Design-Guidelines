---
name: lumen-combobox
description: Use for single-select where the option list is long enough to benefit from search — carrier picker, lane picker, account selector. For short lists (≤ 5) use @lumen/select. Composes as <Combobox options={[…]} value={…} onChange={…} placeholder=… />.
---

# Lumen Combobox

Searchable single-select. Composed from Popover + cmdk Command + Input. Portaled to document.body per ADR 0021. Type-ahead filtering on the option list; arrow + enter selects; outside-click + escape dismiss.

## Use when

- Long option lists (≥ 8).
- Carrier picker, lane picker, account selector.
- Any single-select where typing is faster than scrolling.

## NEVER

- NEVER render the popover inline absolute (must portal — hard rule 10).
- NEVER omit the search input — it's the point of Combobox.
- NEVER use Combobox for multi-select (use TagsInput or MultiCombobox).

## Tokens consumed

- surface.popover
- surface.input.rest
- surface.tint-accent
- border.default
- border.focus
- text.primary
- text.placeholder
- shadow.input.lit-edge
- shadow.input.focus
- shadow.popover
- radius.md
- z-index.overlay

## Anatomy

1. Trigger (Combobox button — looks like Input)
2. Portaled popover (search input + filtered list + empty state)
3. Selected indicator (check icon)
4. Optional clear button (X)

## API

- `options` — { value, label, hint? }[].
- `value`, `onChange` — controlled string.
- `placeholder` — string.
- `searchPlaceholder` — string (default 'Search…').
- `emptyMessage` — string (default 'No results').
- `disabled` — boolean.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- cmdk manages role=combobox + aria-expanded + aria-controls + activedescendant.
- Trigger button shows the selected option label or placeholder.
- Outside-click + escape both dismiss.

## Code (canonical)

```tsx
import { Combobox } from "@/components/ui/combobox";

export function Example() {
  return <Combobox options={[
    { value: "lax", label: "LAX" },
    { value: "sfo", label: "SFO" },
  ]} placeholder="Origin" />;
}
```

## Related

- Select
- TagsInput
- DropdownMenu
- Popover
- CommandPalette

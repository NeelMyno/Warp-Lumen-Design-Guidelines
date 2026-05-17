---
name: lumen-select
description: Use for single-select with ≤ 8 options. For longer lists or where search helps, use @lumen/combobox. The trigger adopts the v0.6 field-shell visual; the portaled content uses the same lime focus tinting as other menus.
---

# Lumen Select

Single-select dropdown built on Radix Select. v0.6 field-shell trigger. Portaled content. For searchable lists use @lumen/combobox.

## Use when

- Single-select with ≤ 8 options.
- Form fields where typing isn't the affordance.
- Inline option pickers (sort by, page size).

## NEVER

- NEVER use Select for >8 options — use Combobox.
- NEVER render content inline (Radix portals).
- NEVER omit the chevron icon (it's the affordance).

## Tokens consumed

- surface.input.rest
- surface.input.disabled
- surface.popover
- surface.tint-accent
- border.default
- border.strong
- border.focus
- border.error
- text.primary
- text.tertiary
- text.placeholder
- shadow.input.lit-edge
- shadow.input.focus
- shadow.popover
- radius.md
- radius.xs

## Anatomy

1. Select root
2. SelectTrigger (field-shell visual)
3. SelectValue (renders the selected label / placeholder)
4. SelectContent (portaled)
5. SelectItem × N
6. SelectGroup + SelectLabel + SelectSeparator

## API

- `value`, `onValueChange` — controlled.
- `defaultValue` — uncontrolled.
- `size` — sm | default on SelectTrigger.
- Standard Radix Select props.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=combobox + role=listbox + aria-* + arrow-key + type-ahead.
- SelectValue shows the selected item or placeholder for screen readers.

## Code (canonical)

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function Example() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Service" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ltl">LTL</SelectItem>
        <SelectItem value="ftl">FTL</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

## Related

- Combobox
- DropdownMenu
- RadioGroup

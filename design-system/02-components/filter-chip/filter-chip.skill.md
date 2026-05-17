---
name: lumen-filter-chip
description: Use above a DataTable / list to show what's currently filtering the view. Each chip = one applied filter. Click the chip to edit (optional Popover); X to remove. For full query building use @lumen/filter-builder.
---

# Lumen FilterChip

Applied-filter chip with operator + value display + optional dropdown editor + dismiss X. Shape is `{label} {operator-label} {value}`. Used in the row above a DataTable to show what's currently filtering the view.

## Use when

- Above a DataTable showing applied filters.
- Active-state indicator on a saved view.
- Compact filter display in a TopBar context.

## NEVER

- NEVER omit onRemove — the point of a chip is dismissibility.
- NEVER use FilterChip for non-applied filters (use Tag).
- NEVER chain 10+ chips — use FilterBuilder.

## Tokens consumed

- pill.neutral.bg
- pill.neutral.fg
- pill.neutral.border
- pill.accent.bg
- pill.accent.fg
- surface.sunken
- radius.full

## Anatomy

1. Chip root (Tag visual)
2. Label (field name)
3. Operator label (gray, smaller)
4. Value (white, bold)
5. Optional edit popover trigger
6. Dismiss X

## API

- `field` — string.
- `operator` — string (display only).
- `value` — string.
- `onRemove` — () => void.
- `onEdit` — () => void (optional).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Chip has aria-label='Filter: {field} {operator} {value}'.
- Remove button has aria-label='Remove filter'.
- If editable, role=button + aria-haspopup.

## Code (canonical)

```tsx
import { FilterChip } from "@/components/ui/filter-chip";

export function Example() {
  return (
    <FilterChip
      field="Lane"
      operator="is"
      value="LAX → SFO"
      onRemove={() => {}}
    />
  );
}
```

## Related

- Tag
- FilterBuilder
- SavedView
- Popover

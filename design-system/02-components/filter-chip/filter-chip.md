---
name: FilterChip
category: data
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - pill.neutral.bg
  - pill.neutral.fg
  - pill.neutral.border
  - pill.accent.bg
  - pill.accent.fg
  - surface.sunken
  - radius.full
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Tag", "FilterBuilder", "SavedView", "Popover"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/filter-chip"
---

# FilterChip

Applied-filter chip with operator + value display + optional dropdown editor + dismiss X. Shape is `{label} {operator-label} {value}`. Used in the row above a DataTable to show what's currently filtering the view.

## When to use

- Above a DataTable showing applied filters.
- Active-state indicator on a saved view.
- Compact filter display in a TopBar context.

## Anatomy

1. Chip root (Tag visual)
2. Label (field name)
3. Operator label (gray, smaller)
4. Value (white, bold)
5. Optional edit popover trigger
6. Dismiss X

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Chip has aria-label='Filter: {field} {operator} {value}'.
- Remove button has aria-label='Remove filter'.
- If editable, role=button + aria-haspopup.

## Tokens consumed

- `pill.neutral.bg`
- `pill.neutral.fg`
- `pill.neutral.border`
- `pill.accent.bg`
- `pill.accent.fg`
- `surface.sunken`
- `radius.full`

## Do

- Always provide onRemove.
- Show all three parts (field + operator + value) for clarity.

## Don't

- Don't chain 10+.
- Don't omit dismissibility.

## Related

- Tag
- FilterBuilder
- SavedView
- Popover

## Code

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

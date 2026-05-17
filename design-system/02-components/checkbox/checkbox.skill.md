---
name: lumen-checkbox
description: Use for multi-select binary — agreeing to ToS, picking multiple filters, multi-row selection in a table. For single binary use Switch. For multi-row table selection consider the DataTable's built-in selection rather than rolling your own checkbox column.
---

# Lumen Checkbox

Multi-select binary control. Built on Radix Checkbox with .lumen-checkbox shell. Lime accent on checked; --radius-xs corners. Lucide Check (stroke-width=3) for the indicator.

## Use when

- Multi-select lists.
- ToS agreement.
- Multi-row table selection.
- Tri-state (parent of a group).

## NEVER

- NEVER use Checkbox for a single binary setting — use Switch.
- NEVER skip the focus ring.
- NEVER fake tri-state with two checkboxes — use checked='indeterminate'.

## Tokens consumed

- color.action.primary.bg.rest
- color.action.primary.fg
- border.default
- border.strong
- shadow.focus
- radius.xs

## Anatomy

1. Checkbox root (.lumen-checkbox shell)
2. Indicator (lucide Check, stroke 3, size-3)

## API

- `checked`, `onCheckedChange` — controlled (use 'indeterminate' for tri-state).
- Standard Radix Checkbox props.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=checkbox + aria-checked + keyboard (Space).
- Pair with a <Label htmlFor> — clicking the label toggles.
- aria-checked='mixed' for tri-state.

## Code (canonical)

```tsx
import { Checkbox } from "@/components/ui/checkbox";

export function Example() {
  return <Checkbox defaultChecked />;
}
```

## Related

- Switch
- RadioGroup
- DataTable selection

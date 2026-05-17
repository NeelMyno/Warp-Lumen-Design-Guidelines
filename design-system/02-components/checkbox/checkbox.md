---
name: Checkbox
category: form
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - color.action.primary.bg.rest
  - color.action.primary.fg
  - border.default
  - border.strong
  - shadow.focus
  - radius.xs
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Switch", "RadioGroup", "DataTable selection"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/checkbox"
---

# Checkbox

Multi-select binary control. Built on Radix Checkbox with .lumen-checkbox shell. Lime accent on checked; --radius-xs corners. Lucide Check (stroke-width=3) for the indicator.

## When to use

- Multi-select lists.
- ToS agreement.
- Multi-row table selection.
- Tri-state (parent of a group).

## Anatomy

1. Checkbox root (.lumen-checkbox shell)
2. Indicator (lucide Check, stroke 3, size-3)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=checkbox + aria-checked + keyboard (Space).
- Pair with a <Label htmlFor> — clicking the label toggles.
- aria-checked='mixed' for tri-state.

## Tokens consumed

- `color.action.primary.bg.rest`
- `color.action.primary.fg`
- `border.default`
- `border.strong`
- `shadow.focus`
- `radius.xs`

## Do

- Pair with Label.
- Use 'indeterminate' for partial-selection parent rows.

## Don't

- Don't use for single binary.
- Don't fake tri-state.

## Related

- Switch
- RadioGroup
- DataTable selection

## Code

```tsx
import { Checkbox } from "@/components/ui/checkbox";

export function Example() {
  return <Checkbox defaultChecked />;
}
```

---
name: Combobox
category: form
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Select", "TagsInput", "DropdownMenu", "Popover", "CommandPalette"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/combobox"
---

# Combobox

Searchable single-select. Composed from Popover + cmdk Command + Input. Portaled to document.body per ADR 0021. Type-ahead filtering on the option list; arrow + enter selects; outside-click + escape dismiss.

## When to use

- Long option lists (≥ 8).
- Carrier picker, lane picker, account selector.
- Any single-select where typing is faster than scrolling.

## Anatomy

1. Trigger (Combobox button — looks like Input)
2. Portaled popover (search input + filtered list + empty state)
3. Selected indicator (check icon)
4. Optional clear button (X)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- cmdk manages role=combobox + aria-expanded + aria-controls + activedescendant.
- Trigger button shows the selected option label or placeholder.
- Outside-click + escape both dismiss.

## Tokens consumed

- `surface.popover`
- `surface.input.rest`
- `surface.tint-accent`
- `border.default`
- `border.focus`
- `text.primary`
- `text.placeholder`
- `shadow.input.lit-edge`
- `shadow.input.focus`
- `shadow.popover`
- `radius.md`
- `z-index.overlay`

## Do

- Provide a clear empty message.
- Use for long option lists.
- Pair with a clear/reset action when value is set.

## Don't

- Don't use for ≤ 5 options.
- Don't skip the portal.

## Related

- Select
- TagsInput
- DropdownMenu
- Popover
- CommandPalette

## Code

```tsx
import { Combobox } from "@/components/ui/combobox";

export function Example() {
  return <Combobox options={[
    { value: "lax", label: "LAX" },
    { value: "sfo", label: "SFO" },
  ]} placeholder="Origin" />;
}
```

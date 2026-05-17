---
name: Popover
category: overlay
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.popover
  - border.default
  - shadow.popover
  - text.primary
  - radius.lg
  - z-index.overlay
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Tooltip", "DropdownMenu", "Combobox", "Calendar", "DatePicker", "HoverCard"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/popover"
---

# Popover

Floating panel anchored to a trigger. Portaled to document.body per ADR 0021 to escape ancestor overflow contexts. Position math is `position: fixed` + `getBoundingClientRect()` re-tracked on scroll + resize. v0.12.4 cascade-fix closed the regression where inline-absolute popovers were clipped inside corner-rounded Cards.

## When to use

- Inline settings panel (filter dropdown, format options).
- Contextual help bubble with rich content (vs Tooltip which is single-line).
- Field affordances — date picker calendar, color picker, time selector.

## Anatomy

1. Popover root (Radix Root)
2. PopoverTrigger — the anchor
3. PopoverContent — the floating panel, portaled
4. PopoverAnchor — alternate anchor element

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role + aria-haspopup + escape-to-close + outside-click dismiss.
- Outside-click dismiss exempts the portaled list itself (don't double-dismiss).
- Focus moves into Popover on open; returns to trigger on close.

## Tokens consumed

- `surface.popover`
- `border.default`
- `shadow.popover`
- `text.primary`
- `radius.lg`
- `z-index.overlay`

## Do

- Use Popover for rich content (Tooltip for single-line).
- Portal — never render inline absolute.

## Don't

- Don't reach for Popover when Tooltip suffices.
- Don't disable the portal.

## Related

- Tooltip
- DropdownMenu
- Combobox
- Calendar
- DatePicker
- HoverCard

## Code

```tsx
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export function Example() {
  return (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Hello</PopoverContent>
    </Popover>
  );
}
```

---
name: lumen-popover
description: Use when surfacing transient content tied to a trigger — settings, info, contextual help, dropdowns. Built on Radix Popover (already portaled). Composes Popover root + PopoverTrigger + PopoverContent. Width default w-72 (288px); customize via className.
---

# Lumen Popover

Floating panel anchored to a trigger. Portaled to document.body per ADR 0021 to escape ancestor overflow contexts. Position math is `position: fixed` + `getBoundingClientRect()` re-tracked on scroll + resize. v0.12.4 cascade-fix closed the regression where inline-absolute popovers were clipped inside corner-rounded Cards.

## Use when

- Inline settings panel (filter dropdown, format options).
- Contextual help bubble with rich content (vs Tooltip which is single-line).
- Field affordances — date picker calendar, color picker, time selector.

## NEVER

- NEVER render as inline `<div absolute>` — must portal (hard rule 10).
- NEVER strip the focus management — Radix handles it correctly.
- NEVER apply backdrop-filter to PopoverContent on dense surfaces — popover IS a floating shell, glass is allowed via .lumen-glass-default if needed.

## Tokens consumed

- surface.popover
- border.default
- shadow.popover
- text.primary
- radius.lg
- z-index.overlay

## Anatomy

1. Popover root (Radix Root)
2. PopoverTrigger — the anchor
3. PopoverContent — the floating panel, portaled
4. PopoverAnchor — alternate anchor element

## API

- `open`, `onOpenChange` — controlled or uncontrolled.
- `align` — start | center (default) | end on PopoverContent.
- `sideOffset` — px between trigger + content (default 4).
- `side` — top | right | bottom | left.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role + aria-haspopup + escape-to-close + outside-click dismiss.
- Outside-click dismiss exempts the portaled list itself (don't double-dismiss).
- Focus moves into Popover on open; returns to trigger on close.

## Code (canonical)

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

## Related

- Tooltip
- DropdownMenu
- Combobox
- Calendar
- DatePicker
- HoverCard

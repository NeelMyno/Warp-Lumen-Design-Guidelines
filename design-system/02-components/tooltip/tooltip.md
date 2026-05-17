---
name: Tooltip
category: overlay
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - text.primary
  - radius.md
  - z-index.tooltip
  - type.11
  - tracking.tight
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Popover", "HoverCard", "Kbd", "IconButton"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/tooltip"
---

# Tooltip

Single-line floating label. Built on Radix Tooltip with .lumen-glass-strong surface. 11px font-medium tracked-tight. Default delayDuration=0 for instant-on (operator density); override per-instance for longer delays in marketing surfaces.

## When to use

- Icon-only buttons (paired with IconButton).
- Abbreviations + acronyms (BOL, ETA, OTD).
- Keyboard shortcut hints next to actions.

## Anatomy

1. TooltipProvider — required at app root (or per-instance)
2. Tooltip root
3. TooltipTrigger — the anchor
4. TooltipContent — the floating label, portaled, glass-strong

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=tooltip + aria-describedby + show on focus / hover / pointer-enter; hide on blur / escape.
- Mobile / touch: tooltip surfaces via long-press; not a substitute for visible label.

## Tokens consumed

- `text.primary`
- `radius.md`
- `z-index.tooltip`
- `type.11`
- `tracking.tight`

## Do

- Pair with IconButton for icon-only affordances.
- Use for abbreviations + keyboard hints.

## Don't

- Don't put essential information in a tooltip.
- Don't use for multi-line content.

## Related

- Popover
- HoverCard
- Kbd
- IconButton

## Code

```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function Example() {
  return (
    <Tooltip>
      <TooltipTrigger>?</TooltipTrigger>
      <TooltipContent>Bill of Lading</TooltipContent>
    </Tooltip>
  );
}
```

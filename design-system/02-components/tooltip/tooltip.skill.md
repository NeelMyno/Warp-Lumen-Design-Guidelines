---
name: lumen-tooltip
description: Use for single-line label content tied to a trigger (icon tooltips, abbreviation expansions, keyboard shortcut hints). For multi-line / rich content use @lumen/popover or @lumen/hover-card. Default delayDuration=0 for operator density.
---

# Lumen Tooltip

Single-line floating label. Built on Radix Tooltip with .lumen-glass-strong surface. 11px font-medium tracked-tight. Default delayDuration=0 for instant-on (operator density); override per-instance for longer delays in marketing surfaces.

## Use when

- Icon-only buttons (paired with IconButton).
- Abbreviations + acronyms (BOL, ETA, OTD).
- Keyboard shortcut hints next to actions.

## NEVER

- NEVER use Tooltip for essential information — content must be auxiliary (keyboard users see it on focus).
- NEVER make Tooltip multi-line — use Popover or HoverCard for rich content.
- NEVER override glass-strong with a solid surface that defeats the brand glass voice.

## Tokens consumed

- text.primary
- radius.md
- z-index.tooltip
- type.11
- tracking.tight

## Anatomy

1. TooltipProvider — required at app root (or per-instance)
2. Tooltip root
3. TooltipTrigger — the anchor
4. TooltipContent — the floating label, portaled, glass-strong

## API

- `delayDuration` — default 0 (operator density). Pass 700 for marketing-style hover delays.
- `sideOffset` — default 6px.
- Composed inside TooltipProvider; single Tooltip auto-provides one for convenience.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=tooltip + aria-describedby + show on focus / hover / pointer-enter; hide on blur / escape.
- Mobile / touch: tooltip surfaces via long-press; not a substitute for visible label.

## Code (canonical)

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

## Related

- Popover
- HoverCard
- Kbd
- IconButton

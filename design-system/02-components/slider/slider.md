---
name: Slider
category: form
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - lumen.accent.4
  - lumen.accent.5
  - lumen.lime.a14
  - lumen.lime.a32
  - surface.sunken
  - surface.raised
  - shadow.focus
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["RangeSlider", "NumberInput", "Switch"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/slider"
---

# Slider

Numeric range input. Built on Radix Slider. Single-handle by default; range when defaultValue=[lo, hi] (two thumbs). Lime accent track + bordered thumb with ring on hover/focus. Touch + keyboard accessible.

## When to use

- Continuous numeric input (weight, distance, price).
- Range filtering (price between $50 and $500).
- Volume / opacity / blur controls.

## Anatomy

1. Slider root (relative flex)
2. Track (--surface-sunken)
3. Range (lime accent on the filled portion)
4. Thumb × N (1 or 2 — render based on defaultValue.length)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=slider + aria-valuemin/max/now + arrow keys + home/end.
- Provide aria-label on the Slider root for screen readers.
- Honor prefers-reduced-motion (transition stays instant).

## Tokens consumed

- `lumen.accent.4`
- `lumen.accent.5`
- `lumen.lime.a14`
- `lumen.lime.a32`
- `surface.sunken`
- `surface.raised`
- `shadow.focus`

## Do

- Use for continuous numeric input.
- Pair with a numeric display.

## Don't

- Don't use for discrete options.
- Don't omit aria-label.

## Related

- RangeSlider
- NumberInput
- Switch

## Code

```tsx
import { Slider } from "@/components/ui/slider";

export function Example() {
  return <Slider defaultValue={[40]} />;
}
```

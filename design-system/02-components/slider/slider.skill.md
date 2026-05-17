---
name: lumen-slider
description: Use for numeric range entry where the value is continuous — weight, distance, price ceiling. For discrete steps use steps prop; for binary use Switch. RangeSlider is the same component with two thumbs — pass defaultValue={[lo, hi]}.
---

# Lumen Slider

Numeric range input. Built on Radix Slider. Single-handle by default; range when defaultValue=[lo, hi] (two thumbs). Lime accent track + bordered thumb with ring on hover/focus. Touch + keyboard accessible.

## Use when

- Continuous numeric input (weight, distance, price).
- Range filtering (price between $50 and $500).
- Volume / opacity / blur controls.

## NEVER

- NEVER use Slider for non-continuous values (use Select / RadioGroup).
- NEVER omit aria-label or aria-labelledby on the thumb.
- NEVER use Tailwind arbitrary translate for the thumb (hard rule 12 — Radix handles position via inline style).

## Tokens consumed

- lumen.accent.4
- lumen.accent.5
- lumen.lime.a14
- lumen.lime.a32
- surface.sunken
- surface.raised
- shadow.focus

## Anatomy

1. Slider root (relative flex)
2. Track (--surface-sunken)
3. Range (lime accent on the filled portion)
4. Thumb × N (1 or 2 — render based on defaultValue.length)

## API

- `defaultValue` — number[] (e.g. [40] for single, [20, 80] for range).
- `min`, `max`, `step` — numeric bounds.
- `onValueChange` — (v: number[]) => void.
- `disabled` — boolean.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=slider + aria-valuemin/max/now + arrow keys + home/end.
- Provide aria-label on the Slider root for screen readers.
- Honor prefers-reduced-motion (transition stays instant).

## Code (canonical)

```tsx
import { Slider } from "@/components/ui/slider";

export function Example() {
  return <Slider defaultValue={[40]} />;
}
```

## Related

- RangeSlider
- NumberInput
- Switch

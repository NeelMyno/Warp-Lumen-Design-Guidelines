---
name: lumen-progress
description: Use ProgressBar for linear determinate (form completion, file upload). Use ProgressRing for hero KPI tiles where the donut IS the metric (capacity, on-time %, savings goal). Four tones: accent / success / warning / danger / neutral. For indeterminate use Spinner.
---

# Lumen Progress

Determinate progress. Two shapes: ProgressBar (linear, four tones) + ProgressRing (circular, Lumen-signature for hero KPI tiles). Bar honors three sizes (sm h1 / md h1.5 / lg h2). Ring uses stroke-dasharray + dashoffset with cubic-bezier(0.2,0,0,1) 280ms transition.

## Use when

- Determinate linear progress (form completion, file upload).
- Hero KPI tile where the donut IS the metric (capacity, OTD %, goal).
- Multi-step flow indicator (paired with Stepper).

## NEVER

- NEVER use Progress for indeterminate — use Spinner.
- NEVER omit aria-label / role=progressbar.
- NEVER spin the ring (it's determinate).

## Tokens consumed

- color.accent
- lumen.accent.6
- lumen.amber.5
- lumen.red.5
- text.tertiary
- text.secondary
- text.primary
- surface.sunken
- space.1_5
- type.12
- type.22

## Anatomy

1. ProgressBar — track + indicator + optional label + value display
2. ProgressRing — SVG circle base + circle fill (stroke-dasharray animated)
3. Center value display (heading-h6 ratio, --type-22 on size 56 ring)

## API

- ProgressBar: `value`, `max` (default 100), `tone`, `label`, `showValue`, `size`.
- ProgressRing: `value`, `max`, `size` (px), `stroke` (px), `tone`, `label`.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- ProgressBar — role=progressbar + aria-valuemin/max/now (Radix manages).
- ProgressRing — role=img + aria-label with the value or label.
- Animation honors prefers-reduced-motion.

## Code (canonical)

```tsx
import { ProgressBar, ProgressRing } from "@/components/ui/progress";

export function Example() {
  return (
    <div className="flex gap-4 items-center">
      <ProgressBar value={60} showValue />
      <ProgressRing value={75} size={56} />
    </div>
  );
}
```

## Related

- Spinner
- Stat
- Stepper

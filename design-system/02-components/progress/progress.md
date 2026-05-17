---
name: Progress
category: feedback
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Spinner", "Stat", "Stepper"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/progress"
---

# Progress

Determinate progress. Two shapes: ProgressBar (linear, four tones) + ProgressRing (circular, Lumen-signature for hero KPI tiles). Bar honors three sizes (sm h1 / md h1.5 / lg h2). Ring uses stroke-dasharray + dashoffset with cubic-bezier(0.2,0,0,1) 280ms transition.

## When to use

- Determinate linear progress (form completion, file upload).
- Hero KPI tile where the donut IS the metric (capacity, OTD %, goal).
- Multi-step flow indicator (paired with Stepper).

## Anatomy

1. ProgressBar — track + indicator + optional label + value display
2. ProgressRing — SVG circle base + circle fill (stroke-dasharray animated)
3. Center value display (heading-h6 ratio, --type-22 on size 56 ring)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- ProgressBar — role=progressbar + aria-valuemin/max/now (Radix manages).
- ProgressRing — role=img + aria-label with the value or label.
- Animation honors prefers-reduced-motion.

## Tokens consumed

- `color.accent`
- `lumen.accent.6`
- `lumen.amber.5`
- `lumen.red.5`
- `text.tertiary`
- `text.secondary`
- `text.primary`
- `surface.sunken`
- `space.1_5`
- `type.12`
- `type.22`

## Do

- Use ProgressRing for hero KPIs.
- Show value with %.
- Pair color tone with semantic meaning.

## Don't

- Don't use for indeterminate.
- Don't omit aria-label.

## Related

- Spinner
- Stat
- Stepper

## Code

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

---
name: lumen-loader
description: AI-context loader. Wraps Lumen's v0.12.4 Spinner; adds an optional 'AI thinking' label slot. Mirrors Vercel AI Elements `Loader`. Install with `npx ai-elements@latest add loader`. Status: stable.
---

# Lumen Loader

AI-context loader. Wraps Lumen's v0.12.4 Spinner; adds an optional 'AI thinking' label slot.

## Use when

- Pre-stream wait — model is queued but no tokens have arrived.
- Tool execution wait — between Confirmation approval and ToolOutput.
- Citation lookup wait — between assistant claim and Sources rendering.

## NEVER

- NEVER use Loader for non-AI loading. The v0.12.4 Spinner primitive is the right primitive for generic loading.
- NEVER hardcode the loader label. The label adapts to context ('Thinking…', 'Quoting carriers…', 'Looking up shipment…').
- NEVER show Loader once streaming begins. Once tokens arrive, MessageResponse's shimmer is the loading affordance.

## Tokens consumed

- color.surface.canvas
- color.surface.raised
- color.text.primary
- color.text.secondary
- color.text.accent
- color.border.hairline
- color.border.frame
- space.3, space.4, space.6
- radius.md, radius.lg
- motion.duration.fast, motion.duration.base
- motion.easing.standard

## Anatomy

1. `Loader` — Root, composes Spinner + label.

## API

Composes Lumen Spinner (v0.12.4) with an optional label slot. Honors prefers-reduced-motion (spinner animation stops; label persists).

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add loader
import { Loader } from "@/components/ai-elements/loader";

export function Example() {
  return <Loader />;
}
```

## Related

- Spinner (v0.12.4 primitive)
- MessageResponse (shimmer takes over once streaming begins)
- Tool (Loader bridges Confirmation → ToolOutput)

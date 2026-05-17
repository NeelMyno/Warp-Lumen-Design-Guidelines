---
name: lumen-loader
description: Lumen-branded loading indicator for AI surfaces. Reuses the v0.12.4 Spinner primitive with three intensity levels. Mirrors Vercel AI Elements `Loader` verbatim per AGENTS.md hard rule 19. Install with `npx ai-elements@latest add loader`. Status: stable.
---

# Lumen Loader

Lumen-branded loading indicator for AI surfaces. Reuses the v0.12.4 Spinner primitive with AI-surface-specific affordances.

## Use when

- Streaming-response wait state — first token hasn't arrived yet.
- Long-running tool call is executing.
- Reasoning blocks are recomputing mid-stream.

## NEVER

- NEVER use Loader for non-AI surfaces — Lumen's Spinner primitive handles all non-AI loading. Loader exists for the AI surface idiom.
- NEVER pair Loader with a separate "Loading..." text node — the `label` prop drives sr-only announcement; sighted users see the motion.
- NEVER suppress motion silently on `prefers-reduced-motion` — replace rotation with an opacity pulse so the affordance survives.
- NEVER stack multiple Loaders on the same surface — one per active AI operation.

## Tokens consumed

- color.accent.500 (spring green at 24% intensity)
- color.text.secondary (sr-only label)
- motion.duration.slow (1200ms rotation)
- motion.easing.linear
- space.2, space.3
- radius.full

## Anatomy

1. `Loader` — Root SVG spinner; consumes Lumen Spinner primitive under the hood.

## API

```ts
interface LoaderProps {
  intensity?: "subtle" | "default" | "pulse";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}
```

## Modes

- Restrained (default): solid spring tint at 24% opacity, no glow.
- Expressive: ambient atmosphere from page chrome may render around the loader.

## Accessibility

- `role="status"` + `aria-live="polite"`.
- `prefers-reduced-motion`: opacity pulse replaces rotation.
- Always visible — never opacity 0 or display none during active wait.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add loader
import { Loader } from "@/components/ai-elements/loader";

export function Example() {
  return <Loader intensity="pulse" size="md" label="Streaming response" />;
}
```

## Related

- Spinner (underlying primitive)
- MessageResponse (where Loader appears mid-stream)
- loader-ai (v0.13.0 alias)
- 03-patterns/chat-thread.md

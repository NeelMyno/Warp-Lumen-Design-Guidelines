---
name: lumen-snippet
description: Lightweight terminal command or short code snippet. Built on shadcn InputGroup; one-line copy affordance. Mirrors Vercel AI Elements `Snippet`. Install with `npx ai-elements@latest add snippet`. Status: stable.
---

# Lumen Snippet

Lightweight terminal command or short code snippet. Built on shadcn InputGroup; one-line copy affordance.

## Use when

- Assistant returns a single terminal command ('Run `pnpm install`').
- A short code snippet (one-line, one-statement) that benefits from copy-affordance UI.
- Surface needs a lighter-weight alternative to CodeBlock for short inline content.

## NEVER

- NEVER use Snippet for multi-line code. CodeBlock handles multi-line; Snippet is single-line.
- NEVER omit the copy button — it's the whole reason Snippet exists.
- NEVER apply Spring Green to the snippet text. Use color.text.primary on color.surface.sunken.

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

1. `Snippet` — Root container.
2. `SnippetCopyButton` — Click-to-copy IconButton.

## API

Props: `command: string` (the single line), `language?: string` (shell | json | css | …). Renders inline-code-styled with a click-to-copy IconButton.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add snippet
import { Snippet } from "@/components/ai-elements/snippet";

export function Example() {
  return <Snippet />;
}
```

## Related

- CodeBlock (multi-line)
- InputGroup (shadcn primitive)
- Terminal

---
name: lumen-response
description: Plain (non-streaming) markdown rendering wrapper. Use when content is complete and the streaming/shimmer mechanics of MessageResponse are unnecessary. Mirrors Vercel AI Elements `Response`. Install with `npx ai-elements@latest add response`. Status: stable.
---

# Lumen Response

Plain (non-streaming) markdown rendering wrapper. Use when content is complete and the streaming/shimmer mechanics of MessageResponse are unnecessary.

## Use when

- Rendering complete assistant text where streaming is already done.
- Tool output that returns prose (research result, summary).
- Static content surfaces — assistant-generated documentation, policy explanation.

## NEVER

- NEVER use Response for streaming content — that's MessageResponse's job.
- NEVER inject raw HTML by default. Markdown allowlist only.
- NEVER set Response.aria-live; it's static content.

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

1. `Response` — Root markdown wrapper.

## API

Props: `text: string`, `markdown?: { allowHtml?, remarkPlugins?, rehypePlugins? }`. Renders complete markdown with no shimmer / cursor.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add response
import { Response } from "@/components/ai-elements/response";

export function Example() {
  return <Response />;
}
```

## Related

- MessageResponse (streaming sibling)
- Message
- Tool (ToolOutput often uses Response for text)

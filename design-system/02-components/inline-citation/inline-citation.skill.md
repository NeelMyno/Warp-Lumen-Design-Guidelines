---
name: lumen-inline-citation
description: Clickable [1]-style superscript inside MessageResponse. Anchors to a Sources entry by document_index. Mirrors Vercel AI Elements `InlineCitation`. Install with `npx ai-elements@latest add inline-citation`. Status: stable.
---

# Lumen InlineCitation

Clickable [1]-style superscript inside MessageResponse. Anchors to a Sources entry by document_index.

## Use when

- A claim in MessageResponse maps to a specific citation from the Anthropic Citations API.
- The user needs an at-the-character-position visual cue that 'this claim has a source.'
- Reading flow benefits from inline references over footnote-style end-of-paragraph numbers.

## NEVER

- NEVER hardcode the superscript number. The number comes from the Citation's document_index + 1.
- NEVER render an InlineCitation without a matching Sources entry — orphaned superscripts break the click-through contract.
- NEVER use InlineCitation outside a Message body. Standalone citations go through Sources.

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

1. `InlineCitation` — The superscript itself.
2. `InlineCitationContent` — Tooltip content (cited_text excerpt).

## API

Renders as `<sup>[N]</sup>` styled inline. On click, scrolls to the Sources entry with matching id (id = `source-{document_index}`). Hover shows a tooltip with the cited_text excerpt.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add inline-citation
import { InlineCitation } from "@/components/ai-elements/inline-citation";

export function Example() {
  return <InlineCitation />;
}
```

## Related

- Sources (the footer InlineCitation anchors to)
- MessageResponse (the renderer that inlines InlineCitation tokens)
- 03-patterns/citation-card.md

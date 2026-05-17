---
name: lumen-sources
description: Citation footer below an assistant Message. Consumes the Anthropic Citations API JSON shape verbatim. Mirrors Vercel AI Elements `Sources`. Install with `npx ai-elements@latest add sources`. Status: stable.
---

# Lumen Sources

Citation footer below an assistant Message. Consumes the Anthropic Citations API JSON shape verbatim.

## Use when

- An assistant response cites source material (Claude with Citations API; RAG retrieval results; web-search tool output).
- The user needs to verify a claim by clicking through to the source.
- Compliance surface where every assistant claim needs traceable provenance.

## NEVER

- NEVER drop the citation linkage. If a message has `citations`, Sources MUST render and InlineCitation superscripts MUST appear in the message body.
- NEVER fabricate a source. The Citation type comes from the model's tool output; the UI renders verbatim.
- NEVER summarize the cited_text. Render it verbatim. The user is verifying against the original passage.

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

1. `Sources` — Root footer container.
2. `SourcesTrigger` — Click-to-expand header ('3 sources').
3. `SourcesContent` — Numbered list of citation cards.
4. `Source` — Single citation card — title + cited_text excerpt + open-in-new-window.

## API

Takes `citations: Citation[]` where each Citation matches the Anthropic Citations API shape: `{ type: 'char_location' | 'page_location' | 'content_block_location'; cited_text: string; document_index: number; document_title: string | null; ...type-specific fields }`. Renders a numbered list below the message body.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add sources
import { Sources } from "@/components/ai-elements/sources";

export function Example() {
  return <Sources />;
}
```

## Related

- InlineCitation (matching superscripts in message body)
- Message
- Tool (Sources often cites tool output)
- 03-patterns/citation-card.md (canonical pattern)

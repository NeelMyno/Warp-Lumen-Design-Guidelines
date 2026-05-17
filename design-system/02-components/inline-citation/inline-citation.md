---
name: InlineCitation
type: component
tier: T5
family: AIInsight
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: InlineCitation
install: npx ai-elements@latest add inline-citation
related:
  - ./inline-citation.skill.md
  - ../tool/tool.md
---

# InlineCitation

Clickable [1]-style superscript inside MessageResponse. Anchors to a Sources entry by document_index.

## Use when

- A claim in MessageResponse maps to a specific citation from the Anthropic Citations API.
- The user needs an at-the-character-position visual cue that 'this claim has a source.'
- Reading flow benefits from inline references over footnote-style end-of-paragraph numbers.

## API

Renders as `<sup>[N]</sup>` styled inline. On click, scrolls to the Sources entry with matching id (id = `source-{document_index}`). Hover shows a tooltip with the cited_text excerpt.

### Anthropic Citations API integration

`InlineCitation` consumes the same `Citation` shape as [`Sources`](../sources/sources.md):

```ts
type Citation =
  | { type: "char_location"; cited_text: string; document_index: number; document_title: string | null; start_char_index: number; end_char_index: number }
  | { type: "page_location"; cited_text: string; document_index: number; document_title: string | null; start_page_number: number; end_page_number: number }
  | { type: "content_block_location"; cited_text: string; document_index: number; document_title: string | null; start_block_index: number; end_block_index: number };
```

The model's response inserts citation tokens inline (e.g., as part of the `MessageResponse`'s markdown). `InlineCitation` is the renderer for those tokens. The Anthropic Messages API delivers citations alongside the streamed text via the `citation` content block type in the stream — the AI SDK's `useChat` hook surfaces them as `message.parts: Array<...>` where each part can be `text`, `tool-call`, `reasoning`, or `citation`.

### Component props

- `citation: Citation` — required. The citation object from the model response.
- `index: number` — required. The 0-based index into the message's citations array (the rendered superscript is `index + 1`).
- `onClick?: () => void` — optional. Defaults to scroll-to-Sources-entry behavior. Override for analytics or custom navigation.

### Example consuming code

```tsx
import { InlineCitation, InlineCitationContent } from "@/components/ai-elements/inline-citation";

export function CitedSpan({ citation, index }: { citation: Citation; index: number }) {
  return (
    <>
      {citation.cited_text}
      <InlineCitation citation={citation} index={index}>
        <InlineCitationContent>
          <strong>{citation.document_title ?? `Document ${citation.document_index}`}</strong>
          <p>{citation.cited_text}</p>
        </InlineCitationContent>
      </InlineCitation>
    </>
  );
}
```

The pattern is: `MessageResponse` walks the message's `parts`, renders text parts as markdown, and renders citation parts as `<InlineCitation />` superscripts. The `Sources` footer below the Message renders the matching entries; click on `[1]` scrolls to the entry with `id="source-0"`.

## Anatomy

| Sub-component | Role |
|---|---|
| `InlineCitation` | The superscript itself. |
| `InlineCitationContent` | Tooltip content (cited_text excerpt). |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Sources (the footer InlineCitation anchors to)
- MessageResponse (the renderer that inlines InlineCitation tokens)
- 03-patterns/citation-card.md

## Install

```bash
npx ai-elements@latest add inline-citation
```

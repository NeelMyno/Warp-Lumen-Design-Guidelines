---
name: Sources
type: component
tier: T5
family: AIInsight
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Sources
install: npx ai-elements@latest add sources
related:
  - ./sources.skill.md
  - ../tool/tool.md
---

# Sources

Citation footer below an assistant Message. Consumes the Anthropic Citations API JSON shape verbatim.

## Use when

- An assistant response cites source material (Claude with Citations API; RAG retrieval results; web-search tool output).
- The user needs to verify a claim by clicking through to the source.
- Compliance surface where every assistant claim needs traceable provenance.

## API

Takes `citations: Citation[]` where each Citation matches the Anthropic Citations API shape verbatim. Renders a numbered list below the message body.

### Anthropic Citations API — the canonical type (verbatim)

```ts
type CharLocationCitation = {
  type: "char_location";
  cited_text: string;
  document_index: number;
  document_title: string | null;
  start_char_index: number;
  end_char_index: number;
};

type PageLocationCitation = {
  type: "page_location";
  cited_text: string;
  document_index: number;
  document_title: string | null;
  start_page_number: number;
  end_page_number: number;
};

type ContentBlockLocationCitation = {
  type: "content_block_location";
  cited_text: string;
  document_index: number;
  document_title: string | null;
  start_block_index: number;
  end_block_index: number;
};

type Citation =
  | CharLocationCitation
  | PageLocationCitation
  | ContentBlockLocationCitation;
```

This shape comes directly from the Anthropic Messages API when [Citations](https://docs.anthropic.com/en/docs/build-with-claude/citations) are enabled on a request. The `document_index` is 0-based; the `Sources` UI renders 1-based superscripts (`[1]`, `[2]`, …).

### Component props

- `citations: Citation[]` — required. The full citation array from the model response.
- `defaultOpen?: boolean = false` — whether the Sources footer is expanded by default. Default collapsed; the header shows the count ("3 sources").
- `maxExcerpt?: number = 280` — character limit for cited_text excerpts in the rendered cards. Click to expand the full passage.
- `onSourceClick?: (citation: Citation, index: number) => void` — fires when the user clicks a single source card. Use to log telemetry or open an external viewer.

### Example consuming code

```tsx
import { Sources, SourcesTrigger, SourcesContent, Source } from "@/components/ai-elements/sources";

export function MessageFooter({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;
  return (
    <Sources citations={citations}>
      <SourcesTrigger />            {/* "3 sources" expand button */}
      <SourcesContent>
        {citations.map((c, i) => (
          <Source key={i} citation={c} index={i} />
        ))}
      </SourcesContent>
    </Sources>
  );
}
```

The Anthropic Citations response shape lives in [`@anthropic-ai/sdk`](https://www.npmjs.com/package/@anthropic-ai/sdk) under the `Citation` types. The Lumen `Sources` component imports them at compile time so the contract stays in sync upstream.

## Anatomy

| Sub-component | Role |
|---|---|
| `Sources` | Root footer container. |
| `SourcesTrigger` | Click-to-expand header ('3 sources'). |
| `SourcesContent` | Numbered list of citation cards. |
| `Source` | Single citation card — title + cited_text excerpt + open-in-new-window. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- InlineCitation (matching superscripts in message body)
- Message
- Tool (Sources often cites tool output)
- 03-patterns/citation-card.md (canonical pattern)

## Install

```bash
npx ai-elements@latest add sources
```

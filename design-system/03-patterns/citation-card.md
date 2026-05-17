---
name: Citation Card
type: pattern
version: 0.13.0
last_updated: 2026-05-17
phase: 5
audience: [designer, engineer, llm-agent]
primitives:
  - Sources
  - InlineCitation
  - Message
  - MessageResponse
api: Anthropic Citations API
related:
  - ./chat-thread.md
  - ./shipment-timeline.md
  - ../02-components/sources/sources.md
  - ../02-components/inline-citation/inline-citation.md
---

# Citation Card

The detailed pattern for rendering source citations using the Anthropic Citations API JSON shape. Inline `[1]` superscripts in the message body, expandable Sources footer below.

## What this pattern depends on

- **Anthropic Citations API enabled** on the request. The Messages API returns citation blocks in the streamed parts when documents are included in the request.
- **The renderer walks `message.parts`** (not just `message.text`) so citation positioning is preserved.
- **Stable `document_index`** across the message lifetime (one citation array per message; indexes don't shift).

## The canonical type

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

Verbatim from the Anthropic Messages API. Lumen does NOT transform this shape; the components consume it as-is.

## Composition

```
Message from="assistant"
  ├─ MessageContent
  │   └─ MessageResponse
  │       └─ (text with InlineCitation [1] superscripts inline at the cited positions)
  └─ Sources (footer)
      ├─ SourcesTrigger ("3 sources")
      └─ SourcesContent (collapsed by default)
          ├─ [1] Source — document_title + cited_text excerpt + open-in-new-window
          ├─ [2] Source — …
          └─ [3] Source — …
```

## Renderer pattern

```tsx
import { MessageResponse } from "@/components/ai-elements/message-response";
import { InlineCitation, InlineCitationContent } from "@/components/ai-elements/inline-citation";
import { Sources, SourcesTrigger, SourcesContent, Source } from "@/components/ai-elements/sources";

function renderAssistantMessage(msg: AssistantMessage) {
  const citations: Citation[] = msg.parts.filter((p) => p.type === "citation");
  return (
    <Message from="assistant">
      <MessageContent>
        {msg.parts.map((part, i) => {
          if (part.type === "text") return <span key={i}>{part.text}</span>;
          if (part.type === "citation") {
            const idx = citations.indexOf(part);
            return (
              <InlineCitation key={i} citation={part} index={idx}>
                <InlineCitationContent>
                  <strong>{part.document_title ?? `Document ${part.document_index}`}</strong>
                  <p>{part.cited_text}</p>
                </InlineCitationContent>
              </InlineCitation>
            );
          }
        })}
      </MessageContent>
      {citations.length > 0 && (
        <Sources citations={citations}>
          <SourcesTrigger />
          <SourcesContent>
            {citations.map((c, i) => (
              <Source key={i} citation={c} index={i} />
            ))}
          </SourcesContent>
        </Sources>
      )}
    </Message>
  );
}
```

## Voice

| Surface | Copy |
|---|---|
| SourcesTrigger label | "3 sources" (count + literal noun). NOT "Show references" or "View citations". |
| Source card document_title fallback | "Document {document_index + 1}" when the API returns `null`. Don't invent a title. |
| Source card excerpt format | First 280 chars of `cited_text` + "…" if truncated. Click expands to full excerpt. |
| InlineCitation tooltip | The document_title + a short excerpt. Hover-only; click jumps to the Source card. |

## Accessibility

- `InlineCitation` renders as `<a href="#source-{document_index}">` so screen readers announce it as a link.
- `Sources` is `role="region"` with `aria-labelledby="sources-heading"`.
- Each `Source` is a `role="article"` with `aria-label` derived from `document_title`.
- Click on `InlineCitation` scrolls smoothly to the matching `Source`; `prefers-reduced-motion` degrades to `scroll-behavior: auto`.

## Failure modes

1. **document_index off-by-one.** The API is 0-based; the UI renders 1-based. Double-add to the index → `[2]` superscript points to `Source 3`. Always derive UI index from `index + 1` exactly once.
2. **Citations summarized in Sources.** Render `cited_text` VERBATIM. The user is verifying against the original passage; paraphrase defeats the purpose.
3. **Sources rendered without InlineCitation in the body.** Orphaned Sources — the user can't see what claims were cited. Always pair: superscripts in body + matching entries in footer.
4. **InlineCitation rendered without matching Sources entry.** Click → 404-jump. Always derive both from the same `citations` array.
5. **Citation tokens dropped during stream.** If the renderer uses `message.text` instead of `message.parts`, citation positioning is lost. Always walk `parts`.

## Related

- [`Sources`](../02-components/sources/sources.md) — the footer component
- [`InlineCitation`](../02-components/inline-citation/inline-citation.md) — the superscript component
- [`Message`](../02-components/message/message.md) — the parent bubble
- [`MessageResponse`](../02-components/message-response/message-response.md) — the markdown renderer that walks `parts`
- [Anthropic Citations API docs](https://docs.anthropic.com/en/docs/build-with-claude/citations)

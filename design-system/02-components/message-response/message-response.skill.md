---
name: lumen-message-response
description: Use when rendering streamed assistant markdown inside a Message. Shimmers on partial tokens, finalizes on stream-complete, degrades under prefers-reduced-motion. Markdown-safe by default (no raw HTML). Mirrors Vercel AI Elements `MessageResponse`. Install with `npx ai-elements@latest add message`.
---

# Lumen MessageResponse

Streaming-optimized markdown renderer for assistant message bodies.

## Use when

- Streaming Claude / OpenAI / model-X output token-by-token into the UI.
- Rendering markdown (links, bold, lists, code spans, headings) inside a Message body.
- Surface needs a visual "still streaming" cue (most chat use cases).

## NEVER

- NEVER assume the stream completes synchronously — partial tokens (mid-word, broken code fences) are normal mid-stream.
- NEVER inject raw HTML by default. Markdown allowlist only; opt-in via `markdown.allowHtml` for trusted streams (rare).
- NEVER hardcode the markdown processor — accept remark/rehype plugins via props so consumers can extend (KaTeX, syntax highlighting, freight-domain entity highlighting).
- NEVER re-announce on every token. Wait for `isStreaming` to flip false; `Conversation` announces once via aria-live.

## Tokens consumed

- color.text.primary
- color.text.secondary
- color.text.accent
- color.surface.tint-accent
- motion.duration.slow
- motion.easing.standard

## Anatomy

1. prose container (renders the markdown body)
2. shimmer overlay (linear gradient, 1200ms, only when `isStreaming`)
3. trailing cursor block (1ch blinking block, only when `isStreaming`)

## API

- `text: string` — partial-or-complete markdown body, updated per chunk.
- `isStreaming?: boolean = false` — toggles shimmer + cursor.
- `markdown?: MarkdownConfig` — `{ allowHtml?, remarkPlugins?, rehypePlugins? }`.
- `onComplete?: () => void` — fires once on stream-complete.

## Modes

- Restrained: shimmer at 6% accent opacity, 1200ms ease-in-out.
- Expressive: identical mechanics.

## Accessibility

- `aria-busy="true"` while streaming; `aria-busy="false"` on complete.
- `prefers-reduced-motion`: shimmer + cursor blink dropped; text just appears.
- Screen readers ignore mid-stream updates; `Conversation` announces on complete.

## Code (canonical)

```tsx
import { MessageResponse } from "@/components/ai-elements/message-response";

export function AssistantBody({ text, streaming }: { text: string; streaming: boolean }) {
  return <MessageResponse text={text} isStreaming={streaming} />;
}
```

Inside a Message:
```tsx
import { Message, MessageContent } from "@/components/ai-elements/message";

<Message from="assistant">
  <MessageContent>
    <MessageResponse text={msg.text} isStreaming={msg.streaming} />
  </MessageContent>
</Message>
```

## Related

- Message
- MessageContent
- Conversation (aria-live announcer)
- Reasoning (sibling above)
- Tool (sibling beside/above)
- Sources (sibling footer)
- Response (alias for non-streaming markdown rendering)

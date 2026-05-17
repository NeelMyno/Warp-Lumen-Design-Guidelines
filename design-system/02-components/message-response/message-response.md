---
name: MessageResponse
type: component
tier: T5
family: Message
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: MessageResponse
install: npx ai-elements@latest add message
related:
  - ./message-response.skill.md
  - ../message/message.md
  - ../conversation/conversation.md
---

# MessageResponse

Streaming-optimized markdown renderer for assistant message bodies. Shimmers on partial tokens, finalizes when the stream completes, and degrades to plain prose under `prefers-reduced-motion`. Lives inside `MessageContent` for assistant turns.

## Use when

- Rendering streamed assistant output token-by-token.
- Any message body that ships markdown (links, bold, lists, code spans, headings).
- Where the visual cue of "still streaming" matters (most chat surfaces).

## API

- `text: string` — the partial-or-complete markdown body. Updated on every chunk from the stream.
- `isStreaming?: boolean` — toggles the shimmer overlay + cursor blink. Defaults to `false` (assumes complete).
- `markdown?: { allowHtml?: boolean; remarkPlugins?: any[]; rehypePlugins?: any[] }` — optional markdown config; defaults to safe (no raw HTML).
- `onComplete?: () => void` — fires once when `isStreaming` flips from `true` to `false`.

## Anatomy

```
MessageResponse
├── prose container (rendered markdown)
├── shimmer overlay (during isStreaming, prefers-reduced-motion respected)
└── trailing cursor block (during isStreaming)
```

## Modes

- **Restrained** (default): shimmer is a subtle linear gradient sweep at 6% accent opacity, 1200ms ease-in-out.
- **Expressive**: same shimmer mechanics; the rest of the page may carry mesh atmosphere, but MessageResponse stays calm.

## Accessibility

- `aria-busy="true"` while `isStreaming`; `aria-busy="false"` when complete.
- Screen readers wait for stream-complete before announcing (via Conversation's aria-live). Don't re-announce on every token.
- `prefers-reduced-motion`: shimmer + cursor blink are dropped; text just appears as it streams.

## Hard rules

- NEVER assume the stream completes synchronously. Render must handle partial tokens (e.g., mid-word, broken code fences).
- NEVER inject raw HTML by default. Markdown allowlist only; opt-in via `markdown.allowHtml` for trusted streams.
- NEVER hardcode the markdown processor — use the prop-supplied remark/rehype plugin set so consumers can extend (KaTeX, syntax highlighting, etc.).

## Related

- [`Message`](../message/message.md) — parent bubble
- [`Conversation`](../conversation/conversation.md) — the announcer surface
- [`Reasoning`](../reasoning/reasoning.md) — sibling that shows above MessageResponse for chain-of-thought
- [`Tool`](../tool/tool.md) — sibling that shows beside MessageResponse for tool calls
- [`Sources`](../sources/sources.md) — sibling footer for citations

## Install

```bash
npx ai-elements@latest add message
```

MessageResponse ships in the same module as Message + MessageContent.

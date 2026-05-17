---
name: Message
type: component
tier: T5
family: Message
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Message
install: npx ai-elements@latest add message
related:
  - ./message.skill.md
  - ../message-response/message-response.md
  - ../conversation/conversation.md
  - ../reasoning/reasoning.md
  - ../tool/tool.md
  - ../sources/sources.md
  - ../actions/actions.md
---

# Message

Single-turn bubble in an AI conversation. Renders four roles: `user`, `assistant`, `system`, `tool`.

## Use when

- Rendering any individual turn inside a `Conversation`.
- Threading user input + assistant output in sequence.
- Wrapping richer content slots — `MessageContent`, `MessageResponse`, `Reasoning`, `Tool`, `Sources`, `Actions`.

## Anatomy

```
Message (from="assistant")
├── Reasoning           ← optional collapsible chain-of-thought (above content)
├── MessageContent      ← the body slot
│   └── MessageResponse ← streaming-optimized markdown renderer
├── Tool                ← optional inline tool call (above or beside content)
├── Sources             ← citation footer
└── Actions             ← regenerate / copy / like below the message
```

## API

- `from: "user" | "assistant" | "system" | "tool"` — speaker role. Drives alignment, surface, ARIA.
- `id?: string` — stable id for InlineCitation anchor jumps and React keys.
- `children: ReactNode` — the slot contents.

## Role behavior

| Role | Alignment | Surface | aria-live |
|---|---|---|---|
| `user` | right | `color.surface.raised` (neutral) | none — user typed it |
| `assistant` | left | `color.surface.tint-accent` while streaming → neutral when complete | `polite` (via Conversation) |
| `system` | full-width inline | `color.surface.sunken` | `assertive` (rare; reserve for critical state) |
| `tool` | left, indented | `color.surface.canvas` + hairline frame | none — Tool renders its own announcer |

## Modes

- **Restrained** (default): solid surfaces, no atmosphere. The bubble surface is the only chrome.
- **Expressive**: same. Mode rebinds the page chrome AROUND the Conversation, not the Message itself.

## Accessibility

- `role="article"` on each Message.
- `aria-label="You said: …"` or `"Assistant said: …"` (composed from `from` + content excerpt).
- Tab navigates between Actions strip below the message.
- User messages never re-announce (the user typed them); assistant messages announce on stream-complete.

## Related

- [`Conversation`](../conversation/conversation.md) — the container
- [`MessageContent`](#) — sub-component, ships in the same module
- [`MessageResponse`](../message-response/message-response.md) — streaming-optimized markdown
- [`Reasoning`](../reasoning/reasoning.md) — collapsible thinking block
- [`Tool`](../tool/tool.md) — tool-call rendering
- [`Sources`](../sources/sources.md) — citation footer
- [`Actions`](../actions/actions.md) — regenerate / copy / like strip
- [`03-patterns/chat-thread.md`](../../03-patterns/chat-thread.md)

## Install

```bash
npx ai-elements@latest add message
```

The Vercel AI Elements `Message` ships `Message` + `MessageContent`. Lumen themes via `LumenAIProvider`; no per-component overrides needed when wrapped.

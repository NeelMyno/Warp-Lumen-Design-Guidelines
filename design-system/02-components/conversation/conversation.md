---
name: Conversation
type: component
tier: T5
family: Conversation
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Conversation
install: npx ai-elements@latest add conversation
related:
  - ./conversation.skill.md
  - ../message/message.md
  - ../message-response/message-response.md
  - ../prompt-input/prompt-input.md
  - ../../03-patterns/chat-thread.md
---

# Conversation

Root container for an AI chat thread. The shell every other Phase 5 primitive sits inside.

## Use when

- Any LLM-driven chat surface: assistant chat, agent inbox, support thread, freight dispatcher conversation.
- Multi-turn conversations where the user expects scroll-to-latest on new messages.
- Long threads (over ~100 messages) where virtualization matters for performance.

## API

| Sub-component | Role |
|---|---|
| `Conversation` | The root container. Manages scroll behavior + virtualization. |
| `ConversationContent` | The scrollable content area. Auto-wraps `Conversation`'s children if not present. |
| `ConversationScrollButton` | The "scroll to bottom" affordance. Appears when user scrolls up past the last message. |
| `ConversationEmptyState` | Pre-message empty state. Takes `title` + `description` props. |

## Anatomy

```
Conversation                        ← scroll container, manages virtualization
├── ConversationEmptyState          ← shown when messages.length === 0
└── ConversationContent             ← scrollable; auto-wraps children if not nested
    ├── Message (user)
    ├── Message (assistant)
    │   ├── MessageContent
    │   └── MessageResponse         ← streams partial markdown with shimmer
    ├── Sources                     ← citation footer
    └── Actions                     ← regenerate / copy / like below assistant message
    +
    ConversationScrollButton        ← floats bottom-right when scrolled up
```

## Modes

- **Restrained** (default): solid `color.surface.canvas` background. No mesh. The dense-data-table discipline applies — chat is operator-density, not landing-page expressive.
- **Expressive**: identical structure; mode rebinds the ambient atmosphere of the container. Avoid mesh inside the thread itself (it competes with message text); mesh belongs on the page chrome around the Conversation, not inside it.

## Accessibility

- `role="log"` + `aria-live="polite"` so screen readers announce each new assistant message.
- `aria-label="Conversation thread"` (override per use case with the freight-domain context: "Dispatcher conversation", "Lane quote conversation").
- Keyboard:
  - `Home` — scroll to top of thread
  - `End` — scroll to bottom (latest message)
  - `PageUp` / `PageDown` — page through thread
- `prefers-reduced-motion`: auto-scroll uses `scroll-behavior: auto` (no smooth scroll animation).

## Modes — restraint vs. expressive

The Conversation root never carries a mesh background. Even in expressive mode, the thread surface stays solid for legibility. The mode-aware atmosphere lives on the page chrome AROUND the thread (in a hero section above, in the sidebar to the left), not inside.

## Related

- [`Message`](../message/message.md) — the bubble unit inside ConversationContent
- [`MessageResponse`](../message-response/message-response.md) — streaming-optimized markdown renderer for assistant messages
- [`PromptInput`](../prompt-input/prompt-input.md) — the input below the conversation
- [`Reasoning`](../reasoning/reasoning.md) — collapsible chain-of-thought block inside a Message
- [`Tool`](../tool/tool.md) — tool-call rendering inside a Message
- [`Sources`](../sources/sources.md) — citation footer below an assistant Message
- [`Actions`](../actions/actions.md) — action-button strip below an assistant Message
- [`03-patterns/chat-thread.md`](../../03-patterns/chat-thread.md) — the canonical composition

## Install

```bash
npx ai-elements@latest add conversation
```

Then theme with Lumen tokens via the `LumenAIProvider` wrapper. The Vercel AI Elements `Conversation` component ships with sensible defaults; the Lumen theme overrides surface + text + radius + density to match the system.

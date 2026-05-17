---
name: lumen-conversation
description: Use when scaffolding any AI chat surface in a Lumen-themed React app. Returns the Conversation root container with auto-scroll, virtualization at >100 messages, and the empty-state slot. Mirrors Vercel AI Elements `Conversation`. Install with `npx ai-elements@latest add conversation`; theme via LumenAIProvider.
---

# Lumen Conversation

The root container for an AI chat thread. Manages scroll, virtualization, and the empty state. Vercel AI Elements name verbatim.

## Use when

- Building an LLM-driven chat surface (assistant, agent inbox, dispatcher conversation, support thread).
- Multi-turn flows where the user expects scroll-to-latest on new messages.
- Threads that may grow long (>100 messages) where virtualization keeps the surface responsive.

## NEVER

- NEVER hardcode a model name inside Conversation. The model lives in `PromptInputSelect` or the `LumenAIProvider` context. Conversation is model-agnostic.
- NEVER apply `backdrop-filter` to the thread container. Hard rule 16 — glass goes on floating shells only, not on dense data surfaces.
- NEVER drop the `ConversationScrollButton` when the user scrolls up — it's the affordance back to live updates.
- NEVER assume streaming is complete on any render. Child `MessageResponse` may still be partial; the renderer must handle mid-stream gracefully.
- NEVER nest two `Conversation` containers (no scope nesting; pattern violates the dual-mode scope rule too).

## Tokens consumed

- color.surface.canvas
- color.surface.raised
- color.text.primary
- color.text.secondary
- space.4
- space.6
- space.8
- radius.lg
- motion.duration.fast
- motion.easing.standard
- shadow.card

## Anatomy

1. `Conversation` — outer scroll container (manages virtualization)
2. `ConversationEmptyState` — pre-message slot with `title` + `description` props
3. `ConversationContent` — the scrollable content area (auto-wraps children if not nested)
4. `Message` children — one per turn (user, assistant, system, tool)
5. `ConversationScrollButton` — floating "scroll to bottom" affordance, appears when scrolled up

## API

- `messages?: ReactNode` — Pass children directly OR via render-prop. Children are auto-wrapped in `ConversationContent`.
- `autoScroll?: boolean = true` — Auto-scroll to latest on new message arrival. Disable for read-only review surfaces.
- `virtualizeAfter?: number = 100` — Threshold above which thread switches to TanStack Virtual rendering.
- `className?: string` — Layout override pass-through.

## Modes

- **Restrained** (default): solid `color.surface.canvas` background. Thread surface is operator-density first.
- **Expressive**: same structure; mode rebinds AMBIENT atmosphere of the page chrome (not the thread interior). Thread stays solid for legibility.

## Accessibility

- `role="log"` + `aria-live="polite"` — screen readers announce new assistant messages without interrupting.
- `aria-label="Conversation thread"` (override with freight context where applicable).
- Keyboard: Home / End / PageUp / PageDown navigate the thread.
- `prefers-reduced-motion`: auto-scroll degrades to `scroll-behavior: auto`.

## Code (canonical)

```tsx
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";

export function ExampleThread({ messages }: { messages: Msg[] }) {
  if (messages.length === 0) {
    return (
      <Conversation>
        <ConversationEmptyState
          title="Ask anything about your lanes."
          description="Quote, book, or track in plain English."
        />
      </Conversation>
    );
  }
  return (
    <Conversation>
      <ConversationContent>
        {messages.map((m) => (
          <Message key={m.id} from={m.role}>
            <MessageContent>{m.text}</MessageContent>
          </Message>
        ))}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
```

## Related

- Message
- MessageContent
- MessageResponse
- PromptInput
- Reasoning
- Tool
- Sources
- InlineCitation
- Actions
- LumenAIProvider (context wrapper, sets default model + streaming behavior)
- 03-patterns/chat-thread.md (the canonical composition)

---
name: lumen-reasoning
description: Use when an assistant message includes a chain-of-thought / extended-thinking stream. Renders a collapsible "Thinking…" block above MessageContent that shimmers during streaming and collapses on complete. Mirrors Vercel AI Elements `Reasoning` (with `ReasoningTrigger`, `ReasoningContent`). Install with `npx ai-elements@latest add reasoning`.
---

# Lumen Reasoning

Collapsible chain-of-thought disclosure for assistant turns.

## Use when

- Streaming a reasoning trace alongside the main response (Claude extended thinking, OpenAI reasoning models).
- Operator surfaces where transparency matters — dispatcher, contract review, compliance flows.
- Multi-step agent surfaces where the user benefits from seeing HOW the model planned.

## NEVER

- NEVER skip Reasoning when the model returned a reasoning stream. The trigger must appear even when collapsed.
- NEVER auto-expand a completed Reasoning. The "fades to collapsed" pattern is intentional — reasoning is reference, not primary.
- NEVER merge reasoning content into MessageResponse. They have different aria-live behavior (Reasoning off; Response polite).
- NEVER use Reasoning for tool output. That's Tool's job.

## Tokens consumed

- color.text.secondary
- color.text.tertiary
- color.border.hairline
- color.surface.sunken
- space.3, space.4
- radius.md
- motion.duration.fast
- motion.easing.standard

## Anatomy

1. `Reasoning` (root, manages open/closed state + isStreaming shimmer)
2. `ReasoningTrigger` (disclosure button — "Thinking…" while streaming, "Show thinking" when complete)
3. `ReasoningContent` (the chain-of-thought body, markdown-rendered)

## API (root)

- `isStreaming?: boolean` — shimmer during streaming.
- `defaultOpen?: boolean` — initial state. Default: open while streaming, collapsed when complete.
- `title?: string` — override default labels.

## Modes

- Restrained (default): hairline frame, muted label.
- Expressive: same behavior; shimmer is the only animation.

## Accessibility

- Built on Radix Disclosure. `aria-expanded` + `aria-controls`.
- Keyboard: Space / Enter toggles. Tab moves Reasoning → MessageResponse → Actions in order.
- Screen reader: trigger label tracks state.
- `prefers-reduced-motion`: shimmer + collapse animation dropped.

## Code (canonical)

```tsx
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";

export function AssistantTurnWithReasoning({ msg }: { msg: AssistantMsg }) {
  return (
    <Message from="assistant">
      {msg.reasoning && (
        <Reasoning isStreaming={msg.streaming}>
          <ReasoningTrigger />
          <ReasoningContent>{msg.reasoning}</ReasoningContent>
        </Reasoning>
      )}
      <MessageContent>
        <MessageResponse text={msg.text} isStreaming={msg.streaming} />
      </MessageContent>
    </Message>
  );
}
```

## Related

- Message
- MessageResponse
- Tool (sibling — tool calls often follow reasoning)
- Confirmation (often follows reasoning + tool when destructive)
- 03-patterns/agent-approval-flow.md
- 03-patterns/chat-thread.md

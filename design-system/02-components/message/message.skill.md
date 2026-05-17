---
name: lumen-message
description: Use when rendering a single conversation turn in a Lumen-themed AI chat. Returns a role-aware bubble (user / assistant / system / tool) with appropriate alignment, surface treatment, and ARIA semantics. Composes MessageContent + optional MessageResponse + Reasoning + Tool + Sources + Actions. Install with `npx ai-elements@latest add message`.
---

# Lumen Message

Single-turn bubble inside a `Conversation`. Renders four roles with role-appropriate chrome and accessibility.

## Use when

- Wrapping any individual user input or assistant output inside `Conversation`.
- Hosting nested AI primitives — `MessageContent`, `MessageResponse`, `Reasoning`, `Tool`, `Sources`, `Actions`.

## NEVER

- NEVER render a user bubble with Spring Green chrome. The accent is reserved for assistant action moments only — typing a query is not an action moment, sending the result is.
- NEVER bake the model name into Message. Model lives in `PromptInputSelect` or the `LumenAIProvider` context.
- NEVER drop the `from` prop — alignment + ARIA break silently without it.
- NEVER mount a Message outside a `Conversation`. The aria-live announcer + virtualization context live on `Conversation`.
- NEVER apply `backdrop-filter` to a message bubble. Hard rule 16 — glass goes on floating shells, not on text-dense bubbles.

## Tokens consumed

- color.surface.raised
- color.surface.canvas
- color.surface.tint-accent
- color.text.primary
- color.text.secondary
- color.border.hairline
- color.border.frame
- space.3, space.4, space.6
- radius.lg, radius.xl
- motion.duration.base
- motion.easing.standard

## Anatomy

1. `Message` — outer bubble, role-aware alignment + surface
2. `Reasoning` (optional, above body) — collapsible chain-of-thought
3. `MessageContent` — the body slot
4. `MessageResponse` (inside MessageContent for assistant) — streaming-optimized markdown
5. `Tool` (optional, beside or above body) — tool call rendering
6. `Sources` (optional footer) — citation cards
7. `Actions` (optional below) — regenerate / copy / like

## API

- `from: "user" | "assistant" | "system" | "tool"` — required. Drives alignment + surface + aria.
- `id?: string` — stable id; React key + InlineCitation anchor target.
- `children: ReactNode` — body slots.

## Role behavior

| Role | Alignment | Surface | aria-live |
|---|---|---|---|
| user | right | neutral raised | none |
| assistant | left | tint-accent (streaming) → neutral (complete) | polite |
| system | full-width inline | sunken | assertive (rare) |
| tool | left, indented | canvas + hairline frame | none (Tool announces itself) |

## Modes

- Restrained (default): solid surfaces.
- Expressive: same. Mode rebinds the page chrome AROUND the Conversation.

## Accessibility

- `role="article"` on every Message.
- `aria-label="You said: …"` / `"Assistant said: …"` from `from` + content.
- Tab cycles through Actions strip below.
- User-message bubbles never announce; assistant-message bubbles announce on stream-complete via Conversation's aria-live.

## Code (canonical)

```tsx
import { Message, MessageContent } from "@/components/ai-elements/message";
import { MessageResponse } from "@/components/ai-elements/message-response";

export function ExampleAssistantTurn({ msg }: { msg: AssistantMsg }) {
  return (
    <Message from="assistant" id={msg.id}>
      <MessageContent>
        <MessageResponse text={msg.text} isStreaming={msg.streaming} />
      </MessageContent>
    </Message>
  );
}
```

## Related

- Conversation
- MessageContent (ships in same module)
- MessageResponse
- MessageBranch (regeneration navigation)
- Reasoning
- Tool, ToolHeader, ToolInput, ToolOutput
- Sources, InlineCitation
- Actions
- 03-patterns/chat-thread.md

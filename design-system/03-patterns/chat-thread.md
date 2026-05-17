---
name: Chat Thread
type: pattern
version: 0.13.0
last_updated: 2026-05-17
phase: 5
audience: [designer, engineer, llm-agent]
primitives:
  - Conversation
  - Message
  - MessageContent
  - MessageResponse
  - Reasoning
  - Tool
  - Sources
  - InlineCitation
  - PromptInput
  - Suggestion
  - Actions
related:
  - ./agent-approval-flow.md
  - ./citation-card.md
  - ./lane-search.md
  - ./shipment-timeline.md
  - ../../examples/ai-surface/README.md
---

# Chat Thread

The canonical generic AI chat surface. Every other AI surface in Lumen mimics this composition. If you are unsure how to assemble Phase 5 primitives, start here.

## Composition

```
┌─ Page chrome (mode-aware: restrained for operator surfaces, expressive for marketing) ─┐
│                                                                                        │
│  ┌─ Conversation (role="log", aria-live="polite") ────────────────────────────────┐    │
│  │  [ConversationEmptyState] (shown only when messages.length === 0)              │    │
│  │  ┌─ ConversationContent (scrollable) ───────────────────────────────────┐      │    │
│  │  │  [Message from="user"]                                               │      │    │
│  │  │    └─ MessageContent                                                 │      │    │
│  │  │  [Message from="assistant"]                                          │      │    │
│  │  │    ├─ Reasoning (optional, collapsed when complete)                  │      │    │
│  │  │    │   ├─ ReasoningTrigger                                           │      │    │
│  │  │    │   └─ ReasoningContent                                           │      │    │
│  │  │    ├─ Tool (optional, with ToolHeader + Input + Output)              │      │    │
│  │  │    ├─ MessageContent                                                 │      │    │
│  │  │    │   └─ MessageResponse (with InlineCitation superscripts inline)  │      │    │
│  │  │    ├─ Sources (footer; cites the Anthropic Citations API shape)      │      │    │
│  │  │    └─ Actions (regenerate / copy / like / dislike)                   │      │    │
│  │  │  …repeats…                                                           │      │    │
│  │  └──────────────────────────────────────────────────────────────────────┘      │    │
│  │  ConversationScrollButton (floats when scrolled up)                            │    │
│  └──────────────────────────────────────────────────────────────────────────────-─┘    │
│                                                                                        │
│  Suggestion (chip strip — shown when assistant offers follow-ups OR empty state)       │
│                                                                                        │
│  ┌─ PromptInput (sticky bottom) ─────────────────────────────────────────────────┐     │
│  │  PromptInputTools  PromptInputTextarea                       PromptInputSelect │     │
│  │  PromptInputFooter (attachment chips + char count)                             │     │
│  │                                                              PromptInputSubmit │     │
│  └──────────────────────────────────────────────────────────────────────────────-─┘     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## Wiring

- **Streaming:** `useChat` from `@ai-sdk/react` provides `messages`, `input`, `handleSubmit`, `status`. Each message's `parts` array carries text + reasoning + tool-call + citation blocks; the renderer walks parts and dispatches to the matching primitive.
- **Reasoning:** appears when `message.parts` includes a reasoning block. Streams above MessageContent; collapses on stream-complete.
- **Tool:** appears when `message.parts` includes a tool-call block. Use `Tool` + `ToolHeader` + `ToolInput` + `ToolOutput`. If the tool is destructive, wrap in `Confirmation` (see [`agent-approval-flow.md`](./agent-approval-flow.md)).
- **Citations:** when `message.parts` includes citation blocks (Anthropic Citations API), the MessageResponse renders `InlineCitation` superscripts at the matching text positions, AND the Sources footer renders the full citation list. See [`citation-card.md`](./citation-card.md).
- **Suggestions:** the assistant can return follow-up suggestions via a tool call or system metadata; render above PromptInput. Click submits to the chat handler.

## Voice

All copy through this pattern flows through [`voice-and-tone.md`](../00-foundations/voice-and-tone.md). Critical templates:

| Surface | Copy |
|---|---|
| ConversationEmptyState title | "Ask anything about your lanes." (or domain-specific: "Quote, book, track.") |
| ConversationEmptyState description | "Quote, book, or track in plain English." |
| Suggestion chips (first render) | "Quote LAX → SFO 3 pallets", "Track WRP-9824", "Today's deliveries" |
| Reasoning trigger (streaming) | "Thinking…" |
| Reasoning trigger (complete) | "Show thinking" / "Hide thinking" |
| Tool status — running | Tool name + spinner. E.g., "quote_lane · Quoting 14 carriers…" |
| Tool status — error | "Lane unavailable. No carrier capacity on this corridor for the requested pickup window." (System fault voice from voice-and-tone.md.) |
| Actions tooltips | "Regenerate", "Copy", "Like", "Dislike" — sentence case. |

NEVER use: "Hello! How can I help you today?", "Sure! Here's that information for you:", "I hope this helps!", "Let me know if you have any other questions!"

## Accessibility

- `Conversation` is `role="log"` + `aria-live="polite"`. New assistant messages announce ONCE on stream-complete (not per-token).
- User messages are NOT announced — the user typed them.
- Reasoning is `aria-live="off"` — it's reference material, not announce-worthy.
- Tab order: Conversation → Suggestion chips → PromptInputTextarea → PromptInputSubmit. Within an assistant message, Actions buttons cycle in DOM order.
- `prefers-reduced-motion`: auto-scroll degrades to `scroll-behavior: auto`. MessageResponse shimmer + cursor blink drop. Reasoning open/close animation drops.
- `prefers-reduced-transparency`: any glass surface (PromptInput slash palette overlay, ConversationScrollButton) bumps alpha to ≥ 0.85 and drops `backdrop-filter`. Hard rule 16.

## Failure modes (real things that go wrong)

1. **Reasoning auto-expands on completed messages.** Wrong — the pattern is fades-to-collapsed. Set `defaultOpen={false}` when `isStreaming === false`.
2. **Sources renders but InlineCitation superscripts don't.** Likely cause: the renderer is walking `message.text` instead of `message.parts`. Use `parts` so citation positioning is preserved.
3. **PromptInput submits on Enter without Shift+Enter for newline.** PromptInputTextarea should ship this behavior by default; if not, override `onKeyDown`.
4. **Tool output renders as raw JSON when it should be a Lumen composite.** When the tool returns freight-domain data (lane quote, shipment status, carrier list), use `ToolOutput` with a child Lumen composite (`ShipmentTimeline`, `LaneCode`, `CarrierBadge` table), not the default JSON renderer.
5. **Confirmation gate skipped for a destructive tool.** Every write-side tool MUST gate through Confirmation. See [`agent-approval-flow.md`](./agent-approval-flow.md).

## Reference implementation

- **[`examples/ai-surface/`](../../examples/ai-surface/)** — full Next.js 15 app demonstrating this composition end-to-end. Uses Anthropic Claude via `@ai-sdk/anthropic`; streams reasoning + tool + citation + Confirmation. Falls back to a deterministic mock-stream when `ANTHROPIC_API_KEY` is unset (so the reference runs in any environment).

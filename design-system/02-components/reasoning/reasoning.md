---
name: Reasoning
type: component
tier: T5
family: AIInsight
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Reasoning
install: npx ai-elements@latest add reasoning
related:
  - ./reasoning.skill.md
  - ../tool/tool.md
  - ../message/message.md
---

# Reasoning

Collapsible "Thinking" block that shows the model's chain-of-thought. Streams alongside the main response, fades when complete, and collapses into a single-line summary once the user has had a chance to read it.

## Use when

- Surfaces using Claude extended thinking, OpenAI reasoning models, or any model that emits a separate reasoning stream.
- Where transparency matters — operator surfaces (freight dispatch, agent debugging), compliance flows.
- Surfaces where the user benefits from seeing HOW the model arrived at an answer (legal review, contract analysis, multi-step planning).

## API

| Sub-component | Role |
|---|---|
| `Reasoning` | Root wrapper; manages collapsed/expanded state and `isStreaming` shimmer. |
| `ReasoningTrigger` | The disclosure button — "Thinking…" while streaming, "Show thinking" / "Hide thinking" when complete. |
| `ReasoningContent` | The chain-of-thought body (markdown-rendered). |

Props on root:
- `isStreaming?: boolean` — shimmer the disclosure trigger while streaming.
- `defaultOpen?: boolean` — initial open/closed state. Default: `true` while streaming, `false` when complete (the "fades to collapsed" behavior).
- `title?: string` — override the default "Thinking…" / "Show thinking" labels.

## Anatomy

```
Reasoning (isStreaming=true)
├── ReasoningTrigger        ← "Thinking…" with shimmer
└── ReasoningContent        ← live-streamed chain-of-thought (visible)

Reasoning (isStreaming=false, defaultOpen=false)
├── ReasoningTrigger        ← "Show thinking" (chevron right)
└── ReasoningContent        ← collapsed, available on click
```

## Modes

- **Restrained** (default): hairline frame around the content when expanded; muted label color.
- **Expressive**: same. The shimmer is the only animation; mode doesn't change behavior.

## Accessibility

- Built on Radix `Disclosure` (or equivalent). Trigger has `aria-expanded` matching the open state, `aria-controls` pointing to the content id.
- Keyboard: Space / Enter on trigger toggles open. Tab moves through Reasoning → MessageResponse → Actions in expected order.
- Screen readers: trigger label changes from "Thinking" to "Show thinking" / "Hide thinking" based on state — no surprise.
- `prefers-reduced-motion`: shimmer dropped; collapse/expand uses 0ms transition.

## Hard rules

- NEVER skip Reasoning when the model returned a reasoning stream. Even if collapsed by default, the trigger must appear so the user knows the option exists.
- NEVER auto-expand a Reasoning block on a completed message. The "fades to collapsed" pattern is intentional — the chain-of-thought is reference, not the primary content.
- NEVER mix reasoning content with the main response inside `MessageResponse`. They have different aria-live behavior (Reasoning is aria-live="off"; MessageResponse is the announced one).

## Related

- [`Message`](../message/message.md) — Reasoning lives at the top of Message, above MessageContent
- [`MessageResponse`](../message-response/message-response.md) — the streamed primary response
- [`Tool`](../tool/tool.md) — sibling for tool calls (reasoning + tool often appear in the same turn)
- [`03-patterns/agent-approval-flow.md`](../../03-patterns/agent-approval-flow.md) — reasoning often precedes a Confirmation

## Install

```bash
npx ai-elements@latest add reasoning
```

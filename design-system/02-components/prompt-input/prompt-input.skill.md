---
name: lumen-prompt-input
description: Composable input bar for AI chat. Ships root + Textarea + Tools + Button + Footer + Submit + Select (model picker). Mirrors Vercel AI Elements `PromptInput`. Install with `npx ai-elements@latest add prompt-input`. Status: stable.
---

# Lumen PromptInput

Composable input bar for AI chat. Ships root + Textarea + Tools + Button + Footer + Submit + Select (model picker).

## Use when

- Any AI surface where the user types a prompt — chat thread, command palette LLM mode, search-by-AI.
- Surface needs model selection (Claude vs OpenAI vs Lumen-MCP-tool-only).
- Slash-commands / tool palette via PromptInputTools slot.

## NEVER

- NEVER bypass usePromptInput. It manages file-attachment validation, submit-on-Enter behavior, and slash-command parsing.
- NEVER ship PromptInput without a Submit affordance. PromptInputSubmit is opinionated by design.
- NEVER ship PromptInput without a model selector for multi-model surfaces. PromptInputSelect is the canonical model picker.
- NEVER let PromptInput fall outside the focus order — it should be the last focusable element in tab order before Submit.

## Tokens consumed

- color.surface.canvas
- color.surface.raised
- color.text.primary
- color.text.secondary
- color.text.accent
- color.border.hairline
- color.border.frame
- space.3, space.4, space.6
- radius.md, radius.lg
- motion.duration.fast, motion.duration.base
- motion.easing.standard

## Anatomy

1. `PromptInput` — Root provider.
2. `PromptInputTextarea` — The textarea; auto-grows, submit-on-Enter (Shift+Enter for newline).
3. `PromptInputTools` — Slot for tool / slash-command palette.
4. `PromptInputButton` — Composable button (mic, attach, send).
5. `PromptInputFooter` — Slot below textarea for chips + meta.
6. `PromptInputSubmit` — Opinionated send button — disabled when canSubmit is false.
7. `PromptInputSelect` — Model selector dropdown.

## API

PromptInput is a provider pattern. Children share usePromptInput context. PromptInputTextarea binds to the value; PromptInputSubmit subscribes to canSubmit; PromptInputTools renders a slash-command palette below the textarea; PromptInputFooter slots attachment chips + character count. PromptInputSelect is the model picker dropdown.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add prompt-input
import { PromptInput } from "@/components/ai-elements/prompt-input";

export function Example() {
  return <PromptInput />;
}
```

## Related

- Conversation (PromptInput sits below it)
- Suggestion (often above PromptInput)
- ai-prompt-input (v0.12.6 legacy; superseded by PromptInput)

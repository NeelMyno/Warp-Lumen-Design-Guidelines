---
name: PromptInput
type: component
tier: T5
family: PromptInput
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: PromptInput
install: npx ai-elements@latest add prompt-input
related:
  - ./prompt-input.skill.md
  - ../prompt-input/prompt-input.md
---

# PromptInput

Composable input bar for AI chat. Ships root + Textarea + Tools + Button + Footer + Submit + Select (model picker).

## Use when

- Any AI surface where the user types a prompt — chat thread, command palette LLM mode, search-by-AI.
- Surface needs model selection (Claude vs OpenAI vs Lumen-MCP-tool-only).
- Slash-commands / tool palette via PromptInputTools slot.

## API

PromptInput is a provider pattern. Children share usePromptInput context. PromptInputTextarea binds to the value; PromptInputSubmit subscribes to canSubmit; PromptInputTools renders a slash-command palette below the textarea; PromptInputFooter slots attachment chips + character count. PromptInputSelect is the model picker dropdown.

## Anatomy

| Sub-component | Role |
|---|---|
| `PromptInput` | Root provider. |
| `PromptInputTextarea` | The textarea; auto-grows, submit-on-Enter (Shift+Enter for newline). |
| `PromptInputTools` | Slot for tool / slash-command palette. |
| `PromptInputButton` | Composable button (mic, attach, send). |
| `PromptInputFooter` | Slot below textarea for chips + meta. |
| `PromptInputSubmit` | Opinionated send button — disabled when canSubmit is false. |
| `PromptInputSelect` | Model selector dropdown. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Conversation (PromptInput sits below it)
- Suggestion (often above PromptInput)
- ai-prompt-input (v0.12.6 legacy; superseded by PromptInput)

## Install

```bash
npx ai-elements@latest add prompt-input
```

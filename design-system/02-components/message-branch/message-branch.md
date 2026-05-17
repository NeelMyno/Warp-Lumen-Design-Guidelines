---
name: MessageBranch
type: component
tier: T5
family: Message
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: MessageBranch
install: npx ai-elements@latest add message
related:
  - ./message-branch.skill.md
  - ../message/message.md
---

# MessageBranch

Navigation for regenerated assistant responses. Shows previous / next / page selector + content slot.

## Use when

- An assistant message has been regenerated — the user can flip between alternative responses.
- The model returns multiple candidate responses to a single prompt (n>1).
- A history surface where the user reviews past response variants for the same prompt.

## API

Ships MessageBranch root + MessageBranchContent (the body slot) + MessageBranchPrevious / Next / Page (the controls) + MessageBranchSelector (dropdown for many branches).

## Anatomy

| Sub-component | Role |
|---|---|
| `MessageBranch` | Root container; manages activeBranchIndex state. |
| `MessageBranchContent` | The displayed branch body. |
| `MessageBranchPrevious` | Previous arrow; disables at index 0. |
| `MessageBranchNext` | Next arrow; disables at index N-1. |
| `MessageBranchPage` | '2 of 5' page indicator. |
| `MessageBranchSelector` | Dropdown for direct branch selection (use when N > 5). |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Message
- MessageContent
- MessageResponse
- Actions (regenerate triggers a new branch)

## Install

```bash
npx ai-elements@latest add message
```

---
name: lumen-message-branch
description: Navigation for regenerated assistant responses. Shows previous / next / page selector + content slot. Mirrors Vercel AI Elements `MessageBranch`. Install with `npx ai-elements@latest add message`. Status: stable.
---

# Lumen MessageBranch

Navigation for regenerated assistant responses. Shows previous / next / page selector + content slot.

## Use when

- An assistant message has been regenerated — the user can flip between alternative responses.
- The model returns multiple candidate responses to a single prompt (n>1).
- A history surface where the user reviews past response variants for the same prompt.

## NEVER

- NEVER show MessageBranch when only one response exists. Single-response Messages don't need navigation chrome.
- NEVER drop the index display — the user needs to know which of N they're viewing.
- NEVER auto-jump branches on click — confirm the user wanted to navigate.

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

1. `MessageBranch` — Root container; manages activeBranchIndex state.
2. `MessageBranchContent` — The displayed branch body.
3. `MessageBranchPrevious` — Previous arrow; disables at index 0.
4. `MessageBranchNext` — Next arrow; disables at index N-1.
5. `MessageBranchPage` — '2 of 5' page indicator.
6. `MessageBranchSelector` — Dropdown for direct branch selection (use when N > 5).

## API

Ships MessageBranch root + MessageBranchContent (the body slot) + MessageBranchPrevious / Next / Page (the controls) + MessageBranchSelector (dropdown for many branches).

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add message
import { MessageBranch } from "@/components/ai-elements/message-branch";

export function Example() {
  return <MessageBranch />;
}
```

## Related

- Message
- MessageContent
- MessageResponse
- Actions (regenerate triggers a new branch)

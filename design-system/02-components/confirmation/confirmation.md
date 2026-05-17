---
name: Confirmation
type: component
tier: T5
family: AIInsight
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Confirmation
install: npx ai-elements@latest add confirmation
related:
  - ./confirmation.skill.md
  - ../tool/tool.md
---

# Confirmation

Approval gate for destructive tool calls. Brutalist hairline frame + slow-down-and-repeat-the-noun copy.

## Use when

- An assistant is about to invoke a destructive tool (book a shipment, send an email, delete a record).
- The action cannot be undone without consequence (financial commitment, external system mutation).
- User explicit consent matters legally or commercially.

## API

Confirmation wraps in a brutalist hairline frame (border-frame token, sharper corners than a default card). Copy slot accepts the destructive-voice template. Confirm + Cancel buttons; on confirm, fires the wrapped onApprove callback which resumes the Tool execution.

## Anatomy

| Sub-component | Role |
|---|---|
| `Confirmation` | Root frame + state machine (pending / approved / rejected). |
| `ConfirmationTitle` | Repeats the noun being acted on ('Cancel order WRP-9824?'). |
| `ConfirmationDescription` | One-sentence consequence ('This cannot be undone.'). |
| `ConfirmationActions` | Confirm (danger) + Cancel (secondary) buttons. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Tool (Confirmation wraps the Tool call before execution)
- Dialog (Confirmation is a Dialog with brand-specific chrome)
- 03-patterns/agent-approval-flow.md (canonical pattern)

## Install

```bash
npx ai-elements@latest add confirmation
```

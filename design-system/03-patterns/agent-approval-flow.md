---
name: Agent Approval Flow
type: pattern
version: 0.13.0
last_updated: 2026-05-17
phase: 5
audience: [designer, engineer, llm-agent]
primitives:
  - Tool
  - Confirmation
  - Reasoning
  - Agent (state indicator)
related:
  - ./chat-thread.md
  - ./lane-search.md
  - ./quote-builder.md
  - ../02-components/confirmation/confirmation.md
---

# Agent Approval Flow

The pattern for destructive tool calls. Tool shows pending state → Confirmation interrupts with the brutalist hairline frame → user approves → Tool resumes → ToolOutput renders the result.

## What "destructive" means

Any tool that mutates external state. Examples:
- `book_shipment` — commits to a carrier slot, financial commitment
- `cancel_order` — irreversible
- `send_email` — externally visible
- `delete_record` — irreversible
- `transfer_funds` — financial commitment, irreversible
- `publish_content` — externally visible
- `dispatch_driver` — affects a real human

Read-only tools (`get_shipment_status`, `quote_lane`, `list_carriers`) do NOT require Confirmation.

## The canonical flow

1. **Assistant decides** to invoke a destructive tool. Reasoning streams: "Booking shipment WRP-9824 with Sterling LTL at $312/pallet. Need user approval before commit."
2. **Tool renders in pending state** — `ToolHeader: "book_shipment · awaiting approval"`.
3. **Confirmation appears** with the brutalist hairline frame:
   - Title: "Book shipment WRP-9824 with Sterling LTL at $312/pallet?" — repeats the nouns + the number.
   - Description: "This cannot be undone. Carrier slot will be held immediately."
   - Actions: [Cancel | Confirm — danger intent button].
4. **User approves** → Confirmation collapses; Tool resumes execution.
5. **Tool output renders** — success message + booking confirmation + reference number.
6. **Or user cancels** → Tool transitions to "cancelled" state; assistant offers alternatives.

## Composition

```
Message from="assistant"
  ├─ Reasoning (optional, fades to collapsed when complete)
  │   └─ ReasoningContent: "Booking shipment WRP-9824 with Sterling LTL…"
  ├─ Tool (pending)
  │   ├─ ToolHeader: "book_shipment · awaiting approval"
  │   ├─ ToolInput: { shipment_id: "WRP-9824", carrier: "Sterling LTL", rate: 312 }
  │   └─ (ToolOutput not yet rendered)
  ├─ Confirmation
  │   ├─ ConfirmationTitle: "Book shipment WRP-9824 with Sterling LTL at $312/pallet?"
  │   ├─ ConfirmationDescription: "This cannot be undone. Carrier slot will be held immediately."
  │   └─ ConfirmationActions [Cancel (secondary) | Confirm (danger)]
  │
  └─ Agent state indicator: "Awaiting approval" (pulsing LiveDot)

  ↓ user clicks Confirm ↓

Message from="assistant" (same message, updated)
  ├─ Reasoning (collapsed)
  ├─ Tool (running)
  │   ├─ ToolHeader: "book_shipment · booking…"
  │   ├─ ToolInput: { … }
  │   └─ ToolOutput (streaming): "Confirming with Sterling LTL…"
  └─ Agent state: "Running tool"

  ↓ tool completes ↓

Message from="assistant"
  ├─ Reasoning (collapsed)
  ├─ Tool (success)
  │   ├─ ToolHeader: "book_shipment · 0.6s ✓"
  │   ├─ ToolInput: { … }
  │   └─ ToolOutput: "Booked. Sterling LTL #SHP-447921. Pickup confirmed 06:00 Tue 2026-05-19. Tracking is live."
  └─ Agent state: "Done"
```

## Voice

Confirmation copy follows [`voice-and-tone.md`](../00-foundations/voice-and-tone.md) §"Destructive confirmation":

| Surface | Copy template |
|---|---|
| ConfirmationTitle | Question form, repeat the noun + key numbers: "Cancel order WRP-9824?" / "Book shipment WRP-9824 with Sterling LTL at $312/pallet?" / "Send to 14 carriers?" |
| ConfirmationDescription | One sentence stating the consequence: "This cannot be undone." / "Carrier slot will be held immediately." / "Notifies all 14 carriers in your network." |
| Confirm button (intent=danger) | The action verb: "Cancel order", "Book", "Send". NOT "OK", NOT "Yes". |
| Cancel button (intent=secondary) | Always "Cancel". Universal escape. |
| Tool success ToolOutput | "Booked. Sterling LTL #SHP-447921. Tracking is live." Brief, no celebration. |
| Tool failure ToolOutput | System-fault voice. "Booking failed. Carrier rejected slot at 06:43 UTC. Retry or pick a different carrier." |

NEVER use: "Are you sure you want to…?", "Confirm action?", "OK", "Yes/No", emoji.

## Accessibility

- **Confirmation is a Radix AlertDialog.** It steals focus on open; `Escape` cancels; `Enter` confirms (but only when the Confirm button is focused — not aggressive Enter-anywhere).
- **`role="alertdialog"`** ensures screen readers announce the dialog body immediately.
- **`aria-describedby`** ties the ConfirmationDescription to the dialog.
- **The danger button has explicit `aria-label`** when the icon alone might be ambiguous; in practice, the button always carries a verb label, so no extra `aria-label` is needed.
- **Tab order inside the dialog**: Description → Cancel → Confirm. The Confirm button is NOT the initial focus (preventing accidental Enter-on-load commits).
- **`prefers-reduced-motion`**: dialog open/close uses 0ms transition (no slide-in).

## Failure modes

1. **Confirmation bypassed for a destructive tool.** Hardcoded pattern violation. Solution: make destructive tool calls go through a `withConfirmation` HOC that interposes Confirmation before tool invocation.
2. **Title doesn't repeat the noun.** "Are you sure?" is wrong. The noun + numbers are part of the slow-down-and-think mechanism.
3. **Initial focus on Confirm button.** Hitting Enter on dialog open commits accidentally. Initial focus must be on Cancel OR on the dialog body itself, never on Confirm.
4. **"Don't ask again" checkbox.** NEVER. Every destructive action gets its own gate. Suppressing the gate creates the "I clicked OK by reflex" failure mode the brutalist frame is designed to prevent.
5. **Confirmation modal is glass-blurred.** Confirmation is a floating shell — glass is permitted (hard rule 16 — glass goes on floating shells). BUT the blur radius stays restrained (8–12px), the alpha bumps to ≥ 0.85 under `prefers-reduced-transparency`, and the brutalist hairline frame overlays on top of the glass.

## Reference implementation

- See [`examples/ai-surface/`](../../examples/ai-surface/) — `book-shipment` route demonstrates the full Confirmation gate flow with a mock `book_shipment` tool.
- The `book_shipment` tool spec lives at `examples/ai-surface/lib/tools/book-shipment.ts`.

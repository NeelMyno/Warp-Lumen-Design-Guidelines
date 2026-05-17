---
name: Quote Builder
type: pattern
version: 0.13.0
last_updated: 2026-05-17
phase: 5
audience: [designer, engineer, llm-agent]
domain: freight
primitives:
  - Conversation
  - Tool
  - QuoteBuilder (Phase 2 freight composite)
  - Confirmation
related:
  - ./lane-search.md
  - ./chat-thread.md
  - ./agent-approval-flow.md
---

# Quote Builder (freight-native)

Multi-turn conversation that iteratively fills a `QuoteBuilder` composite — lane, weight, accessorials, special instructions. Each turn updates a single field via natural language; the final state submits via tool call.

## The canonical flow

Turn-by-turn fill, with the QuoteBuilder composite VISIBLE alongside the Conversation (split-pane: chat on left, QuoteBuilder on right). Each assistant turn updates the composite's state.

1. **User**: "Quote a lane LAX to SFO."
   **Assistant** (Tool: `update_quote_field`): updates `origin: "LAX"`, `destination: "SFO"`. Asks: "Weight?"
2. **User**: "3 pallets, 1200 lb total."
   **Assistant**: updates `pallets: 3, weight_lb: 1200`. Asks: "Special handling?"
3. **User**: "Lift gate at delivery."
   **Assistant**: updates `accessorials: ["lift_gate_delivery"]`. Asks: "Pickup date?"
4. **User**: "Tuesday."
   **Assistant**: confirms date via Confirmation ("Tuesday 2026-05-19?"). User approves.
5. **Final state ready** → Confirmation: "Submit this quote? LAX→SFO, 3 pallets / 1200 lb, lift gate at delivery, pickup 2026-05-19."
6. **On approval**: Tool call `submit_quote(quoteState)` → render result inline (see [`lane-search.md`](./lane-search.md)).

## Composition

```
┌─ Split pane ─────────────────────────────────────────────────────────────────┐
│ ┌─ Conversation (chat) ──────────┐ │ ┌─ QuoteBuilder composite ────────────┐ │
│ │ [Message user]                 │ │ │ Origin:        LAX                  │ │
│ │ [Message assistant + Tool]     │ │ │ Destination:   SFO                  │ │
│ │ …                              │ │ │ Pallets:       3                    │ │
│ │ [Message assistant + Confirm]  │ │ │ Weight:        1200 lb              │ │
│ │ PromptInput                    │ │ │ Accessorials:  [Lift gate (del.)]   │ │
│ │                                │ │ │ Pickup:        Tue 2026-05-19       │ │
│ │                                │ │ │ [Submit quote button]               │ │
│ └────────────────────────────────┘ │ └─────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Wiring

- **Shared state:** QuoteBuilder state lives in a shared React context (`useQuoteBuilderState`). The chat's `update_quote_field` tool mutates the same state.
- **Tool calls:** `update_quote_field({ field, value })` for each iterative update; `submit_quote(state)` for the final commit. Each tool call appears in the Conversation as a Tool primitive (collapsed by default — the QuoteBuilder pane is the primary visual feedback).
- **Confirmation gates:** wrap `submit_quote` only. The per-field updates don't gate (the user can correct via another turn cheaply); the final submit does (it commits to a carrier slot reservation, a financial commitment).
- **Resumable:** the QuoteBuilder state persists in localStorage (or server-side per session). If the user leaves and returns, the partially-filled state restores.

## Voice

| Surface | Copy |
|---|---|
| Field-update confirmations (tool collapsed) | (silent — visual feedback in QuoteBuilder pane is sufficient) |
| Inter-turn assistant prompts | "Weight?", "Special handling?", "Pickup date?" — terse, single-question, no preamble. |
| Date-confirmation Confirmation | "Tuesday 2026-05-19?" — repeat the noun, name the date explicitly. |
| Final submit Confirmation | "Submit this quote? LAX→SFO, 3 pallets / 1200 lb, lift gate at delivery, pickup 2026-05-19." — repeat all key facts. |
| Submit-success | "Quote submitted. 14 carriers quoting; results in ~6s." |

Never: "Got it!", "Sounds good!", "Excellent choice!". Voice is operator-density.

## Accessibility

- The split-pane has explicit landmarks: `<aside aria-label="Quote builder">` for the composite, the Conversation for the chat.
- QuoteBuilder fields update with `aria-live="polite"` when the chat mutates them (so screen readers know the state changed).
- Confirmation Dialog steals focus on submit; returns focus to PromptInput on cancel, returns focus to result message on confirm.

## Failure modes

1. **State out of sync between chat and composite.** Both consume the same context; never let the chat's local state diverge from the composite's source of truth.
2. **Final Confirmation skipped.** Submitting is a financial commitment. Always Confirm.
3. **Field overwrites without verification.** User says "3 pallets". Assistant updates `pallets: 3`. User says "no wait, 4 pallets." Assistant should: (a) update `pallets: 4`, (b) optionally surface "Was 3 → 4" in the QuoteBuilder field. Don't silently overwrite without trace.

## Reference implementation

- See [`examples/ai-surface/`](../../examples/ai-surface/) — `quote-builder` route demonstrates this flow.
- The `QuoteBuilder` composite lives at `design-system/02-components/quote-builder/` (Phase 2 freight-domain composite).

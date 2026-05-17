---
name: Lane Search
type: pattern
version: 0.13.0
last_updated: 2026-05-17
phase: 5
audience: [designer, engineer, llm-agent]
domain: freight
primitives:
  - PromptInput
  - Reasoning
  - Confirmation
  - Tool
  - LaneCode
  - CarrierBadge
related:
  - ./chat-thread.md
  - ./quote-builder.md
  - ./agent-approval-flow.md
---

# Lane Search (freight-native)

User describes a lane in natural language. The assistant extracts entities, confirms intent, executes the quote, and renders the rate result inline.

## The canonical flow

1. **User input** (PromptInput) — natural language: "I need to ship 3 pallets from LAX to SFO next Tuesday."
2. **Assistant reasoning** (Reasoning, streaming) — "Extracting: origin LAX, destination SFO, weight 3 pallets, pickup 2026-05-19. Verifying ZIP codes…"
3. **Confirmation gate** (Confirmation) — "Quote LAX (90045) → SFO (94128), 3 pallets, Tue 2026-05-19. Confirm?"
4. **Tool call** (Tool, ToolHeader, ToolInput shown as freight-domain composite) — `quote_lane` invoked with the extracted params.
5. **Tool output** (ToolOutput) — renders inline as a table of carrier quotes with LaneCode + CarrierBadge composites, sorted by rate.
6. **Follow-up suggestions** (Suggestion strip) — "Book the cheapest", "Show transit times", "Compare to last week".

## Composition

```
Message from="user"
  └─ MessageContent: "I need to ship 3 pallets from LAX to SFO next Tuesday."

Message from="assistant"
  ├─ Reasoning (collapsed when complete)
  │   └─ ReasoningContent: "Extracting entities… 3 pallets, LAX→SFO, Tuesday."
  ├─ Confirmation
  │   ├─ ConfirmationTitle: "Quote LAX (90045) → SFO (94128), 3 pallets, Tue 2026-05-19?"
  │   ├─ ConfirmationDescription: "Quoting takes ~6 seconds. No commitment to book."
  │   └─ ConfirmationActions [Confirm | Cancel]
  ├─ Tool (after Confirmation = approved)
  │   ├─ ToolHeader: "quote_lane · Quoting 14 carriers…"
  │   ├─ ToolInput: { origin: "LAX 90045", destination: "SFO 94128", pallets: 3, date: "2026-05-19" }
  │   └─ ToolOutput:
  │       └─ Table of CarrierBadge rows: rate, transit days, carrier, action button
  └─ Suggestion strip below: "Book the cheapest", "Show transit times", "Compare to last week"
```

## Wiring

- **Entity extraction:** the assistant's tool definition for `quote_lane` includes a JSON schema. Claude's tool-use mode parses the natural-language prompt directly into the schema. Lane-search benefits from Claude's reasoning model for ambiguity ("next Tuesday" → confirm date).
- **Confirmation:** because `quote_lane` is read-side (no commit, no carrier reservation), the Confirmation is OPTIONAL but still recommended for date-disambiguation. If the user's input is fully unambiguous ("LAX to SFO 90045→94128 3 pallets 2026-05-19"), skip Confirmation and call `quote_lane` directly.
- **Tool output renderer:** `ToolOutput` accepts a freight-domain renderer (`LaneQuoteTable`) instead of the default JSON. The renderer maps each carrier to a `CarrierBadge` + rate + transit days + a "Book" action.

## Voice

| Surface | Copy |
|---|---|
| ConfirmationTitle | "Quote LAX (90045) → SFO (94128), 3 pallets, Tue 2026-05-19?" — repeat the noun (the lane), name the date explicitly. |
| ConfirmationDescription | "Quoting takes ~6 seconds. No commitment to book." — set the duration expectation; explicitly de-risk. |
| Tool status (running) | "Quoting 14 carriers…" |
| Tool status (success) | "14 quotes returned. Cheapest: $312/pallet via Sterling LTL." |
| Tool status (no capacity) | "Lane unavailable. No carrier capacity on this corridor for the requested pickup window. Try a date 24h later or a different origin ZIP." (Phase 3 mcp-host.md voice signature.) |

## Accessibility

- The Confirmation Dialog steals focus (Radix AlertDialog). On approval, focus returns to the assistant message; on cancel, focus returns to PromptInput.
- The quote result table is keyboard-navigable; arrow keys move between rows; Enter on a row opens the carrier detail view.
- `aria-live="polite"` on the Conversation announces "14 quotes returned" once the tool resolves.

## Failure modes

1. **Skipped Confirmation on ambiguous input.** "Next Tuesday" without explicit date confirmation → user gets a quote for the wrong week. Always Confirm when dates are relative.
2. **Tool output rendered as raw JSON.** Users can't compare carriers when output is `[{"rate": 312, "carrier": "Sterling LTL"}, …]`. Always wrap in the freight-domain composite.
3. **No-capacity case handled as an error.** Lane-unavailable is a valid business outcome, not an error. Use the system-fault voice from [`voice-and-tone.md`](../00-foundations/voice-and-tone.md) — direct, suggest action.

## Reference implementation

- See [`examples/ai-surface/`](../../examples/ai-surface/) — includes a `lane-search` route demonstrating this flow with a deterministic mock (no real carrier API).
- The `quote_lane` tool spec lives at `examples/ai-surface/lib/tools/quote-lane.ts`.

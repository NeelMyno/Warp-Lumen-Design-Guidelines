---
name: Shipment Timeline
type: pattern
version: 0.13.0
last_updated: 2026-05-17
phase: 5
audience: [designer, engineer, llm-agent]
domain: freight
primitives:
  - PromptInput
  - Tool
  - ShipmentTimeline
  - Sources
related:
  - ./chat-thread.md
  - ./citation-card.md
---

# Shipment Timeline (freight-native)

User asks status of a shipment. Assistant calls `get_shipment_status`, renders the response as a `ShipmentTimeline` composite inline, cites the data source (carrier scan, GPS ping, EDI message).

## The canonical flow

1. **User input** — "Where is WRP-9824?"
2. **Tool call** — `get_shipment_status({ shipment_id: "WRP-9824" })` — no Confirmation needed (read-only).
3. **Tool output** — `ToolOutput` renders the `ShipmentTimeline` composite vertically: pickup → cross-dock → line haul → last mile, with timestamps + status at each step.
4. **Citations** — `Sources` footer cites the data source for each timeline entry (e.g., "Pickup timestamp from Sterling LTL EDI 214 message at 06:43 UTC. GPS ping at line haul step from carrier telematics feed.").
5. **Follow-up suggestions** — "Show driver contact", "Reroute via ABF", "Set up SLA alert".

## Composition

```
Message from="user"
  └─ MessageContent: "Where is WRP-9824?"

Message from="assistant"
  ├─ Tool
  │   ├─ ToolHeader: "get_shipment_status · 0.4s"
  │   ├─ ToolInput: { shipment_id: "WRP-9824" }
  │   └─ ToolOutput:
  │       └─ ShipmentTimeline composite
  │           ├─ Pickup (✓ 06:43 UTC · Sterling LTL · LAX terminal)
  │           ├─ Cross-dock (✓ 09:21 UTC · LAX hub · sorted to lane 4)
  │           ├─ Line haul (• now · GPS: I-5 mile 412 · ETA 14:30 UTC SFO)
  │           └─ Last mile (○ pending · SFO terminal)
  ├─ MessageContent (text summary):
  │   └─ MessageResponse: "WRP-9824 is on line haul, ETA 14:30 UTC. Originally quoted 14:00 — 30 min slip."
  ├─ Sources
  │   ├─ [1] Sterling LTL EDI 214 (pickup timestamp)
  │   ├─ [2] Sterling LTL EDI 214 (cross-dock arrival)
  │   ├─ [3] Carrier GPS telematics (line haul current position)
  │   └─ [4] Sterling LTL quoted ETA (original commitment)
  └─ Suggestion strip: "Show driver contact", "Reroute via ABF", "Set up SLA alert"
```

## Wiring

- **Tool output composition:** `ToolOutput` accepts the `ShipmentTimeline` (Phase 2 freight-domain primitive). The renderer maps each tracking event from the tool's JSON return value to a timeline step with timestamp + carrier + location.
- **Inline citations:** the `MessageResponse` text summary includes `[1]`, `[3]`, `[4]` superscripts at the relevant claims ("Pickup at 06:43 [1]", "GPS shows line haul [3]", "Originally quoted 14:00 [4]"). The `Sources` footer below renders the corresponding entries.
- **Live updates:** if the shipment is in transit, the tool call can be re-invoked on a schedule (every 5 min) to update the timeline. Use `useSWR` or React Query for revalidation; the `ShipmentTimeline` accepts a `lastUpdated` prop and shows a `LiveDot` while polling.

## Voice

| Surface | Copy |
|---|---|
| Text summary (MessageResponse) | "WRP-9824 is on line haul, ETA 14:30 UTC. Originally quoted 14:00 — 30 min slip." — declarative, numerate, names the slip explicitly. |
| ETA slip language | "30 min slip" / "2 h slip" / "On time". Never "Slightly delayed" or "Running a bit late." |
| Source titles | Provenance-first. "Sterling LTL EDI 214" not "Tracking data". |
| Tool error (shipment not found) | "Shipment WRP-9824 not found. Verify the ID or search by lane + date." Direct; suggest action. |

## Accessibility

- ShipmentTimeline renders as `role="list"` with each step as `role="listitem"`.
- Each step's status indicator (✓ completed, • in-progress, ○ pending) has an accessible name.
- The `LiveDot` while polling has `aria-label="Updating"`.
- `prefers-reduced-motion`: LiveDot pulse drops to a static dot.

## Failure modes

1. **Citations summarized instead of verbatim.** The Sources card must show the EXACT `cited_text` from the tool response. Don't paraphrase.
2. **Live polling drains battery on mobile.** Cap polling at every 5 min when the shipment is in transit; pause entirely when the user navigates away (use `document.visibilityState`).
3. **Timeline status mismatch.** If the EDI says "delivered" but GPS says "in transit", surface the discrepancy as a warning step — don't pick one source silently. (Edge case — surfaces an actual freight-data issue.)
4. **No data fallback.** If the carrier doesn't provide GPS telematics, the "line haul" step shows "No live position. Last EDI scan 04:12 UTC at LAX terminal" — honest about provenance, don't fake position.

## Reference implementation

- See [`examples/ai-surface/`](../../examples/ai-surface/) — `shipment-status` route demonstrates this flow with a mock `get_shipment_status` tool returning the canonical WRP-9824 fixture.

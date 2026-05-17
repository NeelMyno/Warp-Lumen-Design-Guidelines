---
name: Patterns
type: index
version: 0.13.0
last_updated: 2026-05-17
phase: 5
audience: [designer, engineer, llm-agent]
related:
  - ./chat-thread.md
  - ./lane-search.md
  - ./shipment-timeline.md
  - ./quote-builder.md
  - ./citation-card.md
  - ./agent-approval-flow.md
  - ./command-palette-flow.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Patterns — Lumen v0.13

Multi-component flows. Where Phase 2 primitives + Phase 5 AI primitives compose into reusable freight-domain experiences.

Each pattern documents:
- **Composition** — which primitives are involved and how they wire together
- **Voice** — copy templates that match the tone of the surface
- **Accessibility** — keyboard flow, screen-reader behavior, reduced-motion handling
- **Failure modes** — what goes wrong if you skip a step
- **Reference implementation** — pointer to the working code in `examples/`

## The seven Phase 5 patterns

| Pattern | What it does | Primary primitives |
|---|---|---|
| [`chat-thread.md`](./chat-thread.md) | Canonical generic chat surface. The reference every AI surface mimics. | Conversation, Message, MessageResponse, Reasoning, PromptInput, Suggestion, Actions, Sources |
| [`lane-search.md`](./lane-search.md) | Natural-language freight lane quoting flow. | PromptInput, Reasoning, Confirmation, Tool, LaneCode, CarrierBadge |
| [`shipment-timeline.md`](./shipment-timeline.md) | Status inquiry for a single shipment with provenance. | PromptInput, Tool, ShipmentTimeline, Sources |
| [`quote-builder.md`](./quote-builder.md) | Multi-turn iterative quote-building conversation. | Conversation, Tool, QuoteBuilder, Confirmation |
| [`citation-card.md`](./citation-card.md) | Source citation rendering with Anthropic Citations API shape. | Sources, InlineCitation, Source |
| [`agent-approval-flow.md`](./agent-approval-flow.md) | Destructive-tool gating with brutalist hairline frame. | Tool, Confirmation, Reasoning |
| [`command-palette-flow.md`](./command-palette-flow.md) | Slash-command + AI-mediated execution via CommandPalette. | CommandPalette, PromptInput, Tool, Confirmation |

## Hard rules across all patterns

- **NEVER apply backdrop-filter to a thread, table, row, or cell.** Glass goes on floating shells only (Tool overlays, PromptInput slash palette, Confirmation modal). Hard rule 16.
- **NEVER auto-execute write-side tools.** Every destructive action gates through Confirmation. See [`agent-approval-flow.md`](./agent-approval-flow.md).
- **NEVER drop the citation linkage.** If a message ships with `citations`, Sources renders AND InlineCitation superscripts appear in the body. See [`citation-card.md`](./citation-card.md).
- **NEVER mix Lumen's voice with chirpy AI defaults.** Every assistant turn through these patterns gets `00-foundations/voice-and-tone.md` applied to copy. "Booked. Tracking is live." NOT "Great news! Your shipment has been successfully booked! 🎉".

## How to add a new pattern

1. Create `03-patterns/<name>.md` following the section shape of an existing pattern (Composition → Voice → Accessibility → Failure modes → Reference).
2. Cross-reference every primitive used; link to its `02-components/<name>/component.md`.
3. Update this README's table.
4. If the pattern ships with a reference implementation, add it under `examples/<pattern-name>/`.
5. Add a CHANGELOG entry under the matching minor version.

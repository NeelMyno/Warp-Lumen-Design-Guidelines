---
name: Command Palette Flow
type: pattern
version: 0.13.0
last_updated: 2026-05-17
phase: 5
audience: [designer, engineer, llm-agent]
primitives:
  - CommandPalette (Phase 2)
  - PromptInput
  - Tool
  - Confirmation
  - Suggestion
related:
  - ./chat-thread.md
  - ./agent-approval-flow.md
  - ../02-components/prompt-input/prompt-input.md
---

# Command Palette Flow

How the Phase 2 `CommandPalette` integrates with AI. The palette opens on slash-command, the items list mixes plain commands with AI suggestions, and the user's selection either executes directly (plain command) or kicks off an LLM-mediated flow (AI suggestion).

## Two modes inside one palette

Lumen's `CommandPalette` is a multi-mode palette. Phase 5 adds AI-mediated execution as a parallel mode to direct command execution.

| Mode | When | Behavior |
|---|---|---|
| **Direct command** | User types a known command keyword (`book`, `quote`, `track`). | Item executes immediately on Enter. No LLM. |
| **AI suggestion** | User types natural language ("ship 3 pallets to SFO"). | Item shows a sparkle icon + the AI-rephrased intent. On Enter, the palette closes, the natural-language query routes to the AI surface (PromptInput in the chat-thread pattern). |
| **Slash command** | User types `/` to open the palette explicitly. | Same as Direct command but biased to action-verbs. |

The palette decides which mode to render based on the input — a `useMemo` derives whether the input matches a known command keyword vs. requires AI interpretation.

## Composition

```
CommandPalette (opens on Cmd/Ctrl+K or /)
  ├─ Command input (top)
  ├─ Items list (filtered live):
  │   ├─ ┌─ "Direct" section ─────────────────┐
  │   │  │ • Quote lane (LAX → SFO)           │
  │   │  │ • Track shipment WRP-9824          │
  │   │  │ • Book latest quote (#Q-3392)      │
  │   │  └────────────────────────────────────┘
  │   └─ ┌─ "AI" section ─────────────────────┐
  │      │ ✦ Ask AI: "ship 3 pallets to SFO"  │
  │      │ ✦ Ask AI: "what's WRP-9824 status" │
  │      └────────────────────────────────────┘
  └─ Footer (key hints): ↵ to execute · ⇧↵ to send to AI · esc to dismiss
```

## Wiring

- **Plain commands** are pre-registered with the palette via `registerCommand({ keyword, label, execute })`. Execution is synchronous client-side handlers (no LLM involved).
- **AI suggestions** are dynamically generated from the input. The palette has a `parseInput(input)` helper that returns:
  - `mode: "direct"` + matching command, OR
  - `mode: "ai"` + the rephrased intent ("Ask AI: '…'")
- **On select (Enter):**
  - Direct → palette calls `command.execute()` and closes.
  - AI → palette dismisses, the input is forwarded to the chat surface's PromptInput, and the chat-thread pattern takes over.
- **Suggestion strip:** when the palette is open with an empty input, render a `Suggestion` strip below the input showing the top 3 recent or context-relevant commands.

## Voice

| Surface | Copy |
|---|---|
| Palette placeholder | "Search commands or ask AI…" |
| Direct command labels | Verb-led, sentence case: "Quote lane", "Track shipment", "Book latest quote". |
| AI suggestion prefix | "✦ Ask AI: " (sparkle icon + literal prefix). |
| Footer hints | "↵ to execute · ⇧↵ to send to AI · esc to dismiss" |
| Empty-state suggestions | Context-relevant. On the Quotes page: "Quote lane", "List recent quotes", "Compare carriers". On the Shipments page: "Track shipment", "Show in-transit", "Today's deliveries". |

## Accessibility

- The palette is a Radix Dialog. On open, focus moves to the command input.
- Item list is keyboard-navigable: ↑↓ to traverse, Enter to execute, Escape to dismiss.
- Each item announces its category ("Direct command: Quote lane" / "AI suggestion: Ask AI ship 3 pallets to SFO") via `aria-label`.
- The sparkle icon for AI suggestions has `aria-hidden` (the prefix label carries the semantics).
- `prefers-reduced-motion`: open animation drops to instant.

## Failure modes

1. **AI suggestion accidentally fires Direct execution.** If the input matches a partial command keyword ("quo"), the palette can confuse a partial match with a direct execution. Solution: require exact keyword match for Direct; partial → AI suggestion.
2. **Sparkle icon used elsewhere.** The sparkle icon is reserved for AI surface affordances (palette AI items, `intent="ai"` Button). Don't use it for other decorative purposes.
3. **AI suggestions render lookahead text.** Some palettes auto-complete the user's input with the AI suggestion preview. Don't — it tricks the user into thinking they're typing what the AI proposed.
4. **Palette stays open after AI selection.** AI selection should dismiss the palette and transfer focus to the chat surface's PromptInput. Don't leave the palette open with the chat below — context confusion.

## Reference implementation

- See [`examples/ai-surface/`](../../examples/ai-surface/) — `command-palette` route demonstrates this flow with a small registered command set + AI fallback.
- The `CommandPalette` lives at `design-system/02-components/command-palette/` (Phase 2).

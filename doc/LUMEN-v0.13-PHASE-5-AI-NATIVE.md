# PHASE 5 — AI-Native Component Specialization

Execute master doc §7.Phase-5. Master doc is canonical; this prompt adds execution-level detail for the AI primitives.

## What this phase ships

The AI-native component family — built on top of Phase 2's foundation, mirroring Vercel AI Elements naming verbatim, wired to the Anthropic Citations API shape for citation UI, and mapped to OpenAI ChatKit theme variables so a Lumen-themed ChatKit embed is a single CSS-variable handoff. Plus three freight-native patterns (chat-thread, lane-search, shipment-timeline, quote-builder) that demonstrate the AI primitives in production-grade composite use. After this phase, any Warp product can ship an on-brand AI surface in one install.

## Technical pins

| Tool | Version | Why |
|---|---|---|
| Vercel AI Elements | Latest from `https://elements.ai-sdk.dev` (May 2026+ snapshot indexed 2026-05-01) | Canonical component names; install via `npx ai-elements@latest add <name>` |
| Vercel AI SDK | `ai@^5.0.0`, `@ai-sdk/react@^1.0.0` | `useChat` hook, `streamText`, `toUIMessageStreamResponse` |
| AI SDK provider | `@ai-sdk/anthropic@latest` for Claude integration; `@ai-sdk/openai` for ChatKit | Required for the reference apps |
| Anthropic SDK | `@anthropic-ai/sdk@^0.40.0` | For the Citations API shape reference and the agent reference app |
| OpenAI ChatKit | latest stable | For the ChatKit theme variable mapping |
| Storybook | Continue with v10.3 from Phase 2 | Stories for every AI primitive |

## The full AI primitive set (mirror Vercel AI Elements names verbatim)

This is broader than what master doc §7.Phase-5 lists. The full Vercel AI Elements family as of May 2026 is **eight families with ~50 components**. Lumen ships an opinionated subset — the components Warp actually uses — but every one matches Vercel's name so a Lumen-themed ChatKit embed Just Works.

### Family 1: PromptInput

- `PromptInput` (root container)
- `PromptInputTextarea` (the actual textarea)
- `PromptInputTools` (slot for tool/slash-command palette)
- `PromptInputButton` (composable button — send, attach, mic)
- `PromptInputFooter` (slot below the textarea for affordances)
- `PromptInputSubmit` (the send button, opinionated)
- `PromptInputSelect` (model selector dropdown)

State management: provider pattern with `usePromptInput` hook. File attachment validation built in.

### Family 2: Conversation

- `Conversation` (root container, manages scroll)
- `ConversationContent` (auto-scrolling content area)
- `ConversationScrollButton` (the "scroll to bottom" affordance that appears when scrolled up)
- `ConversationEmptyState` (`title`, `description` props for empty conversations)

Virtualization for long threads — use TanStack Virtual under the hood for any thread over 100 messages. Streaming-optimized re-renders.

### Family 3: Message

- `Message` (root, `from` prop: "user" | "assistant" | "system" | "tool")
- `MessageContent` (the bubble)
- `MessageResponse` (streaming-optimized response renderer with shimmer on partial tokens)
- `MessageBranch`, `MessageBranchContent`, `MessageBranchPrevious`, `MessageBranchNext`, `MessageBranchPage`, `MessageBranchSelector` (for regenerated-response navigation)

### Family 4: AI Insight (the reasoning/tool/citation layer)

- `Reasoning`, `ReasoningTrigger`, `ReasoningContent` (collapsible chain-of-thought; `isStreaming` prop shows shimmer while streaming)
- `Tool`, `ToolHeader`, `ToolInput`, `ToolOutput` (compound component; consumes `ToolUIPart` / `DynamicToolUIPart` from AI SDK; integrates with approval workflow)
- `Confirmation` (approval gate for destructive tool calls — wraps in Lumen's brutalist hairline frame voice element)
- `Sources` + `InlineCitation` (citation UI consuming Anthropic Citations API shape — see below)

### Family 5: Code & Content Display

- `CodeBlock` (formalize the existing v0.12.4 code block per master doc §7.Phase-5)
- `Artifact` (Anthropic-style artifact rendering — code, document, HTML, SVG, Mermaid)
- `WebPreview` (iframe with safety wrapper, used by Artifact for HTML)
- `JSXPreview` (live React component preview)
- `Sandbox` (collapsible container with status indicator and tabbed navigation between code and output)
- `SchemaDisplay` (REST endpoint visualization — HTTP method, path, params, request/response schema)
- `Snippet` (lightweight terminal command + short code snippet, built on shadcn's `InputGroup`)
- `StackTrace` (formatted JS/Node error stack with clickable file paths)
- `Terminal` (console output with ANSI color support, streaming indicators, auto-scroll)

### Family 6: Voice & Audio (only if Warp ships voice surfaces)

- `AudioPlayer` + `Transcription`
- `VoiceSelector`, `SpeechInput`, `MicSelector`

Default: implement minimal stubs. Mark with `status: "experimental"` in the SKILL.md. Flesh out when a Warp product needs them.

### Family 7: Workflow (React Flow integration)

- `Canvas`, `Node`, `Edge`, `Connection`, `Controls`, `Panel`, `Toolbar`

For workflow visualization (agent plans, route graphs, freight-lane networks). Use `@xyflow/react` under the hood.

### Family 8: Agent / Task / Commit

- `Agent` (state indicator: idle / thinking / running tool / awaiting approval / done / error — six visual states)
- `Task` (single-task card with status, owner, deadline; for plan visualization)
- `Commit` (commit/change card for showing what the agent modified)

### Shared

- `Actions` (the action-button strip below an assistant message — regenerate, copy, like, dislike)
- `Suggestion` (suggestion chip strip above PromptInput)
- `Loader` (Lumen-branded spinner reusing the v0.12.4 spinner primitive)
- `InlineCitation` (inline `[1]`-style citation reference)
- `Context` (token usage / context window display — `Stat` + progress meter composition per master doc §7.Phase-5)
- `Response` (text rendering wrapper for streaming content with markdown)
- `Image` (image rendering with loading / error states)

## The Anthropic Citations API shape (use verbatim)

The `Sources` and `InlineCitation` components consume citation data shaped per Anthropic's Citations API. The canonical JSON shape is:

```ts
type Citation = {
  type: "char_location" | "page_location" | "content_block_location";
  cited_text: string;
  document_index: number;
  document_title: string | null;
  // Plus type-specific fields:
  // char_location: start_char_index, end_char_index
  // page_location: start_page_number, end_page_number
  // content_block_location: start_block_index, end_block_index
};
```

The `Sources` component takes `citations: Citation[]` as a prop and renders a "Sources" footer below an assistant message. The `InlineCitation` component renders a clickable `[1]` superscript that scrolls to the matching entry in `Sources` on click.

Note: Anthropic's docs use the term **Citations API** as the official name. Match that voice in component docs.

## OpenAI ChatKit theme variable mapping

Map every Lumen semantic token to the ChatKit theme variable shape. ChatKit expects a flat object of CSS-variable–style overrides:

```ts
// 02-components/_chatkit-theme/lumen-chatkit-theme.ts
export const lumenChatKitTheme = {
  colorScheme: "dark",
  color: {
    accent: {
      primary: "var(--color-spring-500)",
      level: "var(--color-spring-400)",
    },
    background: {
      primary: "var(--surface-canvas)",
      secondary: "var(--surface-raised)",
    },
    text: {
      primary: "var(--text-primary)",
      secondary: "var(--text-secondary)",
    },
  },
  radius: "var(--radius-lg)",
  density: "compact",
  typography: {
    fontFamily: "var(--font-sans)",
  },
};
```

A consumer importing this theme into a ChatKit embed gets Lumen's voice with no further configuration.

Reference implementation: `examples/chatkit/` as a Next.js app embedding ChatKit themed with `lumenChatKitTheme`. The embed should render visually consistent with the rest of Lumen.

## Per-AI-component file shape

Same shape as Phase 2 components (MD + SKILL.md + TSX + registry JSON + Storybook + Manifest). Critical SKILL.md NEVER rules to surface for AI components:

- NEVER hardcode model names. Models are passed as props or pulled from a `LumenAIProvider` context. The component is model-agnostic.
- NEVER assume streaming completes synchronously. Every render of `MessageResponse`, `Reasoning`, `Tool`, `ToolOutput` must handle partial content gracefully.
- NEVER ship a Tool component without a Confirmation gate for destructive operations. Tool components consuming write-side actions wrap in `Confirmation`.
- NEVER drop the citation linkage. If a message has `citations: Citation[]`, the `Sources` component renders and `InlineCitation` superscripts appear in the message body at the cited spans.
- NEVER hardcode Spring Green outside the token reference. `text.accent` resolves to the right hue.

## Group F — Freight-native AI patterns

Create `03-patterns/` MD files for the production-grade composites. Each documents how the AI primitives compose into a freight-domain flow.

**`chat-thread.md`** — The canonical generic chat surface. `Conversation > Message > MessageContent > MessageResponse` shape. Suggestion chips above `PromptInput`. Reasoning blocks collapsible. Source citations footer. This is the reference pattern every other AI surface mimics.

**`lane-search.md`** — Freight-domain. User describes lane in natural language ("I need to ship 3 pallets from LAX to SFO next Tuesday"). LLM extracts entities (origin ZIP, dest ZIP, weight, date), renders confirmation via `Confirmation` component ("Quote LAX → SFO, 3 pallets, Tuesday — confirm?"), executes the `quote_lane` tool, renders rate result via `Tool` + `ToolOutput`. Includes the freight-domain `LaneCode` and `CarrierBadge` components from Phase 2 inline in the assistant response.

**`shipment-timeline.md`** — Freight-domain. User asks status of a shipment. LLM calls `get_shipment_status` tool, response renders inline as the `ShipmentTimeline` component from Phase 2 (vertical timeline with pickup → cross-dock → line haul → last mile). `Sources` cites the data source (carrier scan event, GPS ping, EDI message).

**`quote-builder.md`** — Freight-domain. Multi-turn flow where LLM iteratively fills the `QuoteBuilder` composite (lane, weight, accessorials, special instructions) via natural conversation. Each turn updates the component state. Final state submits via tool call.

**`citation-card.md`** — Generic. The detailed pattern for rendering citations with the Anthropic Citations API shape. Inline citations in message body, expandable Sources card below.

**`agent-approval-flow.md`** — Generic. The pattern for destructive tool calls. `Tool` shows pending state, `Confirmation` interrupts with the brutalist hairline frame, user approves, `Tool` resumes execution, `ToolOutput` renders result.

**`command-palette-flow.md`** — How the Phase 2 `CommandPalette` integrates with AI. Slash command opens palette, palette items can be plain commands or AI suggestions, selection triggers either direct execution or an LLM-mediated flow.

## Group G — The reference AI surface

Build `examples/ai-surface/`. A Next.js 15 app demonstrating the full chat-thread pattern end-to-end. Uses Anthropic Claude via `@ai-sdk/anthropic`. Streams responses with reasoning blocks. Renders citations from a fake Anthropic Citations API response. Demonstrates tool calls with confirmation gates. Renders all six Agent states.

This is the Phase 5 proof-of-concept and the visual reference that proves the AI primitives ship a coherent system.

## Decisions you will likely make unilaterally

- Whether to install Vercel AI Elements directly (`npx ai-elements@latest add conversation`) and re-export them under `@lumen/ai-*`, or rebuild them under Lumen with the same names. Default: **install + theme** — `npx ai-elements add conversation` then style with Lumen tokens. Forking would mean tracking Vercel upstream forever; theming lets Lumen ride their updates. Document this clearly in each AI component's MD.
- Whether to ship the Voice & Audio family at all. Default: ship stubs only with `status: "experimental"`. Flesh out when needed.
- Whether the Workflow family (Canvas, Node, Edge) is in scope. Default: ship if a freight-network-visualization use case exists; otherwise stub with `status: "experimental"`.
- How to handle the OpenAI ChatKit integration on the Lumen-themed surface. Default: implement as a separate `examples/chatkit/` page; don't make ChatKit a hard dependency of Lumen.
- Whether to add `LumenAIProvider` as a context wrapper for the AI primitive set. Default: yes — single context for default model, streaming behavior, citation styling. Reduces boilerplate per consuming app.

## Verification gates for Phase 5

| Gate | Pass condition |
|---|---|
| Vercel AI Elements integrated | `npx ai-elements@latest add conversation` works in `examples/ai-surface/` |
| All required primitives shipped | Conversation, Message, MessageResponse, Reasoning, Tool, Confirmation, Sources, InlineCitation, PromptInput (+ subcomponents), Suggestion, Actions, Loader, CodeBlock, Artifact, WebPreview, Agent, Context — all exist with MD + SKILL.md + Storybook stories |
| Anthropic Citations shape | `Sources` and `InlineCitation` consume the `Citation` type verbatim from Anthropic's API |
| ChatKit theme exported | `lumenChatKitTheme` exists and the `examples/chatkit/` reference inherits Lumen tokens without per-component overrides |
| Streaming works | The reference AI surface streams a real Claude response with reasoning, tool call, citation, and confirmation gate, all rendering correctly mid-stream |
| Six freight patterns | `03-patterns/` contains chat-thread, lane-search, shipment-timeline, quote-builder, citation-card, agent-approval-flow, command-palette-flow MD files |
| Mode dual-render | Toggling `ModeScope` on the reference AI surface from restrained to expressive flips backgrounds (mesh appears) without breaking any component |
| Token discipline | No hex literals in any AI component source; `tools/audit-tokens.ts` passes |
| Voice consistency | Tool names, error messages, and Confirmation copy in the reference app match the brutalist-instrument-panel voice from `00-foundations/voice-and-tone.md` |
| Self-critique | All 15 questions in master doc §10.1 answered "no" |

## Stop condition

Phase report into `design-system/06-claude-code-briefings/phase-5-report.md` per master doc §10.3. Commit message: `feat(lumen): phase 5 — AI-native primitives and freight-domain patterns`. **Halt**. Wait for Phase 6.

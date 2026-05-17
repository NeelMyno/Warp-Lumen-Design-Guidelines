# examples/ai-surface

Reference implementation for the Lumen v0.13 AI surface — the six Phase 5 flows shipped end-to-end as a working Next.js 15 + React 19 + AI SDK app.

## What ships

- **`/`** — landing page with links to all six flows.
- **`/chat`** — the **canonical chat-thread pattern** with full streaming (Conversation, Message, Reasoning, Tool, Sources, InlineCitation, Actions, PromptInput).
- **`/lane-search`** — freight-native lane quoting flow.
- **`/shipment-status`** — freight-native status inquiry with provenance.
- **`/quote-builder`** — freight-native multi-turn quote-build conversation.
- **`/book-shipment`** — destructive tool gated by brutalist Confirmation.
- **`/command-palette`** — slash-command palette with AI-mediated suggestions.

The five freight / agent flows are documented surfaces; the **`/chat`** route is the working renderer that streams responses end-to-end. Each flow page links into `/chat` with a canonical fixture prompt.

## Streaming sources

- **Live** — when `ANTHROPIC_API_KEY` is set in env. Streams Claude via `@ai-sdk/anthropic` + Vercel AI SDK `streamText`. (The live branch is scaffolded but commented out at `app/api/chat/route.ts:62` until `pnpm install` runs; uncomment then.)
- **Mock** — default. Returns a deterministic chunked stream from `lib/mocks/chat-mock-stream.ts` matching the canonical fixtures. Runs anywhere, no API key, no network. Useful for: design review, CI smoke tests, fresh-laptop demos.

The mock chunks and live chunks have the same shape, so the client renderer is identical for both paths.

## Setup

```bash
cd examples/ai-surface
pnpm install
pnpm install:ai-elements    # materializes Vercel AI Elements component tree
pnpm dev                    # http://localhost:3010
```

To enable live Claude streaming:

```bash
export ANTHROPIC_API_KEY="sk-ant-…"
# Then uncomment the live branch in app/api/chat/route.ts (line ~62) and:
pnpm dev
```

## Mock fixtures

The mock stream pattern-matches on the user prompt. Three canonical fixtures:

| Prompt | Response | Demonstrates |
|---|---|---|
| "I need to ship 3 pallets from LAX to SFO next Tuesday" | Reasoning → `quote_lane` tool → 7 carrier quotes | Lane-search pattern |
| "Where is WRP-9824?" | `get_shipment_status` tool → ShipmentTimeline → 3 citations | Shipment-timeline + citation-card |
| Any other input | Stock instructional message | Chat-thread baseline |

To add a new fixture, append to `lib/mocks/chat-mock-stream.ts:pickMockResponse()`.

## What this reference does NOT do

- **Persist conversation history.** Each page load starts fresh. Production wires a state store (TanStack Query / Zustand / server session).
- **Implement real tool execution.** Mock returns canned outputs. Production wires actual `quote_lane` / `get_shipment_status` / `book_shipment` handlers.
- **Render the full Vercel AI Elements component tree.** Until `pnpm install:ai-elements` is run, the chat page uses hand-rolled wrappers around plain HTML + Tailwind that match the visual contract. After install, swap to:
  ```tsx
  import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
  import { Message, MessageContent } from "@/components/ai-elements/message";
  import { MessageResponse } from "@/components/ai-elements/message-response";
  import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
  import { Tool, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
  import { Sources, SourcesTrigger, SourcesContent, Source } from "@/components/ai-elements/sources";
  import { InlineCitation, InlineCitationContent } from "@/components/ai-elements/inline-citation";
  import { PromptInput, PromptInputTextarea, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
  import { Suggestion } from "@/components/ai-elements/suggestion";
  import { Actions } from "@/components/ai-elements/actions";
  ```

The Lumen theme overrides (via `globals.css` token block) apply automatically once those imports resolve.

## Related

- [`design-system/03-patterns/chat-thread.md`](../../design-system/03-patterns/chat-thread.md) — composition diagram
- [`design-system/03-patterns/lane-search.md`](../../design-system/03-patterns/lane-search.md)
- [`design-system/03-patterns/shipment-timeline.md`](../../design-system/03-patterns/shipment-timeline.md)
- [`design-system/03-patterns/quote-builder.md`](../../design-system/03-patterns/quote-builder.md)
- [`design-system/03-patterns/agent-approval-flow.md`](../../design-system/03-patterns/agent-approval-flow.md)
- [`design-system/03-patterns/command-palette-flow.md`](../../design-system/03-patterns/command-palette-flow.md)
- [`audit-dashboard/src/lib/lumen-ai-provider.tsx`](../../audit-dashboard/src/lib/lumen-ai-provider.tsx) — context wrapper for default model / streaming / confirmation behavior
- [`design-system/02-components/_chatkit-theme/`](../../design-system/02-components/_chatkit-theme/) — sister theme mapping for OpenAI ChatKit

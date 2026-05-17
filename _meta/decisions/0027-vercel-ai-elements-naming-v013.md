# ADR 0027 — Vercel AI Elements naming (verbatim) for AI primitives

- **Date:** 2026-05-17
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Related rules:** [AGENTS.md hard rule 19](../../AGENTS.md)
- **Related ADRs:** [0024 — Dual-mode architecture](./0024-dual-mode-architecture-v013.md), [0003 — shadcn registry](./0003-shadcn-registry.md)

## Context

Vercel AI Elements (`https://elements.ai-sdk.dev`) emerged in 2026 as the de facto naming convention for AI-surface React primitives: `Conversation`, `Message`, `MessageContent`, `MessageResponse`, `Reasoning`, `Tool`, `ToolHeader`, `Sources`, `InlineCitation`, `PromptInput`, `Suggestion`, `Confirmation`, `Artifact`, `WebPreview`, `Agent`. The convention is now wired into OpenAI's ChatKit (`chatkit-react`), Vercel AI SDK (`useChat` defaults), Anthropic's Citations API examples, and the broader AI-React ecosystem.

When designing Lumen's AI primitive layer (Phase 5 of the v0.13 refactor), we faced three naming choices:

1. **Invent Lumen-specific names** (e.g., `Thread`, `Bubble`, `Cite`).
2. **Mirror Vercel AI Elements names verbatim.**
3. **Hybrid — Vercel names with Lumen prefixes** (e.g., `LumenConversation`, `LumenMessage`).

Option 1 fragments the ecosystem. A vibe-coder copying a code sample from Vercel docs would have to translate `Conversation` → `Thread` to use Lumen. Each translation is a failure point.

Option 3 is verbose and creates surface ambiguity: is `LumenConversation` different from `Conversation`? Users assume yes, and the API documentation has to constantly clarify.

Option 2 — verbatim mirroring — lets a Lumen-themed app drop in any Vercel AI Elements code sample without modification and theme it via Lumen tokens. A ChatKit embed becomes "one line of CSS" because the prop names, slot names, and sub-component composition match.

## Decision

**When generating an AI surface component, mirror the Vercel AI Elements naming verbatim. Lumen ships the Vercel name as both the folder name, the registry slug, the exported React component name, and the install command.**

### Specific commitments (verbatim from AGENTS.md hard rule 19)

When generating an AI surface component (Conversation, Message, Reasoning, Tool, Sources, InlineCitation, PromptInput, Suggestion, Confirmation, Artifact, WebPreview, Agent), mirror the Vercel AI Elements naming verbatim so a Lumen-themed ChatKit embed is a single line of CSS.

- Folder name: `design-system/02-components/<vercel-name-kebab>/` (e.g., `suggestion/`, NOT `suggestion-strip/`).
- Registry slug: `@lumen/<vercel-name-kebab>` (e.g., `@lumen/suggestion`).
- Exported React component name: PascalCase Vercel name (e.g., `Suggestion`).
- Install command: `npx ai-elements@latest add <vercel-name>` is the canonical AI-Elements install; `npx shadcn@latest add @lumen/<vercel-name>` installs the Lumen-themed stub variant.

### Citation UI consumes Anthropic Citations API JSON shape

`Sources` and `InlineCitation` consume the Citation type verbatim from Anthropic's Citations API:

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

### ChatKit theme bridge

`design-system/02-components/_chatkit-theme/lumen-chatkit-theme.ts` exports `lumenChatKitTheme` — a flat object of CSS-variable–style overrides that maps every Lumen semantic token onto ChatKit's theme variable shape. A consumer importing this theme into a ChatKit embed gets Lumen's voice with no further configuration.

### v0.13.4 — rename the four divergent-named folders

The initial Phase 5 shipped four components under Lumen-divergent names that violated this rule:
- `suggestion-strip/` → renamed to `suggestion/`
- `loader-ai/` → renamed to `loader/`
- `agent-state/` → renamed to `agent/`
- `context-window/` → renamed to `context/`

v0.13.4 adds the canonical-named folders as primary; the divergent-named folders are kept as deprecated aliases (per [ADR 0026 — Phase 0 alias namespace](./0026-phase-0-alias-namespace-v013.md)'s additive principle, applied to component names). v0.14 will retire the divergent names. Mid-cycle removal is a v1.0 decision.

## Consequences

### Positive

- **Vibe-coder ergonomics.** A user copying a Vercel AI Elements snippet pastes it into a Lumen-themed app and it just works.
- **ChatKit integration is trivial.** OpenAI ChatKit's theme bridge accepts CSS variables; Lumen exports those variables; the embed inherits Lumen's voice with no per-component override.
- **AI ecosystem coherence.** Every AI-tools tutorial in 2026 uses Vercel AI Elements names. Lumen reads as part of the ecosystem, not adjacent to it.
- **Documentation reuse.** Vercel's docs for `Conversation` apply verbatim to `@lumen/conversation`. Lumen's per-component MD reuses Vercel's anatomy.

### Negative

- **Less room for Lumen-specific naming preference.** "Loader" is generic — Lumen would prefer "LumenSpinner" for clarity. Mirroring Vercel's name means accepting their generic vocabulary.
- **Naming drift if Vercel renames.** If Vercel renames `Suggestion` to `SuggestionChip` in a future release, Lumen would have to update its primary name AND maintain the old name as a deprecated alias. Cost of keeping pace with upstream.
- **Anthropic Citations API JSON shape is upstream-controlled.** If Anthropic changes the citation type, Lumen's `Sources` and `InlineCitation` consume the new shape — but the component MD documents the v1 shape. A future revision must update both.

### Risks

- **Vercel AI Elements is opinionated and evolving.** Their naming may shift in v2 of the library. Lumen tracks via the `vercel_ai_elements` field in each component MD frontmatter. CI step (not yet implemented) could check upstream registry against Lumen's local set.

## Alternatives considered

### A. Lumen-specific naming (Option 1)

Rejected — fragments the ecosystem, breaks copy-paste from Vercel docs.

### B. `Lumen<Name>` prefix hybrid (Option 3)

Rejected — verbose, ambiguous, hard to map back to AI SDK examples.

### C. Mirror Vercel names but only for the components Warp actually uses

Partially accepted — Lumen does not ship all ~50 Vercel AI Elements components. The opinionated subset is documented in [Phase 5 prompt](../../doc/LUMEN-v0.13-PHASE-5-AI-NATIVE.md). For every component Lumen does ship, the name matches Vercel verbatim.

## References

- [Vercel AI Elements](https://elements.ai-sdk.dev) — the upstream registry
- [AGENTS.md §"Hard rules" 19](../../AGENTS.md)
- [Phase 5 prompt](../../doc/LUMEN-v0.13-PHASE-5-AI-NATIVE.md)
- [Phase 5 report](../../design-system/06-claude-code-briefings/phase-5-report.md)
- [Anthropic Citations API](https://docs.anthropic.com/en/docs/build-with-claude/citations)
- [OpenAI ChatKit](https://platform.openai.com/docs/chatkit)
- [_chatkit-theme/lumen-chatkit-theme.ts](../../design-system/02-components/_chatkit-theme/lumen-chatkit-theme.ts)

---

## Related Notes
- [[ADR 0024 — Dual-mode architecture]]
- [[ADR 0026 — Phase 0 alias namespace]]
- [[ADR 0028 — GPT-image-2 prompt library]]

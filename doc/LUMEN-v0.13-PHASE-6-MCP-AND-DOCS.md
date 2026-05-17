# PHASE 6 — Documentation Polish, MCP Wiring & v0.13.0 Ship

Execute master doc §7.Phase-6. Master doc is canonical; this prompt adds execution-level detail.

## What this phase ships

The wired MCP layer (using shadcn's out-of-the-box MCP, not a custom server), the generated `llms-full.txt` flattened dump, the rebuilt audit dashboard at `/library` with mode toggle and live token introspection, the final `CHANGELOG.md` entry, and the v0.13.0 git tag. After this phase, an engineer can run `/mcp` in Claude Code, add the Lumen registry as an MCP source, and ask "build me a glass AI hero with a lane-arc background for the landing page" — and get correct, on-brand React + tokens output with no further prompting.

## Critical update from research

The original master doc §7.Phase-6 plan called for building a custom Lumen MCP server at `07-mcp/`. **Skip that.** The shadcn MCP server "works out of the box with any shadcn-compatible registry" per the shadcn documentation — there's no separate server to build. Phase 6 becomes a documentation + wiring + rebuild phase, not a server-build phase. This collapses scope significantly.

If a custom MCP server is genuinely needed later (for Lumen-specific tooling beyond what shadcn MCP exposes — e.g., a `lumen.get_prompt_template` tool the shadcn MCP doesn't natively know about), build it as a separate package in v0.14. Don't block v0.13.0 ship on it.

## Technical pins

| Tool | Version | Why |
|---|---|---|
| shadcn MCP | Out-of-the-box from shadcn CLI v4 | The MCP server reads `registry.json` and per-item JSONs directly; no build step required |
| MCP install command | `claude mcp add --transport http shadcn https://ui.shadcn.com/api/mcp` | Standard shadcn MCP install for Claude Code |
| `llms-full.txt` build script | Custom Node script at `tools/build-llms-txt.ts` | Flattens every MD + token JSON + prompt template into one file |
| Next.js | Continue v15.x from Phase 0–5 | Audit dashboard runtime |

## Work to do

### Group A — Wire the shadcn MCP

The Lumen registry from Phase 2 already serves at `https://warp-lumen-design-guidelines.vercel.app/r/registry.json`. Verify it's reachable. Then write the consumer-side install instructions into `design-system/AGENTS.md` and `CLAUDE.md`.

In `AGENTS.md`, under a new section `## MCP integration`:

```markdown
## MCP integration

The Lumen registry is shadcn-MCP-compatible out of the box. To wire it into Claude Code:

1. Install the shadcn MCP server:
   `claude mcp add --transport http shadcn https://ui.shadcn.com/api/mcp`

2. Add the Lumen registry to your project's `components.json`:
   ```json
   {
     "registries": {
       "@lumen": "https://warp-lumen-design-guidelines.vercel.app/r/{name}.json"
     }
   }
   ```

3. Restart Claude Code and run `/mcp` to verify the connection.

4. Invoke Lumen via natural language: "install the Lumen button" → resolves to
   `npx shadcn@latest add @lumen/button`.

Other agents (Cursor, Codex, Copilot) follow the same shadcn MCP install pattern.
See `https://ui.shadcn.com/docs/registry/mcp` for tool-specific install commands.
```

In `CLAUDE.md`, the existing `@AGENTS.md` reference covers this. Add a one-liner:

```markdown
## MCP

Lumen exposes the shadcn MCP — see AGENTS.md §MCP integration. Use `/mcp` to verify.
```

### Group B — `llms-full.txt` generator

Build `tools/build-llms-txt.ts`. It produces `llms-full.txt` at repo root — a single flattened markdown file containing the full content of every MD, every token JSON, every prompt template in the design system, formatted for direct ingestion into an LLM context window.

Structure of `llms-full.txt`:

```
# Lumen Design System — Full Reference (v0.13.0)

> Single-file flattened dump of the entire Lumen design system. Generated.
> For the indexed version, see llms.txt. For the canonical source, see
> github.com/NeelMyno/Warp-Lumen-Design-Guidelines.

## §1. Foundations

### principles.md
[full content]

### voice-and-tone.md
[full content]

…

## §2. Tokens (DTCG 2025.10)

### color.tokens.json
```json
[full JSON]
```

…

## §3. Components

### button
#### button.md
[full content]
#### button.skill.md
[full content]

…

## §4. Patterns
…

## §5. Platforms
…

## §6. Prompts
…
```

The generator script:

```ts
// tools/build-llms-txt.ts
import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

const SECTIONS = [
  { title: "§1. Foundations", pattern: "00-foundations/*.md" },
  { title: "§2. Tokens (DTCG 2025.10)", pattern: "01-tokens/**/*.tokens.json" },
  { title: "§3. Components", pattern: "02-components/**/{*.md,*.skill.md}" },
  { title: "§4. Patterns", pattern: "03-patterns/*.md" },
  { title: "§5. Platforms", pattern: "04-platforms/*.md" },
  { title: "§6. Prompts", pattern: "05-prompts/*.md" },
];

let out = `# Lumen Design System — Full Reference (v0.13.0)\n\n`;
out += `> Single-file flattened dump of the entire Lumen design system. Generated.\n\n`;

for (const section of SECTIONS) {
  out += `\n## ${section.title}\n\n`;
  const files = globSync(section.pattern).sort();
  for (const file of files) {
    out += `\n### ${file}\n\n`;
    const content = readFileSync(file, "utf-8");
    if (file.endsWith(".json")) {
      out += "```json\n" + content + "\n```\n";
    } else {
      out += content + "\n";
    }
  }
}

writeFileSync("llms-full.txt", out);
console.log(`Wrote llms-full.txt: ${out.length.toLocaleString()} chars`);
```

Add to `package.json`:
- `"llms": "ts-node tools/build-llms-txt.ts"`

Run it. The output should be roughly 250K-500K characters (60K-120K tokens). That's fine for `llms-full.txt`; the indexed `llms.txt` stays small (5-10K tokens) per the llmstxt.org convention.

### Group C — Audit dashboard rebuild

The existing audit dashboard is the Next.js app at the Vercel deployment. Rebuild it against the new token graph and add three new features:

**1. Mode toggle.** A persistent header control that flips `ModeScope` on the entire dashboard between restrained and expressive. Every page renders correctly in both modes (since every component is mode-agnostic per Phase 2's discipline). The toggle persists in `localStorage`.

**2. Live token introspection.** Add a `/tokens` route. Renders an interactive token explorer:
- Filter by category (color, spacing, typography, etc.)
- Filter by layer (primitive, semantic, mode-specific)
- Click any token → side panel shows: resolved value in both modes, which CSS variable it generates, every component MD that lists it in its `tokens:` frontmatter, every component source file that references its CSS variable
- Search by token name (fuzzy match)
- Copy-to-clipboard for CSS variable name, DTCG path, or resolved value

**3. Component browser improvements.** Add to the existing `/library` route:
- Component cards now show: registry install command (`npx shadcn@latest add @lumen/<name>`), tokens consumed (linked to `/tokens` filter), mode behavior badge (mode-agnostic / restrained-only / expressive-only)
- Filter by tier (1 primitive / 2 composed / 3 signature / 4 freight)
- Filter by SKILL.md NEVER-rule count (sortable — components with many constraints rise to the top of "things to be careful with")

**4. Bonus: prompt-library browser.** Add a `/prompts` route. Renders every gpt-image-2 template with its assembled prompt visible, a "copy prompt to clipboard" button, and the reference asset PNG inline. Lets a Warp engineer browse the seven templates and grab a prompt without opening the MD file.

The existing surface pages (`/foundations`, `/saas`, `/landing`, `/tool`, `/commerce`, `/mobile`, `/desktop`) all stay. They get the mode toggle treatment automatically since every component on them is mode-agnostic.

### Group D — Final CHANGELOG.md entry

Append to `CHANGELOG.md` at repo root:

```markdown
## v0.13.0 — 2026-MM-DD

### Added
- DTCG 2025.10 token graph at `01-tokens/`, build pipeline via Style Dictionary v5
- Five platform artifacts emitted per build: CSS variables, Tailwind preset,
  SwiftUI extensions, Compose Kotlin objects, JSON dump
- Expressive mode primitives: glass.tokens.json, mesh.tokens.json (5 named recipes),
  noise.tokens.json (3 variants), gradient.tokens.json
- `ModeScope` component (`@lumen/mode-scope`) and `data-mode` attribute mechanism
- Component library refactor to shadcn registry under `@lumen/*`:
  - Tier 1 primitives (19 components)
  - Tier 2 composed (15 components)
  - Tier 3 Lumen signatures (3 — Stat, LiveDot, RateTicker)
  - Tier 4 freight-domain composites (10 — LaneCode, LaneArc, ShipmentTimeline,
    RouteMap, DockBay, CrossDockGrid, CarrierBadge, PalletTile, OTRTruckIso,
    QuoteBuilder)
- `registry:base` single-payload install via `@lumen/lumen-base`
- `registry:font` first-class Satoshi delivery via `@lumen/font-satoshi`
- Storybook 10.3 Component Manifests for MCP consumption
- AI-native primitive family mirroring Vercel AI Elements naming verbatim:
  Conversation, Message, Reasoning, Tool, Confirmation, Sources, InlineCitation,
  PromptInput (+ subcomponents), Suggestion, Actions, Artifact, WebPreview,
  Agent, Context, and the full ai-elements set
- Anthropic Citations API JSON shape for citation UI (Citation type verbatim)
- OpenAI ChatKit theme variable mapping (`lumenChatKitTheme` export)
- Freight-native AI patterns: chat-thread, lane-search, shipment-timeline,
  quote-builder, citation-card, agent-approval-flow, command-palette-flow
- Platform translation guides for iOS, Android, macOS, Windows, Shopify, browser
  extension, CLI (Go + Node), MCP host, responsive web
- Reference implementations per platform under `examples/`
- gpt-image-2 prompt library at `05-prompts/`: immovable style anchor + 7
  paste-ready templates + `lumen-prompts` CLI + reference assets
- `AGENTS.md` (root agent context), `CLAUDE.md` (Claude-specific MCP hints),
  `llms.txt` (LLM discoverability index), `llms-full.txt` (flattened full dump)
- shadcn MCP integration documented in AGENTS.md §MCP

### Changed
- Token format from v0.12.4 ad-hoc CSS to DTCG 2025.10 JSON
- Component distribution from manual copy-paste to shadcn registry
- Documentation from human-only to LLM-first (smallest-correct-context layering)

### Preserved (intentionally)
- Every v0.12.4 public token name retains an alias for backward compatibility
- All visual values from foundations page match exactly
- Spring Green #00FA8A single-accent discipline
- Obsidian #0D0D0D canvas
- Satoshi as the only typeface
- 4-pt base / 8-pt soft grid
- WCAG 2.2 AA contrast minimums
- LiveDot, RateTicker, Stat as signature primitives

### Migration
- v0.12.4 consumers update by replacing manual imports with shadcn registry pulls
- v0.12.4 token references (`--lumen-*`) continue to resolve via aliases through
  v1.0; explicit migration to DTCG-generated CSS vars is recommended but not
  required for v0.13.0
```

Fill the date when shipping.

### Group E — Tag and ship

After all verification gates pass:

1. Final commit of the audit dashboard rebuild and CHANGELOG.
2. Merge `v0.13.0` branch back to `main` via PR (with the operator approving the merge).
3. Tag `v0.13.0` at the merge commit.
4. Deploy the audit dashboard to Vercel from `main`.
5. Verify the registry endpoint resolves: `curl https://warp-lumen-design-guidelines.vercel.app/r/registry.json` should return the populated registry JSON.

### Group F — Final llms.txt regeneration

After all phases are committed and dashboards deployed, regenerate `llms.txt` (the indexed version, not `llms-full.txt`) so its component list reflects the final shipped component set. Use `tools/build-llms-txt.ts` with an `--indexed` flag that produces the short version, or write a separate `tools/build-llms-index.ts` if cleaner.

## Decisions you will likely make unilaterally

- Whether to build a custom Lumen MCP server in this phase. Default: **no, skip.** Defer to v0.14 if needed. Shadcn MCP covers v0.13.0.
- Where the `llms-full.txt` lives. Default: repo root, regenerated on every `pnpm run llms`.
- How to handle the audit dashboard's token introspection live-search performance. Default: build an index at build time (`tools/build-token-index.ts` emits a JSON index that the dashboard loads client-side). Avoid runtime parsing of `*.tokens.json` files.
- Whether to ship a CONTRIBUTING.md for the design system. Default: yes, brief — point at AGENTS.md as the authoritative guide for agents and at this Phase 6 setup for humans wanting to contribute.
- Whether to write a v0.13.0 announcement / blog post. Default: out of scope for this phase. Operator handles.

## Verification gates for Phase 6

| Gate | Pass condition |
|---|---|
| Registry endpoint reachable | `curl https://warp-lumen-design-guidelines.vercel.app/r/registry.json` returns 200 with the full Phase 2 registry payload |
| MCP install works | Following the AGENTS.md MCP install instructions in a fresh Claude Code project successfully wires `@lumen` and `/mcp` returns it |
| Single-install E2E | `npx shadcn@latest add @lumen/lumen-base` in a fresh Next.js 15 app installs Lumen and the app renders a sample page with tokens |
| Per-component install E2E | `npx shadcn@latest add @lumen/conversation` in the same app installs Conversation and a chat surface renders |
| `llms-full.txt` exists | Generated, non-empty, contains every MD + token JSON + prompt MD |
| Audit dashboard rebuilt | `/foundations`, `/library`, `/saas`, `/landing`, `/tool`, `/commerce`, `/mobile`, `/desktop`, `/tokens`, `/prompts` all reachable; mode toggle works on every page |
| Token introspection | `/tokens` route shows live filter, search, click-to-detail working |
| Component browser | `/library` shows install commands and token references for every component |
| CHANGELOG complete | v0.13.0 entry covers added, changed, preserved, migration |
| Branch merged | `v0.13.0` branch merged to `main`, tag `v0.13.0` exists, deployment is live |
| Self-critique | All 15 questions in master doc §10.1 answered "no" |

## Stop condition

Phase report into `design-system/06-claude-code-briefings/phase-6-report.md` per master doc §10.3. Final commit message: `feat(lumen): phase 6 — ship v0.13.0`. Tag: `v0.13.0`. **Halt**.

This is the end of the refactor. The next action belongs to the operator: full review of all six phase reports, spot-check of the unilateral decisions logged in each, sign-off on the merge to `main`.

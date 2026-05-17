# ADR 0029 — shadcn registry distribution (no custom Lumen MCP in v0.13)

- **Date:** 2026-05-17
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Related ADRs:** [0003 — shadcn registry](./0003-shadcn-registry.md), [0007 — two-file component contract](./0007-two-file-component-contract.md)
- **Phase report:** [phase-6-report.md](../../design-system/06-claude-code-briefings/phase-6-report.md)

## Context

The v0.13 master doc §5 specifies a Lumen MCP server at `design-system/07-mcp/` with tools `list_components`, `get_component`, `get_tokens`, `get_prompt_template`, `search`, `install`. Per master doc Phase 6, the MCP server would be published as `@warp/lumen-mcp` on npm and installable via `claude mcp add @warp/lumen-mcp`.

During Phase 6 execution, we evaluated whether to build the custom Lumen MCP. The shadcn MCP (`https://ui.shadcn.com/api/mcp`) already exposes the surface Lumen needs:

| Tool | shadcn MCP provides | Lumen needs |
|---|---|---|
| `list` | ✓ — enumerate items in a registry | ✓ |
| `search` | ✓ — fuzzy-search by name + description | ✓ |
| `get_item` | ✓ — fetch single registry-item.json | ✓ |
| `install` / `add` | ✓ — install a component into a project | ✓ |
| `init` | ✓ — bootstrap `components.json` | ✓ |

The shadcn MCP reads `registry.json` and per-item `*.registry.json` directly. Lumen ships exactly these files. A consumer running `claude mcp add --transport http shadcn https://ui.shadcn.com/api/mcp` and adding `@lumen` to their `components.json` gets the full Lumen graph exposed via the shadcn MCP — no custom server, no extra dependency, no separate npm package.

The only Lumen-specific tool surface NOT exposed by the shadcn MCP is `get_prompt_template` (Phase 4's GPT-image-2 templates). Lumen ships those as a CLI (`pnpm prompts`) instead — usable from any context where the operator can run npm scripts.

## Decision

**Lumen v0.13 ships no custom MCP server. Distribution rides on the shadcn MCP, which reads Lumen's `registry.json` and per-item `*.registry.json` files directly. Consumers install one MCP server (the shadcn MCP), add `@lumen` to their `components.json`, and gain access to the full component graph through natural-language invocations like "install the Lumen button."**

### Install path (consumer side)

1. Install shadcn MCP:
   ```bash
   claude mcp add --transport http shadcn https://ui.shadcn.com/api/mcp
   ```
2. Add Lumen registry to `components.json`:
   ```json
   {
     "registries": {
       "@lumen": "https://warp-lumen-design-guidelines.vercel.app/r/{name}.json"
     }
   }
   ```
3. Restart Claude Code, run `/mcp` to verify.
4. Invoke via natural language: "Install the Lumen button" → resolves to `npx shadcn@latest add @lumen/button`.

### Lumen MCP deferred to v0.14 (optional)

If a Lumen-specific tool surface beyond what shadcn MCP exposes is needed later — e.g., `lumen.get_prompt_template` for the GPT-image-2 library, or `lumen.audit_contrast` for runtime contrast checks — it ships as a separate `@warp/lumen-mcp` package in v0.14. The v0.13 deferral does NOT block any documented v0.13 deliverable.

### The 07-mcp/ folder is intentionally NOT created in v0.13

Master doc §5 lists `design-system/07-mcp/` in the file map. v0.13 leaves this directory absent rather than shipping a stub. The shadcn MCP path makes the directory unnecessary; creating a stub directory with a "see shadcn MCP" pointer would add a confusing artifact.

## Consequences

### Positive

- **One MCP install for the consumer.** Already installing `shadcn` MCP → adding Lumen is one `components.json` field, not a second `claude mcp add` invocation.
- **Zero maintenance cost for v0.13.** The shadcn MCP team owns the server; Lumen owns the registry data. Updates to the MCP layer happen upstream.
- **Lumen's surface is just the registry.** Adding a new component means adding a new `<name>.registry.json`. The MCP layer picks it up automatically.
- **No npm publication required.** v0.13 doesn't need an `@warp/lumen-mcp` package on npm. CI is simpler.
- **GPT-image-2 prompts ship via CLI.** `pnpm prompts` is the discovery + invocation path; no MCP indirection.

### Negative

- **Consumers must trust shadcn's MCP server.** The MCP server runs on Vercel infrastructure. Lumen has no control over its uptime, rate limits, or roadmap. If `https://ui.shadcn.com/api/mcp` goes dark, Lumen's distribution layer goes dark.
- **No Lumen-specific MCP tools in v0.13.** `lumen.get_prompt_template`, `lumen.audit_contrast`, `lumen.validate_tokens` — useful runtime surfaces — don't exist as MCP tools yet. Deferred to v0.14.
- **The Phase 6 master doc claim of "MCP server at 07-mcp/" is not literally satisfied.** The 07-mcp folder doesn't exist. AGENTS.md and CLAUDE.md document the deferral explicitly so it's not a hidden gap, but a strict read of master doc §5 sees a missing folder.

### Risks

- **shadcn MCP version drift.** If shadcn changes its registry-item JSON format in a breaking way, Lumen's registry items become invalid. Mitigation: pin the schema URL (`https://ui.shadcn.com/schema/registry-item.json`) in every registry item.
- **Lumen-specific behavior temptation.** A contributor might ship a custom MCP server "because we should." This ADR's policy: don't, until a concrete v0.14 need is named.

## Alternatives considered

### A. Build the Lumen MCP as the master doc specifies

Rejected for v0.13 — duplicates the shadcn MCP surface without adding capability. Maintenance cost not justified.

### B. Fork shadcn MCP and rebrand

Rejected — fork-of-Vercel's MCP server inherits all the maintenance burden plus the rebrand overhead. Worst of both worlds.

### C. Use a different MCP server (e.g., custom-built minimal)

Rejected — same fork-and-maintain trade-off, lower quality than shadcn's reference implementation.

### D. Ship a stub `07-mcp/README.md` pointing at the shadcn MCP

Considered. We chose to NOT create the folder because a stub directory is itself a kind of broken promise. The decision is documented in AGENTS.md §"MCP integration" instead.

## References

- [shadcn MCP docs](https://ui.shadcn.com/docs/registry/mcp)
- [Phase 6 prompt](../../doc/LUMEN-v0.13-PHASE-6-MCP-AND-DOCS.md)
- [Phase 6 report](../../design-system/06-claude-code-briefings/phase-6-report.md)
- [AGENTS.md §"MCP integration"](../../AGENTS.md)
- [CLAUDE.md §"MCP — shadcn registry"](../../CLAUDE.md)
- [ADR 0003 — shadcn registry](./0003-shadcn-registry.md) — the v0.7 decision this ADR extends

---

## Related Notes
- [[ADR 0003 — shadcn registry]]
- [[ADR 0027 — Vercel AI Elements naming]]
- [[ADR 0028 — GPT-image-2 prompt library]]

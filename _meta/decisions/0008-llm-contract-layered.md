# ADR 0008 — Layered LLM contract surfaces

- **Date:** 2026-05-02
- **Status:** Accepted

## Context

Multiple AI coding tools need to consume Lumen rules: Claude Code, Cursor, Codex, GitHub Copilot, Devin, Warp Terminal AI. Each has its own conventions for where rules live (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, etc.). Putting the same rules in five places creates drift; centralizing them in one place means tools that don't read that one place miss the rules.

## Decision

**Layered LLM contract** — each file does one job, with a clear hierarchy:

1. **`/llms.txt`** — root discovery index (per [llmstxt.org](https://llmstxt.org)). The single most important file for LLM-driven discovery.
2. **`/llms-full.txt`** — inlined version of llms.txt for agents that do a single fetch.
3. **`/AGENTS.md`** — universal cross-tool agent rules (per [agents.md](https://agents.md), Linux Foundation Agentic AI Foundation). 25+ tools recognize this in 2026.
4. **`/CLAUDE.md`** — Claude-specific addenda on top of AGENTS.md.
5. **`/.cursor/rules/lumen.mdc`** — Cursor's `.mdc` format. Mirrors AGENTS.md.
6. **`/.warp/lumen.mdc`** — Warp Terminal's format. Mirrors AGENTS.md.
7. **`/.github/copilot-instructions.md`** — GitHub Copilot's discovery file. Mirrors AGENTS.md.

The mirrors at (5)(6)(7) are auto-generated from AGENTS.md by a script (planned: `scripts/sync-agent-rules.mjs`) so they don't drift.

Per-component machine contracts (`02-components/{name}/component.json`) are the data that agents read; the contract files above are the rules for HOW to read them.

## Consequences

**Positive:**
- Every major tool finds its preferred rules file.
- Single source of truth (AGENTS.md) for the rules content.
- llms.txt provides cheap discovery for any agent that does a HEAD-then-GET dance.
- Easy to add another tool's format later without rewriting rules.

**Negative:**
- More files at the repo root. Mitigation: each is named clearly and serves a defined audience.
- Sync script must run on every AGENTS.md edit. Mitigation: CI hook that auto-generates and commits the mirrors.

## References

- [llmstxt.org spec](https://llmstxt.org)
- [agents.md spec](https://agents.md)
- `/research/system-architecture.md` § "LLM contract surfaces"

# ADR 0003 — Distribute via shadcn registry, not npm

- **Date:** 2026-05-02
- **Status:** Accepted
- **Deciders:** Lumen working group

## Context

Lumen components need to be installable in consumer repos. Two distribution models:

1. **Published npm package** — `pnpm add @lumen/ui`. Consumers `import { Button } from '@lumen/ui'`. Updates flow via version bump.
2. **shadcn-style registry** — `npx shadcn@latest add <registry-url>/button`. Consumer's repo gets a copy of the component code. Updates require re-running the command (and accepting the diff).

## Decision

Distribute via **shadcn registry**.

The registry index lives at `/_registry/registry.json`. Per-component sidecars at `/_registry/{name}.json` follow the [shadcn registry-item.json schema](https://ui.shadcn.com/docs/registry/registry-item-json).

In production, this folder is deployed to a CDN so consumers can run:

```bash
npx shadcn@latest add https://cdn.warp.dev/lumen/registry/button.json
```

## Consequences

**Positive:**
- No version-lock pain — consumers own the code in their repo.
- Customizable — teams can modify any component to fit a one-off case without forking.
- AI-native — Cursor, Claude Code, Codex all understand the shadcn pattern in 2026.
- Discoverable via the shadcn MCP server.
- No bundle bloat for consumers (only what they install).
- Easy to evolve — add a new component, regenerate registry, done.

**Negative:**
- Updates don't propagate automatically. Consumers must re-run the install command to pick up improvements. Mitigation: changelog discipline + opt-in update tooling.
- No tree-shaking magic from a published package. Acceptable — copy-paste removes the question entirely.
- Larger surface area for security review (consumer owns the code). Acceptable.

**Tradeoffs not chosen:**
- npm package gives upgrade-via-version-bump but locks consumers to our breaking-change cadence.
- A hybrid (publish primitives, registry for blocks) was considered but adds complexity without clear win.

## References

- [shadcn registry](https://ui.shadcn.com/docs/registry)
- [shadcn MCP Server](https://ui.shadcn.com/docs/mcp)
- `/_registry/registry.json` — Lumen's registry index
- `/research/system-architecture.md` — full evaluation

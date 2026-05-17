# ADR 0026 — Phase 0 alias namespace (additive)

- **Date:** 2026-05-16
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Related rules:** [AGENTS.md hard rule 18](../../AGENTS.md)
- **Related ADRs:** [0023 — DTCG 2025.10 lift](./0023-dtcg-2025-10-lift-v013.md), [0001 — DTCG format](./0001-dtcg-format.md)

## Context

The v0.13 master refactor briefing (`doc/LUMEN-v0.13-MASTER-REFACTOR.md`) standardized token names against the foundations-page vocabulary: `color.obsidian.*`, `color.spring.*`, `color.lumen-red.*`, `color.lumen-amber.*`. v0.12.6 shipped the same colors under different names: `color.brand.*` (obsidian stops), `color.accent.*` (spring stops), `color.status.danger.*` (lumen-red), `color.status.warning.*` (lumen-amber).

Two paths existed:

1. **Rename in place.** Update every v0.12.6 path to the master-doc name, update every downstream consumer (audit-dashboard, examples/, _registry sidecars, internal Warp products).
2. **Add aliases.** Keep v0.12.6 paths verbatim. Add the master-doc-named paths as DTCG aliases that resolve to the same primitive values. Both namespaces ship.

Option 1 is a breaking change with consumer churn proportional to install base. Option 2 lets v0.13 ship the new vocabulary without breaking any existing path — but doubles the surface area.

The master doc §6 hard rule "Do not delete v0.12.4 token names without an alias" already commits us to additive behavior. This ADR formalizes the alias namespace as a first-class architectural decision rather than a one-time migration tactic.

## Decision

**The Phase 0 alias namespace is first-class but additive. Both v0.12.6 names and the master-doc names ship simultaneously, resolve to the same primitive values, and are equally valid for new code. v0.12.6 token names are NOT deprecated — they are preserved alongside the master-doc names through every v0.13.x release. Breaking changes belong in v1.0, not v0.13.**

### Specific commitments (verbatim from AGENTS.md hard rule 18)

- `color.obsidian.*` aliases `color.brand.*`.
- `color.spring.*` aliases `color.accent.*`.
- `color.lumen-red.*` aliases `color.status.danger.*`.
- `color.lumen-amber.*` aliases `color.status.warning.*`.
- Both namespaces ship; both resolve to the same primitive values.
- New code may use either; existing v0.12.6 code paths are preserved verbatim.
- Do NOT remove a v0.12.6 token name without an alias — breaking changes belong in v1.0, not v0.13.

### Why "first-class" matters

The aliases are NOT deprecation markers. A contributor reading `color.brand.800` and a contributor reading `color.obsidian.800` are both writing correct, idiomatic Lumen v0.13 code. The audit-dashboard tooling lists both forms; the lint chain validates both forms; the LLM contract surfaces both forms. Neither is a "legacy" form.

The decision to ship both indefinitely (vs. soft-deprecating one) prevents the common design-system failure where the "modern" form gets fork-favored mind-share while the "legacy" form ends up scattered across years of half-migrated code. Both names are sanctioned; both names will continue to be sanctioned.

### What happens at v1.0

The v1.0 release is the only milestone where a breaking change can remove an alias. Whether to remove the v0.12.6 names at v1.0 is a separate decision deferred to that release's ADR.

## Consequences

### Positive

- **Zero consumer churn for v0.13.** Every internal Warp product consuming `color.brand.800` continues to work without modification.
- **Documentation can use either name.** Master doc uses `color.spring.500`; v0.12.6 ADRs use `color.accent.500`. Both are correct.
- **Audit-dashboard surfaces both.** The token-index lists both forms with cross-references.
- **`scripts/validate-tokens.mjs` accepts both.** Aliases resolve to the same primitive; either path produces the same CSS variable output.

### Negative

- **Doubled token-graph surface area.** 1177 declared tokens currently; ~120 of those are pure aliases that exist only for the namespace.
- **Two ways to do the same thing.** A contributor must understand that `color.brand.800` and `color.obsidian.800` are the same value. The `$description` on the alias documents the equivalence.
- **`llms-full.txt` and AGENTS.md surface area grow.** Both namespaces appear in the LLM contract; an AI agent may use either when generating code.

### Risks

- **Drift between the two names.** If a future contributor edits the brand-namespace value without updating the obsidian-namespace alias (or vice versa), the two names silently diverge. `scripts/validate-tokens.mjs` validates alias resolution; if drift produces an unresolvable alias, validation fails. But if drift produces a valid-but-different value, the validator does not catch it. Mitigation: alias edits must be reviewed against the corresponding primitive.

## Alternatives considered

### A. Rename in place (no aliases)

Rejected — breaking change for every v0.12.6 consumer, including audit-dashboard, examples/, _registry sidecars, and internal Warp products that link Lumen. The cost is unbounded.

### B. Aliases as deprecation markers

Rejected — communicates "the v0.12.6 form is going away" without a concrete v1.0 commitment. Creates premature urgency.

### C. Only alias the loud-name primitives (color.brand, color.accent), not the status namespaces

Rejected — partial coverage is worse than full coverage. Either both forms are first-class or only one is.

## References

- [AGENTS.md §"Hard rules" 18](../../AGENTS.md)
- [doc/LUMEN-v0.13-MASTER-REFACTOR.md §6](../../doc/LUMEN-v0.13-MASTER-REFACTOR.md)
- [Phase 0 report §"Phase 0 alias namespace"](../../design-system/06-claude-code-briefings/phase-0-report.md)
- [01-tokens/primitives/color.tokens.json](../../design-system/01-tokens/primitives/color.tokens.json) — where both namespaces live

---

## Related Notes
- [[ADR 0023 — DTCG 2025.10 lift]]
- [[ADR 0024 — Dual-mode architecture]]
- [[ADR 0027 — Vercel AI Elements naming]]

# ADR 0001 — Use DTCG JSON as the token source format

- **Date:** 2026-05-02
- **Status:** Accepted
- **Deciders:** Lumen working group

## Context

Lumen needs a canonical source-of-truth format for its design tokens that:
- Is editable by both designers (via Tokens Studio in Figma) and engineers (in the repo).
- Compiles to every consumer platform we care about (CSS, Tailwind, Swift, Compose, Liquid, etc.).
- Is well-supported by 2026's tooling without lock-in to one vendor.
- Is human-readable enough that LLMs and humans can both parse it.

Candidate formats considered:
- **DTCG JSON** (W3C Design Tokens Community Group, format module 2025.10).
- Custom JSON (designed for Lumen).
- YAML (DESIGN.md by Google Stitch — March 2026).
- TypeScript constants as source.

## Decision

Use **DTCG JSON** as the canonical source.

Source files use `.tokens.json` extension and the `application/design-tokens+json` MIME type. Format follows the 2025.10 spec: every token is `$value` + `$type`, with optional `$description`, `$deprecated`, `$extensions`. References use curly-brace dot-paths (`{color.brand.500}`).

## Consequences

**Positive:**
- Style Dictionary v5 has first-class DTCG support already wired up (no custom adapters).
- Tokens Studio in Figma ingests/exports DTCG natively, enabling round-trip with designers.
- Future tooling (validators, MCP servers, Figma variables sync) is converging on DTCG.
- Avoids inventing a custom format that becomes a rewrite waiting to happen.

**Negative:**
- DTCG 2025.10 is still a draft (preview). Spec may change in non-backward-compatible ways before 1.0. Mitigation: pin the version in our schema reference.
- Slightly more verbose than custom shorthand JSON. Acceptable for source-of-truth.

**Tradeoffs not chosen:**
- Custom JSON would have been easier to start but isolates us from the ecosystem.
- YAML / DESIGN.md is elegant for foundations but scales poorly for full component schemas.
- TS constants couple tokens to the JS ecosystem and don't translate to non-JS platforms cleanly.

## References

- [DTCG Format Module 2025.10](https://www.designtokens.org/tr/drafts/format/)
- [Tokens Studio for Figma](https://tokens.studio/)
- [Style Dictionary v5 release notes](https://github.com/style-dictionary/style-dictionary/releases)
- `/research/system-architecture.md` — full evaluation

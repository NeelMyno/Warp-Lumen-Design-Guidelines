# ADR 0007 — Each component ships md + json sidecar

- **Date:** 2026-05-02
- **Status:** Accepted

## Context

Lumen components need to be documented for both humans (designers, engineers reading docs) and LLM agents (Cursor, Claude Code, Codex). Two formats are at play:

- **Markdown** — what LLMs train on most fluently. Best for prose, examples, narrative.
- **JSON** — best for structured data (props, enums, a11y rules). Unambiguous keys.

A single combined format (DESIGN.md, YAML+prose) is elegant for foundations but scales poorly for components with deep prop schemas.

## Decision

**Each component ships TWO files**, both required, both in `02-components/{name}/`:

- `component.md` — human spec. Frontmatter + canonical sections (When to use, When NOT to use, Anatomy, Variants, States, Accessibility, Do, Don't, Code, Changelog).
- `component.json` — machine contract. Validates against `_schema/component.schema.json`. Carries props schema, token consumption list, a11y rules, do/don't, code paths.

CI verifies they stay in sync (frontmatter `name`/`version`/`deprecated` must agree).

## Consequences

**Positive:**
- LLMs can read JSON for ~80% fewer tokens than equivalent prose (Diana Wolosin / Indeed benchmark).
- Humans get canonical-order Markdown that's easy to scan.
- Schema catches missing fields at lint time, not at runtime.
- Token consumption tracking enables impact analysis (changing a token shows which components rebuild).

**Negative:**
- Two files to maintain per component. Mitigation: CI sync check + a `pnpm new-component` scaffold.
- Slight duplication between the prose's "Variants" section and the JSON's `props`. Acceptable — different audiences need different surfaces of the same data.

## References

- `/design-system/02-components/_schema/component.schema.json`
- `/design-system/02-components/README.md`
- `/research/system-architecture.md` § "Two-track docs per component"

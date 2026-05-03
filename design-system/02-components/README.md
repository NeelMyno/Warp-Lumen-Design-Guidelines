# Components — Lumen

> Each component lives in `./{name}/` and contains BOTH `component.md` (human spec) AND `component.json` (machine contract). Both must stay in sync — CI verifies. The JSON validates against `_schema/component.schema.json`.

## Why two files?

Markdown is what LLMs train on most fluently for prose. JSON is unambiguous for structured data (props, enums, a11y rules). Empirically (Diana Wolosin / Indeed, 2026), JSON metadata cuts agent token consumption ~80% vs. Markdown. So:

- **`component.md`** carries prose, anatomy, do/don't, examples, narrative.
- **`component.json`** carries the contract: props schema, token consumption, a11y rules, code paths.

When an LLM is asked to use a component, it should read the JSON first.

## Canonical section order in component.md

Every component.md MUST use this section order. LLMs and humans both rely on it.

1. Title (h1) + summary line
2. When to use
3. When NOT to use
4. Anatomy
5. Variants
6. States
7. Accessibility
8. Do
9. Don't
10. Code (links to platform examples)
11. Changelog

## Components shipped in v0.1 (audit baseline)

| Name | Status | Audit dashboard usage |
|---|---|---|
| [Button](./button/component.md) | stable | All pages |
| [Input](./input/component.md) | stable | Tool, SaaS |
| [Card](./card/component.md) | stable | All pages |
| [Badge](./badge/component.md) | stable | Foundations, SaaS, Mobile |
| [Stat](./stat/component.md) | stable · Warp signature | Foundations, SaaS, Landing, Mobile, Desktop |
| [LiveDot](./live-dot/component.md) | stable · Warp signature | Foundations, SaaS, Landing, Mobile, Desktop |
| [RateTicker](./rate-ticker/component.md) | stable · Warp signature | Foundations, Landing |
| [Table](./table/component.md) | stable | SaaS |
| [Dialog](./dialog/component.md) | beta | (specced; no audit usage yet) |
| [Toast](./toast/component.md) | beta | (specced; no audit usage yet) |
| [EmptyState](./empty-state/component.md) | stable | SaaS |
| [Toggle](./toggle/component.md) | stable | Tool |

## Adding a new component

1. Create `./{name}/component.md` and `./{name}/component.json`.
2. JSON must validate against `_schema/component.schema.json`. Run `pnpm validate:components`.
3. Add at least one example file under `./{name}/examples/`.
4. Add an entry to `_registry/registry.json` and a `_registry/{name}.json` sidecar.
5. Add a CHANGELOG entry under `[Unreleased] -> Added`.

## Validation

```bash
pnpm validate:components   # JSON schema check on every component.json
pnpm validate:tokens       # Tokens consumed by components must exist
pnpm validate:a11y         # axe-core + wcag-contrast pass on rendered stories
pnpm validate:sync         # md + json frontmatter agree on name, version, deprecated
```

A failing check blocks merge.

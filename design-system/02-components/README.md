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

## Components shipped (v0.1 → v0.7)

The current contract surface — 30 components across three rebuild waves. Every contract ships `component.md` + `component.json` and references at least one `web-react` example (either via `examples/web-react.tsx` or via the audit-dashboard reference implementation).

### v0.1 baseline (12)

| Name | Status | Audit dashboard usage |
|---|---|---|
| [Button](./button/component.md) | stable | All pages |
| [Input](./input/component.md) | stable · v0.6 rewrite | All forms |
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

### v0.6 forms layer (8)

The single-shell forms architecture. See [foundations/forms-and-inputs.md](../00-foundations/forms-and-inputs.md) and [ADR 0011](../../_meta/decisions/0011-forms-and-inputs-v06.md).

| Name | Status | Audit dashboard usage |
|---|---|---|
| [Field](./field/component.md) | stable · composition wrapper | Foundations, Tool, SaaS, Library |
| [Form](./form/component.md) | stable · semantic wrapper | Tool, SaaS |
| [Textarea](./textarea/component.md) | stable | Foundations, Library |
| [Select](./select/component.md) | stable | Tool, SaaS, Library |
| [Checkbox](./checkbox/component.md) | stable | Foundations, Library |
| [RadioGroup](./radio-group/component.md) | stable | Foundations, Library |
| [Switch](./switch/component.md) | stable | Foundations, Library |
| [ValidationMessage](./validation-message/component.md) | stable | (Form-level summary) |

### v0.7 deferred-form completion (10)

Specialized form controls promoted from `audit-dashboard/src/components/primitives/inputs.tsx` to dedicated contracts. All adopt the v0.6 `.lumen-field` shell. See [ADR 0012](../../_meta/decisions/0012-distribution-surface-fix-v07.md).

| Name | Status | Audit dashboard usage |
|---|---|---|
| [Combobox](./combobox/component.md) | beta | Library |
| [NumberInput](./number-input/component.md) | beta | Tool, Library |
| [PasswordInput](./password-input/component.md) | beta | Library |
| [OtpInput](./otp-input/component.md) | beta | Library |
| [TagsInput](./tags-input/component.md) | beta | Library |
| [DatePicker](./date-picker/component.md) | beta | Library |
| [TimePicker](./time-picker/component.md) | beta | Library |
| [Segmented](./segmented/component.md) | beta | Library |
| [RangeSlider](./range-slider/component.md) | beta | Library |
| [FileDropzone](./file-dropzone/component.md) | beta | Library |

## Adding a new component

Follow [`_meta/prompts/new-component.md`](../../_meta/prompts/new-component.md) — the canonical scaffolding fragment. In short:

1. Create `./{name}/component.md` and `./{name}/component.json`.
2. JSON must validate against `_schema/component.schema.json`. Run `pnpm validate:components`.
3. Add `./{name}/examples/web-react.tsx` (copy-paste-ready, semantic-token-only).
4. Add an entry to `_registry/registry.json` and a `_registry/{name}.json` sidecar.
5. Add a CHANGELOG entry under `[Unreleased] → Added`.

## Validation

```bash
pnpm validate              # tokens (strict) + components (schema) + contrast (WCAG AA)
pnpm validate:components   # JSON schema check on every component.json
pnpm validate:tokens       # Strict — every tokens.consumed reference must resolve
pnpm validate:contrast     # WCAG AA contrast pairs across light + dark
pnpm lint                  # 3-stage: no-primitives + no-arbitrary-typography + no-arbitrary-form-values
```

A failing check blocks merge.

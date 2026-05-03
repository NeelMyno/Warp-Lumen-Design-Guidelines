# Architecture Decision Records (ADRs)

> Each significant architectural / design decision in Lumen has an ADR. ADRs are immutable once accepted; if a decision is reversed, file a new ADR that supersedes it. Format: [Michael Nygard's ADR template](https://github.com/joelparkerhenderson/architecture-decision-record/blob/main/locales/en/templates/decision-record-template-by-michael-nygard/index.md).

## Index

| # | Title | Status |
|---|---|---|
| [0001](./0001-dtcg-format.md) | Use DTCG JSON as the token source format | Accepted |
| [0002](./0002-style-dictionary.md) | Use Style Dictionary v5 as the build pipeline | Accepted |
| [0003](./0003-shadcn-registry.md) | Distribute via shadcn registry, not npm | Accepted |
| [0004](./0004-quiet-industrial-mood.md) | Default mood: Quiet Industrial | Accepted |
| [0005](./0005-warp-green-as-only-accent.md) | Warp lime green is the system's only loud accent | Accepted |
| [0006](./0006-satoshi-jetbrains-pairing.md) | Pair Satoshi with JetBrains Mono | Accepted |
| [0007](./0007-two-file-component-contract.md) | Each component ships md + json sidecar | Accepted |
| [0008](./0008-llm-contract-layered.md) | Layered LLM contract (llms.txt → AGENTS.md → CLAUDE.md → tool-specific) | Accepted |
| [0009](./0009-versioning-semver-system-wide.md) | Single semver for the whole system, not per-component | Accepted |

## Adding a new ADR

1. Copy the template (or use ADR 0001 as a starting point).
2. Number sequentially (`0010-...`).
3. Use a slug that names the decision, not the question.
4. Status starts as `Proposed`. Move to `Accepted` after PR merge.
5. If superseding, set status to `Superseded by [0XXX]` on the old ADR.

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
| [0006](./0006-satoshi-jetbrains-pairing.md) | Pair Satoshi with JetBrains Mono | Superseded by [0017](./0017-satoshi-only-typography-v010.md) |
| [0007](./0007-two-file-component-contract.md) | Each component ships md + json sidecar | Accepted |
| [0008](./0008-llm-contract-layered.md) | Layered LLM contract (llms.txt → AGENTS.md → CLAUDE.md → tool-specific) | Accepted |
| [0009](./0009-versioning-semver-system-wide.md) | Single semver for the whole system, not per-component | Accepted |
| [0010](./0010-typography-v05.md) | Typography v0.5 system upgrade | Accepted (partially amended by [0017](./0017-satoshi-only-typography-v010.md)) |
| [0011](./0011-forms-and-inputs-v06.md) | Forms & inputs v0.6 — single-shell single-focus-surface | Accepted |
| [0012](./0012-distribution-surface-v07.md) | Distribution surface v0.7 | Accepted |
| [0013](./0013-form-rhf-binding-v07.md) | Form RHF binding v0.7 | Accepted |
| [0014](./0014-spacing-rebuild-v08.md) | Spacing rebuild v0.8 | Accepted |
| [0015](./0015-shadcn-token-bridge-direct-refs-v081.md) | shadcn token-bridge direct refs (v0.8.1) | Accepted |
| [0016](./0016-button-rebuild-v09.md) | Button rebuild v0.9 | Accepted |
| [0017](./0017-satoshi-only-typography-v010.md) | Satoshi-only typography (v0.10) — single-typeface system | Accepted |
| [0018](./0018-premium-psychology-recolor.md) | v0.11 Premium Psychology recolor — Spring Green + Obsidian Mint | Accepted (canvas portion amended by [0020](./0020-obsidian-recolor-mint-retired-v012.md); single-accent / hierarchy / first-impression / micro-interactions sections preserved verbatim) |
| [0019](./0019-sparkline-fluid-and-stat-grid-divider-v01117.md) | Sparkline fluid SVG + StatGrid divider symmetry (v0.11.17) | Accepted |
| [0020](./0020-obsidian-recolor-mint-retired-v012.md) | v0.12 Obsidian recolor — mint retired (neutral `#0D0D0D` canvas) | Accepted (amends [0018](./0018-premium-psychology-recolor.md)'s canvas anchor) |
| [0021](./0021-card-corner-clip-contract-v0121.md) | v0.12.1 Card corner-clip contract — `padding="none"` auto-clips edge-touching children to the rounded shape | Accepted |
| [0022](./0022-hover-glow-ladder-retune-v0122.md) | v0.12.2 Hover-glow ladder retune — primary-button hover bloom dialed down at the token + layered-halo level | Accepted |

## Adding a new ADR

1. Copy the template (or use ADR 0001 as a starting point).
2. Number sequentially (`0010-...`).
3. Use a slug that names the decision, not the question.
4. Status starts as `Proposed`. Move to `Accepted` after PR merge.
5. If superseding, set status to `Superseded by [0XXX]` on the old ADR.

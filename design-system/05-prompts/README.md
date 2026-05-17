---
name: Prompt Library README
type: index
version: 0.13.0
last_updated: 2026-05-17
audience: [llm-agent, designer, engineer]
related:
  - ./style-anchor.md
  - ../../tools/lumen-prompts/README.md
  - ../../examples/gpt-image-2/README.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Prompt library — Lumen v0.13

The paste-ready prompt system for generating Lumen-branded imagery via **gpt-image-2** (snapshot `gpt-image-2-2026-04-21`). One immovable style anchor + seven per-asset templates + a CLI that assembles them on demand + a reference asset set the team diffs against on every re-baseline.

This library lands in Phase 4 per [doc/LUMEN-v0.13-MASTER-REFACTOR.md](../../doc/LUMEN-v0.13-MASTER-REFACTOR.md) §7.Phase-4. The style anchor is the verbatim content from master doc §9.

---

## Quick start

```bash
# Print a fully-assembled prompt to stdout
pnpm prompts hero-background --subject "route arc over a dim freight lane map"

# Pipe to clipboard (macOS) and paste into ChatGPT
pnpm prompts mesh --subject "aurora-spring" | pbcopy

# Operator-side: materialize all reference PNGs
export OPENAI_API_KEY="sk-…"
pnpm prompts:generate-references
```

---

## The eight files

| File | Role |
|---|---|
| [`style-anchor.md`](./style-anchor.md) | **IMMUTABLE.** The master prompt every template `@import`s. Defines model, scene, details, constraints, style references, deviation rules. Verbatim from master doc §9. |
| [`hero-background.md`](./hero-background.md) | Landing-page hero backgrounds. 16:9, 2560×1440, expressive mode. |
| [`abstract-shape.md`](./abstract-shape.md) | Empty-state covers, secondary heroes, loading screens. 1:1, 1600×1600, restrained mode. |
| [`illustration.md`](./illustration.md) | Onboarding step illustrations, feature heroes, narrative covers. 1:1 or 16:9, expressive mode. |
| [`pattern.md`](./pattern.md) | Seamless tile patterns for background chrome. 1:1, 512×512, restrained mode. |
| [`mesh.md`](./mesh.md) | Mesh-recipe visual references for the five Phase 1 recipes. 16:9, 2560×1440 (or 4K), expressive mode. |
| [`empty-state.md`](./empty-state.md) | Dashboard empty states. 1:1 or 4:3, 1024×1024 or 800×600, restrained mode, **anticipatory** (never melancholy). |
| [`marketing-card.md`](./marketing-card.md) | OG cards, social shares, blog heroes, landing-page feature blocks. 1.91:1 or 16:9, expressive mode, higher UI density. |

---

## How the style anchor + templates compose

Every template MD opens with the directive:

```markdown
@import ./style-anchor.md
```

The `lumen-prompts` CLI replaces this directive with the anchor body at assembly time. The result is a single self-contained prompt the model receives — no client-side `@import` machinery needed on the consumer side.

```
┌─ template (e.g., hero-background.md) ─────────────┐
│  # Hero background — Lumen v0.13                  │
│  @import ./style-anchor.md  ←────────────────┐    │
│  ## Model pin                                │    │
│  ## Subject  [FILL THIS SLOT...]   ←─ filled by   │
│  ## Composition override              CLI's       │
│  ## Use case override                 --subject   │
│  ## Mode                                          │
│  ## Template-specific constraints                 │
└───────────────────────────────────────────────────┘
                                              │
        ┌─ style-anchor.md (immutable) ──────┘
        │  ## Model + parameters
        │  ## Scene
        │  ## Subject  [FILL THIS SLOT]   ←─ also filled
        │  ## Details                       by CLI
        │  ## Use case [FILL THIS SLOT]   ←─ also filled
        │  ## Constraints
        │  ## Style references
        │  ## When to deviate
        └────────────────────────────────────
```

The `[FILL THIS SLOT]` markers in BOTH the anchor and the template get filled with the same `--subject` text. The template's `## Use case override` block (which carries richer per-template content) is the canonical use case the model reads.

---

## Immutability of the style anchor

The style anchor is **immutable**. Modifying it causes silent visual drift across every asset Lumen ships. If a change is genuinely required:

1. Do NOT edit `style-anchor.md` in place.
2. Create `style-anchor.v2.md` with the new content.
3. Update every template's `@import` directive to point at the v2.
4. Update the CLI to default to v2.
5. Regenerate the entire reference set under `examples/gpt-image-2/`.
6. Ship as a versioned bump in CHANGELOG (this is a v0.14 or v1.0 event, not a patch).

The warning callout at the top of `style-anchor.md` says this. Treat it as a hard rule.

---

## Snapshot pin policy

Every template references the model snapshot `gpt-image-2-2026-04-21` explicitly. The CLI never overrides this; the anchor never lifts it. Per master doc §11:

> **gpt-image-2 is a moving target.** The model alias `gpt-image-2` may roll forward to a new snapshot silently. Pin every prompt to `gpt-image-2-2026-04-21` until we re-baseline outputs against a newer snapshot.

If the pinned snapshot is deprecated or replaced:

1. Test the new snapshot against the canonical subjects (run `pnpm prompts:generate-references` with the new pin temporarily).
2. Diff the new PNGs against the prior baselines visually.
3. If acceptable, update the pin in master doc §9, in `style-anchor.md`, and in every template MD (search-and-replace `gpt-image-2-2026-04-21` → new snapshot).
4. Regenerate the full reference set as a single PR.

---

## Reference assets

[`examples/gpt-image-2/`](../../examples/gpt-image-2/) holds the canonical PNG outputs (operator-materialized; not in repo until a generation pass commits them). Each template subdirectory ships a `canonical-subject.md` manifest naming the exact subject + parameters used to generate the reference.

When a regenerated PNG visibly differs from the prior baseline for the same subject + snapshot pin, that is the **drift signal** — investigate and either accept (re-baseline) or reject (rollback the change that caused the drift).

---

## CLI summary

```
Usage: pnpm prompts <template> --subject "..." [flags]

Templates:
  hero-background | abstract-shape | illustration | pattern |
  mesh | empty-state | marketing-card

Flags:
  --subject <text>     Required.
  --composition <text> Optional composition override.
  --mode <text>        Optional mode override (restrained | expressive).
  --snapshot           Emit a date-stamped header for archival diffing.
  --help, -h           Print usage.
```

Full CLI docs: [`tools/lumen-prompts/README.md`](../../tools/lumen-prompts/README.md).

---

## What Lumen does NOT generate via gpt-image-2

- **Icons.** Hand-drawn vector at 1.5px stroke. The CLI rejects `icon`, `icons`, `iconography`, `glyph`, `symbol` as templates. See master doc §3 "Imagery."
- **Logos.** Lumen's wordmark and supporting marks are hand-built. gpt-image-2 never generates them.
- **Real customer data.** Synthetic IDs and codes only (`WRP-9824`, `$84/pallet`). Never reference an actual customer, carrier, or lane.
- **Brand marks for partners.** Even when illustrating "carrier network density," the nodes are unlabeled.

These are hard rules. The CLI enforces icon rejection; the templates document the rest as constraints + failure modes.

---

## Style anchor inspiration

The style anchor calibrates against five visual references (named in `style-anchor.md` §"Style references"):

- **RonDesignLab** dark-mission-control set — "Navy Mobile – Truck Management Dashboard," "BizSpeed TMS – Logistics Web Dashboard," "SpaceX App – Space Mission Control"
- **Linear's** blueprint-grid + calmer-interface aesthetic
- **Vercel Geist's** restrained dark palette

These references are loaded into the anchor's calibration but never named in the prompt itself (the model would over-fit to literal SpaceX imagery). See [`00-foundations/inspirations.md`](../00-foundations/inspirations.md) §6 "Image generation" for full provenance.

---

## Related

- [`tools/lumen-prompts/`](../../tools/lumen-prompts/) — the CLI + reference generator
- [`examples/gpt-image-2/`](../../examples/gpt-image-2/) — canonical subjects + reference PNGs
- [`00-foundations/inspirations.md`](../00-foundations/inspirations.md) — visual references the anchor calibrates against
- [`00-foundations/voice-and-tone.md`](../00-foundations/voice-and-tone.md) — copy pairings (especially for `empty-state.md`)
- [`01-tokens/primitives/mesh.tokens.json`](../01-tokens/primitives/mesh.tokens.json) — mesh recipe slot source (Phase 1)
- [`doc/LUMEN-v0.13-MASTER-REFACTOR.md`](../../doc/LUMEN-v0.13-MASTER-REFACTOR.md) §7 Phase 4, §9 style anchor, §11 drift rationale

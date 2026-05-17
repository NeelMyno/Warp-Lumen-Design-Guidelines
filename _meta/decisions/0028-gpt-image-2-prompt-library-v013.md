# ADR 0028 — GPT-image-2 prompt library + immutable style anchor

- **Date:** 2026-05-17
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Foundation MD:** [05-prompts/style-anchor.md](../../design-system/05-prompts/style-anchor.md)
- **Phase report:** [phase-4-report.md](../../design-system/06-claude-code-briefings/phase-4-report.md)

## Context

OpenAI's GPT-image-2 (snapshot `gpt-image-2-2026-04-21`) ships 99% text-rendering accuracy, native 4K output, and "thinking mode" for cross-frame consistency. The release made AI-generated imagery a viable asset pipeline for design systems: heroes, illustrations, abstract shapes, mesh backgrounds, pattern fields.

Lumen's pre-v0.13 imagery story was inconsistent:
- Heroes were hand-painted in Figma, exported to PNG, and committed to `public/`.
- Empty-state illustrations were sourced from Streamline (paid library), edited per use case, and committed.
- Mesh backgrounds were hard-coded CSS gradients with no shared spec.
- Marketing-card images were one-off per campaign, with drift across Warp products.

Each path required a human designer in the loop. Each path produced inconsistent results. Each path made it impossible for an engineer to ship an on-brand asset without going through design.

The opportunity: a paste-ready prompt library that lets any engineer at Warp run a single command and get an on-brand image asset. The risk: AI image generators drift across snapshots; without a pin and a shared style anchor, two engineers running "the same prompt" produce visually inconsistent output.

## Decision

**Ship a paste-ready prompt library under `design-system/05-prompts/` with one immovable style anchor and per-asset-type templates. Pin GPT-image-2 to snapshot `gpt-image-2-2026-04-21` in every prompt. Provide a CLI (`pnpm prompts <template> --subject "..."`) that assembles the full prompt string for paste-into-ChatGPT use.**

### The style anchor is immutable

`design-system/05-prompts/style-anchor.md` contains the verbatim master-doc §9 content. It declares:
- Model: gpt-image-2 (snapshot `gpt-image-2-2026-04-21`)
- Quality: high
- Mode: thinking ON for hero / multi-frame; OFF for single backgrounds
- Aspect: 16:9 default; 2560×1440 hero, 1600×1600 square, 1024×1024 empty-state
- Scene: dark obsidian canvas, subtle radial teal + spring atmosphere at 8-12%, volumetric fog, 8% film grain, instrument-panel mood
- Details: hairline 1px white at 6%, frosted-glass surfaces, geometric sans-serif type if any, single Spring Green accent on focal element only
- Constraints: no photoreal humans, no logos, no neon glow beyond spring accent, no stock-photo aesthetic

The file ships with a `> [!warning] **DO NOT EDIT.**` header. Modifications cause silent drift across every template that `@import`s it. If a change is genuinely required, version-bump to `style-anchor.v2.md` and migrate consumers explicitly.

### Seven per-asset templates

Each template under `05-prompts/` opens with `@import ./style-anchor.md` and fills the `Subject` and `Use case` slots from the anchor with template-specific content:

| Template | Asset type | Aspect | Resolution |
|---|---|---|---|
| `hero-background.md` | Landing-page hero background | 16:9 | 2560×1440 |
| `abstract-shape.md` | Empty-state / loading / secondary hero | 1:1 | 1600×1600 |
| `illustration.md` | Onboarding step | 4:3 | 2048×1536 |
| `pattern.md` | Repeating pattern field | 1:1 | 2048×2048 |
| `mesh.md` | 5 named mesh recipes (aurora-spring, aurora-cool, dock-bay, lane-arc, cross-dock) | 16:9 | 2560×1440 |
| `empty-state.md` | Empty-state illustration | 1:1 | 1024×1024 |
| `marketing-card.md` | Marketing card / social image | 1.91:1 | 1600×836 |

### Snapshot pin is mandatory

Every prompt — anchor + 7 templates — pins `gpt-image-2-2026-04-21`. The `tools/lumen-prompts` CLI rejects (exit code 3) any attempt to generate an icon prompt; icons stay vector hand-drawn per AGENTS.md hard rule 7's "do not generate Lumen icons via gpt-image-2."

### Reference assets are operator-side

The CLI ships canonical-subject manifests at `examples/gpt-image-2/`. Actual PNG materialization requires `OPENAI_API_KEY` — operator-side, not committable from the SDK environment.

## Consequences

### Positive

- **Engineers ship on-brand imagery without design in the loop.** `pnpm prompts hero-background --subject "route arc over a dim freight lane map"` produces a paste-ready prompt; ChatGPT produces the asset.
- **Drift is bounded.** Two engineers running the same template + subject produce visually consistent output because the anchor is shared and the model is pinned.
- **The style anchor is the SSOT.** Brand voice changes happen in one file; every template inherits.
- **The CLI is paste-friendly.** Output goes to stdout, ready for pasting into the gpt-image-2 endpoint or ChatGPT's image surface.

### Negative

- **Cost.** Each gpt-image-2 invocation at `quality: high` costs ~$0.05–0.20 depending on aspect. Production asset generation can run to hundreds of dollars per campaign.
- **API-key gating.** The reference-PNG materialization requires `OPENAI_API_KEY`, which lives in the operator's environment (not committable). Lumen-CI cannot regenerate reference assets unattended.
- **OpenAI model rollover.** Pinning to `gpt-image-2-2026-04-21` means if OpenAI rolls forward the alias to `gpt-image-2-2027-01` with materially different output, our reference assets need re-baselining. We re-evaluate the pin annually.

### Risks

- **Style anchor drift via well-meaning edits.** A contributor "polishing" the anchor's prose introduces silent drift across every template. Mitigation: `> [!warning] DO NOT EDIT.` header + version-bump protocol.
- **Icons-via-AI temptation.** A contributor might bypass the CLI exit-3 rejection by hand-running the prompts. AGENTS.md hard rule 7 is the policy backstop.
- **Subject slot abuse.** A subject like "anime girl, neon background, 4k" would override the anchor's brand voice. The anchor's "no photoreal humans, no neon glow beyond spring accent" lines mitigate but don't prevent. Code review catches.

## Alternatives considered

### A. Per-asset hand-painted in Figma + commit PNG

Rejected — slow, requires design every time, no consistency across iterations.

### B. Stock photo library subscription (Unsplash / Pexels / Streamline)

Rejected — generic, drifts in style, requires curation per use case, costs scale with team size.

### C. Custom Lumen image generator (fine-tuned model)

Rejected for v0.13 — building and maintaining a fine-tuned model is a separate project. v1.0 or beyond.

### D. AI generator without a pinned snapshot

Rejected — produces silent drift across model rollovers.

## References

- [GPT-image-2 model card](https://openai.com/index/introducing-gpt-image-2/) — pricing, capabilities, snapshot policy
- [05-prompts/style-anchor.md](../../design-system/05-prompts/style-anchor.md) — the immovable anchor
- [Phase 4 prompt](../../doc/LUMEN-v0.13-PHASE-4-PROMPTS.md)
- [Phase 4 report](../../design-system/06-claude-code-briefings/phase-4-report.md)
- [tools/lumen-prompts/README.md](../../tools/lumen-prompts/README.md) — CLI doc

---

## Related Notes
- [[ADR 0024 — Dual-mode architecture]]
- [[ADR 0027 — Vercel AI Elements naming]]
- [[ADR 0029 — shadcn registry distribution]]

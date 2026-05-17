# tools/lumen-prompts

Tiny CLI that emits a fully-assembled gpt-image-2 prompt string given a template name and a subject. Built so any engineer can do:

```bash
pnpm prompts hero-background --subject "route arc over a dim freight lane map"
```

…and paste the output into ChatGPT (or pipe into `prompts:generate-references` for batch API generation).

---

## Why this exists

The Lumen prompt library at [`design-system/05-prompts/`](../../design-system/05-prompts/) is a set of MD files that share an immutable style anchor. To use a template, you have to: (a) read the template, (b) inline the anchor, (c) fill the `[FILL THIS SLOT]` marker with your subject, (d) honor the snapshot pin `gpt-image-2-2026-04-21`. Doing this by hand drifts. The CLI does it deterministically.

---

## Usage

```bash
pnpm prompts <template> --subject "..." [flags]
```

### Templates

- `hero-background` — landing-page hero backgrounds (16:9, 2560×1440)
- `abstract-shape` — empty-state covers, secondary heroes (1:1, 1600×1600)
- `illustration` — onboarding step illustrations, feature heroes (1:1 or 16:9)
- `pattern` — seamless tile patterns (1:1, 512×512)
- `mesh` — mesh-recipe visual references (16:9, 2560×1440 or 4K)
- `empty-state` — dashboard empty states (1:1 or 4:3, 1024×1024 or 800×600)
- `marketing-card` — OG cards, feature blocks, blog heroes (1.91:1 or 16:9)

### Flags

| Flag | Description |
|---|---|
| `--subject <text>` | The subject fill for the template. **Required.** |
| `--composition <text>` | Override the composition block (optional). |
| `--mode <text>` | Override the mode block (`restrained` \| `expressive`, optional). |
| `--snapshot` | Emit a date-stamped header for archival diffing. |
| `--help`, `-h` | Print usage. |

### Examples

```bash
# Hero background with default composition
pnpm prompts hero-background --subject "route arc over a dim freight lane map"

# Mesh recipe (subject names the recipe slot)
pnpm prompts mesh --subject "aurora-spring"

# Empty state with archival snapshot header
pnpm prompts empty-state --subject "single freight pallet awaiting load" --snapshot

# Pipe into clipboard (macOS)
pnpm prompts illustration --subject "long-haul truck silhouette on a highway at dusk" | pbcopy
```

---

## What the CLI does

1. Reads the template MD from `design-system/05-prompts/<template>.md`.
2. Reads the immutable style anchor from `design-system/05-prompts/style-anchor.md`.
3. Strips the LLM-agent frontmatter and the "DO NOT EDIT" warning block from both — the image model reads body only.
4. Replaces the `@import ./style-anchor.md` directive in the template with the inlined anchor body.
5. Fills the first `[FILL THIS SLOT...]` marker with the `--subject` text.
6. Applies optional `--composition` and `--mode` overrides.
7. (Optional) Prepends a snapshot header with template name, subject, timestamp, model pin.
8. Writes the assembled prompt to stdout.

The model snapshot (`gpt-image-2-2026-04-21`) is hardcoded into the anchor and every template — the CLI doesn't override it. Per master doc §11, the pin IS the contract; if the pin is wrong the operator re-baselines via a master doc update.

---

## Icon rejection

The CLI **refuses** to emit a prompt for `icon`, `icons`, `iconography`, `glyph`, `symbol`, or `lumen-icon`. Lumen icons are hand-drawn vectors at 1.5px stroke, never gpt-image-2 output. See master doc §3 "Imagery" — this is a hard rule.

```bash
$ pnpm prompts icon --subject "shipment"
lumen-prompts: 'icon' is not a generatable asset.

Lumen icons are hand-drawn vectors at 1.5px stroke, never gpt-image-2 output.
See doc/LUMEN-v0.13-MASTER-REFACTOR.md §3 "Imagery" — 
Hard rule: gpt-image-2 generates atmosphere, NEVER icons.

If you need an icon, see design-system/00-foundations/iconography.md
or commission one via the icon-design workflow in _meta/prompts/.
```

---

## Reference asset generation (operator-side)

To materialize the reference PNGs that ship under `examples/gpt-image-2/<template>/`, run:

```bash
export OPENAI_API_KEY="sk-…"
pnpm prompts:generate-references
```

The `generate-references.ts` script:
- Reads each `examples/gpt-image-2/<template>/canonical-subject.md` for the canonical subject text.
- Calls the CLI internally to assemble the full prompt.
- POSTs the prompt to OpenAI's `/v1/images/generations` endpoint with the snapshot-pinned model.
- Saves the resulting PNG to `examples/gpt-image-2/<template>/<canonical-subject-slug>.png`.

This is operator-side because:
1. The repo CI does not carry an OpenAI API key — generation is interactive and budgeted.
2. The pinned snapshot `gpt-image-2-2026-04-21` may not resolve in your account at the moment of generation (model rollout windows, regional availability). The operator handles 404s.
3. Reference PNGs are visual baselines — they need human review before commit, especially the mesh set where cross-recipe consistency is the whole point.

When the snapshot pin lifts (re-baseline event), regenerate all references in one batch and commit them together so the diff against prior baselines is one PR, not seven.

---

## Source

- CLI: [`index.ts`](./index.ts) (~250 lines, zero external deps)
- Generator: [`generate-references.ts`](./generate-references.ts) (operator-side, requires `OPENAI_API_KEY`)
- Templates: [`design-system/05-prompts/`](../../design-system/05-prompts/)
- Master doc: [`doc/LUMEN-v0.13-MASTER-REFACTOR.md`](../../doc/LUMEN-v0.13-MASTER-REFACTOR.md) §7 Phase 4, §9 style anchor, §11 drift rationale

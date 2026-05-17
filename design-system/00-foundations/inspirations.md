---
name: Inspirations
type: foundation
version: 0.13.0
last_updated: 2026-05-17
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./voice-and-tone.md
  - ./modes.md
  - ../05-prompts/README.md
  - ../05-prompts/style-anchor.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Lumen Inspirations — the named anchors

> Lumen's voice is the synthesis of three dark-mission-control references, Linear's "calmer interface for a product in motion," Vercel's agent-readable SKILL.md shape, and Nordhealth's `llms.txt` + AI Skills delivery pattern. This file names them so designers and LLM agents have the same touchstones.

---

## 1. The three dark-mission-control references (RonDesignLab on Dribbble)

These are the relevant references for Lumen's expressive surfaces. The Cargo TMS case (light-canvas, Urbanist) is NOT a reference for Lumen — it's a counter-example. Lumen is dark-canvas obsidian operator-density first.

### Navy Mobile — Truck Management Dashboard

`https://dribbble.com/RonDesignLab` — search the shot.

Mobile-first dark dashboard for fleet operations. Obsidian canvas, lime-tinted highlights (Lumen ports this to Spring Green), navy structural accents, hairline frames. The operator's primary surface is the live map; secondary surfaces are stacked stat tiles with strong typographic hierarchy. Lumen mirrors: the canvas, the hairline-first chrome, the stat tile composition, the "always-on" signature element (RonDesignLab uses a pulsing dot; Lumen ports this verbatim as LiveDot).

### BizSpeed TMS — Logistics Web Dashboard

Desktop logistics dashboard, dark obsidian, lime accent for the active route. Lane visualization (origin → destination arcs), shipment table with status pills, mini-charts for OTD trends. Lumen mirrors: the lane-arc visual gesture (becomes our `LaneArc` component), the operator-density table treatment, the inline mini-chart pattern in stat tiles.

### SpaceX App — Space Mission Control

Mission-control dark UI, instrument-panel mood. Glass shells on the floating chrome, hairline grids, mono-uppercase tracked metadata labels. Lumen mirrors: the mono-uppercase signature label voice (`SYSTEM V0.13 · LIVE`), the glass-only-on-floating-shells discipline, the instrument-panel restraint.

---

## 2. Linear — "a calmer interface for a product in motion"

`https://linear.app/now/behind-the-latest-design-refresh`

Linear's most recent design-refresh blog. The pull-quote is the architecture: *"a calmer interface for a product in motion."* Lumen's restrained mode shares this DNA — fewer pixels doing more work, motion budget spent on functional moments (state changes, validation, success) not on decoration.

Specific Linear patterns Lumen mirrors:
- **Hierarchy through weight + size, not colour.** Linear's UI is overwhelmingly grayscale; the accent appears only at action and state. Lumen's single-accent rule (Spring Green only) is the same discipline.
- **Hairline-first surface separation.** Cards are defined by a 1 px stroke, not a shadow. Lumen's `shadow.card = shadow.sm` (very subtle) preserves this — only floating UI gets real shadow.
- **Mono-spaced metadata.** Issue IDs, dates, timestamps in mono. Lumen's `mono-cap` tracked label is the freight-domain version.

---

## 3. Vercel `skill-remotion-geist` — the agent-readable SKILL.md format

`https://github.com/vercel-labs/skill-remotion-geist/blob/main/skills/create-remotion-geist/SKILL.md`

The canonical shape for an agent-readable design-system skill file. Lumen's per-component `<name>.skill.md` files copy this format verbatim (frontmatter with `name`, `description`; body with "Use when", "NEVER", "Tokens consumed", "Anatomy", "API", "Modes", "Accessibility", "Code", "Related"). Phase 2 lands these on every component.

What Vercel got right that Lumen copies:
- **One file = one agent decision.** The skill file is everything an agent needs to make ONE component correctly. Not a tutorial, not a reference, not a deep-dive. A decision aid.
- **Lead with "Use when" — the trigger.** Then "NEVER" — the guardrails. Then tokens, anatomy, API, code. The agent retrieves the trigger first; the trigger matches; the rest of the file is loaded.
- **Hard rules verbatim.** No paraphrase. Repeat the same constraints across every component so an agent reading one file learns the system's voice.

---

## 4. Nordhealth — `llms.txt` + AI Skills

`https://nordhealth.design/llms.txt` and `https://nordhealth.design/ai/skills/`

The canonical shape for design-system `llms.txt` + Agent Skills delivery. Lumen's root `llms.txt` (Phase 0) and per-component agent skills (Phase 2) copy the Nordhealth pattern.

What Nordhealth got right:
- **`llms.txt` is a 5–10K-token INDEX, not a dump.** Foundation, tokens, components, patterns, platforms each get one section; each section is a bullet list of MD/JSON paths. The agent retrieves the index, scans for relevance, fetches the specific file.
- **AI Skills live at a stable URL.** Each skill is a stable file an agent can fetch by name. No login, no cookies, no JS rendering.
- **The taxonomy mirrors the file tree.** What `00-foundations/`, `01-tokens/`, `02-components/` contain on disk = what the `llms.txt` index advertises.

---

## 5. What Lumen explicitly is NOT

These would feel like reasonable references but they're wrong for Lumen — call them out for the LLM that will inevitably reach for them.

| Reference | Why NOT |
|---|---|
| Material Design 3 expressive | Material's brand is colourful + reactive. Lumen's brand is restrained + single-accent. Borrow the easing tokens, not the colour philosophy. |
| Apple HIG glassmorphism / vibrancy | Lumen uses glass on FLOATING shells only. Apple paints glass on every chrome surface — that's an iOS contract Lumen doesn't share. |
| Bootstrap / Tailwind UI | Generic SaaS chrome. Lumen's freight-domain voice means lane codes, dock bays, OTD percentages — domain-specific composites that generic UI doesn't carry. |
| Carbon (IBM) | Carbon is closest in spirit (enterprise density, hairline-first) but Carbon's accent is blue. Lumen never reaches for blue. |
| Polaris (Shopify) | Polaris is for embedded Shopify surfaces — Lumen consumes Polaris contracts on Shopify embeds (≤ 15% of pixel surface) but does NOT generalize Polaris to other surfaces. |

---

## 6. Image generation (gpt-image-2 prompt library)

Phase 4 lands the [`05-prompts/`](../05-prompts/) library: an immutable style anchor + seven per-asset templates that produce Lumen-branded imagery via `gpt-image-2` (snapshot `gpt-image-2-2026-04-21`). The anchor calibrates the model against the visual references named above — without naming them in the prompt itself.

### What the anchor calibrates against

The five visual references that shape every Lumen image asset (named in [`05-prompts/style-anchor.md`](../05-prompts/style-anchor.md) §"Style references" but **never quoted into the prompt**):

| Reference | What it contributes to the anchor |
|---|---|
| **RonDesignLab "Navy Mobile – Truck Management Dashboard"** | The dark canvas + hairline chrome + lime/Spring-Green accent discipline. Mobile-first composition where the operator's primary surface dominates and secondary surfaces stack as restrained tiles. |
| **RonDesignLab "BizSpeed TMS – Logistics Web Dashboard"** | The lane-arc visual gesture — origin → destination as a single hairline curve, accent appearing only at endpoints or active arcs. Operator-density table treatment under that hero gesture. |
| **RonDesignLab "SpaceX App – Space Mission Control"** | The instrument-panel mood. Glass on floating chrome only. Mono-uppercase tracked metadata labels. The "held in motion, not chaotic" composition energy. |
| **Linear's blueprint-grid + calmer-interface aesthetic** | The fewer-pixels-doing-more-work discipline. Hairline-first surface separation. Mono-spaced metadata. Grayscale baseline with accent only at action. |
| **Vercel Geist's restrained dark palette** | The dark-obsidian foundation. The single-saturated-color allowance. The atmospheric depth that doesn't tip into glow or neon. |

### Why these references are NEVER named in the prompt

If the prompt says "in the style of SpaceX App by RonDesignLab," gpt-image-2 over-fits to literal imagery from that shot — recreating SpaceX-specific visual fingerprints that aren't Lumen's. The anchor's job is to extract the *physics* of those references (canvas, hairline, mono-cap, instrument-panel mood) and encode them as parametric constraints (`Dark obsidian canvas #0D0D0D`, `Hairline 1px white strokes at 6% opacity`, `Instrument-panel mood`). The references stay in the team's mental model; only the parameters reach the model.

### What the prompt library generates

| Template | Surface | Mode |
|---|---|---|
| [`hero-background`](../05-prompts/hero-background.md) | Landing-page hero backgrounds | expressive (atmosphere 12%) |
| [`abstract-shape`](../05-prompts/abstract-shape.md) | Empty-state covers, secondary heroes, loading screens | restrained (atmosphere 4–6%) |
| [`illustration`](../05-prompts/illustration.md) | Onboarding step illustrations, narrative covers | expressive (atmosphere 10–14%) |
| [`pattern`](../05-prompts/pattern.md) | Seamless tile patterns for background chrome | restrained (atmosphere 0%) |
| [`mesh`](../05-prompts/mesh.md) | Five Phase-1 mesh-recipe visual references | expressive (atmosphere 10–14%) |
| [`empty-state`](../05-prompts/empty-state.md) | Dashboard empty states | restrained (anticipatory mood) |
| [`marketing-card`](../05-prompts/marketing-card.md) | OG cards, blog heroes, feature blocks | expressive (atmosphere 10–14%) |

### What the prompt library does NOT generate

| Asset | Why not | Where to look instead |
|---|---|---|
| Icons | Hand-drawn vectors at 1.5px stroke. Hard rule per master doc §3. | [`00-foundations/iconography.md`](./iconography.md) (legacy) and the v0.12.6 icon set. |
| Logos | Wordmark + supporting marks are hand-built. | `_meta/brand-assets/` (not in this repo). |
| Real customer data | Synthetic IDs only (`WRP-9824`, `$84/pallet`). | Templates document the no-real-data rule. |
| Partner brand marks | Even when illustrating carrier-network-density, nodes are unlabeled. | Templates document the no-partner-brand rule. |

The CLI ([`tools/lumen-prompts/`](../../tools/lumen-prompts/)) **rejects** `icon`, `icons`, `iconography`, `glyph`, `symbol` as templates with a runtime error. This enforcement is the easiest path to keeping the icon hard rule unviolated.

---

## References

- [`principles.md`](./principles.md) — the 7 principles that synthesise these inspirations
- [`voice-and-tone.md`](./voice-and-tone.md) — the mono-uppercase signature, the italic accent word, the brutalist frame
- [`modes.md`](./modes.md) — restrained × expressive routing
- [`../05-prompts/README.md`](../05-prompts/README.md) — the Phase 4 prompt library index
- [`../05-prompts/style-anchor.md`](../05-prompts/style-anchor.md) — the immutable style anchor
- [`doc/LUMEN-v0.13-MASTER-REFACTOR.md`](../../doc/LUMEN-v0.13-MASTER-REFACTOR.md) — §1.5 named inspiration anchors, §9 style anchor source, §11 drift rationale

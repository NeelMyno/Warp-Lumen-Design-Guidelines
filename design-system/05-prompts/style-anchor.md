---
name: Style Anchor
type: prompt-anchor
version: 0.13.0
last_updated: 2026-05-17
audience: [llm-agent, designer, engineer]
immutable: true
related:
  - ./README.md
  - ./hero-background.md
  - ./abstract-shape.md
  - ./illustration.md
  - ./pattern.md
  - ./mesh.md
  - ./empty-state.md
  - ./marketing-card.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

> [!warning]
> **DO NOT EDIT.** This file is the immovable style anchor for every gpt-image-2 prompt
> Lumen ships. Modifying it causes silent drift across the entire image asset library.
> If a change is genuinely required, version-bump (`style-anchor.v2.md`) and migrate
> consumers explicitly. Do not edit in place.
>
> The content below is the verbatim source from
> [`doc/LUMEN-v0.13-MASTER-REFACTOR.md`](../../doc/LUMEN-v0.13-MASTER-REFACTOR.md) §9.

---

# Lumen v0.13 — Style Anchor (immovable)

Use this anchor at the top of every gpt-image-2 prompt by referencing it as
`@import 05-prompts/style-anchor.md` and then adding your subject-specific slot.

## Model + parameters
- Model: gpt-image-2 (snapshot gpt-image-2-2026-04-21).
- Quality: high.
- Mode: thinking mode ON for hero / multi-frame assets, OFF for single backgrounds.
- Aspect: 16:9 unless specified. Output 2560×1440 for hero, 1600×1600 for square illustration, 1024×1024 for empty-state.

## Scene
Dark obsidian canvas (#0D0D0D). Subtle radial atmosphere of deep teal and
Spring Green (#00FA8A) at 8–12% opacity, drifting in the upper-left and
lower-right thirds. Volumetric fog, no hard edges. Faint film grain at 8%
overlay. Instrument-panel mood.

## Subject
[FILL THIS SLOT in the consuming template. One sentence, freight-domain when
possible — isometric long-haul truck, container yard top-down, route arc on
a lane map, cross-dock cutaway, dock-bay grid, network graph, pallet stack.]

## Details
- Hairline 1px white strokes at 6% opacity.
- Frosted-glass surfaces where appropriate, with subtle grain.
- Minimal type if any: clean geometric sans-serif (Satoshi look-alike).
- Single Spring Green #00FA8A accent on the focal element ONLY.
- No second saturated color anywhere. Status hues (lumen-red, lumen-amber) only
  if explicitly required by the subject.

## Use case
[FILL THIS SLOT — e.g., "SaaS dashboard hero illustration", "landing-page
background", "onboarding step 2 illustration", "empty-state for shipments list".]

## Constraints
- NO photoreal humans unless explicitly requested.
- NO logos.
- NO text labels in image unless explicitly requested by the consuming template.
- NO neumorphism, NO glassmorphism-without-context, NO heavy bevels.
- NO neon glow beyond the Spring Green accent.
- NO stock-photo aesthetic.
- NO emoji-style.
- Must read at 50% size.
- Output must be print-grade at the requested resolution.

## Style references (do not name in the prompt, used for our calibration only)
- RonDesignLab "Navy Mobile – Truck Management Dashboard"
- RonDesignLab "BizSpeed TMS – Logistics Web Dashboard"
- RonDesignLab "SpaceX App – Space Mission Control"
- Linear's blueprint-grid and calmer-interface aesthetic
- Vercel Geist's restrained dark palette

## When to deviate
- Restrained surfaces (dashboards) → lower the atmosphere to 4–6% opacity, drop
  the mesh entirely, keep grain.
- Expressive surfaces (landing) → boost atmosphere to 10–14%, allow one named
  mesh recipe (aurora-spring | aurora-cool | dock-bay | lane-arc | cross-dock).
- Onboarding → narrative illustration allowed, character-light, freight-domain
  prop.

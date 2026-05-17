---
name: Illustration
type: prompt-template
version: 0.13.0
last_updated: 2026-05-17
audience: [llm-agent, designer, engineer]
asset_type: illustration
aspect: 1:1 or 16:9
output: 1600×1600 (square) | 2560×1440 (wide)
mode: expressive
related:
  - ./style-anchor.md
  - ./marketing-card.md
  - ./empty-state.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Illustration — Lumen v0.13

@import ./style-anchor.md

## Model pin
- Model: `gpt-image-2` (snapshot `gpt-image-2-2026-04-21`).
- Quality: `high`.
- Thinking mode: **ON** when generating a sequence of onboarding steps in one session — keeps the visual world coherent across 3–8 frames.

## Subject

[FILL THIS SLOT — fill the SUBJECT slot of the style anchor with template-specific content like:]

> A narrative illustration of a freight scene — pickup loading dock at dawn, cross-dock floor mid-operation, long-haul truck on a highway at dusk, last-mile delivery to a storefront, container yard top-down at sunset, dispatcher's monitor wall reflecting a route map — rendered character-light, prop-forward, with Lumen's instrument-panel mood. Soft volumetric atmosphere, hairline structural definition, one Spring Green accent on the focal action.

The subject names a single narrative beat:
- **Pickup**: dock receding, pallet being staged, no driver, low golden-hour fill light.
- **Cross-dock**: mid-floor view, faint motion trails between bays, single accent on the active conveyor.
- **Long-haul**: silhouette truck against a dusk highway, single faint route arc trailing.
- **Last-mile**: small truck at curb, storefront door, one delivered parcel on the threshold, no figures.
- **Container yard**: top-down sundown view, container blocks in hairline grid, single yellow-cab-light Spring Green accent.
- **Dispatcher console**: monitor wall in shadow, faint glow from screens, single live route arc reflected on a glass desk.

## Composition override

- **Aspect**: 1:1 square (1600×1600) or 16:9 (2560×1440) depending on placement.
  - Onboarding step illustration: square.
  - Hero-adjacent narrative: 16:9.
- **Focal action**: composed in the rule-of-thirds intersection (upper-right or lower-left).
- **Negative space**: at least 30% of the frame is quiet — overlay-friendly for step text or caption.
- **Atmospheric depth**: foreground crisp at 80% opacity, mid-ground at 50%, background at 20% fading into fog.

## Use case override

- Onboarding step illustrations (step 1: pickup, step 2: in-transit, step 3: delivered).
- Empty-state hero for the first time a user enters a new section (Shipments, Quotes, Lanes, Drivers).
- Feature-page hero on `/product/dispatch`, `/product/cross-dock`, `/product/last-mile`.
- Blog post hero for narrative posts about specific shipment journeys.

## Mode

**Expressive.** Onboarding is the **one place Lumen relaxes operator-density** for a soft narrative warmth. Atmosphere at 10–14%, allow one mesh recipe (`aurora-spring` for dawn, `aurora-cool` for dusk, `dock-bay` for floor scenes, `lane-arc` for highway scenes, `cross-dock` for terminal scenes).

For non-onboarding use cases (feature page, blog), drop back to restrained-tilting-expressive: atmosphere at 8–10%, no mesh, keep the narrative warmth in the foreground composition only.

## Template-specific constraints

- **Character-light**: at most ONE human silhouette, never their face. Most scenes have zero humans.
- **Prop-forward**: the freight equipment IS the protagonist — the truck, the pallet, the dock door, the conveyor.
- **NO uniforms, NO branded vehicles** — Warp does not paint logos on trucks; carriers do.
- **NO photoreal lens flare, NO film burn** — the warmth is atmospheric fog, not optical artifacts.
- **NO modern smartphones, laptops, or dashboards in the scene** — Lumen is the dashboard; do not render a competing UI surface inside the illustration. (Exception: dispatcher console subject names the monitor wall as the focal element; render it as ambient glow, not as a literal screen layout.)
- **NO weather extremes**: no snow, no rain, no fog beyond the anchor's atmospheric fog. Lumen scenes are working scenes, not establishing-shot drama.
- **MUST feel held, not in motion.** A truck on a highway is poised; a cross-dock is mid-task but not chaotic.

## Failure modes

1. **Human appears in the foreground** with a visible face → re-prompt: `NO faces. If a human silhouette is needed, render at most one figure from behind or in deep shadow. Most scenes have zero humans.`
2. **Vehicle has a logo or fleet livery** → re-prompt: `the truck/van is unbranded. No fleet livery, no logos, no decals. Solid-color body, neutral cab.`
3. **Scene has weather drama** (heavy rain, snow on the dock) → re-prompt: `working scene, clear weather. Lumen narrative is about freight competence, not weather adversity.`
4. **Onboarding sequence feels disjointed** across steps → regenerate with thinking mode ON in a single session, name all three subjects in the prompt, ask for consistency across the set.

## Reference asset

`examples/gpt-image-2/illustration/canonical-subject.md` documents the exact subject text the reference PNG was generated from. The default reference is "long-haul truck silhouette on a highway at dusk, character-light, faint route arc".

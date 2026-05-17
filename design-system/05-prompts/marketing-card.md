---
name: Marketing Card
type: prompt-template
version: 0.13.0
last_updated: 2026-05-17
audience: [llm-agent, designer, engineer]
asset_type: marketing-card
aspect: 1.91:1 (OG) or 16:9 (feature block)
output: 1200×630 (OG card) | 2560×1440 (feature block)
mode: expressive
related:
  - ./style-anchor.md
  - ./hero-background.md
  - ./illustration.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Marketing card — Lumen v0.13

@import ./style-anchor.md

## Model pin
- Model: `gpt-image-2` (snapshot `gpt-image-2-2026-04-21`).
- Quality: `high`.
- Thinking mode: **ON** when generating a coordinated set of cards for a single campaign — keeps the visual language consistent across the OG cards, blog heroes, and feature blocks of the same launch.

## Subject

[FILL THIS SLOT — fill the SUBJECT slot of the style anchor with template-specific content like:]

> A feature-illustrative composition that communicates a single freight capability — instant rates, real-time tracking, cross-dock automation, lane optimization, terminal-first booking, carrier network density, AI dispatch — rendered as a hybrid of UI surface hint + ambient atmosphere. A faint Lumen dashboard fragment (a single stat card, a partial lane arc, a 3-row shipment table) anchors the lower-third; the rest of the frame is atmospheric mesh. Single Spring Green accent on the focal capability.

Subject options (one per feature):

| Capability | Subject |
|---|---|
| Instant rates | partial Lumen stat-card fragment showing a $/pallet figure, lane-arc trail behind it, mesh atmosphere upper-right |
| Real-time tracking | partial route-arc fragment with a single Spring Green dot mid-trajectory, dispatcher-console glow behind |
| Cross-dock automation | dock-bay grid cutaway, one bay highlighted Spring Green, faint motion trails between |
| Lane optimization | three lane arcs from a single origin, one (the optimized one) in Spring Green, others in hairline |
| Terminal-first booking | partial CLI surface fragment (one command, one rate output line), mesh atmosphere right side |
| Carrier network density | network node mesh with 12–20 nodes, hairline connections, three nodes pulsing Spring Green |
| AI dispatch | partial reasoning-thread fragment (a single message bubble silhouette), faint route-arc behind |

## Composition override

- **Aspect**:
  - **OG / social card**: 1.91:1 (Open Graph spec) → output 1200×630.
  - **Feature block on landing**: 16:9 → output 2560×1440.
- **UI surface fragment**: occupies lower-third or lower-right (rule-of-thirds anchored). The fragment IS the call-out — what makes this a marketing card vs. a pure hero background.
- **Headline space**: upper-left or upper-center — clear negative space for live HTML headline overlay.
- **Visual hierarchy at small sizes**: marketing cards MUST read at OG-thumbnail size (200×105 in social previews). Subject + accent moment + headline space must all survive the crop.

## Use case override

- **Open Graph cards** for landing pages and blog posts (`<meta property="og:image">`).
- **Twitter card** images (use same 1.91:1; Twitter handles both `summary_large_image` and OG).
- **LinkedIn share card** (1.91:1 OG inherits cleanly).
- **Landing-page feature blocks** — the 4–6 "what Lumen does" cards on `/product` pages (16:9 aspect).
- **Blog post hero images** (16:9 aspect).
- **Email campaign hero images** — top of marketing emails (16:9 cropped to email-safe width).

## Mode

**Expressive.** Marketing cards live on landing pages, blog posts, and shared social previews — every consumer surface is expressive. Atmosphere at 10–14% (anchor's expressive ceiling). One mesh recipe permitted (pick based on the feature: `aurora-spring` for new features, `lane-arc` for tracking/optimization, `dock-bay` for terminal/cross-dock features, `cross-dock` for automation, `aurora-cool` for AI/dispatch features). Grain at 10%.

## Template-specific constraints

- **UI surface fragments are HINTS, never full screenshots.** A partial stat card. A partial lane arc. A partial table with 3 rows. Never a complete dashboard render — that's product photography territory, not gpt-image-2 territory.
- **NO live data in the fragment.** Numbers can be approximate (`$84/pallet`, `WRP-9824`, `+12% OTD`). They must NOT reference real customers or real lanes.
- **NO logos, NO partner brands, NO carrier marks** — even when illustrating "carrier network density," the nodes are unlabeled.
- **NO text labels above 18pt-equivalent** in the image — headlines ship as live HTML. The image can carry small mono-cap metadata labels at ~12pt-equivalent ("SYSTEM V0.13 · LIVE") if the composition requires it.
- **MUST survive thumbnail crop.** Test mentally: shrink to 200×105 — does the subject still read?
- **Higher UI density permitted vs. hero-background.md** — marketing cards can show MORE Lumen surface because they're consumed at smaller sizes; a hint of a dashboard is acceptable here, never in a hero.

## Failure modes

1. **Full dashboard rendered** — gpt-image-2 over-produces a complete UI → re-prompt: `partial fragment only. ONE stat card, OR ONE lane arc, OR three table rows. Most of the frame is atmospheric mesh, not UI.`
2. **Real customer name or lane appears** in the fragment → re-prompt: `synthetic data only. Use placeholder lane codes (WRP-9824), placeholder rates ($84/pallet). No real customer or carrier names.`
3. **Headline baked into the image** → re-prompt: `NO text headlines in the image. Headlines ship as live HTML overlay. Image is composition + atmosphere + UI fragment only.`
4. **Doesn't survive thumbnail crop** (subject too small or off-center) → re-prompt: `subject anchored at lower-third, occupying ~25% of the frame width. Must be visible at 200×105 social thumbnail.`
5. **Two saturated colors** appear (status amber + Spring Green) → re-prompt: `Spring Green is the only chromatic accent. Status hues (amber/red) appear ONLY if the feature is explicitly about alerts; otherwise the accent is Spring Green only.`

## Reference asset

`examples/gpt-image-2/marketing-card/canonical-subject.md` documents the exact subject text the reference PNG was generated from. The default reference is "real-time tracking — Lumen dashboard surface hint with ambient atmosphere."

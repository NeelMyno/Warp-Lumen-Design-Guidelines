---
name: Hero Background
type: prompt-template
version: 0.13.0
last_updated: 2026-05-17
audience: [llm-agent, designer, engineer]
asset_type: hero-background
aspect: 16:9
output: 2560×1440
mode: expressive
related:
  - ./style-anchor.md
  - ./marketing-card.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Hero background — Lumen v0.13

@import ./style-anchor.md

## Model pin
- Model: `gpt-image-2` (snapshot `gpt-image-2-2026-04-21`).
- Quality: `high`.
- Thinking mode: **OFF** for single backgrounds; **ON** only if you are generating multiple hero variants in one session for cross-frame consistency.

## Subject

[FILL THIS SLOT — fill the SUBJECT slot of the style anchor with template-specific content like:]

> Three soft blurred orbs in Spring Green `#00FA8A` (12% opacity max) and one cool indigo orb, drifting against obsidian `#0D0D0D`, with a faint perlin grain overlay at 10% opacity. Volumetric fog, no hard edges. The orbs occupy the upper-left and lower-right thirds of the frame. Optional faint freight-domain glyphs in the deep background — a hairline route arc or container yard silhouette at 4% opacity — never literal, always atmospheric.

The subject swap may name a single freight-domain anchor (`route arc over a dim freight lane map`, `cross-dock cutaway at dawn`, `dock-bay grid receding into fog`). Keep it to one sentence. The style anchor handles the rest.

## Composition override

- **Aspect**: 16:9.
- **Output**: 2560×1440 (print-grade at 50% size; the master doc reference).
- **Focal area**: dead-center 60% × 40% region MUST be quiet — clear negative space for the headline. Visual weight rides the upper-left third and lower-right third.
- **Depth cue**: orbs in the foreground are larger and softer (blur 60–80px); orbs behind them are smaller and tighter (blur 20–30px). Z-axis is implied through scale, not parallax.

## Use case override

- Landing-page hero background.
- Marketing site hero with a single headline + CTA overlaid via CSS — gpt-image-2 generates the background ONLY.
- Onboarding hero (step 1) before the form fields appear.
- App-shell launch frame on first-run; replaced by the canvas after the first user action.

The headline always overlays the center; never bake type into the image. The CTA always rides the lower-third on the right or below the headline; do not place visual weight there.

## Mode

**Expressive.** Atmosphere at 12%. One named mesh recipe permitted (default: `aurora-spring`). Grain at 10% (slightly above the anchor's 8% default).

If you need a hero for a restrained surface (operator dashboard), use `abstract-shape.md` instead — that template ships at 4–6% atmosphere and drops the mesh entirely.

## Template-specific constraints

- **NO headline text** baked into the image. The headline ships as live HTML over the asset.
- **NO logos** anywhere in the frame.
- **NO icon-style elements** — Lumen icons are hand-drawn vectors, not gpt-image-2 output. Hard rule.
- **NO neon glow** beyond the Spring Green accent.
- **NO second saturated color.** Indigo orbs are atmospheric depth (cool teal range), not a second brand color.
- **NO motion blur, NO speed lines** — Lumen heroes feel held, not in motion.
- **MUST tile-equivalent**: the asset should look intentional at 50% size on a marketing email or 200% size on a 4K landing page.

## Example consuming template (verbatim from master doc §9)

```markdown
# Hero background — Lumen v0.13

@import ./style-anchor.md

## Subject
An ambient hero background for an AI surface — three soft blurred orbs of
Spring Green #00FA8A (12% opacity max) and one cool indigo orb, drifting
against obsidian #0D0D0D, with a faint perlin grain overlay at 10% opacity.
Suggest depth via volumetric fog. No hard edges anywhere.

## Composition override
16:9, 2560×1440. The orbs occupy the upper-left and lower-right thirds. Clear
focal-area negative space dead-center for headline text.

## Use case override
Landing-page hero background. The headline overlays the center; do not place
visual weight there.

## Mode
Expressive (atmosphere at 12%).
```

## Failure modes (real things that go wrong)

1. **gpt-image-2 invents a logo** → re-prompt with `NO LOGOS, NO BRAND MARKS, NO WATERMARKS` literally repeated three times.
2. **Second saturated color appears** (orange highlight, purple gradient) → re-prompt naming the offending color: `do not introduce orange, purple, or any second saturated hue. spring green is the only chromatic accent.`
3. **Center has visual weight** (a glow, a shape, a gradient peak in the middle) → re-prompt: `the center 60% × 40% region must be quiet negative space for a headline overlay. all visual weight rides the upper-left and lower-right thirds.`
4. **Output is busy at 50% size** → re-prompt with a thicker grain (12%) and reduce the orb count to two; complexity reads as noise at small sizes.

## Reference asset

`examples/gpt-image-2/hero-background/canonical-subject.md` documents the exact subject text the reference PNG was generated from. If you re-baseline (gpt-image-2 alias rolls forward, snapshot pin lifts), regenerate against the same canonical subject and diff against the prior PNG.

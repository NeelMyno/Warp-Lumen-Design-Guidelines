# TOKEN-INDEX.md

> **Auto-generated for Lumen v0.14.1** (2026-05-20). Run `node scripts/build-token-index.mjs` to regenerate. Source of truth: the `design-system/01-tokens/{semantic,components}/*.tokens.json` files. **Never hand-edit this file** — drift is caught by the next regeneration.

> **What this is.** A flat, alphabetical index of every Lumen semantic and component-bound token, with its alias target (or resolved primitive value if terminal) and the description from the source file. **Agents and engineers consume only these** — per AGENTS.md hard rule 2, never reference primitives directly.

> **What this isn't.** The primitive tier is intentionally OMITTED (`color.warm.50`, `dimension.4`, `font.weight.bold`, etc.). Listing them would invite agents to bypass the semantic layer.

## Semantic — consume these

### `semantic/color.dark.tokens.json` (114 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `color.action.ai.bg.hover` | `{color.alpha.accent.24}` |  |
| `color.action.ai.bg.press` | `{color.alpha.accent.32}` |  |
| `color.action.ai.bg.rest` | `{color.alpha.accent.12}` |  |
| `color.action.ai.border` | `{color.alpha.accent.40}` |  |
| `color.action.ai.fg` | `{color.accent.300}` | Laser spring-green — brighter than accent.fg on tonal surface to maintain perceived hierarchy. |
| `color.action.danger-soft.bg.hover` | `{color.alpha.danger.12}` |  |
| `color.action.danger-soft.bg.press` | `{color.alpha.danger.18}` |  |
| `color.action.danger-soft.bg.rest` | `transparent` |  |
| `color.action.danger-soft.fg` | `{color.status.danger.300}` | Lumen text.error — 6.5:1 on canvas. v0.11.13 — references the new status.danger.300 primitive. |
| `color.action.danger.bg.hover` | `{color.status.danger.800}` |  |
| `color.action.danger.bg.press` | `{color.status.danger.800}` |  |
| `color.action.danger.bg.rest` | `{color.status.danger.700}` | v0.11 refined deep red (5.4:1 white-on-bg). |
| `color.action.danger.border` | `transparent` |  |
| `color.action.danger.fg` | `{color.absolute.white}` | 5.4:1 on danger.700 — passes AA Normal. v0.11.13 — references the new {color.absolute.white} primitive (was inlined #FFFFFF). |
| `color.action.ghost.bg.hover` | `{color.alpha.paper.06}` |  |
| `color.action.ghost.bg.press` | `{color.alpha.paper.08}` |  |
| `color.action.ghost.bg.rest` | `transparent` |  |
| `color.action.ghost.fg` | `{color.brand.100}` |  |
| `color.action.glass.bg.hover` | `{color.alpha.ink.72}` | v0.11.11 — canvas-anchored to match surface.glass. |
| `color.action.glass.bg.press` | `{color.alpha.ink.86}` | v0.11.11 — canvas-anchored to match surface.glass-strong. |
| `color.action.glass.bg.rest` | `{color.surface.glass}` |  |
| `color.action.glass.border` | `{color.alpha.paper.10}` |  |
| `color.action.glass.fg` | `{color.brand.100}` |  |
| `color.action.outline.bg.hover` | `{color.alpha.paper.04}` |  |
| `color.action.outline.bg.press` | `{color.alpha.paper.08}` |  |
| `color.action.outline.bg.rest` | `transparent` |  |
| `color.action.outline.border.hover` | `{color.alpha.paper.24}` |  |
| `color.action.outline.border.rest` | `{color.alpha.paper.16}` |  |
| `color.action.outline.fg` | `{color.brand.100}` |  |
| `color.action.primary.bg.hover` | `{color.accent.600}` |  |
| `color.action.primary.bg.press` | `{color.accent.700}` |  |
| `color.action.primary.bg.rest` | `{color.accent.500}` |  |
| `color.action.primary.border` | `transparent` |  |
| `color.action.primary.fg` | `{color.accent.fg}` | Near-black #07120D on spring green — 14.7:1 AAA. Never inherit text-primary. (Pre-v0.12 description called this 'near-black-mint' — the value is unchanged in v0.12, but the canvas … |
| `color.action.primary.glow` | `{shadow.accent-glow}` |  |
| `color.action.secondary.bg.hover` | `{color.brand.600}` |  |
| `color.action.secondary.bg.press` | `{color.brand.600}` |  |
| `color.action.secondary.bg.rest` | `{color.brand.700}` |  |
| `color.action.secondary.border` | `{color.alpha.paper.12}` |  |
| `color.action.secondary.fg` | `{color.brand.100}` |  |
| `color.action.selected.bg` | `{color.alpha.accent.12}` |  |
| `color.action.selected.border` | `{color.accent.500}` |  |
| `color.action.selected.fg` | `{color.brand.100}` |  |
| `color.action.success.bg` | `{color.alpha.accent.24}` |  |
| `color.action.success.border` | `{color.alpha.accent.40}` |  |
| `color.action.success.fg` | `{color.accent.300}` |  |
| `color.action.tertiary.bg.hover` | `{color.alpha.paper.06}` |  |
| `color.action.tertiary.bg.press` | `{color.alpha.paper.06}` |  |
| `color.action.tertiary.bg.rest` | `transparent` |  |
| `color.action.tertiary.fg` | `{color.brand.100}` |  |
| `color.aurora.color` | `{color.alpha.accent.32}` |  |
| `color.aurora.core` | `{color.alpha.accent.64}` |  |
| `color.avatar.bg.1` | `{color.accent.700}` | Deep spring green — accent family. |
| `color.avatar.bg.2` | `{color.neutral.700}` | Deep cream. |
| `color.avatar.bg.3` | `{color.status.warning.700}` | Deep amber. |
| `color.avatar.bg.4` | `{color.status.danger.700}` | Deep red. |
| `color.avatar.bg.5` | `{color.brand.500}` | Mid obsidian. |
| `color.avatar.bg.6` | `{color.accent.500}` | Bright spring green — sparingly. |
| `color.avatar.bg.7` | `{color.neutral.500}` | Mid cream. |
| `color.avatar.bg.8` | `{color.status.danger.300}` | Soft red. |
| `color.border.accent` | `{color.alpha.accent.40}` | Spring-green-tinted hairline for accent surfaces |
| `color.border.default` | `{color.alpha.paper.12}` |  |
| `color.border.disabled` | `{color.alpha.paper.06}` | v0.6 — input disabled border. Muted; no hover/focus. |
| `color.border.error` | `{color.status.danger.500}` | v0.6 — input error border. Refined red for the hairline stroke. |
| `color.border.focus` | `{color.accent.400}` |  |
| `color.border.frame` | `{color.alpha.paper.40}` | v0.4 — brutalist hairline frame border, hairline-strong |
| `color.border.hairline` | `{color.alpha.paper.06}` | Default hairline at 6% white — the breathing-room separator (per principles §1, §3). |
| `color.border.strong` | `{color.alpha.paper.24}` | v0.11.13 — references {color.alpha.paper.24} (was inlined rgba(255,255,255,0.24)). |
| `color.border.subtle` | `{color.alpha.paper.08}` | v0.11.13 — references {color.alpha.paper.08} (was inlined rgba(255,255,255,0.08)). |
| `color.border.success` | `{color.accent.400}` | v0.6 — input success border. Spring green; only after explicit validation. |
| `color.border.warning` | `{color.status.warning.500}` | v0.6 — input warning border. Refined amber. |
| `color.chart.1` | `{color.accent.500}` | Spring Green — the current / active / primary series. Reserve for ONE series per chart only. |
| `color.chart.2` | `{color.neutral.500}` | Cream — secondary series. Warm-neutral, low-contrast against accent. |
| `color.chart.3` | `{color.status.warning.500}` | Amber — tertiary series. Warning-tier hue, distinguishable from green. |
| `color.chart.4` | `{color.status.danger.500}` | Red — quaternary series. Use for 'negative' / 'loss' series with semantic intent. |
| `color.chart.5` | `{color.brand.500}` | Obsidian mid-grey — quinary series. Rarely needed. |
| `color.chart.6` | `{color.accent.700}` | Deep Accent — senary series. Return to green family at darker stop. |
| `color.chart.7` | `{color.brand.300}` | v0.13.2 — placeholder. Light obsidian. Probe-safe; reconfigure when a 7th series surfaces. |
| `color.chart.8` | `{color.status.warning.700}` | v0.13.2 — placeholder. Dark amber. Probe-safe; reconfigure when an 8th series surfaces. |
| `color.status.danger.bg` | `{color.status.danger.900}` |  |
| `color.status.danger.fg` | `{color.status.danger.300}` |  |
| `color.status.info.bg` | `{color.alpha.accent.12}` |  |
| `color.status.info.fg` | `{color.accent.300}` |  |
| `color.status.neutral.bg` | `{color.alpha.paper.04}` | Translucent overlay so the pill reads on any surface; the paper-alpha sits well against the v0.12 neutral obsidian canvas without competing with the spring-green accent (pre-v0.12 … |
| `color.status.neutral.fg` | `{color.brand.100}` | User-fixed brand light #E6E6E6 — 14.0:1 on the v0.12 raised surface (was 13.4:1 in v0.11). AAA. |
| `color.status.success.bg` | `{color.accent.900}` |  |
| `color.status.success.fg` | `{color.accent.300}` |  |
| `color.status.warning.bg` | `{color.status.warning.900}` |  |
| `color.status.warning.fg` | `{color.status.warning.300}` |  |
| `color.surface.glass` | `{color.alpha.ink.62}` | Floating glass shell — pair with backdrop-filter blur(20px) saturate(140%). v0.11.13 — references the canvas-anchored alpha primitive. v0.12 — alpha ink anchor moved with the recol… |
| `color.surface.input.disabled` | `{color.brand.900}` | Sunken bg signals 'not interactive'. Paired with disabled border + text. |
| `color.surface.input.focus` | `{color.brand.700}` |  |
| `color.surface.input.hover` | `{color.brand.700}` |  |
| `color.surface.input.read-only` | `{color.brand.700}` | Read-only keeps full contrast — same bg as rest. Caret hidden, content selectable. |
| `color.surface.input.rest` | `{color.brand.700}` | Same as surface.raised; named role for input bg. |
| `color.surface.inverse` | `{color.neutral.50}` |  |
| `color.surface.overlay` | `{color.alpha.ink.86}` | Translucent backdrop for sticky chrome. v0.11.13 — references {color.alpha.ink.86}. v0.12 — ink anchor moved to neutral #0D0D0D. |
| `color.surface.page` | `{color.brand.800}` | Obsidian canvas #0D0D0D — user-fixed v0.12 brand dark (was #171A18 obsidian-mint pre-v0.12). |
| `color.surface.popover` | `{color.brand.600}` | Floating popover surface #1F1F1F — v0.12 (was #232624). Sits ~9.5% L vs canvas ~5.1% L on the neutral ramp. |
| `color.surface.raised` | `{color.brand.700}` | Raised surface #151515 — sits subtly above canvas via lightness alone (no chromatic tilt). v0.12 retune from #1B1E1C — the v0.11.11 'restrained mint tilt' is fully retired in v0.12… |
| `color.surface.scrim` | `{color.alpha.void.72}` | Modal scrim. v0.11.13 — references {color.alpha.void.72} (anchored to brand.950, which is #050505 in v0.12 / was #060807 pre-v0.12) so the scrim reads ~18% darker than canvas-ancho… |
| `color.surface.sunken` | `{color.brand.900}` | Sunken / scrim base #080808 — v0.12 (was #0E110F). |
| `color.surface.tint-accent` | `{color.alpha.accent.12}` | Spring-green tint for hover / selection backgrounds. |
| `color.text.accent` | `{color.accent.300}` | Laser spring-green for inline emphasis on dark. ~10.4:1 — AAA. |
| `color.text.disabled` | `{color.brand.400}` | Text inside disabled controls. v0.14.1 R12 — aligned with tertiary at brand.400 (#6B6B6B, 3.65:1). The disabled STATE is distinguished from tertiary through surface (input.disabled… |
| `color.text.error` | `{color.status.danger.300}` | v0.11 — softened error text on canvas. ~7.0:1 on the v0.12 neutral canvas — AA Normal (was ~6.5:1 on v0.11 obsidian-mint). Distinct from status.danger.fg which is the badge text on… |
| `color.text.inverse` | `{color.brand.800}` | Text on inverse light surfaces. |
| `color.text.link` | `{color.brand.100}` |  |
| `color.text.placeholder` | `{color.brand.400}` | Input placeholder. Alias of tertiary; carries its own role for theming. |
| `color.text.primary` | `{color.brand.100}` | Body and titles — #E6E6E6, the user-fixed brand light value. Contrast ~15.5:1 on the v0.12 neutral obsidian canvas (#0D0D0D) — AAA. Was 13.7:1 on the v0.11 obsidian-mint canvas (#1… |
| `color.text.secondary` | `{color.brand.300}` | Captions, descriptions. ~6.9:1 on the v0.12 canvas — AA Normal (was ~6.4:1 on the v0.11 obsidian-mint canvas). |
| `color.text.success` | `{color.accent.300}` | v0.6 — success text. Reuses accent ramp; spring green is action/live/success. |
| `color.text.tertiary` | `{color.brand.400}` | Hints, eyebrow labels. ~3.65:1 on the v0.12 canvas — AA Large only (≥18px). Held at the same contrast tier as v0.11 (was 3.6:1). |
| `color.text.warning` | `{color.status.warning.300}` | v0.11 — warning text. ~9.5:1 on the v0.12 neutral canvas — AAA (was ~9.1:1 on v0.11 obsidian-mint). v0.11.13 — references the {color.status.warning.300} primitive (was inlined #F5D… |

### `semantic/color.invariant.tokens.json` (6 tokens)

> v0.13.2 — Theme-invariant color semantic additions. Mirrors the corresponding entries in `color.dark.tokens.json` + `color.light.tokens.json` for the keys that DON'T change between themes: `text.on-action`, `text.on-avatar`, `status.{tone}.…

| Token path | Value / alias | Description |
|---|---|---|
| `color.status.danger.border` | `{color.status.danger.500}` | Danger border tone. Refined red #E5484D. Used by Alert / Banner / ValidationMessage / Field (error state). |
| `color.status.info.border` | `{color.accent.500}` | Info border tone. Cool-neutral / accent — info never gets a second loud color. Per ADR 0018 Premium Psychology contract. |
| `color.status.success.border` | `{color.accent.500}` | Success border tone. Spring Green per the single-accent rule (success rides the accent ramp). Used by Alert / Banner / ValidationMessage / Field (success state). |
| `color.status.warning.border` | `{color.status.warning.500}` | Warning border tone. Refined amber #F5B118. Used by Alert / Banner / ValidationMessage / Field (warning state). |
| `color.text.on-action` | `{color.accent.fg}` | v0.13.2 — Text color when painted ON an action surface (primary button bg, action accent bg). Near-black `#07120D`, 14.7:1 AAA on Spring Green. Theme-invariant — the accent surface… |
| `color.text.on-avatar` | `{color.absolute.white}` | v0.13.2 — Text color when painted ON an avatar fallback bg (initials, monogram). White at high contrast against any of the 8 avatar palette positions in `color.avatar.bg.*`. |

### `semantic/color.light.tokens.json` (114 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `color.action.ai.bg.hover` | `{color.alpha.accent.24}` |  |
| `color.action.ai.bg.press` | `{color.alpha.accent.32}` |  |
| `color.action.ai.bg.rest` | `{color.alpha.accent.12}` |  |
| `color.action.ai.border` | `{color.alpha.accent.40}` |  |
| `color.action.ai.fg` | `{color.accent.800}` | Deep accent on neutral — 4.6:1 AA pass. |
| `color.action.danger-soft.bg.hover` | `{color.alpha.danger.08}` |  |
| `color.action.danger-soft.bg.press` | `{color.alpha.danger.14}` |  |
| `color.action.danger-soft.bg.rest` | `transparent` |  |
| `color.action.danger-soft.fg` | `{color.status.danger.700}` |  |
| `color.action.danger.bg.hover` | `{color.status.danger.800}` |  |
| `color.action.danger.bg.press` | `{color.status.danger.800}` |  |
| `color.action.danger.bg.rest` | `{color.status.danger.700}` |  |
| `color.action.danger.border` | `transparent` |  |
| `color.action.danger.fg` | `{color.absolute.white}` | v0.11.13 — references {color.absolute.white}. |
| `color.action.ghost.bg.hover` | `{color.alpha.ink.06}` |  |
| `color.action.ghost.bg.press` | `{color.alpha.ink.08}` |  |
| `color.action.ghost.bg.rest` | `transparent` |  |
| `color.action.ghost.fg` | `{color.neutral.900}` |  |
| `color.action.glass.bg.hover` | `{color.alpha.paper.84}` |  |
| `color.action.glass.bg.press` | `{color.alpha.paper.94}` |  |
| `color.action.glass.bg.rest` | `{color.surface.glass}` |  |
| `color.action.glass.border` | `{color.alpha.ink.12}` |  |
| `color.action.glass.fg` | `{color.neutral.900}` |  |
| `color.action.outline.bg.hover` | `{color.alpha.ink.04}` |  |
| `color.action.outline.bg.press` | `{color.alpha.ink.08}` |  |
| `color.action.outline.bg.rest` | `transparent` |  |
| `color.action.outline.border.hover` | `{color.alpha.ink.24}` |  |
| `color.action.outline.border.rest` | `{color.alpha.ink.16}` |  |
| `color.action.outline.fg` | `{color.neutral.900}` |  |
| `color.action.primary.bg.hover` | `{color.accent.600}` |  |
| `color.action.primary.bg.press` | `{color.accent.700}` |  |
| `color.action.primary.bg.rest` | `{color.accent.500}` |  |
| `color.action.primary.border` | `transparent` |  |
| `color.action.primary.fg` | `{color.accent.fg}` | Near-black-mint #07120D on spring green — 14.7:1 AAA. Single-source for both themes. |
| `color.action.primary.glow` | `{shadow.accent-glow}` |  |
| `color.action.secondary.bg.hover` | `{color.neutral.100}` |  |
| `color.action.secondary.bg.press` | `{color.neutral.100}` |  |
| `color.action.secondary.bg.rest` | `{color.absolute.white}` | v0.11.13 — references {color.absolute.white}. |
| `color.action.secondary.border` | `{color.alpha.ink.12}` |  |
| `color.action.secondary.fg` | `{color.neutral.900}` |  |
| `color.action.selected.bg` | `{color.alpha.accent.12}` |  |
| `color.action.selected.border` | `{color.accent.500}` |  |
| `color.action.selected.fg` | `{color.neutral.900}` |  |
| `color.action.success.bg` | `{color.alpha.accent.24}` |  |
| `color.action.success.border` | `{color.alpha.accent.40}` |  |
| `color.action.success.fg` | `{color.accent.800}` |  |
| `color.action.tertiary.bg.hover` | `{color.neutral.100}` |  |
| `color.action.tertiary.bg.press` | `{color.neutral.100}` |  |
| `color.action.tertiary.bg.rest` | `transparent` |  |
| `color.action.tertiary.fg` | `{color.neutral.900}` |  |
| `color.aurora.color` | `{color.alpha.accent.24}` |  |
| `color.aurora.core` | `{color.alpha.accent.40}` |  |
| `color.avatar.bg.1` | `{color.accent.700}` | Deep spring green. |
| `color.avatar.bg.2` | `{color.neutral.700}` | Deep cream. |
| `color.avatar.bg.3` | `{color.status.warning.700}` | Deep amber. |
| `color.avatar.bg.4` | `{color.status.danger.700}` | Deep red. |
| `color.avatar.bg.5` | `{color.brand.500}` | Mid obsidian. |
| `color.avatar.bg.6` | `{color.accent.500}` | Bright spring green. |
| `color.avatar.bg.7` | `{color.neutral.500}` | Mid cream. |
| `color.avatar.bg.8` | `{color.status.danger.300}` | Soft red. |
| `color.border.accent` | `{color.accent.700}` | Accent hairline (deeper green for AAA on light) |
| `color.border.default` | `{color.alpha.ink.12}` | Standard control border. |
| `color.border.disabled` | `{color.alpha.ink.06}` | v0.6 — input disabled border. Muted; no hover/focus. |
| `color.border.error` | `{color.status.danger.500}` | v0.6 — input error border. Refined red for AA stroke contrast. |
| `color.border.focus` | `{color.accent.500}` | Focus ring color. Always paired with shadow.focus. |
| `color.border.frame` | `{color.alpha.ink.40}` | v0.4 — brutalist hairline frame border |
| `color.border.hairline` | `{color.alpha.ink.06}` | Default hairline. Cards, table rows, dividers. The breathing-room separator (per principles §1, §3). |
| `color.border.strong` | `{color.alpha.ink.24}` | Emphasis dividers. |
| `color.border.subtle` | `{color.alpha.ink.08}` | v0.11.13 — references {color.alpha.ink.08} (was inlined rgba(23,26,24,0.08)). |
| `color.border.success` | `{color.accent.500}` | v0.6 — input success border. Spring green; only after explicit validation. |
| `color.border.warning` | `{color.status.warning.500}` | v0.6 — input warning border. Refined amber. |
| `color.chart.1` | `{color.accent.500}` | Spring Green — current / active series. ONE per chart. |
| `color.chart.2` | `{color.neutral.500}` | Cream — secondary series. |
| `color.chart.3` | `{color.status.warning.500}` | Amber — tertiary series. |
| `color.chart.4` | `{color.status.danger.500}` | Red — quaternary series. |
| `color.chart.5` | `{color.brand.500}` | Obsidian mid-grey — quinary. |
| `color.chart.6` | `{color.accent.700}` | Deep Accent — senary. |
| `color.chart.7` | `{color.brand.300}` | Placeholder (light variant of position 7). |
| `color.chart.8` | `{color.status.warning.700}` | Placeholder (light variant of position 8). |
| `color.status.danger.bg` | `{color.status.danger.50}` |  |
| `color.status.danger.fg` | `{color.status.danger.700}` |  |
| `color.status.info.bg` | `{color.accent.50}` |  |
| `color.status.info.fg` | `{color.accent.800}` |  |
| `color.status.neutral.bg` | `{color.neutral.100}` | Raised neutral surface #F1F2F1 — 16.5:1 on cream-9 ink (AAA). |
| `color.status.neutral.fg` | `{color.neutral.900}` | Cool-neutral deep ink #141615. |
| `color.status.success.bg` | `{color.accent.50}` |  |
| `color.status.success.fg` | `{color.accent.800}` |  |
| `color.status.warning.bg` | `{color.status.warning.50}` |  |
| `color.status.warning.fg` | `{color.status.warning.700}` |  |
| `color.surface.glass` | `{color.alpha.paper.72}` | Floating glass shell — pair with backdrop-filter blur(20px) saturate(140%). v0.11.13 — references {color.alpha.paper.72}. |
| `color.surface.input.disabled` | `{color.neutral.50}` | Even quieter than rest. |
| `color.surface.input.focus` | `{color.absolute.white}` | Pop to paper-white on focus — cognitive-fluency cue: 'you have my attention'. v0.11.13 — references {color.absolute.white}. |
| `color.surface.input.hover` | `{color.neutral.200}` |  |
| `color.surface.input.read-only` | `{color.neutral.200}` |  |
| `color.surface.input.rest` | `{color.neutral.200}` | Sunken neutral — inset feel against paper. v0.11 anchored to user-fixed #E6E6E6. |
| `color.surface.inverse` | `{color.brand.800}` | Dark surface for contrast moments in light mode (CTA bands, footers). |
| `color.surface.overlay` | `{color.alpha.paper.84}` | Translucent backdrop for sticky chrome. |
| `color.surface.page` | `{color.neutral.50}` | Paper canvas #FAFAFA — clean off-white. v0.12 — fully neutral (the v0.11 'whisper of warmth' was 0.4% above neutral; v0.12 normalizes the full neutral ramp). Replaces v0.10 cream p… |
| `color.surface.popover` | `{color.absolute.white}` | Floating popover surface. v0.11.13 — references {color.absolute.white}. |
| `color.surface.raised` | `{color.absolute.white}` | Cards, panels, raised surfaces. Pure white pops above paper canvas. v0.11.13 — references {color.absolute.white}. |
| `color.surface.scrim` | `{color.alpha.ink.40}` | Modal backdrop. |
| `color.surface.sunken` | `{color.neutral.200}` | Inputs, table-row hover, sidebar — anchored to user-fixed #E6E6E6. |
| `color.surface.tint-accent` | `{color.alpha.accent.12}` | Spring-green tint for hover / selection backgrounds. |
| `color.text.accent` | `{color.accent.800}` | Spring-green text on light surfaces. 4.6:1 on paper — AA at 14px+. |
| `color.text.disabled` | `{color.neutral.400}` |  |
| `color.text.error` | `{color.status.danger.700}` | v0.6 — error text on light surface. Deep red for AA. |
| `color.text.inverse` | `{color.brand.100}` |  |
| `color.text.link` | `{color.neutral.900}` |  |
| `color.text.placeholder` | `{color.neutral.500}` | Input placeholder. AA-safe at 14px+. Distinct alias from tertiary so it can theme independently. |
| `color.text.primary` | `{color.neutral.900}` | Body and titles — #141615. Contrast 17.2:1 on paper canvas. |
| `color.text.secondary` | `{color.neutral.700}` | Captions, descriptions. ~10.5:1 — AAA. |
| `color.text.success` | `{color.status.success.700}` | v0.6 — success text. Deep accent for AA. |
| `color.text.tertiary` | `{color.neutral.500}` | Hints, eyebrow labels. ~5.4:1 — AA Normal. |
| `color.text.warning` | `{color.status.warning.700}` | v0.6 — warning text. Deep amber for AA. |

### `semantic/motion.tokens.json` (8 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `motion.duration.shimmer` | `{motion.duration.slower}` | 1.5 s — Skeleton loading shimmer cycle. Slow enough that the reader's eye doesn't grab; reduced-motion replaces with a static muted background. |
| `motion.duration.spin` | `{ value: 1000, unit: ms }` | 1 s — Spinner full-rotation period. Standard easing; reduced-motion replaces with a static dot-pulse. |
| `motion.transition.accelerate` | `{ duration: {motion.duration.base}, delay: {"value":0,"unit":"ms"}, timingFunction: {motio…` |  |
| `motion.transition.base` | `{ duration: {motion.duration.base}, delay: {"value":0,"unit":"ms"}, timingFunction: {motio…` | Default UI feedback |
| `motion.transition.decelerate` | `{ duration: {motion.duration.slow}, delay: {"value":0,"unit":"ms"}, timingFunction: {motio…` |  |
| `motion.transition.fast` | `{ duration: {motion.duration.fast}, delay: {"value":0,"unit":"ms"}, timingFunction: {motio…` | Hover, micro-feedback |
| `motion.transition.page` | `{ duration: {motion.duration.slower}, delay: {"value":0,"unit":"ms"}, timingFunction: {mot…` | Page-level transitions |
| `motion.transition.slow` | `{ duration: {motion.duration.slow}, delay: {"value":0,"unit":"ms"}, timingFunction: {motio…` | State changes |

### `semantic/radius.tokens.json` (10 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `radius.card.default` | `{radius.lg}` |  |
| `radius.card.hero` | `{radius.2xl}` |  |
| `radius.card.lifted` | `{radius.xl}` |  |
| `radius.card.marketing` | `{radius.3xl}` |  |
| `radius.circle` | `{radius.full}` |  |
| `radius.control.lg` | `{radius.lg}` |  |
| `radius.control.md` | `{radius.md}` | Buttons and inputs |
| `radius.control.sm` | `{radius.sm}` |  |
| `radius.pill` | `{radius.full}` |  |
| `radius.popover` | `{radius.lg}` | Listbox / dropdown / menu / tooltip radius. Matches card.default for visual continuity. |

### `semantic/shadow.tokens.json` (24 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `shadow.button.ai-shimmer` | `{ 0: {"color":"var(--border-frame)","offsetX" }` | v0.14 R11 — AI-action shimmer border is now neutral (was accent-32). Animation cycles between border-frame (rest), border-strong (peak), with a neutral paper-alpha halo at the peak… |
| `shadow.button.glow.active` | `none` | v0.14 R11 — was 8px @ accent-20; now `none`. Active state carries via filter: brightness(0.92), not via shadow. |
| `shadow.button.glow.hover` | `{shadow.md}` | v0.14 R11 — was 20px @ accent-28; now aliases the neutral shadow.md lift. The hover affordance is a neutral elevation, not a green glow. |
| `shadow.button.glow.rest` | `none` | v0.14 R11 — was 16px @ accent-25; now `none`. The green button background is the brand affordance at rest; the surrounding halo retired. |
| `shadow.card` | `{shadow.sm}` | Cards default to a hairline border with this very subtle shadow. Reach for shadow.lifted only when card is genuinely lifting. |
| `shadow.elevation.lg` | `{shadow.lg}` | Strong lift. Popover, dropdown menu, floating action. |
| `shadow.elevation.md` | `{shadow.md}` | Standard lift. Lifted Card, BottomNav inset, sticky chrome. |
| `shadow.elevation.sm` | `{shadow.sm}` | Subtle lift. Card resting, input focus halo, slider thumb shadow. |
| `shadow.floating` | `{shadow.2xl}` |  |
| `shadow.focus` | `{ 0: {"color":"var(--border-frame)","offsetX" }` | v0.14 R11 — focus indicator goes neutral. Was a 3 px spring-green halo at accent-32; now a 3 px theme-aware paper/ink ring at 40 % alpha (--border-frame). Per AGENTS.md hard rule 2… |
| `shadow.focus.dual.inner` | `{ 0: {"color":"var(--surface-canvas)","offset }` | Inner separator ring — paints the page canvas color, creating a 2 px gap between the button and the outer neutral ring. |
| `shadow.focus.dual.outer` | `{ 0: {"color":"var(--border-frame)","offsetX" }` | v0.14 R11 — outer 2 px neutral ring (was lime). 40 %-alpha theme-aware paper/ink — passes 3:1 against canvas regardless of button surface. |
| `shadow.focus.dual.stack` | `{ 0: {"color":"var(--surface-canvas)","offset, 1: {"color":"var(--border-frame)","offsetX"…` | v0.14 R11 — composed dual-ring (inner + outer). Apply as a single box-shadow on focus-visible. The underlying source-of-truth is color.surface.page (inner) and color.border.frame (… |
| `shadow.glow.accent` | `{shadow.accent-glow}` | v0.14 R11 — was a spring-green glow; now resolves through shadow.accent-glow which itself aliases to a neutral elevation. The semantic name is preserved so component contracts don'… |
| `shadow.input.error` | `{ 0: {"color":"{color.alpha.danger.32}","offs }` | v0.6 — error halo. Painted on focus when [data-invalid=true]; replaces (not stacks with) shadow.input.focus. Error keeps red because red is a validation tone, distinct from action/… |
| `shadow.input.focus` | `{ 0: {"color":"var(--border-frame)","offsetX" }` | v0.14 R11 — focus halo on .lumen-field wrapper is neutral (was accent-32). border-frame is 40 %-alpha theme-aware; passes WCAG 2.4.13 on every surface. Inputs no longer signal focu… |
| `shadow.input.lit-edge` | `{ 0: {"color":"{color.alpha.paper.06}","offse }` | 1px lit top edge — steals the glass-pane reflection trick from glassmorphism without committing to full glass. Dark mode only; no-op on light. v0.11.13 — references color.alpha.pap… |
| `shadow.input.success` | `{ 0: {"color":"var(--border-frame)","offsetX" }` | v0.14 R11 — success halo is neutral (was accent-32). The post-validation success affordance is now communicated via a brief check icon + the field returning to default border — not… |
| `shadow.kbd` | `{ 0: {"color":"{color.alpha.shadow.04}","offs }` | v0.13.2 — keyboard-chrome subtle inset shadow. Used by Kbd primitive to suggest a 1-pixel raised key edge without the heaviness of a full shadow.md. |
| `shadow.lifted` | `{shadow.md}` |  |
| `shadow.menu` | `{shadow.lg}` |  |
| `shadow.modal` | `{shadow.xl}` |  |
| `shadow.popover` | `{shadow.lg}` |  |
| `shadow.toast` | `{shadow.lg}` |  |

### `semantic/size.tokens.json` (34 tokens)

> v0.13.2 — Component-bound semantic size aliases. Closes the validate:tokens gap where component contracts referenced size.{avatar,banner,bottom-nav,calendar,drawer,kanban,list,navbar,phone,popover,sidebar,slider,table,tree}.* without those …

| Token path | Value / alias | Description |
|---|---|---|
| `size.avatar.lg` | `{dimension.10}` | 40 px — header bar / settings-panel profile. |
| `size.avatar.md` | `{dimension.8}` | 32 px — default; sidebar profile chip, comment thread. |
| `size.avatar.sm` | `{dimension.6}` | 24 px — dense list row, table cell. |
| `size.avatar.xl` | `{dimension.14}` | 56 px — profile-page hero. |
| `size.avatar.xs` | `{dimension.5}` | 20 px — inline-text avatar (chat by-line, comment lead-glyph). |
| `size.banner.compact` | `{dimension.10}` | 40 px — single-line system status (operator default). |
| `size.bottom-nav.compact` | `{dimension.12}` | 48 px — operator-density. |
| `size.bottom-nav.regular` | `{dimension.14}` | 56 px — iOS / Android standard tab bar. |
| `size.calendar.day` | `{dimension.8}` | 32 px — square day cell. Touch floor honored by tap-area padding around the visible cell on mobile. |
| `size.drawer.lg` | `{ value: 480, unit: px }` | 480 px — wide Drawer; detail view, form panel. |
| `size.drawer.md` | `{ value: 360, unit: px }` | 360 px — default Drawer; settings panel, inspector. |
| `size.drawer.sm` | `{dimension.64}` | 256 px — narrow nav drawer / filter panel. |
| `size.kanban.column` | `{ value: 280, unit: px }` | 280 px — standard Kanban column. Wide enough for a 2-3 line title + tags + meta row; narrow enough that 3+ columns fit on a 1024-wide viewport. |
| `size.list.row.comfortable` | `{dimension.14}` | 56 px — marketing / showcase list, mobile leading-image row. |
| `size.list.row.compact` | `{dimension.10}` | 40 px — dense settings list, operator inbox. |
| `size.list.row.regular` | `{dimension.12}` | 48 px — default list row. Touch-target floor (44) honored by inner tap-area padding. |
| `size.navbar.compact` | `{dimension.12}` | 48 px — operator-density tool surface. |
| `size.navbar.marketing` | `{dimension.16}` | 64 px — landing / marketing. |
| `size.navbar.mobile` | `{dimension.11}` | 44 px — iOS / Android default; touch-target floor. |
| `size.phone.lg` | `{ value: 414, unit: px }` | 414 px — iPhone Pro Max. |
| `size.phone.md` | `{ value: 360, unit: px }` | 360 px — iPhone 14/15 default; Android baseline. |
| `size.phone.sm` | `{ value: 320, unit: px }` | 320 px — iPhone SE (1st-gen) outer width. |
| `size.popover.lg` | `{ value: 360, unit: px }` | 360 px — wide Popover; rich content (Combobox results, color picker). |
| `size.popover.md` | `{ value: 280, unit: px }` | 280 px — default; mixed menu with icons + labels + shortcuts. |
| `size.popover.sm` | `{ value: 200, unit: px }` | 200 px — compact menu (3-5 short options). |
| `size.sidebar.expanded` | `{ value: 240, unit: px }` | 240 px — labeled expanded sidebar. |
| `size.sidebar.rail` | `{dimension.16}` | 64 px — icon-only collapsed rail. Touch floor honored by item padding. |
| `size.slider.thumb` | `{ value: 18, unit: px }` | 18 px — round draggable handle; tactile under-cursor feel without obscuring track marks. |
| `size.slider.track` | `{dimension.1}` | 4 px — track height. Hairline-rounded; filled region uses accent. |
| `size.table.row.comfortable` | `{dimension.12}` | 48 px — settings table / marketing comparison. |
| `size.table.row.compact` | `{dimension.9}` | 36 px — dense data-grid (power-user). |
| `size.table.row.regular` | `{dimension.11}` | 44 px — default operator-table row (matches touch floor). |
| `size.tree.row.compact` | `{dimension.8}` | 32 px — dense (file-explorer feel). |
| `size.tree.row.regular` | `{dimension.10}` | 40 px — default. |

### `semantic/space.tokens.json` (55 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `space.0` | `{dimension.0}` |  |
| `space.1` | `{dimension.1}` |  |
| `space.1_5` | `{dimension.1_5}` | v0.8 — 6 px sub-grid for optical adjustment. |
| `space.10` | `{dimension.10}` |  |
| `space.11` | `{dimension.11}` | v0.8 — 44 px (touch target floor). |
| `space.12` | `{dimension.12}` |  |
| `space.14` | `{dimension.14}` | v0.8 — 56 px (button.xl, hero pill CTA). |
| `space.16` | `{dimension.16}` |  |
| `space.2` | `{dimension.2}` |  |
| `space.20` | `{dimension.20}` |  |
| `space.24` | `{dimension.24}` |  |
| `space.3` | `{dimension.3}` |  |
| `space.32` | `{dimension.32}` |  |
| `space.4` | `{dimension.4}` |  |
| `space.40` | `{dimension.40}` |  |
| `space.48` | `{dimension.48}` |  |
| `space.5` | `{dimension.5}` |  |
| `space.6` | `{dimension.6}` |  |
| `space.64` | `{dimension.64}` |  |
| `space.7` | `{dimension.7}` | v0.8 — 28 px (segmented bar segment). |
| `space.8` | `{dimension.8}` |  |
| `space.9` | `{dimension.9}` | v0.8 — 36 px (switch track, cozy tier). |
| `space.inline.lg` | `{dimension.4}` |  |
| `space.inline.md` | `{dimension.3}` |  |
| `space.inline.sm` | `{dimension.2}` |  |
| `space.inline.xs` | `{dimension.1}` |  |
| `space.inset.2xl` | `{dimension.10}` | 40 px — hero card padding (.lumen-card[data-padding=hero]). |
| `space.inset.lg` | `{dimension.4}` | 16 px — input padding-x at lg, card md padding. |
| `space.inset.md` | `{dimension.3}` | 12 px — input padding-x at md, card sm padding. |
| `space.inset.sm` | `{dimension.2}` | 8 px — input padding-y at md, button padding-y at sm. |
| `space.inset.squish.lg` | `{ x: {dimension.4}, y: {dimension.3} }` | 16/12 — lg button. |
| `space.inset.squish.md` | `{ x: {dimension.3}, y: {dimension.2} }` | 12/8 — md button. |
| `space.inset.squish.sm` | `{ x: {dimension.2}, y: {dimension.1} }` | 8/4 — sm button/chip. |
| `space.inset.stretch.md` | `{ x: {dimension.3}, y: {dimension.4} }` |  |
| `space.inset.stretch.sm` | `{ x: {dimension.2}, y: {dimension.3} }` |  |
| `space.inset.xl` | `{dimension.6}` | 24 px — card lg / default padding. |
| `space.inset.xs` | `{dimension.1}` | 4 px — input padding-y at sm. |
| `space.page.lg` | `{dimension.8}` |  |
| `space.page.md` | `{dimension.6}` |  |
| `space.page.sm` | `{dimension.4}` |  |
| `space.section.dense` | `{dimension.6}` | v0.8 — 24 px operator-dashboard section break. Aliased as .operator. |
| `space.section.hero` | `{dimension.24}` | v0.8 — 96 px Vercel-style marketing hero. Used on /landing. |
| `space.section.lg` | `{dimension.16}` | 64 px marketing band. |
| `space.section.marketing` | `{space.section.lg}` | v0.8 alias — marketing pages default to lg. |
| `space.section.md` | `{dimension.12}` | v0.8 — 48 px default band (was 48 px; unchanged). |
| `space.section.operator` | `{space.section.dense}` | v0.8 alias — operator dashboards default to dense. |
| `space.section.sm` | `{dimension.8}` | v0.8 — 32 px tight band (was 40 px in v0.7; reduced to converge with Linear). |
| `space.section.xl` | `{dimension.20}` | 80 px hero/brutalist band. |
| `space.stack.lg` | `{dimension.6}` |  |
| `space.stack.md` | `{dimension.4}` |  |
| `space.stack.sm` | `{dimension.3}` |  |
| `space.stack.xl` | `{dimension.10}` |  |
| `space.stack.xs` | `{dimension.2}` |  |
| `space.table.cell.compact` | `{dimension.3}` | 12 px — operator-table column gap. |
| `space.table.cell.gap` | `{dimension.4}` | 16 px — default column gap. |

### `semantic/type.tokens.json` (46 tokens)

> Lumen semantic typography presets — v0.10. Composes primitive tokens into single bundles that components consume. Six role groups: display (marketing impact), heading (app structure), body (paragraph), label (UI controls), data (tabular num…

| Token path | Value / alias | Description |
|---|---|---|
| `type.body.lg` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.18}, fontWeight: {font.weight.regul…` | Lead paragraph, marketing deck under display headlines. |
| `type.body.md` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.16}, fontWeight: {font.weight.regul…` | Default body. Reading-comfortable 16/25 (1.55). |
| `type.body.sm` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.14}, fontWeight: {font.weight.regul…` | Secondary body, helper text, dense table cell prose. |
| `type.body.tabular` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.16}, fontWeight: {font.weight.regul…` | Body sized but with tabular nums. Use in any paragraph that mixes numbers needing alignment (rate quotes inline in prose, ledger explanations). |
| `type.body.xs` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.13}, fontWeight: {font.weight.regul…` | Smallest body — dense table description column, helper text on small controls. |
| `type.caption` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.13}, fontWeight: {font.weight.regul…` | Photo caption, image alt rendered visible, helper text. |
| `type.code.block` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.13}, fontWeight: {font.weight.regul…` | Code block (snippet, sample). Programming ligatures ON. |
| `type.code.inline` | `{ fontFamily: {font.family.sans}, fontSize: {"value":0.9286,"unit":"em"}, fontWeight: {fon…` | Inline `code` in body. Relative size (0.9286em) holds inline code at a slightly smaller cap-height than surrounding body so it reads as 'set apart' without breaking line rhythm. v0… |
| `type.code.md` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.14}, fontWeight: {font.weight.regul…` | v0.13.2 — Default CodeBlock body. Pair with `Kbd` for inline keyboard cues. |
| `type.code.sm` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.12}, fontWeight: {font.weight.regul…` | v0.13.2 — Small code (dense logs, file paths). Lower-density of `block`. |
| `type.code.terminal` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.13}, fontWeight: {font.weight.regul…` | Terminal output, diff view, command-line samples. Ligatures OFF — operators must read as discrete tokens. Tabular for column-aligned output. |
| `type.data.lg` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.20}, fontWeight: {font.weight.mediu…` | Stat secondary metric, prominent table cell value. |
| `type.data.md` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.16}, fontWeight: {font.weight.mediu…` | Default tabular cell — money column, weight, ETA. |
| `type.data.sm` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.14}, fontWeight: {font.weight.regul…` | Compact table — DRY-93H7 IDs, inline timestamps, dense ledgers. |
| `type.display-italic-accent` | `{ fontFamily: {font.family.sans}, fontStyle: italic, fontSize: {font.size.96}, fontWeight:…` | The 'one italic word per hero' moment. Pairs with display.2xl/xl. Renders in text-accent (lime). Reserved — at most one per page. |
| `type.display.2xl` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.96}, fontWeight: {font.weight.bold}…` | Landing-page hero headline. Pairs with body.lg for the deck. |
| `type.display.hero` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.128}, fontWeight: {font.weight.blac…` | v0.4/v0.5 brutalist hero — one-word brand statements ('SHIP FREIGHT', 'BUILT FOR BUILDERS'). Reserved. Use at most once per page. Pair with display.italic.accent for the optional o… |
| `type.display.lg` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.49}, fontWeight: {font.weight.bold}…` | Section opener (marketing). Pairs with body.md. |
| `type.display.md` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.39}, fontWeight: {font.weight.bold}…` | Marketing page title. |
| `type.display.sm` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.28}, fontWeight: {font.weight.bold}…` | Bridge between heading.h1 and display.md. Card cover, modal hero. |
| `type.display.xl` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.76}, fontWeight: {font.weight.bold}…` | Marketing landing default hero. Pairs with body.lg deck. |
| `type.eyebrow.mono` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.12}, fontWeight: {font.weight.mediu…` | v0.4+ system-metadata signature — '[•] SYSTEM V0.10 LIVE', '@ DIGITAL HQ', 'INVITES IN:'. Wide-tracked uppercase (0.16em) with calt off + tnum + case feature flags so caps sit on a… |
| `type.eyebrow.sans` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.12}, fontWeight: {font.weight.mediu…` | Section eyebrow above display/heading. 'OPERATE', 'NETWORK', 'PRICING'. Renders in text-tertiary by default. |
| `type.heading.h1` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.31}, fontWeight: {font.weight.bold}…` | Page title (app). 31/36 grid-aligned (1.16). |
| `type.heading.h2` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.25}, fontWeight: {font.weight.semib…` | Section header. 25/30 (1.20). |
| `type.heading.h3` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.20}, fontWeight: {font.weight.semib…` | Subsection. Apple's optical-size threshold — at 20px and above, switch to display tracking. |
| `type.heading.h4` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.17}, fontWeight: {font.weight.semib…` | Card title, list section header. 17/24. |
| `type.heading.h5` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.15}, fontWeight: {font.weight.semib…` | Settings group title, dialog section. |
| `type.heading.h6` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.13}, fontWeight: {font.weight.semib…` | Smallest distinct heading. Form field-group title. |
| `type.kbd` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.11}, fontWeight: {font.weight.mediu…` | Keyboard shortcut glyph. ⌘ K · ⇧ ⌘ S. Always inside a .lumen-kbd container. |
| `type.label.lg` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.16}, fontWeight: {font.weight.mediu…` | Large button, primary CTA label, large tab. |
| `type.label.md` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.14}, fontWeight: {font.weight.mediu…` | Default button text, default tab. The most-used label. |
| `type.label.sm` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.13}, fontWeight: {font.weight.mediu…` | Compact button, dense table action. |
| `type.lead` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.20}, fontWeight: {font.weight.regul…` | Hero/section deck — descriptive line under display.* or heading.h1. Renders in text-secondary. |
| `type.metric.lg` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.49}, fontWeight: {font.weight.bold}…` | Stat primary — page-level KPI block. |
| `type.metric.md` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.31}, fontWeight: {font.weight.bold}…` | Stat default — card-level KPI. |
| `type.metric.sm` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.20}, fontWeight: {font.weight.semib…` | Stat compact — sidebar KPI, table summary row. |
| `type.metric.xl` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.61}, fontWeight: {font.weight.bold}…` | Hero KPI — landing-page revenue counter, marquee dashboard. |
| `type.micro` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.12}, fontWeight: {font.weight.mediu…` | Badge body, timestamp, hint, tooltip body. |
| `type.overline` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.11}, fontWeight: {font.weight.mediu…` | Chart axis label, sub-eyebrow secondary uppercase. Lighter tracking than eyebrow. Renders in text-tertiary. |
| `type.prose.body` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.18}, fontWeight: {font.weight.regul…` | Longform reading body. 60–75ch measure recommended. |
| `type.prose.lead` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.22}, fontWeight: {font.weight.regul…` | Longform lead paragraph (under article title). |
| `type.prose.subtitle` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.25}, fontWeight: {font.weight.regul…` | Article subtitle, section heading inside prose. |
| `type.prose.title` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.49}, fontWeight: {font.weight.semib…` | Article title (blog, press, changelog feature). Satoshi at heavy weight; v0.10 — opsz axis is reserved for a future variant. |
| `type.quote` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.31}, fontWeight: {font.weight.semib…` | Block quote — testimonial, customer voice. Italic optional via display.italic.accent override. |
| `type.tabular.nums` | `{ fontFamily: {font.family.sans}, fontSize: {font.size.14}, fontWeight: {font.weight.regul…` | Tabular monospaced digits + lining figures + slashed zero. Apply to ledgers, sparkline labels, table-cell numerics, KPI sub-labels, status-bar clock, code line numbers. Composes wi… |

## Component-bound — consumed by a single component's contract

### `components/button.tokens.json` (90 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `button.focus.neutral` | `{shadow.focus}` | Other intents — single 3 px neutral ring (border-frame at 40 % theme-aware alpha). Was lime at 32 % pre-R11. |
| `button.focus.primary` | `{shadow.focus.dual.stack}` | Primary intent (green bg) — dual ring; outer ring neutral border-frame, inner ring canvas-cream. |
| `button.gap.lg` | `{dimension.2}` | 8 px — icon-to-label gap on lg. |
| `button.gap.md` | `{dimension.2}` | 8 px — icon-to-label gap on md (default). |
| `button.gap.sm` | `{dimension.1_5}` | 6 px — icon-to-label gap on sm. |
| `button.gap.xl` | `{dimension.3}` | 12 px — icon-to-label gap on xl. Slightly looser to match the hero scale. |
| `button.gap.xs` | `{dimension.1}` | 4 px — icon-to-label gap on xs. |
| `button.height.cozy` | `{size.control.cozy}` | v0.8 — 36 px settings-panel sweet spot. Density tier between sm and md. |
| `button.height.lg` | `{size.control.lg}` | 48 px — mobile primary / modal CTA / full-width form submit. Hits the 44 px touch floor with margin. |
| `button.height.md` | `{size.control.md}` | 40 px — Lumen Button default. Comfortable for trackpad + desktop. |
| `button.height.sm` | `{size.control.sm}` | 32 px — compact toolbar / dense-form button. Linear/Carbon operator default. Desktop-density only. |
| `button.height.xl` | `{size.control.xl}` | v0.4 — 56 px hero pill CTA. Marketing + AI-action primary. |
| `button.height.xs` | `{size.control.xs}` | v0.9 — 24 px table-row inline action / chip-close. Desktop-density only; below the 44 px touch floor. |
| `button.icon.lg` | `{dimension.4}` | 16 px icon on 48 px button (label is 14–15 px). |
| `button.icon.md` | `{dimension.1_5}` | Override — 14 px (~13 px label + 1) — see button.tsx for the explicit size mapping. |
| `button.icon.sm` | `{dimension.3}` | 12 px icon on 32 px button. |
| `button.icon.xl` | `{dimension.5}` | 20 px icon on 56 px hero pill (label is 16–18 px). |
| `button.icon.xs` | `{dimension.3}` | 12 px icon on 24 px button. |
| `button.intent.ai.background.hover` | `{color.action.ai.bg.hover}` |  |
| `button.intent.ai.background.press` | `{color.action.ai.bg.press}` |  |
| `button.intent.ai.background.rest` | `{color.action.ai.bg.rest}` |  |
| `button.intent.ai.border` | `{color.action.ai.border}` |  |
| `button.intent.ai.foreground` | `{color.action.ai.fg}` |  |
| `button.intent.ai.shimmer` | `{shadow.button.ai-shimmer}` |  |
| `button.intent.danger-soft.background.hover` | `{color.action.danger-soft.bg.hover}` |  |
| `button.intent.danger-soft.background.press` | `{color.action.danger-soft.bg.press}` |  |
| `button.intent.danger-soft.background.rest` | `{color.action.danger-soft.bg.rest}` |  |
| `button.intent.danger-soft.foreground` | `{color.action.danger-soft.fg}` |  |
| `button.intent.danger.background.hover` | `{color.action.danger.bg.hover}` |  |
| `button.intent.danger.background.press` | `{color.action.danger.bg.press}` |  |
| `button.intent.danger.background.rest` | `{color.action.danger.bg.rest}` |  |
| `button.intent.danger.border` | `{color.action.danger.border}` |  |
| `button.intent.danger.foreground` | `{color.action.danger.fg}` |  |
| `button.intent.ghost.background.hover` | `{color.action.ghost.bg.hover}` |  |
| `button.intent.ghost.background.press` | `{color.action.ghost.bg.press}` |  |
| `button.intent.ghost.background.rest` | `{color.action.ghost.bg.rest}` |  |
| `button.intent.ghost.foreground` | `{color.action.ghost.fg}` |  |
| `button.intent.glass.background.hover` | `{color.action.glass.bg.hover}` |  |
| `button.intent.glass.background.press` | `{color.action.glass.bg.press}` |  |
| `button.intent.glass.background.rest` | `{color.action.glass.bg.rest}` |  |
| `button.intent.glass.blur` | `12px` |  |
| `button.intent.glass.border` | `{color.action.glass.border}` |  |
| `button.intent.glass.foreground` | `{color.action.glass.fg}` |  |
| `button.intent.primary.background.hover` | `{color.action.primary.bg.hover}` |  |
| `button.intent.primary.background.press` | `{color.action.primary.bg.press}` |  |
| `button.intent.primary.background.rest` | `{color.action.primary.bg.rest}` |  |
| `button.intent.primary.border` | `{color.action.primary.border}` |  |
| `button.intent.primary.foreground` | `{color.action.primary.fg}` |  |
| `button.intent.primary.shadow.active` | `{shadow.button.glow.active}` |  |
| `button.intent.primary.shadow.hover` | `{shadow.button.glow.hover}` |  |
| `button.intent.primary.shadow.rest` | `{shadow.button.glow.rest}` |  |
| `button.intent.secondary.background.hover` | `{color.action.outline.bg.hover}` |  |
| `button.intent.secondary.background.press` | `{color.action.outline.bg.press}` |  |
| `button.intent.secondary.background.rest` | `{color.action.outline.bg.rest}` |  |
| `button.intent.secondary.border.hover` | `{color.action.outline.border.hover}` |  |
| `button.intent.secondary.border.rest` | `{color.action.outline.border.rest}` |  |
| `button.intent.secondary.foreground` | `{color.action.outline.fg}` |  |
| `button.intent.selected.background` | `{color.action.selected.bg}` |  |
| `button.intent.selected.border` | `{color.action.selected.border}` |  |
| `button.intent.selected.foreground` | `{color.action.selected.fg}` |  |
| `button.intent.success.background` | `{color.action.success.bg}` |  |
| `button.intent.success.border` | `{color.action.success.border}` |  |
| `button.intent.success.foreground` | `{color.action.success.fg}` |  |
| `button.intent.tertiary.background.hover` | `{color.action.ghost.bg.hover}` |  |
| `button.intent.tertiary.background.press` | `{color.action.ghost.bg.press}` |  |
| `button.intent.tertiary.background.rest` | `{color.action.ghost.bg.rest}` |  |
| `button.intent.tertiary.foreground` | `{color.action.ghost.fg}` |  |
| `button.label.lg` | `{type.label.lg}` | 15 px label on lg. |
| `button.label.md` | `{type.label.md}` | 14 px label on md (default). |
| `button.label.sm` | `{type.label.sm}` | 13 px label on sm. |
| `button.label.xl` | `{type.body.md}` | 16 px label on xl. Hero scale. |
| `button.label.xs` | `{type.label.sm}` | 11–12 px label on xs. |
| `button.motion.duration.focus-in` | `{motion.duration.fast}` | 120 ms ring fade. |
| `button.motion.duration.hover-in` | `{motion.duration.fast}` | 120 ms color/border ease-out. |
| `button.motion.duration.hover-out` | `{ value: 80, unit: ms }` | 80 ms color/border ease-in. Faster than fast — reads as immediate 'release'. |
| `button.motion.duration.press` | `{motion.duration.instant}` | 0 ms — instant feedback on activate. |
| `button.motion.duration.success` | `{motion.duration.slow}` | 260 ms checkmark transition; the 'Saved' label persists 1.6 s, then the success state exits at 80 ms. |
| `button.motion.easing.in` | `{motion.easing.standard}` | cubic-bezier(0.2, 0, 0, 1) — entry/decelerate. |
| `button.motion.easing.out` | `{motion.easing.accelerate}` | cubic-bezier(0.4, 0, 1, 1) — exit/accelerate. |
| `button.padding.lg` | `{ x: {dimension.5}, y: {dimension.3} }` | 20/12 px — lg (48 px button). |
| `button.padding.md` | `{ x: {dimension.4}, y: {dimension.2} }` | 16/8 px — md (40 px button) — Lumen default. |
| `button.padding.sm` | `{ x: {dimension.3}, y: {dimension.1} }` | 12/4 px — sm (32 px button). |
| `button.padding.xl` | `{ x: {dimension.8}, y: {dimension.4} }` | 32/16 px — xl (56 px hero pill CTA). Reads as 'CTA-spaced'. |
| `button.padding.xs` | `{ x: {dimension.2}, y: {dimension.0} }` | 8/0 px — xs (24 px button, no vertical inset because height = label + icon). |
| `button.radius.pill` | `{radius.full}` | Full pill (9999 px). Opt-in via shape='pill' for hero / AI / marketing CTAs. |
| `button.radius.rect` | `{radius.control.md}` | Default rect button radius — ~6 px. Operator default; matches Linear/Notion. |
| `button.radius.round` | `{radius.full}` | Round IconButton — squared dimensions + full radius. |
| `button.shape.pill` | `pill` | Full radius. Hero / AI / marketing. |
| `button.shape.rect` | `rect` | Default — radius.control.md. |
| `button.shape.round` | `round` | Square dimensions + full radius. IconButton-style. |

### `components/card.tokens.json` (13 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `card.background` | `{color.surface.raised}` |  |
| `card.border` | `{color.border.subtle}` |  |
| `card.padding.hero` | `{space.inset.2xl}` | v0.8 — 40 px (hero card / marketing surface). |
| `card.padding.lg` | `{space.inset.xl}` | 24 px — comfortable-density card (default for comfortable mode). |
| `card.padding.md` | `{space.inset.lg}` | 16 px — compact-density card (default for compact mode). |
| `card.padding.sm` | `{space.inset.md}` | 12 px — small card. |
| `card.padding.xl` | `{space.8}` | v0.8 — 32 px (lifted card). |
| `card.padding.xs` | `{space.inset.sm}` | v0.8 — 8 px (dense list-row card). |
| `card.radius.default` | `{radius.card.default}` |  |
| `card.radius.hero` | `{radius.card.hero}` |  |
| `card.radius.lifted` | `{radius.card.lifted}` |  |
| `card.shadow.hover` | `{shadow.lifted}` |  |
| `card.shadow.rest` | `{shadow.card}` |  |

### `components/checkbox.tokens.json` (17 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `checkbox.background.checked` | `{color.accent.500}` |  |
| `checkbox.background.disabled` | `{color.surface.input.disabled}` |  |
| `checkbox.background.rest` | `{color.surface.input.rest}` |  |
| `checkbox.border.checked` | `{color.accent.500}` |  |
| `checkbox.border.disabled` | `{color.border.disabled}` |  |
| `checkbox.border.error` | `{color.border.error}` |  |
| `checkbox.border.hover` | `{color.border.strong}` |  |
| `checkbox.border.rest` | `{color.border.default}` |  |
| `checkbox.indicator.color` | `{color.accent.fg}` |  |
| `checkbox.indicator.stroke` | `2px` | Stroke width for the SVG check. Heavy enough to read at 16px. |
| `checkbox.label.color` | `{color.text.primary}` |  |
| `checkbox.label.gap` | `{space.2}` | Gap between box and label. |
| `checkbox.label.type` | `{type.body.sm}` |  |
| `checkbox.radius` | `{radius.xs}` | 4 px corner radius. Hairline-square, not pill. |
| `checkbox.size.lg` | `{dimension.5}` | 20 px box — touch / marketing |
| `checkbox.size.md` | `{dimension.4}` | 16 px box — default |
| `checkbox.size.sm` | `{dimension.3}` | 12 px box — for tables only |

### `components/combobox.tokens.json` (19 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `combobox.empty.color` | `{color.text.tertiary}` |  |
| `combobox.empty.type` | `{type.body.xs}` |  |
| `combobox.item.background.highlight` | `{color.surface.tint-accent}` | Hovered or keyboard-active row. |
| `combobox.item.background.rest` | `transparent` |  |
| `combobox.item.color.highlight` | `{color.text.primary}` |  |
| `combobox.item.color.rest` | `{color.text.secondary}` |  |
| `combobox.item.height` | `{size.control.sm}` |  |
| `combobox.item.padding.x` | `{space.2}` |  |
| `combobox.item.padding.y` | `{space.1}` |  |
| `combobox.item.radius` | `{radius.xs}` |  |
| `combobox.item.type` | `{type.body.sm}` |  |
| `combobox.listbox.background` | `{color.surface.popover}` |  |
| `combobox.listbox.border` | `{color.border.default}` |  |
| `combobox.listbox.max-height` | `{dimension.48}` | 192 px — internal scroll past this. |
| `combobox.listbox.padding` | `{space.1}` |  |
| `combobox.listbox.radius` | `{radius.popover}` |  |
| `combobox.listbox.shadow` | `{shadow.popover}` |  |
| `combobox.trigger.caret-color` | `{color.text.tertiary}` |  |
| `combobox.trigger.caret-rotation` | `180deg` | Trailing chevron rotates 180° when the popover is open. CSS: transform applied via [data-state='open']. |

### `components/date-picker.tokens.json` (28 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `date-picker.calendar.background` | `{color.surface.popover}` |  |
| `date-picker.calendar.border` | `{color.border.default}` |  |
| `date-picker.calendar.day.background.hover` | `{color.surface.sunken}` |  |
| `date-picker.calendar.day.background.rest` | `transparent` |  |
| `date-picker.calendar.day.background.selected` | `{color.accent.400}` |  |
| `date-picker.calendar.day.background.today` | `transparent` | Today is marked by border, not fill — so it doesn't compete with selection. |
| `date-picker.calendar.day.border.today` | `{color.border.strong}` | 1 px border marks today without competing with selection fill. |
| `date-picker.calendar.day.color.disabled` | `{color.text.disabled}` |  |
| `date-picker.calendar.day.color.hover` | `{color.text.primary}` |  |
| `date-picker.calendar.day.color.muted` | `{color.text.disabled}` | Out-of-month days. |
| `date-picker.calendar.day.color.rest` | `{color.text.secondary}` |  |
| `date-picker.calendar.day.color.selected` | `{color.accent.fg}` | Near-black-green ink on lime fill — AA contrast. |
| `date-picker.calendar.day.radius` | `{radius.sm}` |  |
| `date-picker.calendar.day.size` | `{dimension.8}` | 32 px cell — square tap target. |
| `date-picker.calendar.day.type` | `{type.caption}` |  |
| `date-picker.calendar.header.color` | `{color.text.primary}` |  |
| `date-picker.calendar.header.nav-color.hover` | `{color.text.primary}` |  |
| `date-picker.calendar.header.nav-color.rest` | `{color.text.tertiary}` |  |
| `date-picker.calendar.header.type` | `{type.body.sm}` |  |
| `date-picker.calendar.padding` | `{space.3}` |  |
| `date-picker.calendar.radius` | `{radius.popover}` |  |
| `date-picker.calendar.shadow` | `{shadow.popover}` |  |
| `date-picker.calendar.weekday.color` | `{color.text.tertiary}` |  |
| `date-picker.calendar.weekday.type` | `{type.overline}` |  |
| `date-picker.calendar.width` | `{dimension.64}` | 256 px — fits 7 columns × 32 px cells with breathing room. |
| `date-picker.transition.close` | `{motion.transition.fast}` |  |
| `date-picker.transition.open` | `{motion.transition.fast}` |  |
| `date-picker.trigger.icon-color` | `{color.text.tertiary}` |  |

### `components/field.tokens.json` (21 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `field.error.color` | `{color.text.error}` |  |
| `field.error.type` | `{type.body.xs}` |  |
| `field.gap.controlToHelp` | `{field.gap.help}` |  |
| `field.gap.field` | `{space.4}` | v0.8 — Vertical rhythm between fields in a form. Reduced 20→16 px to converge with Apple HIG / Linear / Stripe. (Was field.gap.groupToGroup = 20 px). |
| `field.gap.fieldset` | `{space.8}` | v0.8 — Vertical rhythm between fieldsets / form sections. (Was field.gap.fieldsetToFieldset). |
| `field.gap.fieldsetToFieldset` | `{field.gap.fieldset}` |  |
| `field.gap.groupToGroup` | `{field.gap.field}` |  |
| `field.gap.help` | `{space.1}` | v0.8 — Control above the hint or error message. (Was field.gap.controlToHelp). |
| `field.gap.label` | `{space.1}` | v0.8 — Label below stacked over the control. (Was field.gap.labelToControl). |
| `field.gap.labelToControl` | `{field.gap.label}` |  |
| `field.helper.color` | `{color.text.tertiary}` |  |
| `field.helper.color-disabled` | `{color.text.disabled}` | v0.8 — kebab-case rename. |
| `field.helper.type` | `{type.body.xs}` |  |
| `field.label.color` | `{color.text.secondary}` |  |
| `field.label.color-disabled` | `{color.text.disabled}` | v0.8 — kebab-case rename. (Was colorDisabled). |
| `field.label.type` | `{type.label.sm}` |  |
| `field.optional.color` | `{color.text.tertiary}` |  |
| `field.optional.type` | `{type.body.xs}` |  |
| `field.required.color` | `{color.border.error}` |  |
| `field.success.color` | `{color.text.success}` |  |
| `field.success.type` | `{type.body.xs}` |  |

### `components/file-dropzone.tokens.json` (32 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `file-dropzone.browse-link.color` | `{color.text.accent}` |  |
| `file-dropzone.browse-link.text-decoration` | `underline` |  |
| `file-dropzone.file-row.background` | `{color.surface.sunken}` |  |
| `file-dropzone.file-row.meta.color` | `{color.text.tertiary}` |  |
| `file-dropzone.file-row.meta.type` | `{type.overline}` |  |
| `file-dropzone.file-row.name.color` | `{color.text.secondary}` |  |
| `file-dropzone.file-row.name.type` | `{type.caption}` |  |
| `file-dropzone.file-row.padding.x` | `{space.2}` |  |
| `file-dropzone.file-row.padding.y` | `{space.1}` |  |
| `file-dropzone.file-row.radius` | `{radius.sm}` |  |
| `file-dropzone.hint.color` | `{color.text.tertiary}` |  |
| `file-dropzone.hint.type` | `{type.caption}` |  |
| `file-dropzone.icon.background` | `{color.surface.sunken}` |  |
| `file-dropzone.icon.color` | `{color.text.secondary}` |  |
| `file-dropzone.icon.icon-size` | `{dimension.5}` | 18–20 px + glyph. |
| `file-dropzone.icon.radius` | `{radius.full}` |  |
| `file-dropzone.icon.size` | `{dimension.10}` | 40 px circle. |
| `file-dropzone.shell.background.dragover` | `{color.alpha.accent.12}` | Subtle lime tint reinforces the dragover border. |
| `file-dropzone.shell.background.hover` | `transparent` |  |
| `file-dropzone.shell.background.rest` | `transparent` |  |
| `file-dropzone.shell.border-style` | `dashed` |  |
| `file-dropzone.shell.border-width` | `1px` |  |
| `file-dropzone.shell.border.dragover` | `{color.accent.500}` | Lime border when files are being dragged over. |
| `file-dropzone.shell.border.error` | `{color.border.error}` | Border color when the file fails accept/size validation. |
| `file-dropzone.shell.border.hover` | `{color.border.strong}` |  |
| `file-dropzone.shell.border.rest` | `{color.border.default}` |  |
| `file-dropzone.shell.padding.x` | `{space.4}` |  |
| `file-dropzone.shell.padding.y` | `{space.8}` |  |
| `file-dropzone.shell.radius` | `{radius.lg}` |  |
| `file-dropzone.shell.transition` | `{motion.transition.fast}` |  |
| `file-dropzone.title.color` | `{color.text.primary}` |  |
| `file-dropzone.title.type` | `{type.body.sm}` |  |

### `components/input.tokens.json` (41 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `input.background.disabled` | `{color.surface.input.disabled}` |  |
| `input.background.focus` | `{color.surface.input.focus}` |  |
| `input.background.hover` | `{color.surface.input.hover}` |  |
| `input.background.read-only` | `{color.surface.input.read-only}` |  |
| `input.background.rest` | `{color.surface.input.rest}` |  |
| `input.border.disabled` | `{color.border.disabled}` |  |
| `input.border.error` | `{color.border.error}` |  |
| `input.border.focus` | `{color.border.focus}` |  |
| `input.border.hover` | `{color.border.strong}` |  |
| `input.border.read-only` | `{color.border.default}` |  |
| `input.border.rest` | `{color.border.default}` |  |
| `input.border.success` | `{color.border.success}` |  |
| `input.border.warning` | `{color.border.warning}` |  |
| `input.foreground.addon` | `{color.text.tertiary}` | Trailing addon (unit chips: lb / STD / %). |
| `input.foreground.error` | `{color.text.error}` |  |
| `input.foreground.helper` | `{color.text.tertiary}` |  |
| `input.foreground.icon-leading` | `{color.text.tertiary}` |  |
| `input.foreground.icon-trailing` | `{color.text.tertiary}` |  |
| `input.foreground.label` | `{color.text.secondary}` |  |
| `input.foreground.placeholder` | `{color.text.placeholder}` |  |
| `input.foreground.success` | `{color.text.success}` |  |
| `input.foreground.value` | `{color.text.primary}` |  |
| `input.foreground.value-disabled` | `{color.text.disabled}` |  |
| `input.foreground.value-read-only` | `{color.text.primary}` | Read-only keeps full contrast — only the caret + interactivity changes. |
| `input.foreground.warning` | `{color.text.warning}` |  |
| `input.gap.slot` | `{space.2}` | Gap between leading/trailing slot and the value. |
| `input.height.lg` | `{size.control.lg}` | 48 px — touch / marketing forms |
| `input.height.md` | `{size.control.md}` | 40 px — default |
| `input.height.sm` | `{size.control.sm}` | 32 px — compact dashboards |
| `input.padding.x.lg` | `{space.4}` |  |
| `input.padding.x.md` | `{space.3}` |  |
| `input.padding.x.sm` | `{space.2}` |  |
| `input.padding.y.lg` | `{space.3}` |  |
| `input.padding.y.md` | `{space.2}` |  |
| `input.padding.y.sm` | `{space.1}` |  |
| `input.radius` | `{radius.control.md}` |  |
| `input.ring.error` | `{shadow.input.error}` |  |
| `input.ring.focus` | `{shadow.input.focus}` |  |
| `input.ring.lit-edge` | `{shadow.input.lit-edge}` | Stacked under focus/error halo to keep the lit-edge effect on dark mode. |
| `input.ring.success` | `{shadow.input.success}` |  |
| `input.transition` | `{motion.transition.fast}` |  |

### `components/number-input.tokens.json` (13 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `number-input.stepper.background.hover` | `{color.surface.sunken}` |  |
| `number-input.stepper.background.press` | `{color.surface.sunken}` |  |
| `number-input.stepper.background.rest` | `transparent` |  |
| `number-input.stepper.color.disabled` | `{color.text.disabled}` |  |
| `number-input.stepper.color.hover` | `{color.text.primary}` |  |
| `number-input.stepper.color.rest` | `{color.text.secondary}` |  |
| `number-input.stepper.icon-size` | `{dimension.3}` | 12 px — Lucide minus / plus glyph. |
| `number-input.stepper.padding.x` | `{space.3}` | Horizontal padding around the +/− glyph. |
| `number-input.suffix.color` | `{color.text.tertiary}` |  |
| `number-input.suffix.type` | `{type.eyebrow.mono}` |  |
| `number-input.value.align` | `center` |  |
| `number-input.value.color` | `{color.text.primary}` |  |
| `number-input.value.type` | `{type.data.md}` | Mono with tnum/lnum on for ledger-aligned digits. |

### `components/otp-input.tokens.json` (7 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `otp-input.cell.size.lg` | `{dimension.12}` | 48 px square — touch / marketing. |
| `otp-input.cell.size.md` | `{dimension.10}` | 40 px square — default. |
| `otp-input.cell.size.sm` | `{dimension.8}` | 32 px square — compact. |
| `otp-input.gap.group-sep` | `{space.3}` | Optional wider gap between 3-3 grouped cells (e.g. 123 456). |
| `otp-input.gap.row` | `{space.2}` | Default gap between cells. |
| `otp-input.value.color` | `{color.text.primary}` |  |
| `otp-input.value.type` | `{type.data.lg}` |  |

### `components/password-input.tokens.json` (11 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `password-input.reveal.background.hover` | `{color.surface.sunken}` |  |
| `password-input.reveal.background.rest` | `transparent` |  |
| `password-input.reveal.color.hover` | `{color.text.primary}` |  |
| `password-input.reveal.color.rest` | `{color.text.secondary}` |  |
| `password-input.reveal.padding.x` | `{space.2}` |  |
| `password-input.reveal.padding.y` | `{space.1}` |  |
| `password-input.reveal.radius` | `{radius.xs}` |  |
| `password-input.reveal.type` | `{type.eyebrow.mono}` | Uppercase mono label — matches the system-metadata signature. |
| `password-input.value.color` | `{color.text.primary}` |  |
| `password-input.value.letter-spacing` | `0.1em` | Wider tracking on the masked dots so each character reads as discrete. |
| `password-input.value.type` | `{type.data.sm}` |  |

### `components/radio.tokens.json` (17 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `radio.background.checked` | `{color.surface.input.rest}` | Background stays the same; only the inner dot fills. |
| `radio.background.disabled` | `{color.surface.input.disabled}` |  |
| `radio.background.rest` | `{color.surface.input.rest}` |  |
| `radio.border.checked` | `{color.accent.500}` |  |
| `radio.border.disabled` | `{color.border.disabled}` |  |
| `radio.border.error` | `{color.border.error}` |  |
| `radio.border.hover` | `{color.border.strong}` |  |
| `radio.border.rest` | `{color.border.default}` |  |
| `radio.group-gap` | `{space.3}` | Vertical gap between radios in a group. |
| `radio.indicator.color` | `{color.accent.500}` |  |
| `radio.indicator.size` | `{dimension.2}` | 8 px dot. |
| `radio.label.color` | `{color.text.primary}` |  |
| `radio.label.gap` | `{space.2}` |  |
| `radio.label.type` | `{type.body.sm}` |  |
| `radio.size.lg` | `{dimension.5}` | 20 px circle — touch / marketing |
| `radio.size.md` | `{dimension.4}` | 16 px circle — default |
| `radio.size.sm` | `{dimension.3}` | 12 px circle — tables only |

### `components/range-slider.tokens.json` (13 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `range-slider.range.background` | `{color.accent.500}` |  |
| `range-slider.slot.height` | `{dimension.6}` | Vertical slot the track + thumbs share. Needs to be at least the thumb diameter so the thumb doesn't clip. |
| `range-slider.thumb.background` | `{color.absolute.white}` | v0.11.13 — references {color.absolute.white} (was inlined #ffffff). |
| `range-slider.thumb.border` | `{color.border.strong}` |  |
| `range-slider.thumb.radius` | `{radius.full}` |  |
| `range-slider.thumb.ring-focus` | `{shadow.focus}` | Lime focus ring around the thumb when keyboard-focused. |
| `range-slider.thumb.shadow` | `{shadow.sm}` |  |
| `range-slider.thumb.size` | `{dimension.4}` | 16 px — meets minimum touch target with hover-area extension. |
| `range-slider.track.background` | `{color.surface.sunken}` |  |
| `range-slider.track.height` | `{dimension.1}` | 4 px — readable but thin. |
| `range-slider.track.radius` | `{radius.full}` |  |
| `range-slider.value.color` | `{color.text.tertiary}` |  |
| `range-slider.value.type` | `{type.overline}` |  |

### `components/segmented.tokens.json` (17 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `segmented.bar.background` | `{color.surface.sunken}` |  |
| `segmented.bar.border` | `{color.border.hairline}` |  |
| `segmented.bar.height` | `{size.control.sm}` | 32 px — denser than full inputs because it lives next to other controls. |
| `segmented.bar.padding` | `{dimension.0}` | Outer pad is 2 px applied as a 0.5 utility — inner segments handle their own padding. |
| `segmented.bar.radius` | `{radius.md}` |  |
| `segmented.segment.background.active` | `{color.surface.raised}` |  |
| `segmented.segment.background.hover` | `transparent` | Hover is signaled via color shift on the inactive label, not bg. |
| `segmented.segment.background.inactive` | `transparent` |  |
| `segmented.segment.color.active` | `{color.text.primary}` |  |
| `segmented.segment.color.inactive` | `{color.text.tertiary}` |  |
| `segmented.segment.color.inactive-hover` | `{color.text.primary}` |  |
| `segmented.segment.height` | `28px` | Bar 32 minus 2 px padding × 2. |
| `segmented.segment.padding.x` | `{space.3}` |  |
| `segmented.segment.radius` | `{radius.sm}` |  |
| `segmented.segment.shadow.active` | `{shadow.xs}` | Subtle lift to read above the bar. |
| `segmented.segment.transition` | `{motion.transition.fast}` |  |
| `segmented.segment.type` | `{type.label.sm}` |  |

### `components/select.tokens.json` (21 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `select.item.background.active` | `{color.surface.tint-accent}` | Highlighted via keyboard nav. |
| `select.item.background.hover` | `{color.surface.tint-accent}` |  |
| `select.item.background.rest` | `transparent` |  |
| `select.item.background.selected` | `{color.surface.tint-accent}` |  |
| `select.item.color.active` | `{color.text.primary}` |  |
| `select.item.color.rest` | `{color.text.secondary}` |  |
| `select.item.color.selected` | `{color.text.primary}` |  |
| `select.item.height` | `{size.control.sm}` | 32 px — tighter than the trigger so the list reads dense. |
| `select.item.indicator` | `{color.accent.400}` | Checkmark glyph color for the selected item. |
| `select.item.padding.x` | `{space.2}` |  |
| `select.item.padding.y` | `{space.1}` |  |
| `select.item.radius` | `{radius.xs}` |  |
| `select.item.type` | `{type.body.sm}` |  |
| `select.listbox.background` | `{color.surface.popover}` |  |
| `select.listbox.border` | `{color.border.default}` |  |
| `select.listbox.max-height` | `{dimension.64}` | 256 px — internal scroll past this. |
| `select.listbox.min-width` | `{dimension.32}` | 128 px — never narrower than the trigger. |
| `select.listbox.padding` | `{space.1}` | Inner padding around the item list. |
| `select.listbox.radius` | `{radius.popover}` |  |
| `select.listbox.shadow` | `{shadow.popover}` |  |
| `select.trigger.caret-color` | `{color.text.tertiary}` | Chevron color in trailing slot. |

### `components/switch.tokens.json` (17 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `switch.label.color` | `{color.text.primary}` |  |
| `switch.label.gap` | `{space.3}` | Gap between track and label. |
| `switch.label.type` | `{type.label.md}` |  |
| `switch.thumb.color.off` | `{color.surface.raised}` |  |
| `switch.thumb.color.on` | `{color.accent.fg}` | Near-black-green so it reads on lime. |
| `switch.thumb.shadow` | `{shadow.xs}` |  |
| `switch.thumb.size` | `{dimension.4}` | 16 px thumb. |
| `switch.thumb.translate-off` | `{dimension.0}` |  |
| `switch.thumb.translate-on` | `{dimension.4}` | 16 px slide. Track width (36) − thumb width (16) − padding gap (4) = 16. |
| `switch.track.background.disabled` | `{color.surface.input.disabled}` |  |
| `switch.track.background.off` | `{color.surface.sunken}` |  |
| `switch.track.background.on` | `{color.accent.500}` |  |
| `switch.track.border.error` | `{color.border.error}` |  |
| `switch.track.border.rest` | `transparent` |  |
| `switch.track.height` | `{dimension.5}` | 20 px |
| `switch.track.radius` | `{radius.full}` |  |
| `switch.track.width` | `{dimension.9}` | v0.8 — 36 px. Migrated from inline value to dimension.9 primitive (added v0.8 to fill the gap). |

### `components/tags-input.tokens.json` (17 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `tags-input.draft.color` | `{color.text.primary}` |  |
| `tags-input.draft.min-width` | `{dimension.20}` | 80 px — enough to type a short tag. |
| `tags-input.draft.placeholder` | `{color.text.placeholder}` |  |
| `tags-input.draft.type` | `{type.body.sm}` |  |
| `tags-input.shell.gap.wrap` | `{space.1}` | Gap between chips and between chip-row and draft input. |
| `tags-input.shell.min-height` | `{size.control.md}` |  |
| `tags-input.shell.padding.y` | `{space.1}` | Vertical breathing room when chips wrap to a new row. |
| `tags-input.tag.background` | `{color.surface.sunken}` |  |
| `tags-input.tag.border` | `transparent` |  |
| `tags-input.tag.color` | `{color.text.secondary}` |  |
| `tags-input.tag.height` | `{dimension.6}` | 24 px chip height. |
| `tags-input.tag.padding.x` | `{space.2}` |  |
| `tags-input.tag.radius` | `{radius.sm}` |  |
| `tags-input.tag.remove.color.hover` | `{color.text.primary}` |  |
| `tags-input.tag.remove.color.rest` | `{color.text.tertiary}` |  |
| `tags-input.tag.remove.icon-size` | `{dimension.3}` | 10–12 px X glyph. |
| `tags-input.tag.type` | `{type.caption}` |  |

### `components/textarea.tokens.json` (6 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `textarea.max-height.default` | `{dimension.64}` |  |
| `textarea.min-height.lg` | `{dimension.32}` | 128 px — long-form |
| `textarea.min-height.md` | `{dimension.20}` | 80 px — default |
| `textarea.min-height.sm` | `{dimension.16}` | 64 px — 2 lines roughly |
| `textarea.padding.y` | `{space.2}` | Top/bottom padding. Differs from input.padding.y because multiline anchors at top. |
| `textarea.resize` | `vertical` | Default resize handle. Set to 'none' for fixed-size textareas; 'both' is discouraged because it breaks page rhythm. |

### `components/time-picker.tokens.json` (16 tokens)

| Token path | Value / alias | Description |
|---|---|---|
| `time-picker.ampm.background` | `{color.surface.sunken}` | Pill bar background. |
| `time-picker.ampm.padding` | `{dimension.0}` | Bar holds 1px inset segments via inner padding. |
| `time-picker.ampm.radius` | `{radius.sm}` |  |
| `time-picker.ampm.segment.background.active` | `{color.surface.raised}` | Active segment lifts above the bar with a subtle shadow. |
| `time-picker.ampm.segment.background.inactive` | `transparent` |  |
| `time-picker.ampm.segment.color.active` | `{color.text.primary}` |  |
| `time-picker.ampm.segment.color.inactive` | `{color.text.tertiary}` |  |
| `time-picker.ampm.segment.padding.x` | `{space.2}` |  |
| `time-picker.ampm.segment.radius` | `{radius.xs}` |  |
| `time-picker.ampm.segment.shadow.active` | `{shadow.xs}` |  |
| `time-picker.ampm.segment.type` | `{type.overline}` |  |
| `time-picker.digit.align` | `center` |  |
| `time-picker.digit.color` | `{color.text.primary}` |  |
| `time-picker.digit.type` | `{type.data.md}` |  |
| `time-picker.digit.width` | `{dimension.8}` | ~32 px — fits 2 mono digits. |
| `time-picker.separator.color` | `{color.text.tertiary}` |  |

---

**Totals:** 411 semantic tokens · 416 component-bound tokens.

> Generated 2026-05-20 from VERSION = 0.14.1. Re-run `pnpm token-index` (or `node scripts/build-token-index.mjs`) to regenerate.

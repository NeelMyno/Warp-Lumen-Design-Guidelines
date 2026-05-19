---
name: OS Modes — reduced-motion, high-contrast, forced-colors
type: foundation
version: 1.0.0
last_updated: 2026-05-19
audience: [designer, engineer, llm-agent]
target: WCAG-2.2-AA + Windows High Contrast Mode (forced-colors)
related: [./accessibility.md, ./motion-language.md, ./color.md, ../../_meta/decisions/0029-os-modes-r9-v014.md]
---

# OS Modes — reduced-motion, high-contrast, forced-colors

> Three operating-system-level accessibility modes change the rendering contract for every Lumen surface. **Reduced motion** suppresses animation. **High contrast** (`prefers-contrast: more`) demands sharper color separation. **Forced colors** (`forced-colors: active` — Windows High Contrast Mode and similar) replaces all colors with OS-controlled values; the system MUST stay usable. R9 of the audit-cycle ladder (ADR 0029) is the round that formalized all three contracts.

## TL;DR — what changes when

| OS mode | Triggers when | What Lumen does |
|---|---|---|
| `prefers-reduced-motion: reduce` | OS-level "reduce motion" toggle, common on iOS / macOS / Android / Windows | All non-essential animation suppressed: hover bloom, button glow, page reveals, sparkline shimmer. Functional motion (focus ring fade-in, dropdown open) is preserved at minimum perceptible threshold |
| `prefers-contrast: more` | OS-level "increase contrast" toggle | Border weight increases from hairline → 1px solid; tertiary text upgrades to secondary contrast ratio; focus ring outline thickens; box-shadow halos drop in favor of solid borders |
| `forced-colors: active` | Windows High Contrast Mode (active) | Colors are OS-controlled. Lumen uses `CanvasText` / `Canvas` / `Highlight` / `ButtonFace` system colors via the CSS `forced-color-adjust: auto` default. Custom token values are overridden by the OS; we ensure structural cues survive |

## 1. Reduced motion (`prefers-reduced-motion: reduce`)

### Contract

When the user has enabled the OS-level reduce-motion preference:

1. **Non-essential motion is suppressed.** Hover bloom, page-reveal fades, sparkline pulse, dot pulse, button shimmer, accent halo glow.
2. **Functional motion is preserved at minimum perceptible threshold.** Focus rings still appear (instant). Dropdown/Popover/Dialog open transitions stay at ≤ 100 ms (under the 100 ms vestibular safety threshold). Loading spinners may continue to indicate progress but their duration is allowed to be longer.
3. **CSS transition `duration: 0s` is the default override pattern.** Per-component overrides for motion that's essential for state communication (loading spinner, progress bar fill) declare `@media (prefers-reduced-motion: no-preference)` to gate the animation.

### Where this lives in Lumen

| Mechanism | File |
|---|---|
| Global override (all decorative animations) | `audit-dashboard/src/app/globals.css` — multiple `@media (prefers-reduced-motion: reduce)` blocks at L2058, L2864, L2883, L2992, L3051, L3127, L3159 |
| Per-component documented exemption | Each animated primitive's `component.md` § Motion |
| Foundations principle | [`./motion-language.md`](./motion-language.md), [`./micro-interactions.md`](./micro-interactions.md) |
| Token | `motion.duration.{instant,fast,base,deliberate,slow,shimmer,spin}` — `instant` (0s) replaces every other duration under reduced-motion |

### Audit probe

```js
// Toggle the OS preference programmatically for testing
document.documentElement.style.setProperty('--motion-base', '0s');
// Or via the browser DevTools emulation:
// Chrome: Lighthouse → Settings → "Emulate prefers-reduced-motion"
```

## 2. High contrast (`prefers-contrast: more`)

### Contract

When the user has enabled the OS-level "increase contrast" preference (macOS System Settings → Accessibility → Display → Increase contrast; iOS Settings → Accessibility → Display & Text Size → Increase Contrast; Windows Settings → Ease of Access → Display):

1. **Border weight increases.** Hairline borders (1px) get a solid 1px treatment; transparent borders become 2px solid. Token: `--border-hairline` upgrades to `--border-default`.
2. **Tertiary text becomes secondary.** The 3:1 large-text minimum for body becomes 4.5:1. `--text-tertiary` upgrades visually to `--text-secondary` contrast levels.
3. **Focus ring outline thickens.** `outline: 2px solid` becomes `outline: 3px solid`; offset increases from 1px to 2px.
4. **Decorative box-shadow halos retire.** Soft halos (the brand visual chrome) are replaced with crisp 1–2 px solid borders. The brand still shows (Spring Green border still tints the action surface), but the soft alpha-blended glow goes.
5. **Surface tints drop their alpha.** Light surface tints (`--surface-tint-accent`) become solid color instead of alpha-blended onto canvas.

### Where this lives in Lumen

`audit-dashboard/src/app/globals.css` — new `@media (prefers-contrast: more)` block (R9, v0.14.0). The block re-binds:
- `--border-hairline` → matches `--border-default`
- `--border-default` weight (the CSS-applied weight) → bumped from 1px to 1.5px
- `--text-tertiary` → matches `--text-secondary` value
- `:focus-visible` outline width 2px → 3px, offset 1px → 2px
- `--shadow-focus` → solid 2px outline (alpha box-shadow halo drops)
- `--shadow-glow-accent` and its variants → no-op (solid border-accent replaces)

### Audit probe

```js
// Chrome DevTools: Lighthouse → Settings → Emulation tab → "Emulate prefers-contrast: more"
// Or per the spec, force it in CSS:
const root = document.documentElement;
root.setAttribute('data-force-high-contrast', '');
// (Then add a CSS rule that activates the same overrides under that attribute, for testing)
```

## 3. Forced colors (`forced-colors: active`) — Windows High Contrast Mode

### Contract

Windows High Contrast Mode (WHCM) and similar (some Linux distros, some accessibility-focused browsers) replace ALL colors with system colors. The user controls them (white-on-black, yellow-on-black, etc.). When `forced-colors: active`:

1. **Color tokens are overridden by the OS.** All `color`, `background-color`, `border-color`, `outline-color` declarations are remapped to system-controlled values: `CanvasText`, `Canvas`, `LinkText`, `ActiveText`, `ButtonText`, `ButtonFace`, `Highlight`, `HighlightText`, `GrayText`, `Mark`, `MarkText`, etc.
2. **Lumen does NOT fight this.** We do NOT set `forced-color-adjust: none` to preserve our brand colors — that would break the user's contrast contract. The brand surrenders. The structure survives.
3. **Structural cues must NOT rely on color alone.** Already a Lumen hard floor (accessibility.md: "Color is not the only signal" — every status pairs with a glyph or shape). WHCM reinforces this — if you used color alone, WHCM strips it and the user is blind to the cue.
4. **Box-shadow halos are dropped by the browser** automatically — browsers paint box-shadow as `none` under WHCM. Lumen's brand glow goes; our outline-based focus rings (R-rule 11) survive.
5. **SVG icons get the OS foreground color.** `currentColor` on SVG stroke/fill propagates correctly under WHCM. Hard-coded SVG colors do NOT propagate — they get replaced with `CanvasText` by the browser.

### Where this lives in Lumen

`audit-dashboard/src/app/globals.css` — new `@media (forced-colors: active)` block (R9, v0.14.0). The block:
- Adds a `1px solid CanvasText` border to every interactive surface (Button, Card, Input, Switch) so the OS-painted `ButtonFace` doesn't make controls invisible against `Canvas`.
- Strips `box-shadow` entirely (browser does this anyway but we make it explicit for SSR-rendered first paint).
- Sets `outline-color: Highlight` on `:focus-visible` so the OS-controlled focus color paints.
- Sets `forced-color-adjust: auto` (the default) explicitly on the body, signaling intent.

### Audit probe

```js
// Chrome DevTools: Lighthouse → Settings → Emulation tab → "Emulate forced-colors: active"
// Real WHCM testing: Windows 10/11 Settings → Ease of Access → High contrast → toggle on
```

## 4. Common pitfalls (Lumen-specific)

### Pitfall A — using `color:` for non-text contrast

**Wrong:**
```css
.icon-button { color: var(--text-accent); } /* the icon is the only signal */
```

**Right:**
```css
.icon-button { 
  color: var(--text-accent); 
  border: 1px solid transparent; 
}
@media (prefers-contrast: more) { 
  .icon-button { border-color: var(--border-accent); } 
}
@media (forced-colors: active) { 
  .icon-button { border-color: ButtonText; } 
}
```

### Pitfall B — relying on box-shadow as the sole focus indicator

R-rule 11 (v0.12.4) already mandates `outline + box-shadow`. Under WHCM, only the outline survives — the box-shadow halo is stripped by the browser. R-rule 11's outline keeps the contract.

### Pitfall C — `forced-color-adjust: none` to "preserve brand"

DO NOT. The user has chosen high-contrast OS mode because the brand colors aren't working for them. Overriding the OS to "show our brand" is hostile. The only Lumen exception: brand-logo SVGs where the logo shape itself is meaningless without color (e.g., the Spring Green dot in the Lumen wordmark — that's a brand identity tradeoff, document it in the logo's component.md).

### Pitfall D — `prefers-reduced-motion: reduce` only suppressing CSS, not JS

Some Lumen animations live in JS (the dashboard's stat tickers, the sparkline pulse). Per-component opt-in: read `window.matchMedia('(prefers-reduced-motion: reduce)').matches` in React effects, skip the animation when true. `RateTicker` and `Sparkline` already follow this contract.

## 5. R9 verification checklist

When auditing a new surface for OS-mode compliance:

| # | Check | How |
|---|---|---|
| R9-1 | All animations suppress under reduced-motion | DevTools → Emulation → reduce-motion → scroll through every animated primitive |
| R9-2 | Focus ring is still visible at 1.5× outline width | DevTools → Emulation → prefers-contrast: more → tab through every interactive element |
| R9-3 | Tertiary text upgrades to secondary contrast under high-contrast | Pull a tertiary text element; verify computed `color` matches `--text-secondary` under emulation |
| R9-4 | Decorative box-shadow halos retire under high-contrast | Hover a primary button; verify `box-shadow` resolves to a solid 1–2 px border, not a soft halo |
| R9-5 | Forced-colors: every interactive element still visible | DevTools → Emulation → forced-colors: active → verify Button, Card, Input edges paint as `1px solid CanvasText` |
| R9-6 | Forced-colors: focus ring uses `Highlight` | DevTools → tab through elements under forced-colors emulation; verify outline color is the OS highlight |
| R9-7 | Forced-colors: no `box-shadow` artifacts | Inspect computed styles; verify `box-shadow: none` (browser-imposed) or explicit `box-shadow: none` (our override) |
| R9-8 | SVG icons inherit `currentColor` correctly | Pick an icon under forced-colors; verify stroke/fill is `CanvasText`, not a hardcoded color |

## 6. Cross-references

- WCAG 2.2 Success Criterion 2.3.3 (Animation from Interactions) — Level AAA — Lumen meets via prefers-reduced-motion compliance
- CSS Media Queries Level 5 — `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`
- Microsoft Inclusive Design Toolkit — high-contrast guidance for Windows apps
- Apple Human Interface Guidelines — "Reduce Motion" + "Increase Contrast" + "Differentiate Without Color"
- Material Design 3 — Accessibility / High contrast section
- Lumen ADR 0029 — R9 round of the audit-cycle ladder (v0.14.0)
- Lumen [`accessibility.md`](./accessibility.md) — the WCAG 2.2 AA hard floor
- Lumen [`motion-language.md`](./motion-language.md) — the motion contract

## 7. Open questions (deliberately deferred)

- **`prefers-reduced-transparency`** — Lumen's glass surfaces (.lumen-glass, .lumen-glass-strong) are decorative; under reduced-transparency they should fall back to solid surfaces. Currently honored partially (`@media (prefers-reduced-transparency: reduce)` block at globals.css L2940). Full coverage is an R9.1 candidate.
- **`prefers-reduced-data`** — Save-Data header / Client Hints. Affects image quality, font loading. Out of scope for R9; would be R8f (perf-axis) if surfaced.
- **`prefers-color-scheme`** — Lumen uses `data-theme` attribute, not `prefers-color-scheme`. Consumer apps that want OS-driven theme switching can wire `prefers-color-scheme` to set `data-theme` — documented in [`./color.md`](./color.md).
- **High-contrast mode + dark theme combinations** — Lumen's high-contrast block applies on top of whichever theme is active. The dark theme + high-contrast combination needs verification against a real test pool. Carried to R9.2.

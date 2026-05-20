---
name: Accessibility
type: foundation
version: 1.1.0
last_updated: 2026-05-06
audience: [designer, engineer, llm-agent]
target: WCAG-2.2-AA
related: [./principles.md, ../02-components/]
---

# Accessibility

> Lumen targets **WCAG 2.2 Level AA** as a hard floor for every shipped surface. AAA where it doesn't add cost. Assistive-tech parity is not optional and not a "future iteration." v0.12.4 hardened the focus-ring contract; **v0.14 R11 retired green from every shadow value system-wide** — the global `:focus-visible` rule now pairs `outline 2px solid var(--border-frame); outline-offset: 1px;` with a neutral `box-shadow` halo (was lime alpha-32; now 40 %-alpha theme-aware paper/ink). The focus indicator passes WCAG 2.4.13's 3:1 floor on every Lumen surface without depending on the brand color.

## Hard floor — must, never compromise

These are not goals. They are required for any component, page, or template to ship.

| Requirement | Threshold | How Lumen enforces |
|---|---|---|
| Text contrast | 4.5:1 for body, 3:1 for ≥18px / ≥14px bold | Token pairs are pre-validated; any new token pair runs `wcag-contrast` in CI |
| Non-text contrast | 3:1 for UI controls and graphical objects | Hairline borders use `border-default`, focus uses `border-focus` (token-validated) |
| Visible focus | Always present, never `outline: none` without replacement | `:focus-visible` is set globally and pairs `outline 2px solid var(--border-frame); outline-offset: 1px;` with neutral `--shadow-focus` halo (v0.14 R11 — both layers now neutral after green was banished from shadow values; v0.12.4 added the outline on top of the box-shadow halo so focus rings stay visible inside `<Card padding="none">` and other `overflow: hidden` ancestors) |
| Keyboard reachable | Every interactive element via Tab; logical order | Component schema requires keyboard map; `aria-disabled` (not `disabled`) used inside forms |
| Touch target | 44 × 44 px minimum on mobile (HIG) / 48 × 48 dp on Android (Material) | `Button` minimum height 36 web / 44 mobile; clickable area extends beyond visual when needed |
| Reduced motion | Honor `prefers-reduced-motion: reduce` | Global CSS rule disables animation; per-component opt-out documented |
| Color is not the only signal | Status always paired with label OR shape | Badge ships with `leadingDot` by default for status variants |
| Form labels | Visible label OR programmatic `aria-label` | Field component requires `label` prop (or `aria-label` if visually hidden) |
| Heading hierarchy | One `h1` per page; never skip levels | Page templates enforce; CI lint warns on skip |
| Language declared | `<html lang>` set | Root layout sets `lang="en"`; localized templates override |
| Captions / transcripts | Required on any video, audio | Required field on `Video` / `Audio` component schema |
| Resizable text | UI usable up to 200% zoom (1.4.4) | All sizes in `rem` not `px`; no horizontal scroll at 200% |
| Text spacing | Override-tolerant — line-height ≥ 1.5×, letter ≥ 0.12×, word ≥ 0.16×, paragraph ≥ 2× (1.4.12) | Tested against Stylebot text-spacing override; semantic presets pass by default |
| Images of text | Avoid except logo (1.4.5) | No `<img>` with text content in product UI; eyebrow caps render as live text |
| Minimum readable size | 12px body floor (Lumen-internal, exceeds WCAG) | `body.xs` (13px) is the smallest body preset; 11px reserved for `kbd` and `overline` only |
| Reflow | Single-column at 320px, no horizontal scroll (1.4.10) | Mobile-first templates; line-length capped at 75ch; `text-wrap: balance` on display |

## Recommended ceiling — push when possible

These are AAA or beyond. Lumen pushes for them by default; missing them does not block ship.

- 7:1 contrast for primary body text on the page surface (not a card).
- Skip-to-content link on every page with a top nav.
- Live regions for status changes, with `aria-live` set to `polite` (default) or `assertive` (errors only).
- No flashing > 3 times per second (we have nothing that does this).
- Reading-width measure: 50–75 ch for any long-form text.

## Primary action contrast — explicit

The **Spring Green accent surface** (`color.accent.500` = `#00FA8A`) requires `color.accent.fg` (`#07120D`) on top — that pair clears 14.7:1 (AAA). White-on-spring-green is ~1.4:1 (AA fail) and **forbidden by Hard rule #9 in [`AGENTS.md`](../../AGENTS.md)**.

Why this needs its own rule: in Tailwind v4, the shadcn token bridge (`bg-primary` + `text-primary-foreground` resolving via `:root` → `--primary-foreground` → `--text-on-accent` → `--lumen-accent-fg`) has been observed to drop those utility classes from compiled CSS. The button then inherits `--text-primary` (near-white in dark theme) and renders the AA-failing pair. Two enforcement layers protect against this:

1. **Direct refs in vendor primitives.** `audit-dashboard/src/components/ui/{button,badge,progress,slider,card,popover,sheet}.tsx` use `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]` (and analogous direct refs for non-accent surfaces). Arbitrary-value Tailwind utilities (the bracket syntax) are guaranteed to compile.
2. **Lint rule [`lint:no-white-on-accent`](../../scripts/lint-no-white-on-accent.mjs).** Flags both halves: the shadcn bridge utilities anywhere in product code, AND any white-text class paired with a lime background in the same `className` string.

A `.lumen-btn-primary` class in `globals.css` ships as a single-class shorthand for any consumer that needs the same guarantee outside the Button primitive (e.g. raw `<a>` elements or templated CTAs).

## Focus-ring contract (v0.14 R11 — neutral `outline + box-shadow`)

Every focusable element must show a visible focus indicator that survives every layout context — including ancestors that compose `overflow: hidden` (`<Card padding="none">` per ADR 0021, glass surfaces, scroll containers, the InlineTabs `pill` variant `TabsList`, Showcase demo frames). The global `:focus-visible` rule paints two NEUTRAL layers:

```css
:focus-visible {
  outline: 2px solid var(--border-frame);   /* v0.14 R11 — was lime-a64 */
  outline-offset: 1px;
  box-shadow: var(--shadow-focus);          /* v0.14 R11 — neutral paper/ink halo */
}
```

**Why both layers, why this order.** Box-shadow paints into the element's own painting context and is clipped by ancestor `overflow: hidden` — pre-v0.12.4 the global rule used box-shadow only, and focus rings on Pagination buttons inside `<Card padding="none">` (which gained `overflow-hidden` in v0.12.1 per ADR 0021) were partially clipped, producing visible "underline + vertical bar" fragments at the bottom of the card. Outline is painted *outside* the layout box and is structurally immune to ancestor overflow. Modern browsers (Chrome 94+, Firefox 88+, Safari 16.4+) follow `border-radius` for outline when `outline-style` is not `auto`. Stacked, the outline guarantees the focus indicator is ALWAYS visible as a structural ring, while the box-shadow paints the soft alpha-blended halo as atmospheric depth.

**Why the color went from lime to neutral (v0.14 R11).** Through v0.13.5 the focus ring carried the brand accent (spring green at 64 % alpha for the outline + 32 % alpha for the halo). The user mandate that closed R11 is explicit: **no green in any shadow value, anywhere**. The focus indicator is a structural a11y signal (WCAG 2.4.7 + 2.4.13), not a brand statement; it deserves a neutral, theme-aware color (`--border-frame` = 40 % paper alpha in dark, 40 % ink alpha in light) that passes 3:1 on every Lumen surface without depending on the accent. The brand still announces itself through the BACKGROUND fill of primary CTAs / leading dots / badge bgs / surface tints — those are not shadows and remain green by contract.

**The `.lumen-btn-primary:focus-visible` dual-ring is also neutral now.** Per ADR 0016, primary buttons on the green accent surface need a 2 px canvas-colored separator between button and halo (Atlassian 2024 fix; WCAG 2.4.13's 3:1 contrast floor would otherwise fail because button bg = halo color when both are the same color). R11 swaps the OUTER ring from `var(--lumen-accent-4)` to `var(--border-frame)`. Composed via `box-shadow: 0 0 0 2px var(--surface-canvas), 0 0 0 4px var(--border-frame)` AND `outline: none`. The explicit `outline: none` overrides the global outline rule via CSS specificity — the dual-ring shape is preserved (Atlassian pattern stays); only the color changed.

**LLM rule for new components.** When authoring any new `:focus-visible` rule (custom card, inline link, novel control), include `outline` for structural visibility, then layer `box-shadow` for atmospheric depth. **Both must be neutral.** Never write `outline: 2px solid var(--lumen-accent-*)` or `box-shadow: 0 0 0 Npx var(--lumen-lime-*)` — those are banned per AGENTS.md hard rule 20 and the `lint:shadow-no-accent` script will catch the violation in CI.

## Floating UI portal contract (v0.12.4 — escape ancestor overflow)

Floating panels (Combobox dropdown / Select listbox / DropdownMenu / Popover / Tooltip / Calendar) must render via portal so they escape every ancestor's overflow context. The pattern:

```tsx
import { createPortal } from "react-dom";

createPortal(
  <div style={{ position: "fixed", top, left, width, zIndex: 1000 }}>
    {/* listbox / menu / panel */}
  </div>,
  document.body
);
```

Position state is tracked from the trigger's `getBoundingClientRect()` and re-tracked on `scroll` (capture phase, so nested scrollers fire) + `resize` events. Outside-click dismiss must exempt the portaled panel — clicks on options would otherwise close the dropdown before the option's `onClick` handler fires (the click bubbles up from the portaled list, the dismiss handler sees a click outside the trigger's subtree, the dismiss fires before React processes the option's click).

**Why this matters for a11y.** A clipped dropdown is functionally invisible — keyboard users can move focus into options that aren't visible on screen, screen-reader users hear options being announced for items they can't see. Pre-v0.12.4 the hand-rolled Combobox in `inputs.tsx` rendered an inline `<div absolute>` panel anchored to the trigger's `relative` wrapper; user screenshot 2026-05-06 of the `/library` Combobox autocomplete inside a Showcase frame caught the dropdown clipped at the frame's bottom edge. v0.12.4 migrated Combobox to `createPortal` + `position: fixed` + `getBoundingClientRect()` tracking. The Lumen Switch, Tooltip, DropdownMenu, Popover, and Dialog already portal via Radix; Combobox was the outlier hand-rolled primitive that inherited from a pre-portal era — v0.12.4 brought it in line.

**LLM rule for new floating UI.** Portal to `document.body` from day one. Don't bet on the consumer never embedding the panel inside an overflow-clipped ancestor — `<Card padding="none">` is a legitimate consumer surface and is structurally everywhere in the system.

## Buttons — full a11y reference

For the comprehensive button accessibility floor (focus rings, touch targets, keyboard, ARIA, motion, dual-ring on lime surfaces, loading-vs-disabled separation, success-state announcement), see [`buttons.md`](./buttons.md) § "Accessibility floor" and the per-component contracts in [`02-components/button/`](../02-components/button/) / [`icon-button/`](../02-components/icon-button/) / [`split-button/`](../02-components/split-button/) / [`fab/`](../02-components/fab/).

Highlights of the v0.9 button accessibility model:

- **Dual-ring focus on lime accent surfaces** (Atlassian 2024 pattern). A single colored focus ring fails WCAG 2.4.13's 3:1 contrast floor when the button background is the same color. The dual ring places a 2 px canvas-colored separator between button and halo.
- **Touch target floor 44×44 pt** on mobile primaries (Apple HIG, WCAG 2.5.5). Lumen Button sizes lg (48) and xl (56) clear it; sm (32) and xs (24) are desktop-only.
- **Loading is distinct from disabled.** Loading: spinner replaces leading icon, color preserved, `aria-busy=true`. Disabled: `opacity: 0.4`, `aria-disabled=true` (in forms). Operators must never confuse "happening" with "unavailable."
- **Success state announces via live region.** When `<Button success>` flips true, the checkmark + verb-confirmed label hold for 1.6 s; pair with `aria-live="polite"` outside the button for screen-reader users.
- **`prefers-reduced-motion` zero-out.** All transitions cancelled; AI shimmer paused; resting primary glow stays steady (it's a halo, not motion).

## Token contracts (already validated)

These pairs are pre-validated to meet AA. Use these by default; if you mix, validate.

| Pair | Use | Light-mode contrast | Dark-mode contrast |
|---|---|---|---|
| `--text-primary` on `--surface-page` | Body text on page | 14.6:1 | 14.1:1 |
| `--text-secondary` on `--surface-page` | Secondary body | 7.4:1 | 6.8:1 |
| `--text-tertiary` on `--surface-page` | Hints, captions | 4.6:1 (≥18px only) | 4.5:1 (≥18px only) |
| `--text-primary` on `--surface-raised` | Body in card | 14.6:1 | 14.0:1 |
| `--accent-fg` on `--accent-500` | Text on green CTA | 11.2:1 | 11.2:1 |
| `--status-success-fg` on `--status-success-bg` | Success badge text | 6.7:1 | 8.4:1 |
| `--status-warning-fg` on `--status-warning-bg` | Warning badge text | 7.1:1 | 9.2:1 |
| `--status-danger-fg` on `--status-danger-bg` | Danger badge text | 7.4:1 | 9.0:1 |
| `--status-info-fg` on `--status-info-bg` | Info badge text | 7.0:1 | 7.6:1 |
| `--border-focus` on `--surface-page` | Focus ring | 3.4:1 | 3.6:1 |

> [!warning]
> `--text-tertiary` is below 4.5:1 for sub-18px text. Use it only for ≥18px or for non-essential hint copy. For sub-18px secondary text, use `--text-secondary` instead.

## Component-level rules

Every component spec (`/design-system/02-components/{name}/component.json`) carries an `a11y` block. The schema requires:

- `role` (ARIA role, if not implicit).
- `keyboard` (every shortcut and what it does).
- `minTouchTarget` (e.g. `"44x44"`).
- `wcag` (list of WCAG criteria the component is validated against).
- `rules` (component-specific additions, e.g. "Loading state must set `aria-busy=true`").

The `_schema/component.schema.json` validator rejects any component missing this block.

## Page-level rules

Every page in any consumer product must:

1. Have exactly one `h1`.
2. Declare `<html lang>`.
3. Provide a skip-to-content link if there's a top nav.
4. Set page title via `<title>` and `<meta property="og:title">`.
5. Use semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) once each.
6. Pass an automated axe-core run (zero violations) and a manual screen-reader pass (NVDA/JAWS on Windows, VoiceOver on Mac/iOS, TalkBack on Android).

## Color-blind and low-vision

- Status uses dot + label + color, not color alone.
- Charts use line style + marker shape + color, not color alone.
- Diff colors (added green / removed red) pair with `+` / `-` glyphs.
- High-contrast modes (`hc-light`, `hc-dark`) are token modes — they replace `border-subtle` with `border-strong` and bump text to maximum contrast.
- Test palettes against deuteranopia, protanopia, and tritanopia simulators.

## Motion and seizures

- `prefers-reduced-motion: reduce` is globally honored.
- The `LiveDot` pulse honors `prefers-reduced-motion` (CSS rule in primitive).
- The `RateTicker` marquee honors `prefers-reduced-motion`.
- No content flashes more than 3 times per second.

## Forms

- Every input has a programmatically associated label.
- Errors are announced via `aria-describedby` and a visible message; never inline tooltip-only.
- Required fields are marked both visually and via `aria-required="true"`.
- Inline validation fires on blur, not on every keystroke.
- Submit failures move focus to the first invalid field and announce the error.

## Tables

- `<th scope="col">` and `<th scope="row">` are mandatory.
- Sortable columns expose `aria-sort="ascending" | "descending"`.
- Row selection exposes `aria-selected`.
- Tabular numerics use the `data.*` semantic preset (`font-variant-numeric: tabular-nums lining-nums slashed-zero`). Never substitute for actual `<th scope>`.

## Typography

In addition to the WCAG bar:

- **Body floor 12px** in Lumen — only `kbd` (keyboard glyphs) and `overline` (chart axis) may go to 11px. `caption` and below render at 13px.
- **Line-length** — capped at 75ch for editorial body; ~60ch for prose. Long-form pages use `prose-lumen` wrapper which sets `max-width: 65ch`.
- **`font-synthesis: none`** is set globally. Italic VF and full Bold weight axis are shipped — the browser never fakes either. If a typeface ever loses italic or a weight, ship a true file rather than removing this rule.
- **Dynamic Type / system font scale** — iOS Satoshi is wrapped in `UIFontMetrics.scaledFont`; Android composes with `MaterialTheme.typography` which respects the Material font scale. No "px-locked" sizes on mobile.
- **Reduced motion** — type itself never animates in Lumen. Only `LiveDot` pulses; reduced-motion mode holds the pulse static.
- **Eyebrow caps** must remain at AA contrast on their surface — the smaller the eyebrow, the more critical contrast becomes. The `eyebrow.*` presets render in `text-tertiary` by default; on glass surfaces, use `text-secondary`.

## Modals and overlays

- Focus trap inside the modal; first focusable receives focus on open.
- `Esc` closes (and is documented in the keyboard map).
- Page background gets `aria-hidden="true"` while modal is open.
- Close button has `aria-label="Close"` and is keyboard-reachable as the last focusable.

## Mobile

- iOS: respect Dynamic Type (Satoshi mapped via `UIFontMetrics`).
- Android: respect Material 3 type scale + system font scale.
- Never lock orientation unless functionally required (operator app may; marketing may not).
- Touch targets ≥ 44 × 44 pt iOS / 48 × 48 dp Android.
- VoiceOver / TalkBack labels on every icon-only button.

## Internationalization

- Strings externalized; no hardcoded English in components.
- RTL support via logical properties (`margin-inline-start` not `margin-left`); test with Arabic / Hebrew.
- Numbers / dates / currencies via `Intl` APIs, never hand-formatted.
- Language switcher honors `<html lang>` and reloads with correct script direction.

## When to raise the bar to AAA

For:
- Any page in the operator's daily workflow (shipments table, quote builder).
- Any page with destructive actions (delete, cancel, refund).
- Any page that handles money (checkout, billing, settlement).

Push for AAA contrast (7:1 body) and AAA focus order (a published focus map).

## CI checks

Each PR runs:
- `axe-core` against rendered Storybook stories of every component.
- `pa11y-ci` against the `_build`-deployed audit dashboard at all 7 routes.
- WCAG-contrast lint over all token pairs.
- Lighthouse a11y score ≥ 95 against marketing template.

A failing a11y check blocks merge. Suppression requires an ADR.

## Resources

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Material Design 3 — Accessibility](https://m3.material.io/foundations/accessible-design/overview)
- [Inclusive Components by Heydon Pickering](https://inclusive-components.design/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

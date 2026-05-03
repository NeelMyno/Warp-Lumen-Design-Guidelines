---
name: Accessibility
type: foundation
version: 1.0.0
last_updated: 2026-05-02
audience: [designer, engineer, llm-agent]
target: WCAG-2.2-AA
related: [./principles.md, ../02-components/]
---

# Accessibility

> Lumen targets **WCAG 2.2 Level AA** as a hard floor for every shipped surface. AAA where it doesn't add cost. Assistive-tech parity is not optional and not a "future iteration."

## Hard floor — must, never compromise

These are not goals. They are required for any component, page, or template to ship.

| Requirement | Threshold | How Lumen enforces |
|---|---|---|
| Text contrast | 4.5:1 for body, 3:1 for ≥18px / ≥14px bold | Token pairs are pre-validated; any new token pair runs `wcag-contrast` in CI |
| Non-text contrast | 3:1 for UI controls and graphical objects | Hairline borders use `border-default`, focus uses `border-focus` (token-validated) |
| Visible focus | Always present, never `outline: none` without replacement | `:focus-visible` is set globally; `--shadow-focus` is the standard ring |
| Keyboard reachable | Every interactive element via Tab; logical order | Component schema requires keyboard map; `aria-disabled` (not `disabled`) used inside forms |
| Touch target | 44 × 44 px minimum on mobile (HIG) / 48 × 48 dp on Android (Material) | `Button` minimum height 36 web / 44 mobile; clickable area extends beyond visual when needed |
| Reduced motion | Honor `prefers-reduced-motion: reduce` | Global CSS rule disables animation; per-component opt-out documented |
| Color is not the only signal | Status always paired with label OR shape | Badge ships with `leadingDot` by default for status variants |
| Form labels | Visible label OR programmatic `aria-label` | Field component requires `label` prop (or `aria-label` if visually hidden) |
| Heading hierarchy | One `h1` per page; never skip levels | Page templates enforce; CI lint warns on skip |
| Language declared | `<html lang>` set | Root layout sets `lang="en"`; localized templates override |
| Captions / transcripts | Required on any video, audio | Required field on `Video` / `Audio` component schema |

## Recommended ceiling — push when possible

These are AAA or beyond. Lumen pushes for them by default; missing them does not block ship.

- 7:1 contrast for primary body text on the page surface (not a card).
- Skip-to-content link on every page with a top nav.
- Live regions for status changes, with `aria-live` set to `polite` (default) or `assertive` (errors only).
- No flashing > 3 times per second (we have nothing that does this).
- Reading-width measure: 50–75 ch for any long-form text.

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
- Tabular numerics use `font-feature-settings: "tnum"` for column alignment but never substitute for actual `<th scope>`.

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

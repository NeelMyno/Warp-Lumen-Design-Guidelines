---
name: Button
type: component
status: stable
version: 0.1.0
since: 0.1.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native, shopify-liquid]
a11y_level: WCAG-2.2-AA
related: [IconButton, Link, Toggle]
spec: ./component.json
last_updated: 2026-05-02
---

# Button

> A button triggers an action. It's the primary way users commit to a decision in a flow. The Warp green primary button is the system's most distinctive surface — used sparingly and always for the most important action in a view.

## When to use

- Submitting a form ("Get rates", "Book now").
- Confirming a destructive action (use `intent="danger"`, paired with a confirmation dialog).
- Triggering an action that mutates state ("Cancel order", "Re-route").

## When NOT to use

- For pure navigation between pages — use `Link` instead.
- For binary on/off state — use `Toggle`.
- For low-emphasis tertiary actions inside dense tables — use `IconButton` with a tooltip.

## Anatomy

1. Container (rectangle with `radius.control.md`)
2. Leading icon (optional, `space.inline.sm` gap from label)
3. Label (required, ≥1 character, sentence case, verb-led)
4. Trailing icon (optional)
5. Loading spinner (renders in place of leading icon when `loading=true`)
6. Focus ring (`shadow.focus`, always visible on `:focus-visible`, never removed)

## Variants

| Prop | Values | Default | Notes |
|---|---|---|---|
| `intent` | `primary` / `secondary` / `tertiary` / `danger` | `secondary` | Use `primary` for the single most important action in a view. Never two on screen. |
| `size` | `sm` / `md` / `lg` | `md` | `sm` 32 px, `md` 40 px, `lg` 48 px. Mobile minimum 44 px touch target — bumps to `md` automatically. |
| `width` | `auto` / `full` | `auto` | `full` for forms and dialogs. |
| `leadingIcon` | icon | — | Optional. Sized `16` for `sm`/`md`, `18` for `lg`. |
| `trailingIcon` | icon | — | Optional. Use for "next" / "external" indicators. |
| `loading` | boolean | `false` | Replaces leading icon with spinner; sets `aria-busy=true`; suppresses `onClick`. |
| `disabled` | boolean | `false` | Sets `aria-disabled=true` (not `disabled` attribute when inside a form). |

## States

Rest, hover, focus-visible, active, disabled, loading.

- **Rest** → `intent.bg.rest`.
- **Hover** → `intent.bg.hover`. Transition: `motion.transition.fast`.
- **Focus-visible** → `shadow.focus` ring around the rest state. Never replaced by hover. Never removed.
- **Active (press)** → `intent.bg.press`. Instant change on press; restore on release.
- **Disabled** → opacity `0.4`, `cursor: not-allowed`, no hover transition. `aria-disabled=true`.
- **Loading** → spinner replaces leading icon; label remains; `aria-busy=true`; `onClick` suppressed.

## Accessibility

- Renders as `<button type="button">` by default. Use `as="a"` only when navigating.
- Visible focus ring uses `--shadow-focus`. Do not remove or replace.
- Disabled state uses `aria-disabled="true"` (and `pointer-events: none`) instead of the `disabled` attribute when inside a form, so screen readers can still announce the label.
- Loading state sets `aria-busy="true"` and suppresses pointer events.
- Minimum touch target 44 × 44 px on mobile, regardless of `size`. Web defaults to 40 px (`md`); mobile templates must bump to `md` minimum.
- Label must contain at least one visible word. Icon-only buttons must use `<IconButton>` with a required `aria-label`.

WCAG validated:
- 1.4.3 Contrast (minimum) — accent fg/bg pair is 11.2:1 (AAA).
- 2.4.7 Focus Visible — focus ring always present.
- 2.5.5 Target Size (Enhanced) — 44 × 44 minimum on mobile.

## Do

- Use one primary button per view.
- Lead with a verb in the label: "Save changes", "Get rates", "Delete account".
- Pair `danger` intent with a confirmation dialog.
- Pair `loading` with optimistic feedback elsewhere on the page if the operation takes >2 s.

## Don't

- Don't stack three primary buttons in a row. (Stack: 1 primary + 1–2 secondary.)
- Don't use Title Case ("Save Your Changes"). Use sentence case ("Save your changes").
- Don't disable a button without explaining why nearby (helper text, tooltip).
- Don't put icons on both sides of a short label. Pick one.
- Don't use `intent="primary"` for a destructive action. That's `intent="danger"`.

## Code

See platform-specific examples in `./examples/`. The machine contract is `./component.json`.

- Web (Next.js / React + Tailwind v4): [`./examples/primary.tsx`](./examples/primary.tsx)
- React Native (NativeWind): `./examples/primary.rn.tsx`
- iOS (SwiftUI): `./examples/primary.swift`
- Android (Compose): `./examples/primary.kt`
- Shopify Liquid: `./examples/primary.liquid`

## Changelog

- 0.1.0 — Initial. Four intents (primary, secondary, tertiary, danger), three sizes, loading state, full-width variant, leading/trailing icons.

## Related

- [Toggle](../toggle/component.md) — for binary state
- [Badge](../badge/component.md) — for non-interactive status
- [Voice and tone § microcopy](../../00-foundations/voice-and-tone.md#microcopy-templates) — button copy rules

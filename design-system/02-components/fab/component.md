---
name: FAB
type: component
status: stable
version: 0.9.0
since: 0.9.0
deprecated: false
platforms: [web-react, android-native, ios-native]
a11y_level: WCAG-2.2-AA
related: [Button, IconButton]
spec: ./component.json
last_updated: 2026-05-18
---

# FAB

> Floating Action Button — round, fixed-position primary action. Single-tap access to the most common verb in a flow. The most decisive affordance Lumen ships: solid Spring Green, full radius, elevated above the surface, anchored to a screen corner. Use it sparingly — there should never be more than one FAB on a screen.

## When to use

- Mobile-first surfaces where the primary action is the user's single most likely next move (compose message, new shipment, add quote).
- Tablet + mobile breakpoints (`< lg`). On desktop, prefer a labelled `Button` in the header chrome.
- Workflows where the action is one-tap repeatable ("Add another item" in a list, "New transaction" on an account page).

## When NOT to use

- Desktop primary surfaces. The Vercel / Linear / Notion pattern keeps the primary verb in the header — FAB is a mobile-native pattern.
- When the action isn't the *single most* important next move. A FAB next to a list of 6 actions makes one feel arbitrarily promoted.
- More than one per screen. Multiple FABs compete for the eye and dilute the "this is the action" signal.
- Below large mobile keyboards. FAB at `bottom: 16` will get covered when iOS shows the keyboard. Either lift via `keyboardWillShow` or hide the FAB while a text input is focused.

## Accessibility contract

- Renders as a real `<button>` with `aria-label` for the verb.
- Position: `fixed` + `bottom-4 right-4` by default. Respects `safe-area-inset-bottom` on iOS via `env(safe-area-inset-bottom)`.
- The button is `48 × 48` (md) by default; bumps to `56 × 56` (lg) for hero moments. Always meets WCAG 2.2 AA `2.5.5` Enhanced 44 × 44 touch target.
- Focus indicator follows the global v0.12.4 dual-ring contract.
- Keyboard: Tab moves into the FAB (it's the last interactive element on the page); Enter / Space fires.
- When the FAB has a destructive intent, do not animate-in from a hidden state on first focus — that creates an "appear and fire" trap.

## Visual contract

- Shape: full `radius.full` — perfect circle.
- Surface: `color.action.primary.bg.rest` (Spring Green `#00FA8A`) by default. `intent="ghost"` and `intent="ai"` are supported for secondary moments but break the "one decisive verb" rule — use them with intent.
- Elevation: `shadow.lift.lg` at rest. Hover lifts to `shadow.lift.xl` + brand glow halo.
- Press: 1 px translate-y + glow trim per the v0.12.2 hover-bloom retune.
- Icon: lucide at `size={20}` (md) or `size={24}` (lg). Pure `text.on.accent` (`#07120D`).
- Motion: enter via `fade-in + scale-from-0.92 + slide-from-bottom-12` over `motion.medium` with `easing.spring-soft`.

## Sizes

| Size | Diameter | Icon | Use |
|---|---|---|---|
| `md` | 48 × 48 | 20 × 20 | default mobile primary |
| `lg` | 56 × 56 | 24 × 24 | hero / single-action screen |

## Pair with

- `Tooltip` — never (FAB stands alone; if it needs explanation, it isn't decisive)
- `IconButton` — when the action isn't fixed-position (use `shape="round"` + `intent="primary"` instead)

## Related Notes

- [Button](../button/component.md)
- [IconButton](../icon-button/component.md)
- [ADR 0016](../../../_meta/decisions/0016-button-rebuild-v09.md)
- `design-system/00-foundations/buttons.md` — full button language

---
name: Combobox
type: component
status: beta
version: 0.7.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Select, Field, Form, Input]
spec: ./component.json
last_updated: 2026-05-06
---

# Combobox

> Searchable single-choice dropdown. Reuses the `.lumen-field` shell for the trigger; opens a portaled listbox beneath it filtered by the typed query. Use when Select would have more than ~12 options or the option list is dynamic. v0.12.4 — the dropdown now portals to `document.body` via `createPortal` + `position: fixed` + `getBoundingClientRect()` tracking, escaping every ancestor's overflow context (Showcase frames, `<Card padding="none">`, glass surfaces, scroll containers).

## When to use
- Searchable / dynamic / large lists (countries, lanes, carriers, customers).
- Type-ahead matching with prefix or substring filtering.
- When the answer is in a known set but the set is too long to scroll comfortably.

## When NOT to use
- Stable list of < 12 known options → `Select`.
- Free-text input with no constraint → `Input`.
- Multi-select chip entry → `TagsInput` (v0.7).
- 2–3 options that fit on one row → `Segmented`.

## Anatomy

```
┌─ lumen-field (trigger) ─────────────────────┐
│  Type or pick…                          ⌄  │
└─────────────────────────────────────────────┘
   ↓ open
┌─ listbox (portaled popover) ────────────────┐
│  Sterling LTL                               │ ← highlighted row (mouse or arrow)
│  Estes Express                              │
│  Saia                                       │
│  …                                          │
└─────────────────────────────────────────────┘
```

The trigger is a normal field-shell with a bare `<input role="combobox">` inside; the listbox is portaled to `document.body` via `createPortal` with `position: fixed` so it escapes every ancestor's overflow context. Trailing chevron rotates 180° when open.

## States
Rest, hover, focus-visible, open, filled, error, disabled. Listbox: empty (no matches), populated, scrolling.

## Accessibility
- `role="combobox"` on the input + `aria-expanded`, `aria-autocomplete="list"`, `aria-controls` pointing at the listbox id.
- Listbox is `role="listbox"`; each row is `role="option"` with `aria-selected` set when keyboard-active.
- Click outside closes; Escape closes; Enter selects the highlighted option.
- The listbox MUST portal in production via `createPortal(<div fixed>, document.body)` so it escapes `overflow: hidden` ancestors.

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.3, 2.4.7, 2.5.8, 3.3.2, 4.1.2.

## Portal contract (v0.12.4)

The dropdown listbox is rendered via `createPortal(<div style={{ position: 'fixed', top, left, width, zIndex }} />, document.body)`. The position state is computed from the input's `getBoundingClientRect()` and re-tracked on `scroll` (capture phase, so nested scrollers fire) + `resize` events. **Why this matters for LLMs generating code:** any inline `<div className="absolute ...">` panel inside the trigger's DOM subtree will be clipped by ancestor `overflow: hidden` — and ancestor `overflow: hidden` is structurally everywhere in the system:

- `<Card padding="none">` composes `overflow-hidden` per [ADR 0021](../../../_meta/decisions/0021-card-corner-clip-contract-v0121.md).
- `Showcase` demo frames in the audit dashboard's `library` route compose `overflow-hidden` by design (so the demo itself doesn't bleed into adjacent frames).
- Glass-strong surfaces and scroll containers compose `overflow-hidden`.
- The InlineTabs `pill` variant `TabsList` composes `overflow-hidden` (v0.12.4 — sibling pattern at smaller-control scale to ADR 0021).

Pre-v0.12.4 the Combobox rendered an inline `<div absolute z-[var(--z-overlay)] left-0 right-0 mt-1 ...>` element anchored to the `relative` wrapper. User screenshot 2026-05-06 of the `/library` Combobox autocomplete inside a Showcase frame caught the dropdown clipped at the frame's bottom edge — only the top edge of the dropdown peeked out; the option list was trapped inside the frame. v0.12.4 retired the inline-absolute approach and migrated to `createPortal` + `position: fixed` + `getBoundingClientRect()` tracking. DOM verification: `parentElement === document.body`, `position: fixed`, `zIndex: 1000`, all options render past the frame's bottom edge.

The outside-click dismiss handler must exempt the portaled list — clicks on options would otherwise close the dropdown before the option's `onClick` handler fires (the click bubbles up from the portaled list, the dismiss handler sees a click outside the trigger's subtree, the dismiss fires before React processes the option's click). The Lumen Combobox uses a `listRef` that captures the portaled element so the dismiss handler can check `if (listRef.current?.contains(event.target)) return;` before closing.

## Do
- Wrap in a Field for label / hint / error orchestration.
- Cap visible matches at 8 with internal scroll past that.
- Sort matches with prefix-first, then substring.
- Use Select's listbox tokens (`select.listbox.*`) where possible — Combobox is a search-augmented Select.
- Portal the dropdown via `createPortal` + `position: fixed` + `getBoundingClientRect()` tracking (v0.12.4 contract).
- Exempt the portaled list from the outside-click dismiss handler — clicks on options must reach the option handler, not trigger close-before-select.

## Don't
- Don't ship a Combobox without a portal — it will clip inside dialogs, tables, Showcase frames, `<Card padding="none">`, glass surfaces, and scroll containers.
- Don't render the dropdown as an inline `<div absolute>` element anchored to the trigger's `relative` wrapper — Tailwind `absolute` resolves against the nearest `relative` ancestor's painting box, which is clipped by ancestor `overflow: hidden`. The portal pattern escapes the painting context entirely.
- Don't anchor the portaled list with `position: absolute` — `position: fixed` is what makes the coordinates viewport-relative (which is what `getBoundingClientRect()` returns); `absolute` would re-introduce the ancestor-context dependency that the portal was designed to escape.
- Don't auto-select on blur unless the typed value exactly matches one option.
- Don't disable Enter when no option matches — let the user submit and surface a "no matches" hint.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.12.4 — Dropdown listbox migrates from inline `<div absolute>` (anchored to the trigger's `relative` wrapper) to `createPortal(<div style={{ position: 'fixed', top, left, width, zIndex }} />, document.body)`. Position re-tracked on `scroll` (capture phase) + `resize`. Outside-click dismiss exempts the portaled list (so option clicks don't close-before-select). Closes the user-reported `/library` Showcase-frame clipping bug + structurally protects the Combobox inside `<Card padding="none">`, glass surfaces, scroll containers, and any nested overflow-clipped ancestor. Same pattern Radix Popover / Tooltip / DropdownMenu use throughout the rest of the system; v0.12.4 brought the hand-rolled Combobox in line. No new ADR — the pattern is exactly the floating-UI portal contract the rest of the system already follows.
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitive in `inputs.tsx` to a contract. Reuses `select.listbox.*` tokens; adds combobox-only deltas (`combobox.item.*`, caret rotation).

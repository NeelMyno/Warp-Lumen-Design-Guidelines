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
last_updated: 2026-05-03
---

# Combobox

> Searchable single-choice dropdown. Reuses the `.lumen-field` shell for the trigger; opens a portaled listbox beneath it filtered by the typed query. Use when Select would have more than ~12 options or the option list is dynamic.

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

The trigger is a normal field-shell with a bare `<input role="combobox">` inside; the listbox renders absolute-positioned (portaled in production to escape `overflow: hidden` ancestors). Trailing chevron rotates 180° when open.

## States
Rest, hover, focus-visible, open, filled, error, disabled. Listbox: empty (no matches), populated, scrolling.

## Accessibility
- `role="combobox"` on the input + `aria-expanded`, `aria-autocomplete="list"`, `aria-controls` pointing at the listbox id.
- Listbox is `role="listbox"`; each row is `role="option"` with `aria-selected` set when keyboard-active.
- Click outside closes; Escape closes; Enter selects the highlighted option.
- The listbox MUST portal in production so it escapes `overflow: hidden` ancestors.

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.3, 2.4.7, 2.5.8, 3.3.2, 4.1.2.

## Do
- Wrap in a Field for label / hint / error orchestration.
- Cap visible matches at 8 with internal scroll past that.
- Sort matches with prefix-first, then substring.
- Use Select's listbox tokens (`select.listbox.*`) where possible — Combobox is a search-augmented Select.

## Don't
- Don't ship a Combobox without a portal — it will clip inside dialogs and tables.
- Don't auto-select on blur unless the typed value exactly matches one option.
- Don't disable Enter when no option matches — let the user submit and surface a "no matches" hint.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitive in `inputs.tsx` to a contract. Reuses `select.listbox.*` tokens; adds combobox-only deltas (`combobox.item.*`, caret rotation).

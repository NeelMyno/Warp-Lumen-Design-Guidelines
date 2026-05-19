# State matrix

> **Every state every Lumen primitive can be in, plus what to render.** Authored v0.13.2 to close the audit-cycle gap where `micro-interactions.md` covered hover / focus / validation / success but no doc enumerated the full state set across primitives. v0.14 R9 added **`stale`** as an explicit data-freshness state for operator-portal data containers.

## The Lumen states (what they mean, when they trigger)

The state names are Lumen-canonical. When you build a new primitive or compose an existing one, map your behavior to these — don't invent new names.

| State | Trigger | Description |
|---|---|---|
| **default** | At rest, nothing happening | The baseline. Most common state. |
| **hover** | `:hover` (pointer device only — `(hover: hover) and (pointer: fine)`) | Mouse hovering. Touch devices don't fire hover. |
| **focus** | `:focus-visible` (keyboard-reached or explicit focus, not click-focus) | The keyboard user's "I'm on this." Box-shadow halo + outline (v0.12.4 ADR). |
| **active** | `:active` (mouse down / touch in progress) | The press. Brief — 100-200 ms. Buttons go to `var(--color-action-primary-bg-press)`. |
| **selected** | `aria-selected="true"` or `data-state="selected"` | Sticky selection (a chosen tab, a picked color, a multi-select row). Distinct from `active` (transient). |
| **pressed** | `aria-pressed="true"` (toggle button on) | Toggle button in its "on" state. Distinct from `active` (transient mouse-down). |
| **disabled** | `disabled` attribute or `aria-disabled="true"` | Not interactive. Reduced opacity (60-70%); cursor `not-allowed`; tab-skip. |
| **loading** | Async operation in flight | Replace primary action surface with spinner; disable cursor; keep visible. |
| **error** | Validation failed or async error | Red hairline border, error icon, error text below. |
| **success** | Validation passed or async success | Spring green checkmark; either ephemeral (toast) or persistent (form field marker). |
| **warning** | Soft validation issue | Amber hairline border, warning icon, warning text. |
| **empty** | No data to display | `EmptyState` primitive — icon + heading + description + suggested action. |
| **expanded / collapsed** | Accordion / disclosure open or closed | `aria-expanded="true"|"false"`. Animate the chevron 180°, animate height. |
| **dragging** | Drag in progress | Lifted shadow, follow-cursor positioning, dim source position. |
| **read-only** | Display-only (often paired with submitted forms) | Same content style as enabled, no cursor on hover, no `:focus-visible`. Note: NOT disabled — value is still tab-reachable for screen readers. |
| **skeleton** | Loading placeholder before first render | Shimmering rectangle matching the eventual content's dimensions. Honors `prefers-reduced-motion`. |
| **stale** *(v0.14)* | Data older than its freshness budget but not erroring | Operator pattern. Show a small grey clock icon at the top-right of the affected card; tooltip surfaces the actual freshness timestamp ("as of 12 min ago"); the data values themselves do NOT dim (the data is still trustworthy, just aging). Distinct from `error` (the fetch failed) and `loading` (a refresh is in flight). Lumen primitives that carry the `stale` contract: `Stat`, `KpiCard`, `Sparkline`, `LineChart`, `BarChart`, any container in Tier C. |

## The state ladder (which states a component must support)

Not every primitive needs every state. The contract:

### Tier A — every interactive primitive

These ten states are **mandatory** for any clickable, tabbable, hoverable element:

`default · hover · focus · active · disabled · loading (if it triggers async) · error (if it can fail) · success (if it can succeed) · selected (if it's part of a selection set) · pressed (if it's a toggle)`

### Tier B — every form input

Inputs additionally must support:

`read-only · warning · empty (when the input has no value)`

### Tier C — every container that holds data

Cards, tables, lists, charts additionally must support:

`empty · loading (skeleton) · error · stale (if data freshness matters)`

### Tier D — every disclosure / collapsible

`expanded · collapsed` (and an animated transition between them, with `prefers-reduced-motion` fallback).

## Per-primitive state expectations

### Buttons (`Button`, `IconButton`, `FAB`, `SplitButton`, `ButtonGroup`, `Toggle`)

| State | Visual | Token |
|---|---|---|
| default | Brand-resting; primary CTA carries the rest-state lime halo | `--color-action-primary-bg-rest`, `--shadow-button-glow-rest` |
| hover | Slightly brighter bg + dialed-up halo (v0.12.2 retune) | `--color-action-primary-bg-hover`, `--shadow-button-glow-hover` |
| focus | Outline + box-shadow dual-ring (v0.12.4 — outline 2px lime-a64 + 1px offset + soft box-shadow halo) | `outline + var(--shadow-focus)` |
| active | Darker bg, tighter halo | `--color-action-primary-bg-press` |
| disabled | 60% opacity, `cursor: not-allowed`, no halo, no hover response | `opacity-60` |
| loading | Replace label with `Spinner`, disable click but keep `:focus-visible` reachable | `aria-busy="true"` |
| pressed (Toggle only) | `aria-pressed="true"` lights the button as if selected | `--color-action-selected-bg` |

### Inputs (`Input`, `Textarea`, `NumberInput`, `Combobox`, `Select`, `DatePicker`, ...)

| State | Visual | Token |
|---|---|---|
| default | `.lumen-field` shell with hairline border at rest | `--color-border-default` |
| hover | Slightly stronger border, no bg change | `--color-border-strong` |
| focus | Lime border + soft box-shadow halo | `--color-border-focus`, `--shadow-focus` |
| filled | (Implicit) — same as default if the value is present | — |
| disabled | `.lumen-field disabled` — sunken bg, muted text, no caret | `--color-surface-input-disabled` |
| read-only | Same as default but `cursor: text`, no editable caret | — |
| error | Red border, red `ValidationMessage` below | `--color-border-error`, `--color-text-error` |
| warning | Amber border, amber `ValidationMessage` below | `--color-border-warning`, `--color-text-warning` |
| success | Lime border, optional check icon, success `ValidationMessage` | `--color-border-success`, `--color-text-success` |
| loading | Subtle shimmer over the field (e.g. async validation) | `Skeleton` overlay |
| empty (when the input has no value AND error tier is empty-state) | placeholder text in `--color-text-placeholder` | — |

### Form-system (`Field`, `Form`, `ValidationMessage`)

Every form input lives inside a `<Field>` (AGENTS.md composition rule 1). The Field handles label + help text + error/success state + focus halo on the wrapper. Don't render `<Input>` bare.

- **Validation timing** — onSubmit by default; onBlur for fields the user has touched and moved away from; onChange ONLY for fields where it's clearly helpful (password strength, character counter). Per `forms-and-inputs.md`.
- **Validation announcement** — screen readers must announce the error. Use `<ValidationMessage role="alert">` or wire `aria-describedby` to the message ID.

### Data displays (`Table`, `DataGrid`, `KpiCard`, `Chart`, `Sparkline`, `Kanban`, `Timeline`, `TreeView`)

| State | Visual |
|---|---|
| default | The data, rendered |
| loading | `Skeleton` at the same dimensions (don't use a spinner inside a 360×180 chart frame — reads as broken) |
| empty | `EmptyState` (icon + heading + description + suggested action) |
| error | `Alert tone="danger"` with retry button |
| stale | `LiveDot` flips from pulsing green to amber static; tooltip "Last refreshed N min ago" |
| partial | Render what loaded + `ValidationMessage tone="warning"` for missing series |
| row-hover | Subtle bg lift; cursor `pointer` if the row is clickable |
| row-selected | `aria-selected="true"` + lime hairline left border + slightly-tinted bg |

### Disclosures (`Accordion`, `Panel`, `Dialog`, `Drawer`, `Sheet`, `Tooltip`, `Popover`)

| State | Visual |
|---|---|
| collapsed / closed | Trigger only; content hidden | — |
| expanded / open | Content visible; chevron rotated 180° (where applicable) |
| transitioning | Decelerate easing; honors `prefers-reduced-motion: reduce` (replaces transition with instant change) |
| dismissable | ESC closes (Dialog / Drawer / Sheet); outside-click closes (Popover / Tooltip / DropdownMenu) |
| focus-trapped | Dialog and Drawer trap focus per Radix; Sheet inherits via Radix Dialog primitive |

### Disclosure marker contract (v0.12.5)

Every `<details>`/`<summary>` accordion that composes a custom chevron icon must apply `class="lumen-summary"` (or `list-none`) to the summary. Without it the native browser disclosure triangle competes with the lucide ChevronDown.

### Selection controls (`Checkbox`, `RadioGroup`, `Switch`, `Toggle`, `Segmented`)

| State | Visual |
|---|---|
| unchecked | Hairline border on transparent surface | — |
| checked | Spring-green bg + check glyph |
| indeterminate (Checkbox only) | Spring-green bg + horizontal dash |
| pressed (Toggle/Switch only) | Same as checked, but Toggle is `aria-pressed` not `aria-checked` |
| focus-visible | Outline + halo per the global rule |
| disabled | Muted bg + no hover response |

### A11y contract for Switch + Checkbox (v0.13.1)

HTML's implicit-label association does NOT propagate the accessible name to a `<button role="switch">` or `<button role="checkbox">` because Radix overrides the host element role. When the visible label is a sibling `<span>` rather than a `<label htmlFor>`, pass `aria-labelledby` (pointing to the span's id) or `aria-label`. See AGENTS.md updates in v0.13.1.

### Dragging (`Kanban`, `DataGrid` reorderable rows, file-dropzone hover)

| State | Visual |
|---|---|
| not-dragging | At rest | — |
| drag-over (drop target) | Tinted bg + dashed border |
| dragging-source | Lifted shadow on the moving element; source position dimmed to ~40% opacity |
| dropping | Snap into place with a decelerate-easing slide |

### Permission / destructive

| State | Visual |
|---|---|
| confirmation-pending | Dialog asking the user to confirm (e.g. "Delete?"). Pair with `TypeToConfirm` for permanent destructive actions. |
| permission-denied | Disabled control + `Tooltip` explaining why (e.g. "Requires admin role") |
| optimistic | Apply the change in UI immediately, show a `Snackbar` "Done · Undo"; on server-error, revert + show `Toast` |
| retry | After error, show a retry affordance — usually a button labeled "Try again" |
| undo | After destructive-but-reversible action, show a `Snackbar` with "Undo" for ~5 seconds |

## Common mistakes

- **Skipping the loading state.** A button that goes to "Submit → blank → success" feels broken. Always show a `loading` state during async, even if it's < 200 ms (CSS transition can absorb fast async).
- **Using `disabled` when you mean `read-only`.** Disabled is "not interactive AND not announced to screen readers as relevant." Read-only is "not editable but still announced." Form summaries should be read-only.
- **No empty state.** A table with `data.length === 0` rendered as just the headers is broken UX. Always ship an `EmptyState` with suggested action.
- **No error retry.** "Failed to load" with no retry button is a dead end. Always pair error with retry.
- **Animating with no `prefers-reduced-motion` fallback.** Every Lumen animation honors the reduce setting via media query. New animations get the fallback in the same PR.
- **Inventing new state names.** Use the canonical 13. If you need a new state, propose it via PR + ADR (this doc is the source).

## Related

- [`micro-interactions.md`](micro-interactions.md) — hover / focus / validation / success motion language.
- [`motion-language.md`](motion-language.md) — durations, easings, decelerate-not-bounce.
- [`forms-and-inputs.md`](forms-and-inputs.md) — `.lumen-field` shell + validation timing.
- [`accessibility.md`](accessibility.md) — WCAG 2.2 AA contract.
- AGENTS.md hard rules 1-14 — every state contract that touches keyboard / focus / motion / accent / portal is governed here.

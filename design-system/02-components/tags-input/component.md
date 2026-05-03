---
name: TagsInput
type: component
status: beta
version: 0.7.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Input, Combobox, Field, Form]
spec: ./component.json
last_updated: 2026-05-03
---

# TagsInput

> Wrapping chip-row tag entry. Comma OR Enter commits the draft; Backspace on an empty draft removes the last chip. The shell flexes to multi-line when the chip row wraps.

## When to use
- Free-form labels, keywords, recipients, lane stops.
- Email composer "To" / "CC" fields.
- Filter pills on a dashboard.
- Any "add many small things" pattern where each thing is short and discrete.

## When NOT to use
- Picking from a known finite set → `Combobox` (or `Combobox` with multi-select when v0.8 lands).
- Free-form longer text where each value is a sentence → `Textarea`.
- Single value → `Input`.

## Anatomy

```
┌─ lumen-field (flex-wrap) ────────────────────────────┐
│  [react ×]  [a11y ×]  [tokens ×]  Add tag…           │
│   chip       chip       chip      bare draft input   │
└──────────────────────────────────────────────────────┘
```

The shell uses `flex-wrap: wrap`, `min-height: input.height.md`, and a small vertical padding so chips wrap onto a second line cleanly. The bare draft `<input>` sits at the end of the row at auto-width with a minimum width.

## States
Rest, hover, focus-visible, filled, error, disabled. Per chip: rest, hover (close affordance brightens), pressed.

## Accessibility
- The shell is the focus surface; the inner draft `<input>` is bare.
- Each chip's close button has `aria-label="Remove {tag}"`.
- Backspace on an empty draft removes the last chip — but ALSO renders a brief polite announcement: "Removed react".
- Comma key is intercepted, BUT users can still type commas inside a tag by quoting (`"foo, bar"` → adds "foo, bar" as one tag).

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.7, 2.5.8, 3.3.1, 4.1.2.

## Do
- Commit on both Enter AND Comma (the two most common keys users reach for).
- Commit on blur as well — don't drop a half-typed tag.
- Surface duplicates as a no-op with subtle feedback (chip flashes briefly), don't hard-error.
- Cap the rendered chip count and show "+5 more" if needed for dense tables.

## Don't
- Don't auto-format casing — let users type "React" or "react"; preserve their input.
- Don't allow whitespace-only tags (trim and skip).
- Don't allow commas-as-separator AND quoted commas-in-tag in the same field without a clear UX hint — pick one.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitive in `inputs.tsx` to a contract. Wrap-flex shell; Comma + Enter commit; Backspace-removes-last; blur commits.

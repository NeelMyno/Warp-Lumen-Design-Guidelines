---
name: ValidationMessage
type: component
status: stable
version: 0.6.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Field, Form, Alert]
spec: ./component.json
last_updated: 2026-05-03
---

# ValidationMessage

> Inline or summary validation message. Variants: `inline` (below a single Field) and `summary` (top of a Form on submit failure). Tones: `error`, `warning`, `success`, `info`. Color is never the only signal — every tone ships icon + color + text.

## When to use
- Inline: as the helper-row below a Field with a validation result. Field already wires this for `error` and `hint`; ValidationMessage is for cases where you need a non-error tone (success after save, info hint, warning for risky values).
- Summary: at the top of a Form on submit failure with anchor links to each invalid Field.

## Variants

| Variant | Use | Live region |
|---|---|---|
| `inline` | Below a single Field | `role="alert"` for error tone, polite for others |
| `summary` | Top of Form on submit failure | `aria-live="assertive"`, focuses itself |

## Tones

| Tone | Color | Icon |
|---|---|---|
| `error` | `--text-error` | ⚠ |
| `warning` | `--text-warning` | ⚠ |
| `success` | `--text-success` | ✓ |
| `info` | `--text-tertiary` | ℹ |

## Accessibility
- Color is never the only signal — every tone ships an icon AND text.
- Error tone in `inline` variant sets `role="alert"`.
- Error tone in `summary` variant sets `aria-live="assertive"` and focuses itself on submit failure.
- Other tones use `aria-live="polite"`.

WCAG: 1.3.1, 1.4.1, 3.3.1, 3.3.3, 4.1.2, 4.1.3.

## Do

- Use the summary variant for a Form-level error count + anchor links.
- Pair icon + color + text. Color alone fails for low-vision users.
- Reserve success tone for explicit "the system finished a thing" moments — not as decoration.

## Don't

- Don't use error tone for warnings.
- Don't set `aria-live="assertive"` for inline messages.
- Don't render two ValidationMessages per Field — Field handles error/hint slot already.

## Code

- See `feedback.tsx` ValidationMessage atom for the v0.5 implementation; v0.6 promotes it to a dedicated primitive.

## Changelog
- 0.6.0 — Initial dedicated contract. Was previously buried in `feedback.tsx`; promoted because it's a form-composition primitive, not a feedback affordance.

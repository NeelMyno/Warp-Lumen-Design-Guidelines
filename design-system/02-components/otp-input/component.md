---
name: OtpInput
type: component
status: beta
version: 0.7.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Input, Field, Form, PasswordInput]
spec: ./component.json
last_updated: 2026-05-03
---

# OtpInput

> One-time passcode entry. A row of single-digit cells; auto-advance on typing, backspace-erases-previous on delete. Each cell is its own micro `.lumen-field` shell so each cell focuses independently.

## When to use
- 6-digit (or 4-digit) verification codes from SMS, email, or an authenticator app.
- Sign-in second factor.
- Account recovery confirmation.

## When NOT to use
- Long secrets (passwords, recovery phrases) → `PasswordInput` or a custom composer.
- Free-form numeric entry → `NumberInput` or `Input` with `inputMode="numeric"`.
- Codes you want the user to read aloud — keep them in a single Input with letter-spacing tweaks instead.

## Anatomy

```
┌──┐  ┌──┐  ┌──┐    ┌──┐  ┌──┐  ┌──┐
│ 4│  │ 9│  │ 2│    │ 7│  │ 8│  │ 1│
└──┘  └──┘  └──┘    └──┘  └──┘  └──┘
   3-cell group        3-cell group
```

Each cell:
- Is its own `.lumen-field` micro-shell — independent focus halo per cell.
- Houses a single bare `<input maxLength={1} inputMode="numeric">`.
- Auto-focuses the next cell on a valid digit; auto-focuses the previous cell on Backspace when the current cell is empty.
- The whole row sits inside `role="group"` with an `aria-label` describing the code's purpose.

A wider `groupSep` gap in the middle visually breaks 6 cells into 3-3 chunks (matching how the user reads the code aloud).

## States
Per cell: rest, focus-visible, filled, error, disabled. Whole row: error (all cells flip to error when validation fails).

## Accessibility
- `inputMode="numeric"` so mobile shows the number pad.
- `autoComplete="one-time-code"` so iOS / Android offer to autofill from the SMS.
- Each cell `aria-label="OTP digit N of 6"` so AT users hear position context.
- Paste support: pasting "492781" into any cell distributes one digit per cell from that position forward.

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.7, 2.5.8, 3.3.1, 4.1.2.

## Do
- Auto-advance on a valid digit; backspace-erases-previous on Backspace from an empty cell.
- Set `inputMode="numeric"` and `autoComplete="one-time-code"` so the OS autofills from SMS.
- Validate on the row, not per cell — a 5-of-6 incomplete code is "incomplete", not "invalid".
- Surface success / error on the whole row simultaneously.

## Don't
- Don't allow non-digit characters (filter on input — the implementation does this).
- Don't focus the next cell after a paste-fill — focus the LAST filled cell instead so the user can submit.
- Don't disable paste — users paste from email and SMS notifications.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitive in `inputs.tsx` to a contract. Cell-row pattern with auto-advance, backspace-erases-prev, and full paste-distribute support.

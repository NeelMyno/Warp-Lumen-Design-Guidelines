---
name: PasswordInput
type: component
status: beta
version: 0.7.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Input, Field, Form]
spec: ./component.json
last_updated: 2026-05-03
---

# PasswordInput

> Password entry with a Show / Hide toggle in the trailing slot. Reuses the `.lumen-field` shell. Value renders mono with wider tracking so the masking dots read as discrete characters.

## When to use
- Sign-in, sign-up, password change, password confirmation.
- Any sensitive token entry where the user benefits from a visibility toggle (API keys live entry, SSH passphrase).

## When NOT to use
- One-time codes from an authenticator app or SMS → `OtpInput`.
- Recovery phrase entry → a custom multi-line composer (out of v0.7 scope).
- Public, non-secret strings → `Input`.

## Anatomy

```
┌─ lumen-field ────────────────────────────────┐
│  ••••••••••••                       [Show]  │
│   ↑                                    ↑    │
│  value (mono, wider track)           reveal │
└──────────────────────────────────────────────┘
```

The reveal toggle is a real `<button data-interactive>` inside the trailing slot. When pressed, the input's `type` swaps between `"password"` and `"text"`. The toggle's label flips between "Show" and "Hide"; `aria-pressed` mirrors the visibility state.

## States
Rest, hover, focus-visible, filled, error, disabled. Reveal toggle: rest, hover, pressed (showing), disabled.

## Accessibility
- The reveal toggle MUST set `aria-pressed` and a clear `aria-label` ("Show password" / "Hide password").
- Default `autoComplete="current-password"` for sign-in; switch to `"new-password"` for sign-up / change.
- Browser autofill works — never disable it.
- Caps Lock detection is a high-value affordance: render a small live-region warning beneath the field when Caps Lock is on.

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.7, 2.5.8, 3.3.1, 3.3.2, 4.1.2.

## Do
- Use `autoComplete="current-password"` on sign-in, `"new-password"` on sign-up / change.
- Honor browser autofill — the field shell handles `:-webkit-autofill` via the global recipe.
- Surface a Caps Lock warning if you can detect it (`event.getModifierState("CapsLock")`).
- Pair sign-up password fields with `PasswordStrength` (forthcoming v0.8) for a meter beneath the field.

## Don't
- Don't disable paste — let users paste from a password manager. `onPaste="return false"` is an anti-pattern.
- Don't auto-clear the field on validation error; preserve the value so the user can correct it.
- Don't show the password by default — start masked, let the user opt in.

## Roadmap (v0.8)
- **PasswordStrength** — separate primitive for the segmented strength meter that pairs beneath this field. The audit-dashboard already ships a working `<PasswordStrength>` in `audit-dashboard/src/components/primitives/inputs.tsx` ~L346; the dedicated contract lands in v0.8.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitive in `inputs.tsx` to a contract. Reveal toggle in trailing slot; mono value with wider tracking. PasswordStrength deferred to v0.8.

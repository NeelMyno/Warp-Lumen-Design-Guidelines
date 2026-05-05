# auth-flow — sign in, sign up, password reset, OTP, SSO

> The first surface a user touches and the one they touch most often. Auth is small in code and load-bearing in trust — a sign-in form is the brand's handshake. Lumen's auth pattern is a single centered card on a calm canvas, cozy form density inside, marketing breathing room around. The user reaches for one primary action; everything else recedes.

## 1. The shape

```
AuthLayout (full viewport, dark canvas, centered)
  ├── BrandMark (centered top, marketing density)
  │     └── Lumen W mark + wordmark, 32–40px tall
  │
  └── AuthCard (max-w-[360px], centered, raised surface)
        ├── Heading h2  ("Sign in to Warp")
        │
        ├── Form
        │     ├── Field.email
        │     │     ├── Label "Email"
        │     │     ├── Input type="email" autocomplete="email"
        │     │     └── help / error
        │     ├── Field.password
        │     │     ├── Label "Password"
        │     │     ├── PasswordInput (eye toggle in trailing slot)
        │     │     └── help / error
        │     ├── Button.primary.lg fullWidth  ("Sign in")
        │     └── secondary link text-accent  ("Forgot password?")
        │
        ├── Divider with inline "or"
        │
        ├── ProviderButtons (stacked vertically)
        │     ├── Button.outline.lg fullWidth  +  Google icon
        │     ├── Button.outline.lg fullWidth  +  Microsoft icon
        │     ├── Button.outline.lg fullWidth  +  Apple icon
        │     └── Button.outline.lg fullWidth  +  magic-link icon
        │
        └── Footer line (body.sm, text-secondary)
              "Don't have an account? <Link>Sign up</Link>"
```

**Variants — same shell, different fields:**

- **Sign up.** Add `Field.fullName` at the top of the Form. Replace the "Forgot password?" link with a `<Link>Terms of service</Link>` + `<Link>Privacy</Link>` line below the primary CTA. Footer line flips: "Already have an account? <Link>Sign in</Link>".
- **Password reset (request).** Drop everything below the email Field. Single Field.email + `Button.primary.lg` "Send reset link". On submit success, swap the form for a confirmation block: `lumen-eyebrow "CHECK YOUR EMAIL"` + `body.md` "If an account exists for that email, a reset link is on its way." (Never confirm or deny existence — see anti-patterns.)
- **Password reset (commit).** User clicks the email link; surface a Form with `Field.password` (new) + `Field.password` (confirm) + `Button.primary.lg` "Reset password". Same AuthCard shell.
- **OTP verification.** Replace the password Field with `OtpInput` (4–8 cells, auto-focus first cell, auto-advance on input). Below the OTP, render a `Button.tertiary.sm` "Resend code" with a 30s cooldown timer that updates in `text-tertiary` "Resend in 22s". On the cell row, attach `autoComplete="one-time-code"` so iOS surfaces the SMS in the keyboard suggestion bar.
- **SSO landing.** A pre-AuthCard intercept page that asks for the email, then routes to the matched IdP. Single Field.email + `Button.primary.lg` "Continue". On submit, look up the email's domain → if SSO is required, redirect; if not, fall through to the password form.

## 2. Density mode

**Cozy on the form, marketing on the canvas.** This is the pattern's signature trick — the surrounding canvas breathes (the BrandMark sits 64px from the viewport top; the AuthCard sits 48px below the BrandMark; the page has the calm, branded mood of a landing page), but the form inside the card is **cozy** density (40–48px control height, 16px field-to-field gap). The auth surface is a moment of arrival; the form inside is a moment of work.

| Region | Density | Rationale |
|---|---|---|
| AuthLayout canvas | Marketing | First-impression surface; the user must register the brand in 50ms before reaching the form. |
| BrandMark zone | Marketing | Generous breathing pushes the brand into focal-point status. |
| AuthCard padding | Marketing-inside | 24–40px padding so the form has room; not a marketing hero, but not a dense panel either. |
| Form (Field, Button) | Cozy → cozy-large | Touch surfaces use `size.control.lg` (48px) on mobile; desktop uses `size.control.md` (40px) by default. Bump to `lg` for the primary CTA so it carries weight. |

The mobile rule from `density.md` §6 applies: cozy on a coarse-pointer device auto-bumps to `lg` (48px) to satisfy the WCAG 2.2 SC 2.5.8 + Apple HIG 44pt touch floor. Desktop stays at 40 / 48px depending on the field's role.

## 3. Tokens for wrappers

```
AuthLayout outer:
  min-h-screen
  bg-surface-page                 (Obsidian Mint canvas; see color.surface.page)
  pt-section-lg                   (space.section.lg = 64px — push BrandMark down)
  pb-section-md                   (space.section.md = 48px — bottom breathing)
  flex flex-col items-center
  gap-section-md                  (48px — BrandMark to AuthCard)

BrandMark:
  height: 32–40px
  margin-bottom: 0                (parent gap handles the rhythm)

AuthCard:
  max-w-[360px]
  w-full
  bg-surface-raised               (a hair lifted from the canvas)
  border border-hairline
  rounded-card                    (radius.card.default = 12px)
  shadow-card                     (composite hairline + soft drop)

  Padding:
    Mobile (sm)  → p-inset-xl     (space.inset.xl = 24px)
    Desktop (md+)→ p-inset-2xl    (space.inset.2xl = 40px)

AuthCard interior:
  Heading → Form gap:             space.stack.lg (24px)
  Form internal field-to-field:   space.field.gap.field (16px)
  Form → Divider gap:              space.stack.xl (40px)
  Divider → ProviderButtons gap:  space.stack.lg (24px)
  ProviderButtons internal stack: space.2 (8px) — buttons are 48px-tall, 8px feels right
  ProviderButtons → Footer line:  space.stack.lg (24px)
  Heading internals:
    eyebrow (optional):           space.stack.xs (4px)
    h2:                           type.heading.h2 (25px)
```

The 360px max-width is documented across Stripe, Vercel, Linear, GitHub, and Atlassian — it's the canonical auth-card width. Wider than 400px and the form starts to look like a settings page; narrower than 320px and the OTP cells get cramped on mobile.

## 4. Component recipe

| Role | Component + variant | Notes |
|---|---|---|
| AuthCard heading | `heading.h2` (25px) | "Sign in to Warp" / "Create your account" / "Reset your password". One sentence, no apologetic language. |
| Optional eyebrow | `lumen-eyebrow` | Above the h2 when contextualizing — "WORKSPACE / acme-corp" on a tenant-scoped sign-in. Skip for the canonical landing. |
| Email field | `Field` wrapping `Input` `type="email"` `autocomplete="email"` `inputMode="email"` | Always shows the visible label. Placeholder-only inputs are accessibility failures. |
| Password field | `Field` wrapping `PasswordInput` (with eye toggle) | Eye toggle lives in the trailing slot; the wrapper still paints the focus halo. Default state = masked. |
| Full name (sign up) | `Field` wrapping `Input` `autocomplete="name"` | Required; autofocus on mount for sign-up. |
| OTP | `OtpInput` `length={6}` `autoComplete="one-time-code"` | Auto-focus first cell, auto-advance on input, accept paste of full code. iOS's SMS suggestion bar requires `autoComplete="one-time-code"`. |
| Primary CTA | `Button` `intent="primary"` `size="lg"` `fullWidth` | "Sign in" / "Create account" / "Send reset link" / "Verify". Loading state on submit (spinner + disable + "Signing in…"). |
| Secondary link (forgot password) | `<Link>` (text-accent) | Right-aligned below the password field. Don't render as a button; it's a navigation, not an action. |
| Divider with "or" | `Divider` with inline label | A 1px hairline + the word "or" centered in `text-tertiary` `body.sm`. Not "OR" caps; not "— or —"; just "or". |
| Provider button | `Button` `intent="outline"` `size="lg"` `fullWidth` `leadingIcon={...}` | One per provider, stacked vertically below 600px viewport. Provider name as label ("Continue with Google", not "Google"). |
| Footer line | `body.sm` in `text-secondary` + inline `<Link>` | The auth-flow exit ramp. Always offer the inverse path (sign-in offers sign-up; sign-up offers sign-in). |
| Error surface | `ValidationMessage` `severity="error"` | Below the field on field-level errors; above the form on form-level errors ("Email or password is incorrect"). Generic on auth-error — never leak account existence. |
| Success surface (reset, OTP) | `Toast` `intent="success"` + state swap | "Reset link sent" / "Verified — redirecting." Don't navigate silently; the user wants to see the confirmation. |

**Form binding.** Use `<Form schema={zodSchema} defaultValues={{}}>` from `02-components/form/` — the RHF binding from ADR 0013. Every Field reads its name from the form schema; validation timing follows the rules in `forms-and-inputs.md` §Validation timing (don't validate on first typing, validate on blur, switch to onChange after first error, focus-first-invalid on submit).

## 5. Anti-patterns

- **Multiple primary CTAs.** Sign-in form with both "Sign in" and "Send magic link" rendered as `intent="primary"` is a hierarchy break. One primary, the rest as `intent="outline"` (provider buttons), `intent="tertiary"` ("Continue without password"), or text links ("Forgot password?"). Operators must instantly know which button is *the* button.
- **Hidden labels (placeholder-only inputs).** Placeholder text disappears on focus, fails screen readers, fails on browser autofill, and leaves no recovery surface when the user returns to verify what they typed. `Field` always renders the visible label. NN/g + WCAG 1.3.1 + WCAG 2.4.6 are unanimous.
- **Auto-submit on OTP completion.** When the user types the 6th digit, don't silently navigate. Show a brief "Verifying…" state (button label swap + spinner), then navigate. The peak-end rule (`micro-interactions.md`) wants the user to feel the moment of success, not blink past it. Auto-submit also fights manual paste/correction.
- **Unmasked password by default with no toggle.** Password should be masked by default; `PasswordInput`'s eye toggles the mask off when the user explicitly chooses (mostly mobile, where typos are common). Defaulting to unmasked exposes the credential to shoulder-surfing in coffee shops, on Zoom screen-shares, and in screenshots.
- **Validating on every keystroke.** Inline error noise during typing is hostile — the user is mid-thought, not done. Validate on blur after the first interaction; once a field has an error, switch to onChange to clear the error as soon as the value is fixed. (The Apple HIG / NN/g / Smashing consensus, per `forms-and-inputs.md` §Validation timing.)
- **Using `Dialog` for sign-in.** Auth is a page, not a modal. Modals trap focus, break browser back/forward, can't be deep-linked, and don't survive page refresh. `Dialog` is for confirmations and focused tasks inside a logged-in surface; sign-in lives at `/login` or `/sign-in`.
- **Information leak on auth error.** Showing "Account does not exist" on an unknown email gives an enumeration attacker a free directory of your users. The right error is generic: "Email or password is incorrect." On password reset, the right success message is also generic: "If an account exists for that email, a reset link is on its way." OWASP A07-2021, NIST SP 800-63B §5.1, every modern security review.
- **No loading state on submit.** A primary CTA that doesn't show a spinner + disable on click invites double-submit. Two account-creation requests, two charged-card requests, two MFA-code requests. Always disable on submit, swap label to gerund ("Signing in…"), show spinner.
- **Provider buttons without a leading icon.** "Continue with Google" without the Google G is harder to scan than the same button with the colored mark. Icons drop into the leading slot at 18×18px; brand colors stay (don't desaturate Google's G to grayscale).
- **Auth that forgets the keyboard user.** Tab order: email → password → submit → forgot link → divider → providers → sign-up link. Enter on the password field submits the form. `<Form>` handles this by default; don't intercept it with custom keydown handlers.
- **Captcha by default.** Captcha is a bot-traffic mitigation, not a UX pattern. Render captcha only after detecting failed-attempt thresholds, not on the first try. Cloudflare Turnstile + invisible-by-default beats reCAPTCHA's "click all the buses" friction.
- **Marketing density inside the AuthCard.** A 96px vertical stack between fields, 56px-tall buttons, 18px Heading — the form starts to feel like a hero block. Cozy inside; marketing outside. The card is the threshold; the canvas is the welcome.

## 6. Working reference

Auth doesn't have a dedicated `audit-dashboard/src/app/auth/` route yet — the closest reference is the Form examples in `audit-dashboard/src/app/foundations/page.tsx` and the `LoginCard` template in `audit-dashboard/src/components/primitives/templates.tsx` (imported in `library/client.tsx` line 75). Both demonstrate the AuthCard shell + `Field` + `PasswordInput` + `Button.primary.lg` recipe.

An `audit-dashboard/src/app/auth/` route is a candidate for a future tab — it would showcase the four canonical states (sign-in, sign-up, password reset request, password reset commit, OTP, SSO landing) end-to-end, and let the Lumen reviewer verify the cozy-in-marketing density rhythm visually. Track in the patterns roadmap.

**Cross-references:**

- [`forms-and-inputs.md`](../00-foundations/forms-and-inputs.md) §Validation timing — the on-blur / on-submit rules.
- [`buttons.md`](../00-foundations/buttons.md) §Intents — `primary`, `outline`, `tertiary` hierarchy.
- [`first-impression.md`](../00-foundations/first-impression.md) — the 50ms halo contract that AuthLayout's marketing canvas exists to satisfy.
- [`micro-interactions.md`](../00-foundations/micro-interactions.md) §Validation, §Success — the peak-end moments inside an auth flow (verify spinner, success toast).
- [`density.md`](../00-foundations/density.md) §6 — the touch-target auto-bump rule for cozy on coarse-pointer devices.
- [ADR 0013](../../_meta/decisions/0013-form-rhf-binding-v07.md) — the RHF binding that powers the Form schema in this pattern.

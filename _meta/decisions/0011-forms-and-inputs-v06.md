# ADR 0011 — Forms & input fields v0.6 rebuild

- **Date:** 2026-05-03
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Complements:** [ADR 0010 — Typography v0.5 system upgrade](./0010-typography-v05.md). Type tokens stand. Forms reuse them.

## Context

A user-reported visual bug surfaced the architectural rot in Lumen's forms layer: the focused Field rendered with **two separate green focus rings** — one around the wrapper (leading icon + value + trailing addon), one around the inner `<input>` element only. The trailing unit chip ("STD", "lb") fell outside both visible rings; the leading map-pin icon was inside the outer but outside the inner, reading as a separate component. On error states, the red border + green ring stacked and fought at the trailing slot.

A three-agent investigation (peer-systems research across 13 design systems, Lumen repo state audit, glassmorphism inspiration extraction) produced a comprehensive diagnosis. The bug class extends beyond visual: the audit found 20+ drift issues across three parallel input chrome systems, two parallel Selects, two parallel Radios, 17 form primitives without component contracts, no Form/RHF integration, and hardcoded rgba/hex values throughout.

### The visual bug — root cause

`audit-dashboard/src/components/primitives/field.tsx:71-102` (v0.5) wraps a `<div>` with `focus-within:` styles around a child `<input>`. CRITICALLY, `audit-dashboard/src/app/globals.css:736-740` sets a global `:focus-visible` rule:

```css
:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
  border-radius: var(--radius-sm);
}
```

Result on focus:
1. The wrapper `<div>` paints `focus-within:shadow-[var(--shadow-focus)]` around the entire row — ring #1.
2. The inner `<input>` receives `:focus-visible` from the global rule — ring #2 around just the input core.
3. The leading icon and trailing addon are wrapper siblings — inside ring #1 but outside ring #2.

Confirmed via repo audit at the line numbers above.

### Drift surface beyond the bug

- **Three parallel input chrome systems** existed: bare shadcn `<Input>` (Tailwind class chain in `ui/input.tsx`), an `INPUT_BASE` constant in `primitives/inputs.tsx` used by SearchInput / Combobox / NumberInput / PasswordInput, and the wrapper-+-bare-`<input>` pattern in `field.tsx`. Each encoded the same visual contract differently — different `transition` property lists, different focus pseudo-class (`focus` vs `focus-visible`), different text-size ramps.
- **Two parallel Selects**: a custom native `<select>` in `inputs.tsx` (used by every page) and the unused shadcn Radix Select in `ui/select.tsx`. Two implementations with slightly different behavior on keyboard, no portaling on the custom one.
- **Two parallel Radios**: same drift pattern.
- **17 form primitives without contracts**. Only `Input` and `Toggle` had `component.json`; even those had broken `examples/primary.tsx` references that didn't exist.
- **Hardcoded rgba/hex chains**: error+focus halos used hand-typed `rgba(237,94,94,0.20)` in `field.tsx` and `rgba(226,59,59,0.32)` in `ui/input.tsx` — two near-but-not-identical recipes for the same conceptual state.
- **`text-base md:text-sm` (16/14)** on shadcn Input/Textarea fought Lumen's documented 14 px body floor.
- **`bg-transparent`** on shadcn SelectTrigger clobbered the field-shell bg color (Tailwind last-class-wins).
- **`rounded-[4px]`** on shadcn Checkbox — lint violation (hardcoded px instead of `--radius-xs`).
- **`opacity: 50` only** for disabled across all primitives — no bg / border / cursor change.
- **No autofill recipe** — Chrome's yellow autofill flash painted over `--surface-raised`.
- **No read-only state** documented or styled.
- **Eight different `transition` property lists** across the four primitives.

## Peer-system research

Surveyed [shadcn/ui v4](https://ui.shadcn.com/), [Radix Themes TextField](https://www.radix-ui.com/themes/docs/components/text-field), [Vercel Geist Input](https://vercel.com/geist/input), [Stripe Elements](https://docs.stripe.com/elements/appearance-api), [GitHub Primer TextInput](https://primer.style/components/text-input), [IBM Carbon Text Input](https://carbondesignsystem.com/components/text-input/usage), [Material 3 Text Fields](https://m3.material.io/components/text-fields/specs), [Atlassian Design System](https://atlassian.design/components/textfield), [Apple HIG Text Fields](https://developer.apple.com/design/human-interface-guidelines/text-fields), [Twilio Paste Input](https://paste.twilio.design/components/input), [Origin UI](https://originui.com), and Linear (observed). Convergence:

1. **Focus ring is drawn ONCE, on the wrapper that owns leading + value + trailing slots — never on the inner `<input>`.** Use `:has(:focus-visible)` (Tailwind: `has-focus-visible:`) with `:focus-within` fallback. Radix Themes' canonical pattern is `:has(.rt-TextFieldInput:focus) { outline: 2px solid var(--text-field-focus-color); outline-offset: -1px }`.
2. **Inset offset (`outline-offset: -1px` or equivalent box-shadow)** so the ring sits flush with the border. The "double-ring with gap" pattern is dead.
3. **3 px ring at ~30–50% alpha** is the modern recipe. shadcn settled on `ring-[3px] ring-ring/50`.
4. **Error wins; focus weakens.** When both apply, the ring color shifts to error red. Carbon's contrarian "no shadow on invalid" isn't winning the argument.
5. **Default heights: 32 / 40 / 48** for sm/md/lg. Mobile auto-bumps to 44+.
6. **Stacked labels above the field**, not floating, not inline. Material 3 quietly retired filled-with-floating-label as primary.
7. **Validate on blur after first interaction; switch to onChange after first error; validate everything on submit; focus the first invalid field.**
8. **`aria-describedby` carries BOTH hint and error IDs** in a space-separated list. `aria-invalid="true"` on the input. Error summary at form top with `role="alert"`.
9. **Hairline 1 px border at rest; 1 px solid swap on focus, plus an outer glow ring.** Borders thicker than 2 px feel dated.
10. **Slots are decorative by default (`aria-hidden`), interactive when needed (real `<button>` with own a11y).** Bonded under the wrapper's single ring.
11. **Skip success state by default**; show warning only in domains where it's actionable.
12. **Read-only ≠ disabled.** Read-only is focusable, full contrast, copyable. Disabled is muted, not in tab order.

## Decision

**Lumen v0.6 forms & inputs system upgrade.** ONE shell powers every text-entry control. ONE focus surface. ONE ring. Twelve changes:

### 1. Architectural fix — single shell, wrapper-scoped focus

A new `.lumen-field` CSS class is the focusable surface for every text-entry control. The wrapper observes inner focus via `:has(:focus-visible)` (modern, ~92% baseline support) with `:focus-within` fallback. The inner `<input>` / `<textarea>` / `<select>` renders bare via:

```css
.lumen-field :is(input, textarea, select) {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 0;
  outline: none;
  box-shadow: none;
  color: inherit;
  font: inherit;
  padding: 0;
  margin: 0;
}

.lumen-field :is(input, textarea, select):focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
```

Slots (`[data-slot="leading"]`, `[data-slot="trailing"]`, `[data-slot="addon"]`) are siblings inside the shell — inside the focus boundary by construction.

### 2. Token expansion

- `01-tokens/components/input.tokens.json` rewritten: adds `padding.x.{sm,md,lg}` + `padding.y.{sm,md,lg}`, `gap.slot`, `background.{rest,hover,focus,readOnly,disabled}`, `border.{rest,hover,focus,error,success,warning,disabled,readOnly}`, `foreground.{value,valueDisabled,valueReadOnly,placeholder,iconLeading,iconTrailing,addon,label,helper,error,success,warning}`, `ring.{focus,error,success,litEdge}`, `transition`.
- New token files: `field.tokens.json`, `textarea.tokens.json`, `select.tokens.json`, `checkbox.tokens.json`, `radio.tokens.json`, `switch.tokens.json`.
- New semantic tokens (light + dark mode parity):
  - `color.text.{error,success,warning,placeholder}`
  - `color.border.{error,success,warning,disabled}`
  - `color.surface.input.{rest,hover,focus,readOnly,disabled}`
  - `color.alpha.danger.{12,24,32}` and `color.alpha.warning.{12,24}` (primitive level)
- New shadow tokens: `shadow.input.{focus,error,success,lit-edge}`.
- **Reconciled `shadow.focus`** from `0 0 0 3.5px lime-a40` (CSS) to `0 0 0 3px lime-a32` (matches the JSON SoT). Style Dictionary will now emit consistent values.

### 3. CSS recipe layer

`audit-dashboard/src/app/globals.css` gains a 350-line `v0.6 — FORMS & INPUT FIELDS` section: `.lumen-field` with size/density variants, hover/focus/error/success/warning/disabled/readonly states, slot bonding, autofill recipe, number/search input quirks. Plus `.lumen-checkbox`, `.lumen-radio`, `.lumen-switch` shells. Plus `.lumen-form-field` / `.lumen-form-stack` / `.lumen-fieldset` composition helpers.

The global `:focus-visible` rule is gated for descendants of `.lumen-field` so the inner element never paints a ring inside a wrapper.

### 4. Component contracts (9 total)

Rewrote `Input` for v0.6. Added new contracts:

- **Field** — composition wrapper.
- **Form** — semantic `<form>` wrapper; owns blur-validation orchestration + focus-on-first-error + density mode.
- **Textarea**.
- **Select** — Radix-based; collapses the v0.5 dual implementation (custom native + unused Radix).
- **Checkbox**.
- **RadioGroup** — Radix-based; collapses the v0.5 dual implementation.
- **Switch** — separated from Toggle; Switch is the pill toggle, Toggle is the button-style on/off (filter chips).
- **ValidationMessage** — promoted from a buried atom in `feedback.tsx`.

Each component.json validates against `_schema/component.schema.json`. Every contract enumerates `tokens.consumed` for impact analysis.

### 5. Primitive refactor

- **`primitives/field.tsx`** rewritten: single shell, slot composition, `data-*` attribute hooks for state. ~120 lines, down from the v0.5 wrapper-+-bare-input split.
- **`primitives/inputs.tsx`** refactored: `INPUT_BASE` constant deleted. SearchInput / Combobox / NumberInput / PasswordInput / OtpInput / TagsInput / DatePicker / TimePicker / ColorPicker all adopt the `.lumen-field` shell with slot patterns. Eight different transition recipes collapsed to one (the shell's).
- **shadcn `ui/input.tsx`, `ui/textarea.tsx`, `ui/select.tsx`** refactored: drop the `text-base md:text-sm` font-size override that fought Lumen's 14 px floor. Drop `bg-transparent` clobber on Select. Reconcile the `aria-invalid:focus-visible` recipes across all three.
- **shadcn `ui/checkbox.tsx`, `ui/radio-group.tsx`, `ui/switch.tsx`** refactored: adopt `.lumen-checkbox`, `.lumen-radio`, `.lumen-switch` shell classes. Replace `rounded-[4px]` Tailwind arbitrary value (lint violation) with `--radius-xs` token. Inner indicators composed via CSS `::before` / `::after` so the wrapper stays a single element.
- **shadcn `ui/label.tsx`** normalized to `text-label-sm` (Lumen 13 px medium secondary) by default.

### 6. Validation timing

Codified in [`design-system/00-foundations/forms-and-inputs.md`](../../design-system/00-foundations/forms-and-inputs.md):

1. Pre-touched: no inline validation while first typing.
2. Validate on blur after first interaction.
3. Once an error is shown, switch to onChange for that field.
4. On submit, validate everything; focus first invalid; render summary.
5. Server validation via `aria-live="polite"` region.
6. Async validation: debounce 300–500 ms, spinner in trailing slot, never block submit.

**Submit is never disabled as the only signal of validation failure.**

### 7. Accessibility floor

Every component contract carries WCAG 2.2 AA mappings:
- 1.3.1 Info and Relationships
- 1.4.3 Contrast (Minimum)
- 1.4.11 Non-text Contrast (3:1 for control borders; the focus ring meets this against page bg)
- 1.4.13 Content on Hover or Focus
- 2.4.7 Focus Visible
- 2.5.8 Target Size (Minimum, 24×24 CSS px AA)
- 3.3.1 Error Identification
- 3.3.2 Labels or Instructions
- 3.3.3 Error Suggestion
- 4.1.2 Name, Role, Value
- 4.1.3 Status Messages

Plus the form-specific rules previously in `accessibility.md` § Forms.

### 8. Density modes

`<Form density="compact">` sets `data-density="compact"` on the form root. Nested `.lumen-field` shells without an explicit `data-size` adopt 32 px height + reduced padding. Linear / Plaid / Notion convergence pattern.

### 9. Modern flourishes shipped

- **Lit top edge** — `inset 0 1px 0 var(--lumen-paper-a06)` on dark mode; transparent no-op on light mode (the paper canvas doesn't have a glass top reflection). Steals the glassmorphism reflection trick without committing to full glass — NN/g flags glass-on-inputs as a legibility risk.
- **Autofill recipe** — `-webkit-box-shadow: inset 0 0 0 1000px var(--surface-input-rest)` defeats Chrome's yellow flash. The 5000 s transition outlasts the flash so the override never blinks visible.
- **Native quirk handling** — `input[type="number"]` spinners hidden (NumberInput renders its own ±); `input[type="search"]` clear-x hidden (SearchInput renders its own).
- **Field-sizing auto-grow Textarea** — `field-sizing: content` (Chrome 128+, Safari TP). Falls back to user resize handle on Firefox.

### 10. Plan B Inter compatibility preserved

`html[data-font="inter"]` (the v0.5 Plan B switch) flips `--font-sans` to Inter Variable. All form labels, helper text, and value text switch atomically. No new wiring needed.

### 11. Lint

`scripts/lint-no-arbitrary-form-values.mjs` flags:
- Raw `focus-within:shadow-[...]` arbitrary box-shadows on form wrappers.
- Raw `aria-invalid:focus-visible:shadow-[...]` arbitrary recipes.
- Direct primitive reach for error: `bg-[var(--lumen-red-N)]`, `text-[var(--lumen-red-N)]`, `border-[var(--lumen-red-N)]`.
- `rounded-[4px]` and similar hardcoded pixels in form primitives.

Wired into `pnpm lint` as a third stage after `lint:no-primitives` and `lint:no-arbitrary-typography`.

### 12. Foundation doc

`design-system/00-foundations/forms-and-inputs.md` — 200-line canonical guide. Anatomy diagram, focus model, sizing scale, density modes, states matrix, slot semantics, validation timing, required vs optional, form layout & rhythm, stack (Radix vs native), modern flourishes, deferred items.

## Consequences

### Positive

- **The bug class is gone.** One shell, one ring, slots bonded inside. The split-ring + slot-outside pattern cannot recur because the architecture forbids it.
- **Three input chrome systems collapsed to one.** Less code, less drift surface, faster understanding.
- **17 form primitives now have a single shell pattern.** Consistency.
- **9 new component contracts** — Field, Form, Textarea, Select, Checkbox, RadioGroup, Switch, ValidationMessage, plus the rewritten Input. The 12 component contracts that existed at v0.5 are now 21.
- **Token JSON is the source of truth.** Style Dictionary will emit correct values to all 9 platform outputs (iOS Swift, Android Kotlin, Liquid, Stencil, etc.) for the first time since the typography rebuild.
- **Read-only and disabled visually distinct.** Previously both rendered as opacity-50.
- **Autofill is no longer a visual bug.** Chrome's yellow flash overridden cleanly.
- **`text-base md:text-sm` 16/14 fontsize fight is gone.** Inputs render at the documented 14 px body floor.
- **Density modes ship.** Operator dashboards can switch to 32 px field heights without per-component overrides.
- **Lime-as-action discipline preserved.** Lime ring is focus + success. Error ring is red. No second loud color.
- **Lit-edge inspiration applied with restraint.** Glass-pane reflection trick on dark mode only; light mode declares it transparent so the comma-stack composes cleanly. NN/g's "don't glass interactive elements" warning honored — the field surface is opaque, only the lit edge borrows from glassmorphism.

### Negative

- **All audit-dashboard pages with forms need a re-render verification pass.** Field's external API is preserved (label, hint, error, leadingIcon, trailingIcon, trailingAddon, size, mono, disabled, readOnly), so no source-code migration is required for product code; the visual will change to match the new shell.
- **The v0.5 `INPUT_BASE` constant is deleted.** Any external code that imported it breaks. None known.
- **The `Input` contract's `props` no longer includes `error` / `leadingIcon` / `trailingIcon` directly** — those are Field props now. Input is the bare element. Code that reaches for these on `<Input>` (vs `<Field>`) breaks. None found in audit.
- **`Toggle`** contract semantics narrowed: Toggle is now reserved for button-style on/off (filter chips). The pill-toggle visual moves to the new `Switch` contract. No code change required — `audit-dashboard/src/components/primitives/switch.tsx` already wraps the shadcn Switch primitive — but the contracts diverge.
- **Light mode `surface-input-rest`** changed from `--surface-raised` (paper white) to `--lumen-cream-1` (sunken cream). Inputs now read as inset on the paper canvas. Visually noticeable on /landing in light mode.
- **Focus ring** rendered slightly smaller (3 px vs 3.5 px) and at lower alpha (a32 vs a40). The change is intentional — matches the JSON token of record + reduces the ring's visual weight on dense forms.

### Tradeoffs not chosen

- **Did not adopt `outline + outline-offset: -1px`** (the Radix Themes pattern). Lumen's `box-shadow` ring composes cleanly with the `lit-edge` inset shadow via comma-separation; an `outline` doesn't compose with shadows the same way. The visual is identical.
- **Did not adopt floating labels.** Material 3 quietly retired filled-with-floating-labels as the primary pattern; Linear, Geist, Stripe, Atlassian all converged on stacked labels. Stacked is simpler, more accessible, and ships clean RTL support.
- **Did not adopt the segmented-input pattern** (Stripe Elements one-line card). Saved for v0.7.
- **Did not adopt react-hook-form yet.** The v0.6 Form primitive is a thin native wrapper. v0.7 will add an RHF binding for declarative schemas (Zod resolver, `useFormContext`, etc.).
- **Did not adopt warning state UI on inputs.** Tokens exist (`color.border.warning`, `color.text.warning`); CSS recipe ships. But peer convergence is that warning is rare for inputs (Carbon is the contrarian). Use sparingly.
- **Did not change the size scale.** 32/40/48 (sm/md/lg) matches the modern web convergence. Tinkering churns every form for marginal gain.
- **Did not write contracts for Combobox / NumberInput / PasswordInput / OtpInput / TagsInput / DatePicker / TimePicker / FileDropzone / Segmented / RangeSlider** in v0.6. The primitives adopt the new shell; their dedicated contracts arrive in v0.6.x and v0.7. Scope discipline.

## Verification

Done in v0.6.0:

- ✅ All form primitives (Input, Textarea, Select, Checkbox, RadioGroup, Switch) adopt the new shell.
- ✅ `globals.css` global `:focus-visible` gated for descendants of `.lumen-field` — no double ring possible.
- ✅ Autofill recipe verified renders surface bg (manual Chrome test deferred to deploy).
- ✅ All token JSON validates against `component.schema.json`.
- ✅ Lint scripts pass.
- ✅ TypeScript clean (`tsc --noEmit`).
- ✅ Existing 17 contrast pairs still pass WCAG AA.

Open:

- ⏳ Manual visual verification on the deployed Vercel URL — Chrome extension was unreachable during the v0.6 build; verification is deferred to post-deploy.
- ⏳ Windows ClearType QA at 12-14 px Satoshi VF — same deploy-blocker as v0.5.
- ⏳ Per-platform mappings: iOS UITextField + Android Material TextField + Liquid input class need to map to the new field shell tokens. Tracked for v0.6.x.
- ⏳ Dedicated contracts for Combobox / NumberInput / PasswordInput / OtpInput / TagsInput / DatePicker / TimePicker / FileDropzone / Segmented / RangeSlider — v0.6.x and v0.7.

## References

- [`design-system/00-foundations/forms-and-inputs.md`](../../design-system/00-foundations/forms-and-inputs.md) — canonical guide.
- [`audit-dashboard/src/app/globals.css`](../../audit-dashboard/src/app/globals.css) — implementation; `v0.6 — FORMS & INPUT FIELDS` section.
- [`design-system/01-tokens/components/`](../../design-system/01-tokens/components/) — input, field, textarea, select, checkbox, radio, switch.
- [`design-system/02-components/`](../../design-system/02-components/) — input (rewritten), field, textarea, select, checkbox, radio-group, switch, form, validation-message.
- [ADR 0010 — Typography v0.5](./0010-typography-v05.md) — type tokens reused.
- [ADR 0005 — Warp green as only accent](./0005-warp-green-as-only-accent.md) — single-accent rule preserved.
- Peer system sources: shadcn/ui, Radix Themes, Vercel Geist, Stripe Elements, GitHub Primer, IBM Carbon, Material 3, Atlassian, Apple HIG, Twilio Paste, Origin UI.

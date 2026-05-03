---
name: Forms and inputs
type: foundation
version: 1.0.0
last_updated: 2026-05-03
audience: [designer, engineer, llm-agent]
related: [./principles.md, ./voice-and-tone.md, ./accessibility.md, ./typography.md, ./motion-language.md]
---

# Forms and inputs

> How Lumen handles text-entry, choice, and toggle controls. The architectural rule: **one shell, one focus surface.** Every text-entry control wraps in `.lumen-field` (or its dedicated equivalent for Checkbox / Radio / Switch). The shell owns the border, the background, the lit edge, and — critically — the focus halo. The inner element renders bare. Slots bond inside the shell so the focus boundary covers leading icon, value, trailing icon, and trailing addon by construction.

## Principles applied

| Principle | How it shows up |
|---|---|
| **Less, but better** | One shell powers Input, Textarea, Select, Combobox, NumberInput, PasswordInput. Three v0.5 parallel chrome systems collapsed to one. |
| **Care is total or it is performance** | Rest, hover, focus-visible, filled, error, success, disabled, read-only, autofill — every state is named, tokenized, and CSS-recipe'd. |
| **Color is supplement, not signal** | Error pairs red border + red halo + red text + alert icon. Disabled muted bg + cursor change. Lime ring is action/live/success only. |
| **Decelerate, don't bounce** | All transitions ≤ 180 ms (`--motion-fast`) with `cubic-bezier(0.2, 0, 0, 1)`. `prefers-reduced-motion` kills field transitions entirely. |
| **Density is dense, not airy** | Density modes (`comfortable` / `compact`) ship out of the box. Operator dashboards default `compact`. Marketing forms stay `comfortable`. |

## Field shell anatomy

```
┌─ lumen-form-field ──────────────────────────────────────┐
│                                                          │
│  Pickup ZIP  [optional]                                  │  ← lumen-form-field__label
│  Description text below the label                        │  ← lumen-form-field__description
│                                                          │
│  ┌─ lumen-field ────────────────────────────────────┐   │  ← THE SHELL — single focus surface
│  │                                                   │   │
│  │  ⓘ          90045                       [STD]    │   │
│  │ leading      value (bare <input>)        addon    │   │
│  │  slot         flex: 1                    slot     │   │
│  │                                                   │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
│  Hint or error message (mutually exclusive)              │  ← lumen-form-field__hint / __error
│                                                          │
└──────────────────────────────────────────────────────────┘
```

The shell is the `.lumen-field` div. The inner `<input>`, `<textarea>`, or `<select>` is bare — no border, no ring, no fill — inheriting from the wrapper.

## Focus model — the architectural rule

Lumen v0.5 had a **bug**: the wrapper painted a focus halo via `:focus-within`, AND the inner `<input>` painted another halo via the global `:focus-visible` rule. Two rings appeared on the same field, with the leading icon between them. Slots fell outside the inner ring and looked broken.

**v0.6 fix.** Wrapper-scoped focus, single ring:

```css
@supports selector(:has(:focus-visible)) {
  .lumen-field:has(:is(input, textarea, select):focus-visible) {
    border-color: var(--border-focus);
    box-shadow: var(--shadow-input-lit-edge), var(--shadow-input-focus);
  }
}
@supports not selector(:has(:focus-visible)) {
  .lumen-field:focus-within {
    border-color: var(--border-focus);
    box-shadow: var(--shadow-input-lit-edge), var(--shadow-input-focus);
  }
}

/* Suppress the global :focus-visible ring inside the wrapper. */
.lumen-field :is(input, textarea, select):focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
```

The wrapper observes the inner element's focus via `:has(:focus-visible)` (modern, ~92% baseline support) with a `:focus-within` fallback for older browsers. Tailwind v4 ships `has-focus-visible:` as a first-class variant.

This is the **single source of truth principle** applied to CSS state: only the outermost component that visually defines the bounding box may paint focus. The focus event source (the inner element) and the focus visualization (the wrapper) are separate DOM nodes. They're allowed to be different. In fact, they should be.

## Sizing scale

| Variant | Height | Padding-x | Body type | Touch | Use |
|---|---|---|---|---|---|
| `sm` | 32 px | `space.2` (8) | `body.sm` (13) | desktop only | Compact dashboards, dense tables |
| `md` (default) | 40 px | `space.3` (12) | `body.md` (14) | desktop default | Most product forms |
| `lg` | 48 px | `space.4` (16) | `body.lg` (15) | mobile / marketing | Touch surfaces, marketing forms |

Mobile clients should auto-bump `md` → `lg` to satisfy WCAG 2.2 SC 2.5.8 (24×24 px AA) and Apple HIG (44 pt). Lumen's `lg` (48 px) covers both.

## Density modes

`Form` accepts `density="compact" | "comfortable"`. The mode is set as `data-density="compact"` on the form root; nested `.lumen-field` shells without an explicit `data-size` adopt 32 px height + reduced padding.

This is what Linear, Plaid Dashboard, Notion, Airtable, and Asana ship. Operator dashboards default `compact`; marketing pages stay `comfortable`.

## States

| State | Visual | Hook |
|---|---|---|
| **Rest** | hairline border, lit-edge inset | — |
| **Hover** | border swaps to `--border-strong` | `:hover` (only when interactive) |
| **Focus-visible** | border `--border-focus`, lime halo | `:has(:focus-visible)` on shell |
| **Filled** | (visual identical to rest) | `:not(:placeholder-shown)` if needed |
| **Error** | border `--border-error`, halo flips to red on focus | `data-invalid="true"` |
| **Success** | border `--border-success` | `data-valid="true"` |
| **Warning** | border `--border-warning` | `data-warning="true"` |
| **Disabled** | muted bg, dim border, dim text, cursor not-allowed | `data-disabled="true"` |
| **Read-only** | rest bg, no caret, copyable, in tab order | `aria-readonly="true"` |
| **Autofill** | bg pinned to `--surface-input-rest` via inset shadow trick | `:-webkit-autofill` |

Error vs focus interaction: **error wins, focus weakens.** When both apply, the border stays error red and the halo flips to red. The wrapper paints both — never the inner element.

Disabled vs read-only: distinct semantics. Disabled is muted, not in tab order, not interactive. Read-only is full contrast, in tab order, focusable, copyable, just non-editable. Both have visual treatments; they should not look the same.

## Slot semantics

| Slot | Use | Click |
|---|---|---|
| `[data-slot="leading"]` | icon, currency, country code, search glyph | decorative by default (`pointer-events: none`); falls through to the input |
| `[data-slot="trailing"]` | clear button, password reveal, validation icon, dropdown caret | decorative by default; interactive children opt in via `data-interactive` |
| `[data-slot="addon"]` | unit chip (lb / kg / STD / %) | decorative; mono uppercase tracked |

Interactive slot children (e.g., a clear button or password-reveal toggle) render as real `<button>` elements, set `data-interactive`, and have their own contained focus indicator inside the wrapper. The wrapper still paints its outer ring; the slot button shows a small inner ring scoped to itself via `.lumen-field [data-slot="*"] [data-interactive]:focus-visible`.

## Validation timing

The Apple HIG / NN/g / Smashing consensus:

1. **Don't validate during first typing.** Pre-touched state has no inline validation.
2. **Validate on blur** after first interaction.
3. Once an error is shown, **switch to onChange** for that field — clear the error as soon as the value is fixed.
4. **On submit**, validate everything. Focus the first invalid field via `field.focus({ preventScroll: false })`. Render a `ValidationMessage` summary at the top with anchor links to each invalid field.
5. **Server validation** surfaces via `aria-live="polite"` region; map 4xx error codes to specific field errors via a shared schema.
6. **Async validation** (username availability, address verification): debounce 300–500 ms, show a loading spinner in the trailing slot, never block submit. Show success ✓ on resolve.

**Submit is never disabled as the only signal of validation failure.** Users must always be able to attempt submit and see what's wrong.

## Required vs optional

NN/g recommends marking *the rare one* — if 80%+ of fields are required, mark optional ones with `(optional)`. If most are optional, mark required ones with an asterisk + `aria-required="true"`. Asterisks alone fail color-blind users in some renderings.

Lumen ships both:
- `<Field optional>` → renders `(optional)` next to the label.
- `<Field required>` → renders `*` + sets `aria-required` + `required` on the input.

## Form layout & rhythm

| Gap | Default | Token |
|---|---|---|
| Label → control | 4 px | `field.gap.labelToControl` |
| Control → hint/error | 4 px | `field.gap.controlToHelp` |
| Field → field | 20 px | `field.gap.groupToGroup` |
| Fieldset → fieldset | 32 px | `field.gap.fieldsetToFieldset` |

Two-column layouts: only when the fields are conceptually related (city + state + ZIP triplet). Don't two-column unrelated fields — eye-tracking shows F-pattern fails on multi-column forms (Baymard).

Field width: full-bleed by default; constrain for known formats. ZIP US = 6ch + slack; state abbr = 4em; expiry = 6em; CVV = 4em.

## Stack: Radix + bare elements

Lumen builds on top of Radix primitives where they pull weight:
- **Select** → Radix Select (portal, keyboard nav, type-ahead, aria-activedescendant).
- **Checkbox** → Radix Checkbox (data-state, indeterminate).
- **RadioGroup** → Radix RadioGroup (roving tabindex, arrow keys).
- **Switch** → Radix Switch (data-state, native form sub).

Radix wraps the native primitive, exposes `data-state` hooks, handles keyboard semantics, and ports to mobile cleanly.

Inputs / Textarea / Combobox / NumberInput / PasswordInput / OtpInput / TagsInput / DatePicker / TimePicker stay native (no Radix dependency) — they're simpler and the shell pattern handles them uniformly.

## Modern flourishes (2026)

| Feature | Status | Notes |
|---|---|---|
| Lit top edge | ✅ shipped | `inset 0 1px 0 var(--lumen-paper-a06)` on dark mode field shell. Steals the glass-pane reflection trick. |
| Field-sizing auto-grow Textarea | ✅ shipped | `field-sizing: content` (Chrome 128+, Safari TP). Falls back to `min-h` + user resize handle. |
| Autofill bg override | ✅ shipped | `-webkit-box-shadow: inset 0 0 0 1000px var(--surface-input-rest)` — the only way to defeat Chrome's yellow flash. |
| Inline format hint | 🔜 v0.6.x | Below-field hint that updates as the user types (ZIPs, phone, SSN). |
| Unit toggle in trailing slot | 🔜 v0.6.x | Two-state pill (lb ⇄ kg, STD ⇄ EXP) inside the trailing slot. **High-value Warp-specific pattern.** |
| Animated digit roll | 🔜 v0.7 | NumberFlow-style per-digit slide on programmatic value change. Honor `prefers-reduced-motion`. |
| Smart locale defaults | 🔜 v0.7 | Currency from `navigator.language`, country from IP. |
| Auto-format on type | 🔜 v0.7 | Display formatted, submit raw (phone, card, IBAN). |
| Paste-handling | 🔜 v0.7 | Sniff for tab/comma-separated content; split across fields. |

## react-hook-form binding (v0.7)

For non-trivial forms, Lumen ships a react-hook-form binding via the `Form` primitive. Pass a Zod `schema` and `defaultValues`; field-level errors surface automatically through `<Field name="…">`. The v0.6 native-mode path remains the default for simple forms (<3 fields).

```tsx
import { Form, Field } from "@/components/primitives/form-rhf";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  age: z.coerce.number().min(18),
});

<Form schema={schema} defaultValues={{ email: "", name: "" }} onSubmit={(data) => …}>
  <Field name="email" label="Email" type="email" />
  <Field name="name"  label="Full name" />
  <Field name="age"   label="Age" type="number" />
  <Button type="submit">Create account</Button>
</Form>
```

The `schema` prop activates RHF mode. Internally, `Form` calls `useForm({ resolver: zodResolver(schema), defaultValues, mode })` and wraps children in a `FormProvider`. Each `<Field name="…">` is bridged to RHF via `useFormContext()` — `formState.errors[name]` flows into the Field's `error` prop automatically. The validation timing rules above (blur after first interaction, switch to onChange after first error, focus-on-first-invalid on submit) are the defaults.

See [ADR 0013](../../_meta/decisions/0013-form-rhf-binding-v07.md) for the decision rationale, deps (`react-hook-form`, `@hookform/resolvers`, `zod`), and tradeoffs.

## Plan B: Inter

Per [foundations/typography.md](./typography.md) §1 Plan B — `html[data-font="inter"]` flips `--font-sans` to Inter Variable. Form labels, helper text, and value text all switch atomically. Use if Cyrillic/Greek expansion needed or Windows ClearType QA fails.

## What we deferred

These ship as their own contracts in v0.6.x or v0.7:

- **Combobox** — Radix-based searchable list with portaled popover.
- **NumberInput** — stepper with animated digit roll.
- **PasswordInput** + **PasswordStrength** — reveal toggle, strength meter.
- **OtpInput** — cell-row pattern with auto-focus.
- **TagsInput** — wrapping chip row.
- **DatePicker / TimePicker** — real calendar/time-picker logic.
- **FileDropzone** — drag-drop file input.
- **Segmented** — 2–4 mutually exclusive options on one row.
- **RangeSlider** — single + dual-handle.

The current v0.5 implementations live in [`audit-dashboard/src/components/primitives/inputs.tsx`](../../audit-dashboard/src/components/primitives/inputs.tsx) and adopt the new `.lumen-field` shell, but their dedicated `component.json` contracts arrive in subsequent releases.

## References

- [`_meta/decisions/0011-forms-and-inputs-v06.md`](../../_meta/decisions/0011-forms-and-inputs-v06.md) — durable record of v0.6 audit + decisions.
- [`audit-dashboard/src/app/globals.css`](../../audit-dashboard/src/app/globals.css) — implementation; the `v0.6 — FORMS & INPUT FIELDS` section.
- [`design-system/01-tokens/components/input.tokens.json`](../01-tokens/components/input.tokens.json) — canonical field-shell tokens.
- Peer system sources: [shadcn/ui](https://ui.shadcn.com), [Radix Themes Text Field](https://www.radix-ui.com/themes/docs/components/text-field), [Vercel Geist Input](https://vercel.com/geist/input), [Stripe Elements Appearance API](https://docs.stripe.com/elements/appearance-api), [GitHub Primer TextInput](https://primer.style/components/text-input), [IBM Carbon TextInput](https://carbondesignsystem.com/components/text-input/usage), [Material 3 Text Fields](https://m3.material.io/components/text-fields/specs), [Atlassian DS](https://atlassian.design/components/textfield), [Apple HIG Text Fields](https://developer.apple.com/design/human-interface-guidelines/text-fields), [Origin UI](https://originui.com), [WCAG 2.2 SC 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html), [NN/g — Required Field Marking](https://www.nngroup.com/articles/required-fields/), [Smashing — Inline form validation](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/).

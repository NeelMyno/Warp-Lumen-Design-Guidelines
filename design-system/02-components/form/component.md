---
name: Form
type: component
status: stable
version: 0.7.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Field, Input, Textarea, Select, Checkbox, RadioGroup, Switch, ValidationMessage, Button]
spec: ./component.json
last_updated: 2026-05-03
---

# Form

> Semantic wrapper for a group of Fields. Owns submission, validation orchestration, focus-on-first-error, and the optional `data-density` mode hook for compact dashboards. Two modes: **native** (v0.6, the default — manual `validate` callback) and **RHF** (v0.7, activated by passing a Zod `schema`).

## When to use
- Any group of 2+ Fields that submit together.
- A single Field that needs validation orchestration.

## Two modes

The Form primitive picks its mode at runtime based on the `schema` prop.

| Mode | Trigger | Best for | Deps |
|---|---|---|---|
| **Native** | `schema` is undefined | Simple forms (<3 fields), bare HTML form semantics, server-rendered forms | None — bare React |
| **RHF** | `schema` is a Zod schema | Non-trivial forms (>3 fields), nested objects, async validation, typed payloads | `react-hook-form`, `@hookform/resolvers`, `zod` |

Pick one. Don't mix the manual `validate` callback with `schema` — `schema` wins and `validate` is ignored.

## Anatomy — RHF mode (v0.7, recommended for non-trivial forms)

```tsx
import { Form, Field } from "@/components/primitives/form-rhf";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

<Form
  schema={schema}
  defaultValues={{ email: "", name: "" }}
  onSubmit={(data) => console.log(data)}
>
  <Field name="email" label="Email" type="email" />
  <Field name="name" label="Name" />
  <Button type="submit">Save</Button>
</Form>
```

The `schema` prop activates RHF mode. Internally, Form calls `useForm({ resolver: zodResolver(schema), defaultValues, mode })` and wraps children in a `FormProvider`. Each `<Field name="…">` is bridged to RHF's `register(name)` via `useFormContext()`, and `formState.errors[name]` flows into the Field's `error` prop automatically. The native HTML form semantics (Enter-to-submit, browser autofill, password-manager) are preserved.

## Anatomy — native mode (v0.6, kept for simple forms)

```tsx
import { Form, Field } from "@/components/primitives/form";

<Form
  onSubmit={(formData) => …}
  validate={(formData) => {
    const errors: Record<string, string> = {};
    if (!formData.get("email")) errors.email = "Required";
    return errors;
  }}
>
  <Fieldset legend="Lane">
    <Field name="origin" label="Origin ZIP" />
    <Field name="dest" label="Destination ZIP" />
  </Fieldset>
  <ValidationMessage … />   {/* summary, only on submit-with-errors */}
  <Button type="submit">Save</Button>
</Form>
```

Native mode is a thin `<form>` wrapper: `onSubmit` receives the raw `FormData`; `validate` returns a `{ field: error }` map.

## Validation orchestration

Both modes follow the same Lumen timing rules ([forms-and-inputs.md § Validation timing](../../00-foundations/forms-and-inputs.md#validation-timing)):

1. **Pre-touched** state: no inline validation while typing for the first time.
2. **Blur after first interaction**: validate the field; show error if invalid.
3. **OnChange after first error**: clear the error as soon as the value is fixed.
4. **Submit**: validate everything; if any field fails:
   - Focus the first invalid field via `field.focus({ preventScroll: false })` (RHF: `shouldFocusError: true`, the default).
   - Render `<ValidationMessage variant="summary">` at the top with anchor links.
   - `aria-live="polite"` announces the error count.
5. **Server validation**: surface via `aria-live="polite"` region; map 4xx error codes to specific field errors via a shared schema. RHF mode: use `methods.setError(name, { message })`.

The default `mode="onBlur"` in RHF mode mirrors the v0.6 native behavior — `useForm` switches the field to `onChange` automatically once an error is set on it.

## Density modes

`density="compact"` adds `data-density="compact"` to the root. Nested `.lumen-field` shells without an explicit `data-size` switch to 32 px (sm) height + reduced padding. Used in operator dashboards (Linear, Plaid, Notion all ship density modes). The mode hook works identically in both native and RHF modes.

## Accessibility

- Native `<form>` element so Enter-to-submit, browser autofill, and password-manager integration work out of the box (both modes).
- Submit button must NEVER be `disabled` as the only signal of validation failure — the user should always be able to attempt submit and see what's wrong.
- Submit error: focus moves to the first invalid field; summary rendered at top.
- RHF mode preserves the `aria-invalid` + `aria-describedby` wiring on each Field — RHF only owns the validation state, not the rendering.

WCAG: 1.3.1, 2.4.3, 3.3.1, 3.3.4, 4.1.2, 4.1.3.

## Do

- Validate on blur, then onChange after first error.
- Provide a summary ValidationMessage at top on submit failure.
- Keep submit enabled — let the form tell the user what's wrong.
- Default `autoComplete="on"` — autofill is an accessibility feature.
- Use `schema` for non-trivial forms (>3 fields, nested objects, async validation).
- Pair with `<Field name="…">` — the `name` prop is what bridges Field to RHF.

## Don't

- Don't disable the submit button as the only signal of failed validation.
- Don't validate on every keystroke before first interaction.
- Don't suppress browser autofill for known-safe fields (name, email, address).
- Don't mix manual `validate` prop with `schema` — pick one.
- Don't paint your own error on Field when RHF is active — `formState.errors` drives.

## Code

- **RHF mode (canonical example):** [`./examples/web-react-rhf.tsx`](./examples/web-react-rhf.tsx)
- **Native mode primitive:** [`audit-dashboard/src/components/primitives/form.tsx`](../../../audit-dashboard/src/components/primitives/form.tsx) — supports both modes via the `schema` prop.
- **RHF convenience surface:** [`audit-dashboard/src/components/primitives/form-rhf.tsx`](../../../audit-dashboard/src/components/primitives/form-rhf.tsx) — re-exports Form + the FieldRHFBridge as `Field`.
- **Field primitive:** [`audit-dashboard/src/components/primitives/field.tsx`](../../../audit-dashboard/src/components/primitives/field.tsx)

## Changelog
- 0.7.0 — Added react-hook-form binding via FormProvider + zodResolver. Pass `schema` (Zod) and `defaultValues`; nested `<Field name="…">` auto-registers and surfaces field errors. The v0.6 native mode is preserved as the default when no `schema` is set.
- 0.6.0 — Initial release. Lightweight native form wrapper with onSubmit, validate, focus-on-first-error, density mode. v0.7 will ship a react-hook-form binding for declarative form schemas.

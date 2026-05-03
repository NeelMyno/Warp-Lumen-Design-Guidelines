---
name: Form
type: component
status: stable
version: 0.6.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Field, Input, Textarea, Select, Checkbox, RadioGroup, Switch, ValidationMessage, Button]
spec: ./component.json
last_updated: 2026-05-03
---

# Form

> Semantic wrapper for a group of Fields. Owns submission, blur-validation orchestration, focus-on-first-error, and the optional `data-density` mode hook for compact dashboards.

## When to use
- Any group of 2+ Fields that submit together.
- A single Field that needs validation orchestration.

## Anatomy

```
<Form onSubmit={handle}>
  <Fieldset legend="Lane">
    <Field … />
    <Field … />
  </Fieldset>
  <Fieldset legend="Service">
    <Field … />
  </Fieldset>
  <ValidationMessage … />   ← summary, only on submit-with-errors
  <Button type="submit">Save</Button>
</Form>
```

## Validation orchestration

1. **Pre-touched** state: no inline validation while typing for the first time.
2. **Blur after first interaction**: validate the field; show error if invalid.
3. **OnChange after first error**: clear the error as soon as the value is fixed.
4. **Submit**: validate everything; if any field fails:
   - Focus the first invalid field via `field.focus({ preventScroll: false })`.
   - Render `<ValidationMessage variant="summary">` at the top with anchor links.
   - `aria-live="polite"` announces the error count.
5. **Server validation**: surface via `aria-live="polite"` region; map 4xx error codes to specific field errors via a shared schema.

## Density modes

`density="compact"` adds `data-density="compact"` to the root. Nested `.lumen-field` shells without an explicit `data-size` switch to 32 px (sm) height + reduced padding. Used in operator dashboards (Linear, Plaid, Notion all ship density modes).

## Accessibility

- Native `<form>` element so Enter-to-submit, browser autofill, and password-manager integration work out of the box.
- Submit button must NEVER be `disabled` as the only signal of validation failure — the user should always be able to attempt submit and see what's wrong.
- Submit error: focus moves to the first invalid field; summary rendered at top.

WCAG: 1.3.1, 2.4.3, 3.3.1, 3.3.4, 4.1.2, 4.1.3.

## Do

- Validate on blur, then onChange after first error.
- Provide a summary ValidationMessage at top on submit failure.
- Keep submit enabled — let the form tell the user what's wrong.
- Default `autoComplete="on"` — autofill is an accessibility feature.

## Don't

- Don't disable the submit button as the only signal of failed validation.
- Don't validate on every keystroke before first interaction.
- Don't suppress browser autofill for known-safe fields (name, email, address).

## Code

- See `Field` primitive: [`audit-dashboard/src/components/primitives/field.tsx`](../../../audit-dashboard/src/components/primitives/field.tsx)

## Changelog
- 0.6.0 — Initial release. Lightweight native form wrapper with onSubmit, validate, focus-on-first-error, density mode. v0.7 will ship a react-hook-form binding for declarative form schemas.

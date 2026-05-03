# ADR 0013 — Form react-hook-form binding (v0.7)

- **Date:** 2026-05-03
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Complements:** [ADR 0011 — Forms and inputs v0.6 rebuild](./0011-forms-and-inputs-v06.md). The v0.6 shell + Field primitive stand. v0.7 adds a form-state engine on top.

## Context

ADR 0011 explicitly deferred react-hook-form: "The v0.6 Form primitive is a thin native wrapper. v0.7 will add an RHF binding for declarative schemas (Zod resolver, `useFormContext`, etc.)." The v0.6 Form shipped that thin wrapper — a `<form>` element + an `onSubmit` handler that runs an optional `validate(formData)` callback and, on failure, focuses the first invalid field. It works for 2–3 simple fields. It doesn't scale.

What the native pattern lacks once a form crosses ~3 fields:

- **No typed payload.** `onSubmit(formData)` returns `FormData`; consumers cast string-by-string. Zod schemas are the convergent fix in 2025/2026 React.
- **No nested objects.** `address.zip` requires manual splitting and re-stitching.
- **No async validation primitive.** Username availability, address verification, server-side checks all need debouncing + state machinery the v0.6 wrapper doesn't model.
- **No incremental validation state.** "Has this field been touched? Has it been submitted? Is it currently revalidating?" — all useful UI hooks the v0.6 wrapper doesn't expose.
- **Manual error binding.** The Field's `error` prop has to be threaded by hand from the validator's return value through state.
- **Re-render thrashing.** Updating one field's value re-renders the entire form tree because there's no subscription model.

These aren't theoretical. Three internal teams have already wrapped the v0.6 Form in a useReducer + manual error map. Each wrap is a 60–120 line bespoke state machine. They differ on whether to validate on blur or onChange after first error. They differ on focus-on-error timing. The system shipped a primitive whose shape doesn't actually compose at the size most product forms hit.

The fix is upstream: bind a real form-state library into the Form primitive itself, gated by a schema prop so the v0.6 native path stays available for the cases where it's the right tool.

## Peer-system research

Surveyed the React form-library landscape for late-2025/2026:

- **react-hook-form (RHF)** — 6.5M weekly downloads on npm, ~9KB gzipped, MIT-licensed, ref-based register pattern that minimizes re-renders, mature `Controller` API for controlled inputs, `FormProvider` + `useFormContext` for nested composition, first-class TypeScript with full type inference from resolvers, integrations published for Zod / Yup / Valibot / Joi / Vest / class-validator / Superstruct / TypeBox. Last release 2025-Q4.
- **Formik** — 3.2M weekly downloads but maintenance has stalled (last meaningful release 2023; open issue count climbing). Heavier (~13KB), Context-based render-props pattern feels dated next to hooks, no first-class TS resolver story.
- **TanStack Form** — newer (2024 GA), excellent TypeScript story, but ecosystem is younger — fewer Storybook examples, fewer integrations, fewer Stack Overflow answers. Worth revisiting v0.9.
- **Conform** — server-action-first, fits Remix and Next App Router but assumes server-side validation as primary; Lumen's ecosystem (audit-dashboard + consumer apps) is mostly client-validated.
- **Native FormData + manual validation** — the v0.6 path. Doesn't scale (see Context).

For schema validation:

- **Zod** — TypeScript-first; types infer from schema (`z.infer<typeof schema>`); composable; chainable error messages; ~24KB gzipped (tree-shakeable). Last release 2025-Q4. The `@hookform/resolvers/zod` adapter is officially maintained by RHF.
- **Yup** — older API, Object-oriented, type inference is weaker than Zod's, schema descriptions cannot be transformed cleanly at type level.
- **Valibot** — newer, modular (~1KB core + per-validator imports), excellent type inference. Worth tracking.
- **Joi** — Node-server-grown; runtime is heavy in browser; type inference requires a separate `@types/hapi__joi`.

The TS-first ergonomics + ecosystem maturity together point at Zod for v0.7.

## Decision

**Bind react-hook-form (RHF) + Zod (via `@hookform/resolvers/zod`) into the Lumen Form primitive.** The binding is gated by a `schema` prop so v0.6's native pattern remains the default for simple forms. Five mechanics:

### 1. Dual-mode Form

`Form` introspects its props at runtime:

- `schema === undefined` → **native mode** (v0.6 behavior). `<form>` + manual `validate` callback + focus-on-first-error orchestration.
- `schema` is a Zod schema → **RHF mode**. Internally calls `useForm({ resolver: zodResolver(schema), defaultValues, mode })` and wraps children in `<FormProvider>`.

The mode is mutually exclusive — TypeScript's discriminated-union typing rejects mixing `validate` with `schema` at compile time.

### 2. Field bridges to RHF context

A new `Field` export in `form-rhf.tsx` wraps the v0.6 Field with a `useFormContext()` check:

- Inside a `FormProvider` → wraps the inner Field in a `<Controller>` for the named path. RHF's `field.value`, `onChange`, `onBlur`, and `ref` all wire through. `formState.errors[name]` (or the nested-path lookup for `address.zip`-style paths) drives the inner Field's `error` prop. The manual `error` prop is ignored with a dev-mode warning.
- Outside any `FormProvider` → falls through to the native v0.6 Field. Same import surface, no behavior change for native-mode consumers.

The bridge is a separate file (`form-rhf.tsx`) so the native path imports nothing RHF-shaped — consumers who never write `schema={…}` never pay the bundle cost.

### 3. Validation timing matches Lumen rules

`mode` defaults to `"onBlur"` (matches the Lumen rule: validate on blur after first interaction). `reValidateMode` is fixed at `"onChange"` (matches: switch to onChange after first error per field). `shouldFocusError: true` is the default (matches: focus the first invalid field on submit). Consumers can override `mode` for niche cases (e.g. `"onChange"` for a real-time slug-availability form), but the defaults match the system's documented validation timing without configuration.

### 4. The `validate` prop becomes mode-exclusive

In TypeScript, `NativeFormProps` allows `validate` and disallows `schema`. `RHFFormProps` allows `schema` and disallows `validate`. Mixing them is a type error. At runtime, if both are somehow passed, `schema` wins and `validate` is ignored — the contract documents this.

### 5. Field forwardRef

The v0.6 Field is migrated to `forwardRef<HTMLInputElement, FieldProps>` so RHF's `Controller.render({ field: { ref } })` can wire focus-on-first-invalid through the bridge. This is a non-breaking API addition; existing call sites that don't pass a `ref` are unaffected.

## Consequences

### Positive

- **Typed payloads.** `onSubmit(data)` in RHF mode receives `z.infer<typeof schema>` — full type inference from schema to handler.
- **Nested objects work.** `address.zip` Just Works (RHF handles dotted-path registration; the bridge's `readError` walks the dotted path through `formState.errors`).
- **Async validation is a one-liner.** Zod's `.refine(async …)` + `mode: "onBlur"` gives debounced, server-checked validation without bespoke state.
- **Three teams' bespoke wrappers can be deleted.** The library now ships what they hand-rolled.
- **Re-render scope tightens.** RHF's ref-based registration scopes re-renders to the changed field, not the whole form tree.
- **Dev-mode warning catches the mode-mix bug.** Passing manual `error` while inside a FormProvider logs a clear warning.
- **Native path is preserved.** v0.6 forms continue working unchanged. Zero migration cost for existing consumers.
- **Bundle cost is opt-in.** The `form-rhf.tsx` import surface is the only entry point that pulls RHF + zod + resolvers. Apps that never pass `schema` ship none of it (assuming the bundler tree-shakes — Next.js 16 + Turbopack does).

### Negative

- **Three new deps for consumers wanting RHF mode:** `react-hook-form` (~9KB gz), `@hookform/resolvers` (~2KB gz), `zod` (~24KB gz, tree-shakeable). ~35KB gz total before tree-shaking. Documented in audit-dashboard/package.json; v0.6 native consumers don't pay it.
- **Field surface area grows.** The bridge adds a second `Field` export living at `@/components/primitives/form-rhf` alongside the original at `@/components/primitives/field`. Same name, different module. Lint-rule clarity: the form-rhf one is the recommended import when a `schema` is in play; the bare one is fine standalone.
- **forwardRef adoption on Field is a tiny API surface change.** Existing call sites are unaffected (refs are optional and wasn't accepted before), but anyone who was working around the missing ref by querying the DOM should switch to the ref API.
- **The `as unknown as Ref<HTMLInputElement>` cast in the bridge** is needed because RHF types `field.ref` as a generic `RefCallback<unknown>`. The cast is documented + scoped to one line.

### Tradeoffs not chosen

- **HOC pattern (`withForm(Component)`).** Clunky in 2026 — hooks won this argument three years ago. Wouldn't compose with FormProvider/Context cleanly.
- **Render-props pattern (`<Form>{({ values, errors }) => …}</Form>`).** Verbose at every call site. The Field-as-bridge pattern (the one we picked) lets call sites stay flat.
- **Jotai or Zustand for form state.** Overkill — RHF's internal store is purpose-built for forms (subscriptions are per-field, not per-mutation). Adopting a general state lib would lose RHF's re-render optimizations.
- **TanStack Form.** Strong TS story but the ecosystem (Zod / Yup / Valibot resolvers, Storybook examples, Stack Overflow coverage) lags RHF by 2 years. Re-evaluate at v0.9 if TanStack Form crosses 1M weekly downloads.
- **Native FormData + a reducer hook (e.g. `useFormReducer`).** This is what the three internal teams hand-rolled. Maintaining it as a Lumen-native primitive duplicates work RHF already does well, and we'd be on the hook for the bug bin.
- **Defaulting `mode` to `"onChange"`.** Tempting because it's "more responsive," but it violates the Lumen rule (don't validate during first typing). Forces every consumer to override back to `"onBlur"`. Bad default.
- **Auto-mounting a `ValidationMessage` summary at the top of the form on submit failure.** Out of scope for v0.7; the RHF binding makes this trivial to add (`Object.keys(formState.errors).length > 0 && <ValidationMessage variant="summary" …/>`), but the summary's anchor-link wiring is a separate v0.7.x decision.

## Verification

Done in v0.7.0:

- ✅ `Form` accepts `schema`, `defaultValues`, `resolver`, `mode` props.
- ✅ TypeScript discriminates `NativeFormProps` ⊕ `RHFFormProps` so `validate` + `schema` is a compile error.
- ✅ `Field` from `form-rhf.tsx` falls through to native Field outside a FormProvider.
- ✅ `Field` from `form-rhf.tsx` wires Controller + reads `formState.errors[name]` inside a FormProvider.
- ✅ Dev-mode warning fires when manual `error` is passed inside a FormProvider.
- ✅ `Field` (v0.6 primitive) migrated to `forwardRef` — non-breaking.
- ✅ component.json validates against the schema.
- ✅ Example file at `design-system/02-components/form/examples/web-react-rhf.tsx` shows a 4-field form with all four Zod validator types.

Open:

- ⏳ `pnpm install` — three new deps added to `audit-dashboard/package.json`. Re-run on next branch sync.
- ⏳ `pnpm exec tsc --noEmit` — full typecheck pass after the deps install.
- ⏳ Bundle-size measurement on the deployed audit-dashboard — confirm the form-rhf surface tree-shakes for routes that don't import it.
- ⏳ Async validation example (server-checked username availability) — to add at v0.7.x.
- ⏳ Auto-summary `<ValidationMessage variant="summary">` at the top of forms on submit failure — v0.7.x.

## References

- [`design-system/02-components/form/component.json`](../../design-system/02-components/form/component.json) — v0.7 contract.
- [`design-system/02-components/form/component.md`](../../design-system/02-components/form/component.md) — dual-mode prose.
- [`design-system/02-components/form/examples/web-react-rhf.tsx`](../../design-system/02-components/form/examples/web-react-rhf.tsx) — canonical RHF-mode example.
- [`audit-dashboard/src/components/primitives/form.tsx`](../../audit-dashboard/src/components/primitives/form.tsx) — implementation.
- [`audit-dashboard/src/components/primitives/form-rhf.tsx`](../../audit-dashboard/src/components/primitives/form-rhf.tsx) — convenience surface + Field bridge.
- [`audit-dashboard/src/components/primitives/field.tsx`](../../audit-dashboard/src/components/primitives/field.tsx) — Field primitive (forwardRef in v0.7).
- [ADR 0011 — Forms and inputs v0.6 rebuild](./0011-forms-and-inputs-v06.md) — the foundation this builds on.
- Library sources: [react-hook-form docs](https://react-hook-form.com), [Zod docs](https://zod.dev), [@hookform/resolvers](https://github.com/react-hook-form/resolvers).

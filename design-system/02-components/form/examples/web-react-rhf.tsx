// Lumen Form — Web React (v0.7 RHF mode) example
//
// Copy this into your repo at /components/forms/example.tsx and tweak.
// Tokens come from /_build/tailwind/theme.css which you import in your
// global css. The Form + Field primitives live at:
//   /audit-dashboard/src/components/primitives/form.tsx
//   /audit-dashboard/src/components/primitives/form-rhf.tsx
//   /audit-dashboard/src/components/primitives/field.tsx
//
// Required deps (see audit-dashboard/package.json):
//   react-hook-form       ^7
//   @hookform/resolvers   ^3
//   zod                   ^3
//
// What this example shows:
//   1. A Zod schema with four field types: string + email, string min, number
//      with a minimum, boolean that must be true.
//   2. <Form schema={…} defaultValues={…} onSubmit={…}> — schema activates
//      RHF mode. defaultValues are recommended whenever schema is set.
//   3. <Field name="…"> — the `name` is the bridge to RHF. The Field knows
//      to read formState.errors[name] from FormProvider context and surface
//      it as its own error message.
//   4. onSubmit receives the typed, schema-inferred payload.
//   5. onError is called when validation blocks; receives RHF's FieldErrors.

"use client";

import { Form, Field } from "@/components/primitives/form-rhf";
import { Button } from "@/components/ui/button";
import { z } from "zod";

// Schema: TypeScript types are inferred from this — `Values` is the payload
// type that flows to onSubmit.
const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce
    .number({ invalid_type_error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(18, "You must be 18 or older"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" }),
  }),
});

type Values = z.infer<typeof schema>;

const defaultValues: Partial<Values> = {
  email: "",
  name: "",
  // age intentionally omitted — RHF will treat the input as empty until typed,
  // and the schema's z.coerce.number() will surface the right error message.
  terms: false as unknown as true,
};

export function FormRHFExample() {
  return (
    <Form
      schema={schema}
      defaultValues={defaultValues as Values}
      mode="onBlur"
      onSubmit={(data) => {
        // `data` is fully typed: { email: string; name: string; age: number; terms: true }
        // eslint-disable-next-line no-console
        console.log("Form submitted with:", data);
      }}
      onError={(errors) => {
        // RHF FieldErrors map. Useful for analytics / surfacing a top-level
        // ValidationMessage summary.
        // eslint-disable-next-line no-console
        console.warn("Form blocked by validation:", errors);
      }}
    >
      <Field
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
      />

      <Field
        name="name"
        label="Full name"
        autoComplete="name"
        placeholder="Jordan Rivera"
      />

      <Field
        name="age"
        label="Age"
        type="number"
        inputMode="numeric"
        min={0}
        hint="Must be 18 or older."
      />

      {/*
        Terms is a boolean; the convenience Field surface accepts a checkbox
        type and bridges to RHF the same way. For a richer Switch / Checkbox
        experience pair Form with the Lumen Switch / Checkbox primitives
        wrapped in a Controller — same pattern, different inner control.
      */}
      <Field
        name="terms"
        label="I accept the terms and conditions"
        type="checkbox"
      />

      <Button type="submit">Create account</Button>
    </Form>
  );
}

"use client";

import {
  useEffect,
  useId,
  type Ref,
} from "react";
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Field as NativeField, type FieldProps as NativeFieldProps } from "@/components/primitives/field";

/**
 * Lumen form-rhf — convenience import surface for the v0.7 RHF binding.
 *
 *   import { Form, Field } from "@/components/primitives/form-rhf";
 *
 * Re-exports:
 *   • Form — the dual-mode wrapper from form.tsx (RHF mode activated by `schema`).
 *   • Field — a thin wrapper around the v0.6 Field that bridges to RHF context
 *             when one exists. When called outside a FormProvider, it degrades
 *             to the native Field (you can use this anywhere — it's safe).
 *
 * Component contract: design-system/02-components/form/component.{md,json}.
 */

export { Form } from "@/components/primitives/form";
export type {
  FormProps,
  NativeFormProps,
  RHFFormProps,
} from "@/components/primitives/form";

/* ─────────────────────────────────────────────────────────────────── */
/*  FieldRHFBridge — the Field that knows about RHF context             */
/* ─────────────────────────────────────────────────────────────────── */

export type FieldRHFProps<
  TValues extends FieldValues = FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
> = Omit<NativeFieldProps, "name" | "error" | "value" | "defaultValue" | "onChange" | "onBlur"> & {
  /**
   * Required when used inside a Form with a `schema`. The `name` is what
   * ties this Field to the RHF schema key. When no FormProvider is present,
   * this still passes through to the native input as the field name.
   */
  name: TName;
  /**
   * Error override. When inside a FormProvider, RHF's `formState.errors[name]`
   * wins — passing this prop is a no-op (and we warn in dev).
   */
  error?: string;
};

/**
 * Bridge component. Detects RHF context via useFormContext():
 *
 *   • When inside a FormProvider — calls Controller for the named field,
 *     surfaces RHF's value/onChange/onBlur, and binds formState.errors[name]
 *     to the inner Field's `error` prop. The manual `error` prop is ignored
 *     (with a dev-mode warning).
 *
 *   • When outside a FormProvider — falls through to the native Field. The
 *     `name` is forwarded to the inner <input>, the `error` prop drives the
 *     error UI as in v0.6.
 *
 * This keeps the import surface uniform: consumers don't need to know
 * whether they're in RHF land or native land.
 */
export function Field<
  TValues extends FieldValues = FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
>({ name, error: errorOverride, ...rest }: FieldRHFProps<TValues, TName>) {
  // useFormContext returns null when there's no surrounding FormProvider.
  // It's safe to call unconditionally — RHF guards this internally.
  const ctx = useFormContext<TValues>();

  // Native fall-through: no surrounding RHF context, behave like v0.6.
  if (!ctx) {
    return (
      <NativeField
        {...(rest as NativeFieldProps)}
        name={name}
        error={errorOverride}
      />
    );
  }

  return (
    <RHFFieldInner<TValues, TName>
      name={name}
      errorOverride={errorOverride}
      rest={rest}
    />
  );
}

/**
 * Inner component — only rendered when a FormProvider exists. Splitting the
 * Controller call into its own component keeps the hook order stable across
 * renders (the no-context path never invokes Controller).
 */
function RHFFieldInner<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
>({
  name,
  errorOverride,
  rest,
}: {
  name: TName;
  errorOverride: string | undefined;
  rest: Omit<FieldRHFProps<TValues, TName>, "name" | "error">;
}) {
  const { control, formState } = useFormContext<TValues>();

  // Dev warning: RHF mode means formState.errors drives Field error display.
  // A consumer passing `error` directly is mixing modes — flag it loudly.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && errorOverride !== undefined) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Lumen Form] Field name="${name}" was rendered with a manual \`error\` ` +
          `prop while inside a FormProvider. The manual error is ignored — ` +
          `formState.errors.${name} drives the error UI. Use methods.setError() ` +
          `from useFormContext() to surface server-side errors.`,
      );
    }
  }, [name, errorOverride]);

  // The Field itself owns label/id wiring — useId fallback for stability if a
  // consumer doesn't pass an explicit id.
  const fallbackId = useId();
  const fieldId = (rest as { id?: string }).id ?? fallbackId;

  // Resolve the (possibly-nested) error message for this field path.
  // RHF stores nested errors under the same dotted path the Controller uses.
  const fieldError = readError(formState.errors, name);

  return (
    <Controller<TValues, TName>
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // Prefer fieldState.error.message (the local Controller view), fall
        // back to the dotted lookup for paths the Controller doesn't surface.
        const message = fieldState.error?.message ?? fieldError;
        const isCheckbox = (rest as { type?: string }).type === "checkbox";
        const value = field.value;

        return (
          <NativeField
            {...(rest as NativeFieldProps)}
            id={fieldId}
            name={field.name}
            // Checkbox uses `checked`; everything else uses `value`. Coerce
            // null/undefined to "" so React stays in controlled-input mode.
            {...(isCheckbox
              ? { checked: Boolean(value) }
              : {
                  value: (value as string | number | readonly string[] | null | undefined) ?? "",
                })}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref as Ref<HTMLInputElement>}
            error={typeof message === "string" ? message : undefined}
          />
        );
      }}
    />
  );
}

/**
 * Read a possibly-nested RHF error by dotted path. RHF stores errors as a
 * tree mirroring the schema; for `name="address.zip"` the error lives at
 * `errors.address.zip`. This walks the path safely.
 */
function readError(errors: unknown, path: string): string | undefined {
  if (!errors || typeof errors !== "object") return undefined;
  const segments = path.split(".");
  let cursor: unknown = errors;
  for (const segment of segments) {
    if (cursor && typeof cursor === "object" && segment in cursor) {
      cursor = (cursor as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  if (cursor && typeof cursor === "object" && "message" in cursor) {
    const msg = (cursor as { message?: unknown }).message;
    return typeof msg === "string" ? msg : undefined;
  }
  return undefined;
}

"use client";

import {
  FormHTMLAttributes,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldErrors,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

import { cn } from "@/lib/utils";

/**
 * Lumen Form — semantic <form> wrapper with dual-mode validation.
 *
 *   • v0.6 native mode (default): a thin <form> wrapper. `onSubmit` receives
 *     the raw FormData; `validate` is an optional callback that returns a
 *     {field: error} record; submit is blocked when the record is non-empty.
 *
 *   • v0.7 RHF mode (activated by passing `schema`): wraps children in a
 *     react-hook-form FormProvider. `useForm` is configured with
 *     `zodResolver(schema)` (overridable via `resolver`), `defaultValues`,
 *     `mode` (default "onBlur"), and `shouldFocusError: true` so the first
 *     invalid field receives focus on submit failure. `onSubmit` receives
 *     the typed, schema-inferred payload; `onError` receives RHF's
 *     `FieldErrors` map.
 *
 * Pair with the FieldRHFBridge in form-rhf.tsx (or import Field directly
 * from form-rhf for the convenience surface): nested `<Field name="…">`
 * auto-registers via `useFormContext()` and surfaces `formState.errors[name]`
 * into the Field's `error` prop.
 *
 * Component contract: design-system/02-components/form/component.{md,json}.
 */

type Density = "comfortable" | "compact";
type Mode = "onBlur" | "onChange" | "onSubmit";

type CommonProps = {
  /** Sets data-density on the form root; nested .lumen-field shells respect it. */
  density?: Density;
  children: ReactNode;
  className?: string;
};

type FormElementHandlers = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onError" | "children" | "className"
>;

/* ─────────────────────────────────────────────────────────────────── */
/*  Native mode (v0.6)                                                  */
/* ─────────────────────────────────────────────────────────────────── */

export type NativeFormProps = CommonProps &
  FormElementHandlers & {
    /** Native mode: receives the raw FormData after `validate` passes. */
    onSubmit: (data: FormData, event: React.FormEvent<HTMLFormElement>) => void;
    /** Native mode: called when `validate` returns a non-empty record. */
    onError?: (errors: Record<string, string>) => void;
    /** Native mode validator. Return non-empty record to block submit. */
    validate?: (data: FormData) => Record<string, string>;
    /** Activates native mode by absence — must be undefined. */
    schema?: undefined;
    defaultValues?: undefined;
    resolver?: undefined;
    mode?: undefined;
  };

/* ─────────────────────────────────────────────────────────────────── */
/*  RHF mode (v0.7)                                                     */
/* ─────────────────────────────────────────────────────────────────── */

export type RHFFormProps<TValues extends FieldValues> = CommonProps &
  FormElementHandlers & {
    /** Zod schema. Presence activates RHF mode. */
    schema: ZodType<TValues>;
    /** RHF mode: receives the typed, schema-inferred payload. */
    onSubmit: SubmitHandler<TValues>;
    /** RHF mode: receives the FieldErrors map. */
    onError?: (errors: FieldErrors<TValues>) => void;
    /** Initial values for all registered fields. Recommended whenever `schema` is set. */
    defaultValues?: DefaultValues<TValues>;
    /** Override resolver. Defaults to zodResolver(schema). */
    resolver?: Resolver<TValues>;
    /** When validation runs. Default "onBlur" — matches Lumen validation timing. */
    mode?: Mode;
    /** RHF mode never accepts the manual native validator. */
    validate?: undefined;
  };

export type FormProps<TValues extends FieldValues = FieldValues> =
  | NativeFormProps
  | RHFFormProps<TValues>;

/* ─────────────────────────────────────────────────────────────────── */
/*  Implementation                                                      */
/* ─────────────────────────────────────────────────────────────────── */

export function Form<TValues extends FieldValues = FieldValues>(
  props: FormProps<TValues>,
) {
  if (isRHFForm<TValues>(props)) {
    return <RHFForm {...props} />;
  }
  return <NativeForm {...props} />;
}

function isRHFForm<TValues extends FieldValues>(
  props: FormProps<TValues>,
): props is RHFFormProps<TValues> {
  return (props as RHFFormProps<TValues>).schema !== undefined;
}

/* ─── Native mode component ──────────────────────────────────────── */

function NativeForm({
  onSubmit,
  onError,
  validate,
  density,
  children,
  className,
  noValidate = true, // We own validation; suppress the browser's native bubbles.
  ...rest
}: NativeFormProps) {
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formEl = event.currentTarget;
      const formData = new FormData(formEl);

      const errors = validate ? validate(formData) : {};
      const errorEntries = Object.entries(errors).filter(([, msg]) => msg);

      if (errorEntries.length > 0) {
        onError?.(Object.fromEntries(errorEntries));
        // Focus-on-first-error: the canonical way to find the offending field.
        const firstName = errorEntries[0][0];
        const target = formEl.querySelector<HTMLElement>(
          `[name="${cssEscape(firstName)}"]`,
        );
        target?.focus({ preventScroll: false });
        return;
      }

      onSubmit(formData, event);
    },
    [onSubmit, onError, validate],
  );

  return (
    <form
      {...rest}
      noValidate={noValidate}
      onSubmit={handleSubmit}
      data-density={density === "compact" ? "compact" : undefined}
      className={cn("lumen-form", className)}
    >
      {children}
    </form>
  );
}

/* ─── RHF mode component ─────────────────────────────────────────── */

function RHFForm<TValues extends FieldValues>({
  schema,
  onSubmit,
  onError,
  defaultValues,
  resolver,
  mode = "onBlur",
  density,
  children,
  className,
  noValidate = true,
  ...rest
}: RHFFormProps<TValues>) {
  // Memoize the resolver: zodResolver(schema) is cheap but the identity matters
  // for RHF's internal config — re-creating each render churns the form state.
  const effectiveResolver = useMemo<Resolver<TValues>>(
    () => resolver ?? (zodResolver(schema) as unknown as Resolver<TValues>),
    [resolver, schema],
  );

  const useFormConfig: UseFormProps<TValues> = useMemo(
    () => ({
      resolver: effectiveResolver,
      defaultValues,
      mode,
      // Lumen rule: focus the first invalid field on submit failure.
      shouldFocusError: true,
      // Once a field has shown an error, switch it to onChange so the user
      // sees it clear as soon as they fix the value (matches Lumen timing).
      reValidateMode: "onChange",
    }),
    [effectiveResolver, defaultValues, mode],
  );

  const methods = useForm<TValues>(useFormConfig);

  const handleSubmit = methods.handleSubmit(onSubmit, onError);

  return (
    <FormProvider {...methods}>
      <form
        {...rest}
        noValidate={noValidate}
        onSubmit={handleSubmit}
        data-density={density === "compact" ? "compact" : undefined}
        className={cn("lumen-form", className)}
      >
        {children}
      </form>
    </FormProvider>
  );
}

/* ─── helpers ────────────────────────────────────────────────────── */

/**
 * CSS.escape with a tiny fallback for environments where it isn't defined
 * (e.g. older test runners). Safe-guards the querySelector lookup.
 */
function cssEscape(value: string): string {
  if (typeof window !== "undefined" && typeof window.CSS?.escape === "function") {
    return window.CSS.escape(value);
  }
  // Minimal fallback: escape characters that have meaning in CSS attr selectors.
  return value.replace(/(["\\])/g, "\\$1");
}

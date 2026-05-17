// Lumen Input — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/input.tsx.
// Tokens come from dist/tailwind/lumen.css which you import in your global css.
//
// Standalone: this <input> paints its own border, background, and focus halo.
// Inside a Lumen <Field> (.lumen-field wrapper), the wrapper paints the focus
// surface and the inner <input> renders bare via globals.css overrides.

import { InputHTMLAttributes, forwardRef } from "react";

type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, string> = {
  sm: "h-[var(--input-height-sm)] px-[var(--input-padding-x-sm)] text-[var(--type-body-sm)]",
  md: "h-[var(--input-height-md)] px-[var(--input-padding-x-md)] text-[var(--type-body-md)]",
  lg: "h-[var(--input-height-lg)] px-[var(--input-padding-x-lg)] text-[var(--type-body-lg)]",
};

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: Size;
  /** Render value with tabular numerics + slashed-zero (Satoshi tnum). Use for IDs, ZIPs, codes, weights, money. */
  mono?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", mono = false, type = "text", className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={[
        // Shell — used standalone. Inside .lumen-field these are overridden.
        "flex w-full min-w-0 rounded-[var(--input-radius)]",
        "border border-[var(--input-border-rest)] bg-[var(--input-background-rest)]",
        "text-[var(--input-foreground-value)] outline-none",
        "placeholder:text-[var(--input-foreground-placeholder)]",
        "shadow-[var(--input-ring-litEdge)]",
        "transition-[color,box-shadow,border-color,background-color]",
        "duration-[var(--motion-transition-fast)] ease-[var(--motion-easing-standard)]",
        // States.
        "hover:border-[var(--input-border-hover)]",
        "focus-visible:border-[var(--input-border-focus)] focus-visible:shadow-[var(--input-ring-focus)]",
        "aria-invalid:border-[var(--input-border-error)] aria-invalid:focus-visible:shadow-[var(--input-ring-error)]",
        "disabled:cursor-not-allowed disabled:bg-[var(--input-background-disabled)] disabled:text-[var(--input-foreground-valueDisabled)] disabled:border-[var(--input-border-disabled)] disabled:pointer-events-none",
        "read-only:cursor-default read-only:bg-[var(--input-background-readOnly)] read-only:text-[var(--input-foreground-valueReadOnly)] read-only:border-[var(--input-border-readOnly)]",
        SIZE[size],
        mono ? "[font-variant-numeric:tabular-nums_lining-nums_slashed-zero] [font-feature-settings:'tnum'_1,'lnum'_1,'zero'_1]" : "",
        className ?? "",
      ].join(" ")}
      {...props}
    />
  );
});

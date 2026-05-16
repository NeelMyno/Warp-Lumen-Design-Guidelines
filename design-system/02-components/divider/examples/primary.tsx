// Lumen Divider — Web React example.
// Horizontal (default) or vertical. Optional inline label. Decorative by default.

import { ReactNode } from "react";

type Weight = "hairline" | "subtle" | "default" | "strong";
type Inset = "none" | "sm" | "md" | "lg";

const WEIGHT: Record<Weight, string> = {
  hairline: "border-[var(--color-border-hairline)]",
  subtle:   "border-[var(--color-border-subtle)]",
  default:  "border-[var(--color-border-default)]",
  strong:   "border-[var(--color-border-strong)]",
};

const INSET_H: Record<Inset, string> = {
  none: "mx-0",
  sm:   "mx-4",
  md:   "ml-4",
  lg:   "ml-14",
};

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  weight?: Weight;
  label?: ReactNode;
  decorative?: boolean;
  inset?: Inset;
};

export function Divider({
  orientation = "horizontal",
  weight = "hairline",
  label,
  decorative = true,
  inset = "none",
}: DividerProps) {
  const role = decorative ? "presentation" : "separator";
  const aria = decorative ? undefined : orientation;

  if (orientation === "vertical") {
    return (
      <span
        role={role}
        aria-orientation={aria}
        className={[
          "inline-block h-full w-px self-stretch",
          "border-l",
          WEIGHT[weight],
          "border-l-[1px]",
        ].join(" ")}
      />
    );
  }

  if (label) {
    return (
      <div
        role={role}
        aria-orientation={aria}
        className={[
          "relative flex items-center my-[var(--space-stack-md)]",
          INSET_H[inset],
        ].join(" ")}
      >
        <span className={["flex-1 border-t", WEIGHT[weight]].join(" ")} />
        <span className="px-3 text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">
          {label}
        </span>
        <span className={["flex-1 border-t", WEIGHT[weight]].join(" ")} />
      </div>
    );
  }

  return (
    <hr
      role={role}
      aria-orientation={aria}
      className={[
        "border-0 border-t",
        WEIGHT[weight],
        INSET_H[inset],
      ].join(" ")}
    />
  );
}

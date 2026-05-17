// Lumen Skeleton — Web React example.
// Layout-preserving placeholder. Shimmer pauses under prefers-reduced-motion.

// lumen-allow-file: on-grid-px
// Lumen library example — inline layout pixels in a self-contained demo (4-pt grid). The audit-tokens.ts hard gate (excludes examples/ + audit-dashboard/) enforces the strict rule on shipped library source.
import { ReactNode } from "react";

type Shape = "text" | "circle" | "rect" | "card" | "row";
type Radius = "inherit" | "sm" | "md" | "lg" | "pill" | "circle";

const RADIUS: Record<Radius, string> = {
  inherit: "",
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  pill: "rounded-[var(--radius-pill)]",
  circle: "rounded-[var(--radius-circle)]",
};

const DEFAULT_RADIUS: Record<Shape, Radius> = {
  text: "sm",
  circle: "circle",
  rect: "md",
  card: "lg",
  row: "sm",
};

export type SkeletonProps = {
  shape?: Shape;
  width?: string;
  height?: string;
  lines?: number;
  radius?: Radius;
  shimmer?: boolean;
  className?: string;
};

const shimmerClass =
  "relative overflow-hidden after:absolute after:inset-0 after:-translate-x-full " +
  "after:animate-[lumen-shimmer_1.6s_ease-in-out_infinite] motion-reduce:after:hidden " +
  "after:bg-[linear-gradient(90deg,transparent,var(--color-alpha-paper-08),transparent)]";

const baseClass = [
  "bg-[var(--color-surface-sunken)]",
  "border border-[var(--color-border-hairline)]",
].join(" ");

export function Skeleton({
  shape = "rect",
  width,
  height,
  lines = 1,
  radius = "inherit",
  shimmer = true,
  className,
}: SkeletonProps): ReactNode {
  const r = radius === "inherit" ? DEFAULT_RADIUS[shape] : radius;
  const rc = RADIUS[r];
  const sc = shimmer ? shimmerClass : "";

  if (shape === "text" && lines > 1) {
    return (
      <span aria-hidden="true" className={["flex flex-col gap-2", className ?? ""].join(" ")}>
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={[baseClass, rc, sc, "block h-[1em]"].join(" ")}
            style={{ width: i === lines - 1 ? `${60 + Math.random() * 20}%` : "100%" }}
          />
        ))}
        <style>{`@keyframes lumen-shimmer { 100% { transform: translateX(100%); } } @media (prefers-reduced-motion: reduce) { [class*="animate-"] { animation: none !important } }`}</style>
      </span>
    );
  }

  const defaultSize: Record<Shape, { w: string; h: string }> = {
    text:   { w: width ?? "100%", h: height ?? "1em" },
    circle: { w: width ?? "40px", h: height ?? "40px" },
    rect:   { w: width ?? "auto", h: height ?? "24px" },
    card:   { w: width ?? "100%", h: height ?? "192px" },
    row:    { w: width ?? "100%", h: height ?? "44px" },
  };
  const { w, h } = defaultSize[shape];

  return (
    <>
      <span
        aria-hidden="true"
        className={[baseClass, rc, sc, "block", className ?? ""].join(" ")}
        style={{ width: w, height: h }}
      />
      <style>{`@keyframes lumen-shimmer { 100% { transform: translateX(100%); } }`}</style>
    </>
  );
}

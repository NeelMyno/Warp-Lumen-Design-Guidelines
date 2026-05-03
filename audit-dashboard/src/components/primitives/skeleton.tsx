import { cn } from "@/lib/utils";
import { Skeleton as ShadcnSkeleton } from "@/components/ui/skeleton";

/**
 * Lumen Skeleton — wraps the shadcn Skeleton with Lumen's `width`/`height`/
 * `rounded` shorthand. shadcn ships with a tw-animate-css `animate-pulse`
 * shimmer.
 */
export function Skeleton({
  width,
  height = 14,
  className = "",
  rounded = "var(--radius-sm)",
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
  rounded?: string;
}) {
  return (
    <ShadcnSkeleton
      aria-hidden
      className={cn("inline-block", className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width ?? "100%",
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: rounded,
      }}
    />
  );
}

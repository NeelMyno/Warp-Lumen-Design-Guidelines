import { ReactNode } from "react";

/**
 * Horizontal divider with an optional centered label.
 * Use sparingly — Lumen's calm comes from spacing and hairlines on cards,
 * not loud rules between sections.
 */
export function Divider({
  label,
  align = "center",
}: {
  label?: ReactNode;
  align?: "left" | "center" | "right";
}) {
  if (!label) {
    return <hr className="border-0 border-t border-[var(--border-hairline)] my-6" />;
  }
  return (
    <div className="flex items-center gap-3 my-6">
      {(align === "center" || align === "right") && (
        <span className="flex-1 border-t border-[var(--border-hairline)]" />
      )}
      <span className="lumen-eyebrow shrink-0">{label}</span>
      {(align === "center" || align === "left") && (
        <span className="flex-1 border-t border-[var(--border-hairline)]" />
      )}
    </div>
  );
}

export function VerticalDivider({ height = "1em" }: { height?: string }) {
  return (
    <span
      aria-hidden
      className="inline-block bg-[var(--border-default)] mx-2 align-middle"
      style={{ width: 1, height }}
    />
  );
}

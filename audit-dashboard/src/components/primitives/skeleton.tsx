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
    <span
      aria-hidden
      className={["lumen-skeleton inline-block", className].join(" ")}
      style={{
        width: typeof width === "number" ? `${width}px` : width ?? "100%",
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: rounded,
        background:
          "linear-gradient(90deg, var(--surface-sunken) 0%, color-mix(in oklab, var(--surface-sunken) 60%, var(--surface-raised)) 50%, var(--surface-sunken) 100%)",
        backgroundSize: "200% 100%",
        animation: "lumen-skeleton-shimmer 1.6s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes lumen-skeleton-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lumen-skeleton { animation: none !important; }
        }
      `}</style>
    </span>
  );
}

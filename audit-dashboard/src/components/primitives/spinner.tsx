export function Spinner({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={["lumen-spinner shrink-0 animate-spin", className].join(" ")}
      aria-label="Loading"
      role="status"
      style={{ animationDuration: "0.9s" }}
    >
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.9" />
      <path d="M2 12a10 10 0 0 0 6 9.3" opacity="0.4" />
    </svg>
  );
}

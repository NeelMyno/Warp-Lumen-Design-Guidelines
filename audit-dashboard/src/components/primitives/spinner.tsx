import { Loader2 } from "lucide-react";

export function Spinner({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <Loader2
      size={size}
      strokeWidth={2.5}
      className={["lumen-spinner shrink-0 animate-spin", className].join(" ")}
      aria-label="Loading"
      role="status"
      style={{ animationDuration: "0.9s" }}
    />
  );
}

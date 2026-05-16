// Lumen InventoryStatus — Web React example. Five tones.

import { Check, AlertTriangle, Clock, AlertOctagon, Package } from "lucide-react";

type Status = "in-stock" | "low-stock" | "backorder" | "preorder" | "sold-out";

const CONFIG: Record<Status, { label: string; icon: typeof Check; bg: string; fg: string }> = {
  "in-stock":  { label: "In stock",   icon: Check,         bg: "bg-[var(--color-status-success-bg)]", fg: "text-[var(--color-status-success-fg)]" },
  "low-stock": { label: "Low stock",  icon: AlertTriangle, bg: "bg-[var(--color-status-warning-bg)]", fg: "text-[var(--color-status-warning-fg)]" },
  "backorder": { label: "Backorder",  icon: Clock,         bg: "bg-[var(--color-status-info-bg)]",    fg: "text-[var(--color-status-info-fg)]" },
  "preorder":  { label: "Preorder",   icon: Package,       bg: "bg-[var(--color-status-info-bg)]",    fg: "text-[var(--color-status-info-fg)]" },
  "sold-out":  { label: "Sold out",   icon: AlertOctagon,  bg: "bg-[var(--color-status-danger-bg)]",  fg: "text-[var(--color-status-danger-fg)]" },
};

export function InventoryStatus({
  status,
  quantity,
  size = "sm",
  compact,
}: {
  status: Status;
  quantity?: number;
  size?: "sm" | "md";
  compact?: boolean;
}) {
  const c = CONFIG[status];
  const Icon = c.icon;
  const label =
    status === "low-stock" && typeof quantity === "number"
      ? `Only ${quantity} left`
      : c.label;
  const h = size === "md" ? "h-7 px-2.5" : "h-5 px-2";
  return (
    <span
      role="img"
      aria-label={label}
      className={[
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)]",
        h, "text-[var(--type-label-sm)]",
        c.bg, c.fg,
      ].join(" ")}
    >
      <Icon size={10} aria-hidden />
      {!compact && (
        <span className="lumen-tnum">{label}</span>
      )}
    </span>
  );
}

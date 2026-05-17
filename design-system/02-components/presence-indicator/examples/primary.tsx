// Lumen PresenceIndicator — Web React example.

// lumen-allow-file: off-grid-micro
// Lumen library example — sub-grid micro pixels (10-22px) used for demo affordances. The audit-tokens.ts hard gate (excludes examples/ + audit-dashboard/) enforces the strict rule on shipped library source.
import { ReactNode } from "react";

export type PresenceUser = {
  name: string;
  avatarUrl?: string;
  status: "online" | "idle" | "dnd" | "offline";
  activity?: string;
};

const COLOR: Record<PresenceUser["status"], string> = {
  online:  "bg-[var(--color-accent-500)]",
  idle:    "bg-[var(--color-status-warning-500)]",
  dnd:     "bg-[var(--color-status-danger-500)]",
  offline: "bg-[var(--color-text-tertiary)]",
};

export function PresenceIndicator({
  users,
  variant = "avatar-group",
  maxVisible = 3,
  showActivity = false,
  size = "sm",
}: {
  users: PresenceUser[];
  variant?: "dot" | "inline" | "avatar-group";
  maxVisible?: number;
  showActivity?: boolean;
  size?: "sm" | "md";
}) {
  const visible = users.filter((u) => u.status !== "offline").slice(0, maxVisible);
  const overflow = Math.max(0, users.filter((u) => u.status !== "offline").length - maxVisible);
  const aria = visible.length === 0
    ? "No one viewing"
    : `${visible.length + overflow} viewing: ${visible.map((u) => u.name).join(", ")}${overflow > 0 ? ` and ${overflow} more` : ""}`;

  if (variant === "dot") {
    return <span aria-label={aria} className={["inline-block size-2 rounded-full ring-2 ring-[var(--color-surface-page)]", COLOR[users[0]?.status ?? "offline"]].join(" ")} />;
  }
  if (variant === "inline") {
    return (
      <span aria-label={aria} className="inline-flex items-center gap-1.5 text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">
        <span className={["size-2 rounded-full", COLOR[users[0]?.status ?? "offline"]].join(" ")} aria-hidden />
        <span>{users[0]?.name}</span>
      </span>
    );
  }
  const sizeBox = size === "md" ? "size-7" : "size-6";
  return (
    <span aria-label={aria} className="inline-flex flex-col gap-1">
      <span className="inline-flex items-center -space-x-2">
        {visible.map((u) => (
          <span key={u.name} className={["relative ring-2 ring-[var(--color-surface-page)] inline-block rounded-full bg-[var(--color-surface-raised)]", sizeBox].join(" ")}>
            {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="size-full rounded-full object-cover" /> : (
              <span className="absolute inset-0 inline-flex items-center justify-center text-[10px] font-medium uppercase text-[var(--color-text-secondary)]">{u.name[0]}</span>
            )}
            <span aria-hidden className={["absolute -bottom-0.5 -right-0.5 size-2 rounded-full ring-2 ring-[var(--color-surface-page)]", COLOR[u.status]].join(" ")} />
          </span>
        ))}
        {overflow > 0 && (
          <span className={["ring-2 ring-[var(--color-surface-page)] inline-flex items-center justify-center rounded-full text-[10px] uppercase lumen-tnum bg-[var(--color-surface-sunken,#1F1F1F)] text-[var(--color-text-secondary)] border border-[var(--color-border-hairline)]", sizeBox].join(" ")}>+{overflow}</span>
        )}
      </span>
      {showActivity && users[0]?.activity && (
        <span aria-live="polite" className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)] truncate">
          {users[0].name} {users[0].activity}
        </span>
      )}
    </span>
  );
}

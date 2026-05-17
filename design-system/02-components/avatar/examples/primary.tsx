// Lumen Avatar + AvatarGroup + PresenceIndicator — Web React example.
// 8-color palette, hash-derived from name. Initials fallback when no src.

// lumen-allow-file: off-grid-micro, on-grid-px
// Lumen library example — sub-grid micro pixels (10-22px) used for demo affordances; inline layout pixels in a self-contained demo (4-pt grid). The audit-tokens.ts hard gate (excludes examples/ + audit-dashboard/) enforces the strict rule on shipped library source.
import { ReactNode } from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Shape = "circle" | "rounded" | "square";
type Presence = "online" | "idle" | "dnd" | "offline";

const SIZE: Record<Size, { box: string; type: string; ring: number }> = {
  xs: { box: "size-5",  type: "text-[10px]", ring: 1 },
  sm: { box: "size-6",  type: "text-[11px]", ring: 2 },
  md: { box: "size-8",  type: "text-[13px]", ring: 2 },
  lg: { box: "size-10", type: "text-[16px]", ring: 2 },
  xl: { box: "size-14", type: "text-[20px]", ring: 3 },
};

const SHAPE: Record<Shape, string> = {
  circle: "rounded-full",
  rounded: "rounded-[var(--radius-card-default)]",
  square: "rounded-none",
};

const PRESENCE_COLOR: Record<Presence, string> = {
  online:  "bg-[var(--color-accent-500)]",
  idle:    "bg-[var(--color-status-warning-500)]",
  dnd:     "bg-[var(--color-status-danger-500)]",
  offline: "bg-[var(--color-text-tertiary)]",
};

const PALETTE: string[] = [
  "var(--color-avatar-bg-1, #14B8A6)",
  "var(--color-avatar-bg-2, #6366F1)",
  "var(--color-avatar-bg-3, #EC4899)",
  "var(--color-avatar-bg-4, #F59E0B)",
  "var(--color-avatar-bg-5, #84CC16)",
  "var(--color-avatar-bg-6, #06B6D4)",
  "var(--color-avatar-bg-7, #A855F7)",
  "var(--color-avatar-bg-8, #F97316)",
];

function hashColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/);
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
}

export type AvatarProps = {
  name: string;
  src?: string;
  alt?: string;
  size?: Size;
  shape?: Shape;
  presence?: Presence;
  asLink?: string;
  loading?: boolean;
};

export function Avatar({
  name,
  src,
  alt,
  size = "md",
  shape = "circle",
  presence,
  asLink,
  loading,
}: AvatarProps) {
  if (loading) {
    return (
      <span aria-hidden className={["inline-block bg-[var(--color-surface-sunken)]", SIZE[size].box, SHAPE[shape]].join(" ")} />
    );
  }
  const inner = (
    <span
      role="img"
      aria-label={alt ?? name}
      className={[
        "relative inline-flex items-center justify-center select-none uppercase font-medium",
        SIZE[size].box,
        SIZE[size].type,
        SHAPE[shape],
        "text-[var(--color-text-on-avatar,white)]",
        "outline-none focus-visible:shadow-[var(--shadow-focus)]",
      ].join(" ")}
      style={{ backgroundColor: hashColor(name) }}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? name}
          className={["absolute inset-0 size-full object-cover", SHAPE[shape]].join(" ")}
        />
      ) : (
        <span aria-hidden>{initialsOf(name).toUpperCase()}</span>
      )}
      {presence && (
        <span
          aria-hidden
          className={[
            "absolute bottom-0 right-0 block size-2 rounded-full",
            "ring-2 ring-[var(--color-surface-page)]",
            PRESENCE_COLOR[presence],
          ].join(" ")}
        />
      )}
    </span>
  );
  if (asLink) return <a href={asLink}>{inner}</a>;
  return inner;
}

export function AvatarGroup({
  people,
  max = 4,
  size = "md",
  shape = "circle",
}: {
  people: { name: string; src?: string }[];
  max?: number;
  size?: Size;
  shape?: Shape;
}) {
  const visible = people.slice(0, max);
  const overflow = Math.max(0, people.length - max);
  return (
    <span className="inline-flex items-center -space-x-2" aria-label={`${people.length} people`}>
      {visible.map((p) => (
        <span key={p.name} className="ring-2 ring-[var(--color-surface-page)] inline-block rounded-full">
          <Avatar name={p.name} src={p.src} size={size} shape={shape} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={[
            "ring-2 ring-[var(--color-surface-page)]",
            "inline-flex items-center justify-center rounded-full uppercase lumen-tnum",
            SIZE[size].box,
            SIZE[size].type,
            "bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)]",
          ].join(" ")}
          aria-label={`${overflow} more`}
        >
          +{overflow}
        </span>
      )}
    </span>
  );
}

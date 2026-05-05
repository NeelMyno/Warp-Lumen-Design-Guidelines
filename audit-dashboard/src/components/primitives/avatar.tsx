import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

/**
 * Lumen Avatar — Radix-backed shadcn Avatar wrapped with Lumen's `name` →
 * deterministic palette + initials API. AvatarGroup keeps the overflow
 * "+N" pill behaviour.
 */

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/* v0.5: Avatar size ramp uses raw type tokens — no semantic preset matches the avatar initials sizes. */
const SIZE_CLS: Record<Size, string> = {
  xs:    "size-5  text-[10px]",
  sm:    "size-6  text-[length:var(--type-11)]",
  md:    "size-8  text-[length:var(--type-13)]",
  lg:    "size-10 text-[length:var(--type-14)]",
  xl:    "size-12 text-[length:var(--type-15)]",
  "2xl": "size-16 text-[length:var(--type-18)]",
};

const SIZE_PX: Record<Size, number> = {
  xs: 20, sm: 24, md: 32, lg: 40, xl: 48, "2xl": 64,
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function paletteFor(seed: string): { bg: string; fg: string } {
  const families = [
    { bg: "var(--lumen-accent-2)",   fg: "var(--lumen-accent-9)"   },
    { bg: "var(--lumen-cream-2)",    fg: "var(--lumen-cream-9)"    },
    { bg: "var(--lumen-amber-2)",    fg: "var(--lumen-amber-9)"    },
    { bg: "var(--lumen-red-2)",      fg: "var(--lumen-red-9)"      },
    { bg: "var(--lumen-cream-3)",    fg: "var(--lumen-cream-9)"    },
    { bg: "var(--lumen-obsidian-2)", fg: "var(--lumen-obsidian-9)" },
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return families[h % families.length];
}

export function Avatar({
  name,
  size = "md",
  src,
  alt,
  badge,
  ring,
}: {
  name: string;
  size?: Size;
  src?: string;
  alt?: string;
  badge?: ReactNode;
  ring?: boolean;
}) {
  const palette = paletteFor(name);
  return (
    <span className="relative inline-flex shrink-0">
      <ShadcnAvatar
        className={cn(
          SIZE_CLS[size],
          ring && "ring-2 ring-offset-2 ring-offset-[var(--surface-canvas)] ring-[var(--border-default)]",
        )}
      >
        {src && <AvatarImage src={src} alt={alt ?? name} />}
        <AvatarFallback
          className="font-semibold tracking-[var(--tracking-tight)]"
          style={{ background: palette.bg, color: palette.fg }}
        >
          {initials(name)}
        </AvatarFallback>
      </ShadcnAvatar>
      {/* lumen-lint-allow: off-grid — 2 px badge offset from avatar corner is optical, hairline-class. */}
      {badge && <span className="absolute -right-0.5 -bottom-0.5">{badge}</span>}
      <span className="sr-only">{name}</span>
    </span>
  );
}

export function AvatarGroup({
  names,
  max = 4,
  size = "sm",
}: {
  names: string[];
  max?: number;
  size?: Size;
}) {
  const visible = names.slice(0, max);
  const overflow = names.length - visible.length;
  return (
    <div className="inline-flex items-center -space-x-2">
      {visible.map((n) => <Avatar key={n} name={n} size={size} ring />)}
      {overflow > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full bg-[var(--surface-sunken)] text-[color:var(--text-tertiary)] font-medium text-[10px] ring-2 ring-offset-2 ring-offset-[var(--surface-canvas)] ring-[var(--border-default)]"
          style={{ width: SIZE_PX[size], height: SIZE_PX[size] }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}

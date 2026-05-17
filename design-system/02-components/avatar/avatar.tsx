"use client";

/**
 * @lumen/avatar — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Radix Avatar + Lumen `name` → initials + deterministic palette API.
 * AvatarGroup stacks with overflow +N pill.
 */
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_CLS: Record<Size, string> = {
  xs: "size-5 text-[10px]",
  sm: "size-6 text-[length:var(--type-11)]",
  md: "size-8 text-[length:var(--type-13)]",
  lg: "size-10 text-[length:var(--type-14)]",
  xl: "size-12 text-[length:var(--type-15)]",
  "2xl": "size-16 text-[length:var(--type-18)]",
};

const SIZE_PX: Record<Size, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
  "2xl": 64,
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
    { bg: "var(--lumen-accent-2)", fg: "var(--lumen-accent-9)" },
    { bg: "var(--lumen-cream-2)", fg: "var(--lumen-cream-9)" },
    { bg: "var(--lumen-amber-2)", fg: "var(--lumen-amber-9)" },
    { bg: "var(--lumen-red-2)", fg: "var(--lumen-red-9)" },
    { bg: "var(--lumen-cream-3)", fg: "var(--lumen-cream-9)" },
    { bg: "var(--lumen-obsidian-2)", fg: "var(--lumen-obsidian-9)" },
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return families[h % families.length];
}

export type AvatarProps = {
  name: string;
  size?: Size;
  src?: string;
  alt?: string;
  badge?: React.ReactNode;
  ring?: boolean;
  className?: string;
};

export function Avatar({ name, size = "md", src, alt, badge, ring, className }: AvatarProps) {
  const palette = paletteFor(name);
  return (
    <span data-slot="avatar" className={cn("relative inline-flex shrink-0", className)}>
      <AvatarPrimitive.Root
        className={cn(
          "inline-flex items-center justify-center rounded-full overflow-hidden",
          SIZE_CLS[size],
          ring && "ring-2 ring-offset-2 ring-offset-[var(--surface-canvas)] ring-[var(--border-default)]",
        )}
      >
        {src && (
          <AvatarPrimitive.Image
            src={src}
            alt={alt ?? name}
            className="size-full object-cover"
          />
        )}
        <AvatarPrimitive.Fallback
          delayMs={src ? 200 : 0}
          className="flex h-full w-full items-center justify-center font-semibold tracking-[var(--tracking-tight)]"
          style={{ background: palette.bg, color: palette.fg }}
        >
          {initials(name)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
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
    <div data-slot="avatar-group" className="inline-flex items-center -space-x-2">
      {visible.map((n) => (
        <Avatar key={n} name={n} size={size} ring />
      ))}
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

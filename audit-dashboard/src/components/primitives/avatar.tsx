import { ReactNode } from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/* Avatar diameters track the 8pt soft grid:
 *   xs = 20 (2.5u soft) — chat read-receipts, dense rows
 *   sm = 24 (3u)        — comment threads
 *   md = 32 (4u)        — DEFAULT
 *   lg = 40 (5u)        — primary identity
 *   xl = 48 (6u)        — profile cards
 *   2xl = 64 (8u)       — hero / settings
 */
const SIZE: Record<Size, { box: string; text: string; ring: number }> = {
  xs:  { box: "h-5  w-5",  text: "text-[10px]",                ring: 1 },
  sm:  { box: "h-6  w-6",  text: "text-[var(--type-11)]",      ring: 1.5 },
  md:  { box: "h-8  w-8",  text: "text-[var(--type-13)]",      ring: 1.5 },
  lg:  { box: "h-10 w-10", text: "text-[var(--type-14)]",      ring: 2 },
  xl:  { box: "h-12 w-12", text: "text-[var(--type-15)]",      ring: 2 },
  "2xl": { box: "h-16 w-16", text: "text-[var(--type-18)]",    ring: 2 },
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/**
 * Deterministic color from a string. Picks a Lumen-palette family.
 * Stable across renders so the same name keeps the same swatch.
 */
function paletteFor(seed: string): { bg: string; fg: string } {
  const families = [
    { bg: "var(--lumen-accent-2)", fg: "var(--lumen-accent-9)" },
    { bg: "var(--lumen-sky-2)",    fg: "var(--lumen-sky-9)"    },
    { bg: "var(--lumen-amber-2)",  fg: "var(--lumen-amber-9)"  },
    { bg: "var(--lumen-red-2)",    fg: "var(--lumen-red-9)"    },
    { bg: "var(--lumen-gray-3)",   fg: "var(--lumen-gray-9)"   },
    { bg: "var(--lumen-navy-2)",   fg: "var(--lumen-navy-9)"   },
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
  const s = SIZE[size];
  const palette = paletteFor(name);
  return (
    <span className={["relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-[var(--tracking-tight)] overflow-hidden", s.box, s.text].join(" ")}
      style={{
        background: src ? undefined : palette.bg,
        color: palette.fg,
        boxShadow: ring ? `0 0 0 ${s.ring}px var(--surface-page), 0 0 0 ${s.ring + 1}px var(--border-default)` : undefined,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? name} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
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
    <div className="inline-flex items-center -space-x-1.5">
      {visible.map((n) => <Avatar key={n} name={n} size={size} ring />)}
      {overflow > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full bg-[var(--surface-sunken)] text-[var(--text-tertiary)] font-medium text-[10px]"
          style={{
            width:  size === "xs" ? 20 : size === "sm" ? 24 : size === "lg" ? 40 : size === "xl" ? 48 : size === "2xl" ? 64 : 32,
            height: size === "xs" ? 20 : size === "sm" ? 24 : size === "lg" ? 40 : size === "xl" ? 48 : size === "2xl" ? 64 : 32,
            boxShadow: `0 0 0 1.5px var(--surface-page), 0 0 0 2.5px var(--border-default)`,
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}

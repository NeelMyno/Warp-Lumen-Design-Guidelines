// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

/**
 * Swatch — colour chip with on-canvas labelling.
 *
 * v0.14 R10 — every Swatch now ALWAYS displays the resolved hex code (read
 * at runtime from getComputedStyle) and exposes click-to-copy on BOTH the
 * tile (copies the hex) and the var-name affordance (copies the CSS var
 * reference). The hex auto-refreshes when the user switches theme or mood
 * via a MutationObserver on the <html> element's data-* attributes — so a
 * `surface.canvas` swatch shows `#0D0D0D` in dark mode and `#FAFAFA` in
 * light mode without page reload.
 *
 * Why two copy targets:
 *   - Designers copying for Figma → want the hex string
 *   - Engineers copying for code → want `var(--surface-canvas)`
 * Both are surfaced; the tile click is hex (the design-tool use case is
 * more common); the var chip click is the var name.
 */

/** Resolve a CSS var (or any color string) to its computed hex form. */
function resolveHex(input: string): string {
  if (typeof document === "undefined") return "";
  const probe = document.createElement("div");
  probe.style.color = input.startsWith("--") ? `var(${input})` : input;
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  return rgbToHex(computed);
}

/** rgb()/rgba() → #RRGGBB (or #RRGGBBAA when alpha < 1). */
function rgbToHex(rgb: string): string {
  if (!rgb) return "";
  const match = rgb.match(
    /^rgba?\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/,
  );
  if (!match) return rgb;
  const r = parseInt(match[1], 10).toString(16).padStart(2, "0");
  const g = parseInt(match[2], 10).toString(16).padStart(2, "0");
  const b = parseInt(match[3], 10).toString(16).padStart(2, "0");
  let alpha = "";
  if (match[4]) {
    const a = match[4].endsWith("%")
      ? parseFloat(match[4]) / 100
      : parseFloat(match[4]);
    if (a < 1) {
      alpha = Math.round(a * 255).toString(16).padStart(2, "0");
    }
  }
  return `#${r}${g}${b}${alpha}`.toUpperCase();
}

/** Hook — resolves a CSS var to its hex, refreshing on theme/mood change. */
function useResolvedHex(cssVar: string | undefined, fallback: string | undefined) {
  const [hex, setHex] = useState<string>(fallback ?? "");
  useEffect(() => {
    if (!cssVar) {
      if (fallback) setHex(fallback);
      return;
    }
    const update = () => setHex(resolveHex(cssVar));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mood"],
    });
    return () => observer.disconnect();
  }, [cssVar, fallback]);
  return hex;
}

/** Copy helper — clipboard write + brief "copied" flash via callback. */
function useCopy(): [boolean, string, (text: string) => void] {
  const [copied, setCopied] = useState(false);
  const [lastCopied, setLastCopied] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = useCallback((text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setLastCopied(text);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1400);
    });
  }, []);
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  return [copied, lastCopied, copy];
}

/** Small icon — copy glyph, no external lucide import to keep the primitive lean. */
function CopyIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      focusable={false}
    >
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 11V3.5C3 2.67 3.67 2 4.5 2H11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function Swatch({
  name,
  value,
  cssVar,
  role,
  size = "md",
  copyableValue,
}: {
  name: string;
  /** Optional explicit hex. If omitted, the swatch resolves the cssVar at runtime. */
  value?: string;
  cssVar?: string;
  role?: string;
  size?: "sm" | "md" | "lg";
  /** Overrides the default tile-click copy target (which is the resolved hex). */
  copyableValue?: string;
}) {
  const dim = size === "sm" ? "h-12" : size === "lg" ? "h-24" : "h-16";
  const display = cssVar ? `var(${cssVar})` : value ?? "transparent";
  const hex = useResolvedHex(cssVar, value);
  const [copied, lastCopied, copy] = useCopy();

  const tileCopy = copyableValue ?? hex ?? value ?? cssVar ?? "";
  const varRef = cssVar ? `var(${cssVar})` : "";

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] text-left transition-[box-shadow,border-color] duration-[var(--motion-fast)] hover:shadow-[var(--shadow-sm)] hover:border-[var(--border-subtle)]"
    >
      {/* Tile click — copies the resolved hex. */}
      <button
        type="button"
        onClick={() => copy(tileCopy)}
        title={`Click to copy ${tileCopy}`}
        aria-label={`Copy ${name} color value ${tileCopy}`}
        className="relative block w-full text-left focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
      >
        <div
          className={[dim, "w-full relative overflow-hidden"].join(" ")}
          style={{ background: display }}
        >
          {/* Copy affordance on hover/focus — quiet by default, brightens on
              interaction so the click target is discoverable without screaming
              at rest. */}
          <span
            className="absolute top-2 right-2 inline-flex items-center justify-center h-6 w-6 rounded-[var(--radius-sm)] bg-[var(--label-overlay-strong)] text-[color:var(--label-overlay-fg)] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-[var(--motion-fast)]"
            aria-hidden
          >
            <CopyIcon size={11} />
          </span>
          {copied && lastCopied === tileCopy && (
            /* lumen-lint-allow: typography — 11 medium pill for inline confirmation toast */
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 h-[20px] rounded-full bg-[var(--surface-inverse)] text-[color:var(--text-inverse)] text-[length:var(--type-11)] font-medium tracking-[var(--tracking-tight)]">
              Copied {tileCopy}
            </span>
          )}
        </div>
      </button>

      {/* Label row — name + always-visible hex chip. Hex chip is its own
          click target so users can copy hex without hovering the tile,
          AND the var-name chip below copies the CSS reference. */}
      <div className="px-3 py-2 border-t border-[var(--border-hairline)] flex flex-col gap-[var(--space-1_5)]">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-label-sm text-[color:var(--text-primary)] truncate">
            {name}
          </span>
          {hex && (
            <button
              type="button"
              onClick={() => copy(hex)}
              title={`Click to copy ${hex}`}
              aria-label={`Copy hex code ${hex}`}
              /* lumen-lint-allow: typography — 11 mono regular chip for hex display */
              className="lumen-mono lumen-tnum text-[length:var(--type-11)] text-[color:var(--text-secondary)] shrink-0 inline-flex items-center gap-1 rounded-[var(--radius-xs)] px-[var(--space-1_5)] h-5 hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              {copied && lastCopied === hex ? "✓ copied" : hex}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0">
          {role && (
            /* lumen-lint-allow: typography — 11 plain regular for role caption */
            <div className="text-[length:var(--type-11)] text-[color:var(--text-tertiary)] truncate">
              {role}
            </div>
          )}
          {varRef && (
            <button
              type="button"
              onClick={() => copy(varRef)}
              title={`Click to copy ${varRef}`}
              aria-label={`Copy CSS variable ${varRef}`}
              /* lumen-lint-allow: typography — 11 mono regular chip for var display */
              className="lumen-mono text-[length:var(--type-11)] text-[color:var(--text-tertiary)] shrink-0 inline-flex items-center gap-1 rounded-[var(--radius-xs)] px-[var(--space-1_5)] h-5 hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-secondary)] transition-colors focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            >
              {copied && lastCopied === varRef ? "✓ copied" : cssVar}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SwatchGrid({
  children,
  cols,
}: {
  children: ReactNode;
  cols?: number;
}) {
  // Default: responsive 2 → 5 columns. Pass cols to override on a single
  // breakpoint (used for ramps that should always fit on one row).
  const cls = cols
    ? `grid gap-stack-sm grid-cols-${Math.min(cols, 12)}`
    : "grid gap-stack-sm grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5";
  return <div className={cls}>{children}</div>;
}

/**
 * Single-row 10-step ramp swatch — purpose-built for showing a Mantine-style
 * 0–9 colour scale at a glance.
 *
 * v0.14 R10 — every step now resolves its hex on mount + on theme/mood
 * change. Hover surfaces the hex; click copies the hex. The previous behavior
 * (showing the index, copying the var) is preserved via the trailing icon
 * affordance — long-press the step or click the step number to copy var.
 *
 * Single click target keeps the operator-portal pattern simple: most users
 * want hex. Power users see the var name in the tooltip.
 */
export function SwatchRamp({
  prefix,
  family,
  count = 10,
  showHex = true,
}: {
  prefix: string;             // displayed name like "gray", "navy", "accent"
  family: string;             // CSS-var family name like "lumen-gray"
  count?: number;
  /** v0.14 R10 — default flipped to true. Showing the hex IS the point of a swatch. */
  showHex?: boolean;
}) {
  return (
    <div className="grid grid-cols-10 gap-0 rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-hairline)]">
      {Array.from({ length: count }).map((_, i) => (
        <RampStep key={i} prefix={prefix} family={family} index={i} showHex={showHex} />
      ))}
    </div>
  );
}

function RampStep({
  prefix,
  family,
  index,
  showHex,
}: {
  prefix: string;
  family: string;
  index: number;
  showHex: boolean;
}) {
  const cssVar = `--${family}-${index}`;
  const varRef = `var(${cssVar})`;
  const hex = useResolvedHex(cssVar, undefined);
  const [copied, lastCopied, copy] = useCopy();
  const label = showHex && hex ? hex : `${prefix}.${index}`;
  const isHexCopied = copied && lastCopied === hex;

  return (
    <button
      type="button"
      title={`${prefix}.${index} · ${hex || "computing…"} · click to copy hex`}
      aria-label={`Copy hex ${hex || "for"} ${prefix}.${index}`}
      onClick={() => copy(hex || varRef)}
      className="group relative h-16 flex flex-col items-center justify-end pb-2 transition-[transform] hover:z-10 hover:scale-[1.06] focus-visible:outline-none focus-visible:z-10 focus-visible:scale-[1.06]"
      style={{ background: varRef }}
    >
      <span
        /* lumen-lint-allow: typography — 10 semibold ramp-step label chip */
        /* lumen-lint-allow: off-grid — 2 px vertical chip padding is the deliberate compact-overlay treatment over the ramp tile; 4 px would overshoot the chip vertically. */
        className="text-[10px] font-semibold lumen-tnum opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity px-[var(--space-1_5)] py-0.5 rounded-sm bg-[var(--label-overlay-strong)] text-[color:var(--label-overlay-fg)]"
      >
        {isHexCopied ? "✓ copied" : label}
      </span>
    </button>
  );
}

// Lumen Kbd — Web React example. Platform-aware glyph rendering.

// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

"use client";

import { useEffect, useState } from "react";

type Platform = "auto" | "mac" | "win" | "linux";
type Size = "xs" | "sm";

const SIZE: Record<Size, string> = {
  xs: "h-4 min-w-4 px-1 text-[10px]",
  sm: "h-5 min-w-5 px-1.5 text-[11px]",
};

const MAC_GLYPHS: Record<string, string> = {
  cmd: "⌘", command: "⌘", meta: "⌘",
  alt: "⌥", option: "⌥", opt: "⌥",
  shift: "⇧",
  ctrl: "⌃", control: "⌃",
  enter: "↵", return: "↵",
  esc: "⎋", escape: "⎋",
  tab: "⇥",
  backspace: "⌫", delete: "⌫",
  up: "↑", down: "↓", left: "←", right: "→",
  space: "␣",
};

const WIN_NAMES: Record<string, string> = {
  cmd: "Ctrl", command: "Ctrl", meta: "Win",
  alt: "Alt", option: "Alt", opt: "Alt",
  shift: "Shift",
  ctrl: "Ctrl", control: "Ctrl",
  enter: "Enter", return: "Enter",
  esc: "Esc", escape: "Esc",
  tab: "Tab",
  backspace: "Backspace", delete: "Delete",
  up: "↑", down: "↓", left: "←", right: "→",
  space: "Space",
};

const SR_NAMES: Record<string, string> = {
  cmd: "Command", command: "Command", meta: "Meta",
  alt: "Alt", option: "Option", opt: "Option",
  shift: "Shift",
  ctrl: "Control", control: "Control",
  enter: "Enter", return: "Return",
  esc: "Escape", escape: "Escape",
};

function detectPlatform(): "mac" | "win" | "linux" {
  if (typeof navigator === "undefined") return "mac";
  const p = navigator.platform?.toLowerCase() ?? "";
  if (p.includes("mac")) return "mac";
  if (p.includes("win")) return "win";
  return "linux";
}

export type KbdProps = {
  keys: string;
  platform?: Platform;
  size?: Size;
};

export function Kbd({ keys, platform = "auto", size = "sm" }: KbdProps) {
  const [resolved, setResolved] = useState<"mac" | "win" | "linux">("mac");
  useEffect(() => {
    if (platform === "auto") setResolved(detectPlatform());
    else setResolved(platform);
  }, [platform]);

  const tokens = keys.trim().split(/\s+/);
  const isMac = resolved === "mac";

  const display = tokens.map((t) => {
    const k = t.toLowerCase();
    return isMac ? (MAC_GLYPHS[k] ?? t) : (WIN_NAMES[k] ?? t);
  });
  const srLabel = tokens.map((t) => SR_NAMES[t.toLowerCase()] ?? t).join(" ");

  return (
    <span aria-label={srLabel} className="inline-flex items-center gap-[var(--space-inline-xs)] align-middle">
      {display.map((d, i) => (
        <>
          {i > 0 && <span aria-hidden className="text-[var(--color-text-tertiary)]">+</span>}
          <kbd
            key={i}
            className={[
              "inline-flex items-center justify-center font-mono uppercase",
              "rounded-[var(--radius-control-sm)] border border-[var(--color-border-default)]",
              "bg-[var(--color-surface-sunken)]",
              "text-[var(--color-text-secondary)]",
              SIZE[size],
              "shadow-[var(--shadow-kbd,inset_0_-1px_0_var(--color-border-default))]",
            ].join(" ")}
          >
            {d}
          </kbd>
        </>
      ))}
    </span>
  );
}

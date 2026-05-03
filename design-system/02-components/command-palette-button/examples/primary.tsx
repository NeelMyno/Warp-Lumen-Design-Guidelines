// Lumen CommandPaletteButton — Web React example (v0.9)
// Search-styled trigger with platform-aware kbd hint.

import { ButtonHTMLAttributes, ReactNode, useEffect, useState } from "react";

type Size = "sm" | "md" | "lg";

export type CommandPaletteButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  hint?: ReactNode;
  shortcutKey?: string;
  size?: Size;
};

const SIZE: Record<Size, string> = { sm: "lumen-btn-sm", md: "lumen-btn-md", lg: "lumen-btn-lg" };

export function CommandPaletteButton({
  hint = "Find a lane, load, customer…",
  shortcutKey = "K",
  size = "md",
  className,
  ...props
}: CommandPaletteButtonProps) {
  const [mod, setMod] = useState("Ctrl");
  useEffect(() => {
    const isMac = typeof navigator !== "undefined" && /Mac|iPad|iPhone|iPod/.test(navigator.userAgent);
    setMod(isMac ? "⌘" : "Ctrl");
  }, []);

  return (
    <button
      type="button"
      {...props}
      className={[
        "lumen-btn lumen-btn-outline",
        SIZE[size],
        "lumen-cmd-button",
        className ?? "",
      ].filter(Boolean).join(" ")}
    >
      <SearchIcon />
      <span style={{ color: "var(--text-tertiary)", flex: 1, textAlign: "left" }}>{hint}</span>
      <span className="lumen-cmd-button-kbd" aria-hidden>
        <kbd>{mod}</kbd>
        <kbd>{shortcutKey}</kbd>
      </span>
    </button>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// Lumen CommandPaletteButton — Web React example (v0.9)
// Search-styled trigger with platform-aware kbd hint.
//
// Icons via lucide-react (the Lumen icon system as of v0.10.2).

import { ButtonHTMLAttributes, ReactNode, useEffect, useState } from "react";
import { Search } from "lucide-react";

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
      <Search size={14} strokeWidth={2} aria-hidden focusable={false} />
      <span style={{ color: "var(--text-tertiary)", flex: 1, textAlign: "left" }}>{hint}</span>
      <span className="lumen-cmd-button-kbd" aria-hidden>
        <kbd>{mod}</kbd>
        <kbd>{shortcutKey}</kbd>
      </span>
    </button>
  );
}

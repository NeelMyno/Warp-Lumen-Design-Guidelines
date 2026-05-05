"use client";

/**
 * v0.9 — CommandPaletteButton
 * ----------------------------------------------------------------------------
 * A search-styled trigger that opens the global command palette. Carries:
 *   - leading search icon
 *   - placeholder-style label ("Find a load…", "Search lanes…")
 *   - trailing keyboard-shortcut chip (⌘ K on macOS, Ctrl K elsewhere)
 *
 * The component is just the trigger — wire the actual command palette via
 * the `onOpen` handler. All operator-grade systems ship this as standard
 * (Linear, Vercel, Notion, Figma, Raycast).
 */

import { ButtonHTMLAttributes, ReactNode, forwardRef, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button as LumenButton } from "./button";

type Size = "sm" | "md" | "lg";

export type CommandPaletteButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** The placeholder hint — shown muted, like a search input. */
  hint?: ReactNode;
  /** The keyboard shortcut. Default: "K" — paired with the platform modifier (⌘ on Mac, Ctrl elsewhere). */
  shortcutKey?: string;
  size?: Size;
};

function platformModifier(): string {
  if (typeof window === "undefined") return "Ctrl";
  const ua = navigator.userAgent || "";
  const isMac = /Mac|iPad|iPhone|iPod/.test(ua);
  return isMac ? "⌘" : "Ctrl";
}

export const CommandPaletteButton = forwardRef<HTMLButtonElement, CommandPaletteButtonProps>(
  function CommandPaletteButton(
    { hint = "Find a lane, load, customer…", shortcutKey = "K", size = "md", className, ...props },
    ref,
  ) {
    const [mod, setMod] = useState("Ctrl");
    useEffect(() => setMod(platformModifier()), []);

    return (
      <LumenButton
        ref={ref}
        intent="outline"
        size={size}
        leadingIcon={<Search aria-hidden />}
        className={cn("lumen-cmd-button", className)}
        {...props}
      >
        <span className="text-[color:var(--text-tertiary)] flex-1 text-left">{hint}</span>
        <span className="lumen-cmd-button-kbd" aria-hidden>
          <kbd>{mod}</kbd>
          <kbd>{shortcutKey}</kbd>
        </span>
      </LumenButton>
    );
  },
);

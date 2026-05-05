"use client";

/**
 * v0.11.13 — Header search-pill that opens the CommandPalette.
 * ----------------------------------------------------------------------------
 * Renders the same search-shaped trigger button the prior shell carried, but
 * now owns:
 *   - palette open state
 *   - global ⌘K / Ctrl+K listener (and the / shortcut, like GitHub / Notion)
 *   - the CommandPalette dialog itself
 *
 * The dashboard-shell is otherwise a server component; this client island keeps
 * the keyboard listener out of the SSR tree.
 */

import { useEffect, useState } from "react";
import { Search } from "./primitives/icon";
import { CommandPalette } from "./primitives/command-palette";

export function CommandPaletteTrigger() {
  const [open, setOpen] = useState(false);

  /* Global keyboard listener.
     Premium signal #1: the palette is reachable from anywhere, with the same
     shortcut that the icon-pill advertises. Failing to ship this is the single
     biggest "rage click" pattern Crawford flags in the Premium Psychology
     piece — visual chrome that lies about being interactive. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      /* ⌘K (mac) / Ctrl+K (other) — always wins, even from inputs. */
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      /* "/" — opens, but only when not already typing in a field.
         GitHub / Notion / Linear convention. */
      if (e.key === "/" && !inEditable && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-auto h-10 px-4 rounded-[var(--radius-full)] border border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 text-[var(--text-tertiary)] text-body-xs hover:border-[var(--border-default)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]/80 transition-[color,background-color,border-color] duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        aria-label="Open command palette"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search Lumen…</span>
        <span className="flex items-center gap-1">
          <kbd className="lumen-kbd">⌘</kbd>
          <kbd className="lumen-kbd">K</kbd>
        </span>
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}

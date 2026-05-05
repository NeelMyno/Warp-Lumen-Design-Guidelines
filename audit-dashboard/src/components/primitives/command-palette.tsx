"use client";

/**
 * v0.11.13 — CommandPalette
 * ----------------------------------------------------------------------------
 * The system's first real micro-interaction with peak weight: pressing ⌘K
 * from anywhere opens a glass-shelled palette over the canvas. Type to filter,
 * arrow-keys to move, Enter to select, Escape to dismiss.
 *
 * Built without `cmdk` to keep the dependency surface flat — the filter is a
 * subsequence-match (cheap, zero-allocation per keystroke at this corpus size).
 * Honors prefers-reduced-motion via the Dialog primitive's data-state hooks.
 *
 * Trust contract — every item is real:
 *   - Routes             → next/link push to /foundations, /library, etc.
 *   - On-page anchors    → location.hash + smooth-scroll
 *   - Theme              → toggles document.documentElement.dataset.theme
 *   - GitHub             → opens repo in new tab
 *
 * Per Premium Psychology audit P0-1: the global search affordance must do
 * something. This component is that something.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ArrowRight, Moon, Sun, ExternalLink, Hash, FileText, Sparkles } from "lucide-react";

import { TABS } from "@/lib/tabs";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ────────────────────────────────  ITEMS  ──────────────────────────────── */

type ItemKind = "route" | "anchor" | "theme" | "external";

type Item = {
  id: string;
  label: string;
  hint?: string;
  kind: ItemKind;
  href?: string;
  hash?: string;
  pathname?: string;
  group: string;
  icon?: React.ReactNode;
  /** Words used for fuzzy match — title + description tokens. */
  searchTokens: string;
};

/* On-page anchors per route, surfaced when the user is on that route. */
const ANCHORS_BY_ROUTE: Record<string, Array<{ hash: string; label: string }>> = {
  "/foundations": [
    { hash: "color", label: "Color" },
    { hash: "typography", label: "Typography" },
    { hash: "spacing", label: "Spacing & grid" },
    { hash: "radius", label: "Radius" },
    { hash: "elevation", label: "Elevation" },
    { hash: "surfaces", label: "Surfaces" },
    { hash: "motion", label: "Motion" },
    { hash: "iconography", label: "Iconography" },
    { hash: "voice", label: "Voice" },
    { hash: "controls", label: "Controls" },
    { hash: "display", label: "Display" },
    { hash: "navigation", label: "Navigation" },
    { hash: "live", label: "Live data" },
  ],
  "/library": [
    { hash: "buttons", label: "Buttons" },
    { hash: "inputs", label: "Inputs" },
    { hash: "selection", label: "Selection" },
    { hash: "feedback", label: "Feedback" },
    { hash: "data", label: "Data display" },
    { hash: "navigation", label: "Navigation" },
    { hash: "overlays", label: "Overlays" },
  ],
};

function buildItems(pathname: string, theme: "light" | "dark"): Item[] {
  const items: Item[] = [];

  /* Routes — every tab is a destination. */
  for (const tab of TABS) {
    items.push({
      id: `route:${tab.slug}`,
      label: tab.label,
      hint: tab.description,
      kind: "route",
      href: tab.href,
      group: "Go to",
      icon: <FileText size={14} aria-hidden />,
      searchTokens: `${tab.label} ${tab.shortLabel} ${tab.description}`.toLowerCase(),
    });
  }

  /* On-page anchors — surface when the user is on the matching route. The
     home redirects to /foundations so we treat / as foundations too. */
  const anchorRoute = pathname === "/" ? "/foundations" : pathname;
  const anchors = ANCHORS_BY_ROUTE[anchorRoute] ?? [];
  for (const a of anchors) {
    items.push({
      id: `anchor:${anchorRoute}:${a.hash}`,
      label: a.label,
      hint: `Section on ${anchorRoute === "/foundations" ? "Foundations" : "Library"}`,
      kind: "anchor",
      hash: a.hash,
      pathname: anchorRoute,
      group: "On this page",
      icon: <Hash size={14} aria-hidden />,
      searchTokens: a.label.toLowerCase(),
    });
  }

  /* Theme — toggle action. */
  const next: "light" | "dark" = theme === "dark" ? "light" : "dark";
  items.push({
    id: "theme:toggle",
    label: `Switch to ${next} mode`,
    hint: "Persists in localStorage",
    kind: "theme",
    group: "System",
    icon: next === "light" ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />,
    searchTokens: `theme dark light mode toggle ${next}`,
  });

  /* External — repo. */
  items.push({
    id: "ext:github",
    label: "View on GitHub",
    hint: "github.com/NeelMyno/Warp-Lumen-Design-Guidelines",
    kind: "external",
    href: "https://github.com/NeelMyno/Warp-Lumen-Design-Guidelines",
    group: "Links",
    icon: <ExternalLink size={14} aria-hidden />,
    searchTokens: "github repo source code external link",
  });

  return items;
}

/* ──────────────────────────────  FUZZY MATCH  ──────────────────────────────
 * Subsequence match — every char of the query appears in order in the
 * search tokens. Score = run-length-bonus + leading-char-bonus. Tiny,
 * predictable, zero deps. */

function fuzzyScore(query: string, target: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = target;
  let score = 0;
  let qi = 0;
  let prevMatch = -2;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 1;
      if (ti === prevMatch + 1) score += 2; /* run bonus */
      if (ti === 0 || t[ti - 1] === " ") score += 1; /* word-start bonus */
      prevMatch = ti;
      qi++;
    }
  }
  if (qi < q.length) return 0; /* not all chars matched */
  return score / Math.max(1, t.length / 8);
}

/* ──────────────────────────────  COMPONENT  ────────────────────────────── */

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  /* Read theme from <html data-theme>. The ThemeToggle component owns the
     authoritative state; we sync once on open. */
  useEffect(() => {
    if (!open) return;
    const t = (document.documentElement.dataset.theme as "light" | "dark" | undefined) ?? "dark";
    setTheme(t);
    setQuery("");
    setActiveIndex(0);
    /* Focus the input on open. The Dialog primitive auto-focuses the first
       focusable child but the input occasionally loses focus to the close button
       on Safari. Re-focusing in a microtask is cheap insurance. */
    queueMicrotask(() => inputRef.current?.focus());
  }, [open]);

  const items = useMemo(() => buildItems(pathname ?? "/", theme), [pathname, theme]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    return items
      .map((item) => ({ item, score: fuzzyScore(query, item.searchTokens) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }, [items, query]);

  /* Reset active index when filter changes. */
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  /* Keep the active item scrolled into view. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-cmd-index="${activeIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, filtered]);

  /* ────  ACTIONS  ──── */
  const handleSelect = useCallback(
    (item: Item) => {
      switch (item.kind) {
        case "route":
          if (item.href) router.push(item.href);
          break;
        case "anchor":
          if (item.pathname && item.hash) {
            if (pathname !== item.pathname) {
              router.push(`${item.pathname}#${item.hash}`);
            } else {
              const target = document.getElementById(item.hash);
              target?.scrollIntoView({ behavior: "smooth", block: "start" });
              history.replaceState(null, "", `#${item.hash}`);
            }
          }
          break;
        case "theme": {
          const next: "light" | "dark" = theme === "dark" ? "light" : "dark";
          document.documentElement.dataset.theme = next;
          window.localStorage.setItem("lumen-theme", next);
          /* Notify ThemeToggle to re-read on its next mount; for now we just
             sync local state so the next open shows the new "Switch to X" item. */
          setTheme(next);
          break;
        }
        case "external":
          if (item.href) window.open(item.href, "_blank", "noopener,noreferrer");
          break;
      }
      /* Theme is the only action that benefits from staying open (so the user
         can immediately inspect the change). All others close. */
      if (item.kind !== "theme") onOpenChange(false);
    },
    [pathname, router, theme, onOpenChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) handleSelect(item);
    } else if (e.key === "Tab") {
      /* Block Tab from leaving the input — the palette's only focusable element. */
      e.preventDefault();
    }
  };

  /* Group items by group, preserving order. */
  const grouped = useMemo(() => {
    const groups: Array<{ group: string; items: Array<{ item: Item; flatIndex: number }> }> = [];
    filtered.forEach((item, flatIndex) => {
      const last = groups[groups.length - 1];
      if (last && last.group === item.group) {
        last.items.push({ item, flatIndex });
      } else {
        groups.push({ group: item.group, items: [{ item, flatIndex }] });
      }
    });
    return groups;
  }, [filtered]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          /* Override the centered Dialog default — anchor near the top like
             Spotlight / Linear / Raycast. */
          "lumen-cmd-palette",
          "p-0 gap-0 max-w-xl border-[var(--border-default)]",
          "top-[18%] translate-y-0",
          "shadow-[var(--shadow-modal)]",
        )}
        onOpenAutoFocus={(e) => {
          /* Defer to our own microtask focus — Radix's auto-focus sometimes
             lands on the close button if it renders first. */
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search and navigate the Lumen design system. Use arrow keys, Enter to select, Escape to close.
        </DialogDescription>

        {/* Input row — search-shaped, no chrome. */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border-hairline)]">
          <Search size={16} aria-hidden className="text-[var(--text-tertiary)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search foundations, components, pages…"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-body-md text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            autoComplete="off"
            spellCheck={false}
            aria-autocomplete="list"
            aria-controls="lumen-cmd-list"
            aria-activedescendant={filtered[activeIndex]?.id}
          />
          <kbd className="lumen-kbd">esc</kbd>
        </div>

        {/* Results list — grouped, scrollable. */}
        <div
          ref={listRef}
          id="lumen-cmd-list"
          role="listbox"
          aria-label="Search results"
          className="max-h-[420px] overflow-y-auto p-2"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <div className="text-body-sm text-[var(--text-tertiary)]">No results for &ldquo;{query}&rdquo;</div>
              <div className="mt-1 text-micro text-[var(--text-tertiary)]">Try a route name (foundations, library) or a section (color, typography).</div>
            </div>
          ) : (
            grouped.map((g) => (
              <div key={g.group} className="mb-2 last:mb-0">
                <div className="px-3 pt-2 pb-1 lumen-mono-cap text-[var(--text-tertiary)] text-micro">
                  {g.group}
                </div>
                {g.items.map(({ item, flatIndex }) => {
                  const isActive = flatIndex === activeIndex;
                  return (
                    <CommandRow
                      key={item.id}
                      item={item}
                      isActive={isActive}
                      flatIndex={flatIndex}
                      onSelect={handleSelect}
                      onHover={() => setActiveIndex(flatIndex)}
                    />
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint row */}
        <div className="flex items-center justify-between px-4 h-10 border-t border-[var(--border-hairline)] text-micro text-[var(--text-tertiary)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="lumen-kbd">↑</kbd>
              <kbd className="lumen-kbd">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="lumen-kbd">↵</kbd>
              <span>select</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-1">
            <Sparkles size={11} aria-hidden style={{ color: "var(--text-accent)" }} />
            <span>Lumen v0.11.13</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ────  CommandRow — individual selectable row. Memo-friendly. ─────── */

function CommandRow({
  item,
  isActive,
  flatIndex,
  onSelect,
  onHover,
}: {
  item: Item;
  isActive: boolean;
  flatIndex: number;
  onSelect: (item: Item) => void;
  onHover: () => void;
}) {
  /* For routes we render a Link so cmd-click etc. work natively; everything
     else is a button (theme toggle, external). The active class controls the
     visual selection state — keyboard nav stays in sync with hover. */
  const content = (
    <span className="flex items-center gap-3 w-full min-w-0">
      <span
        aria-hidden
        className="inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] text-[var(--text-secondary)] shrink-0"
      >
        {item.icon}
      </span>
      <span className="flex flex-col min-w-0 gap-[1px] text-left">
        <span className="text-body-sm text-[var(--text-primary)] truncate">{item.label}</span>
        {item.hint && (
          <span className="text-micro text-[var(--text-tertiary)] truncate">{item.hint}</span>
        )}
      </span>
      <ArrowRight size={13} aria-hidden className="ml-auto text-[var(--text-tertiary)] shrink-0 opacity-0 lumen-cmd-row-arrow" />
    </span>
  );

  const className = cn(
    "lumen-cmd-row",
    "flex items-center gap-2 w-full px-3 h-10 rounded-[var(--radius-md)] cursor-pointer",
    "transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
    isActive
      ? "bg-[var(--surface-tint-accent)] text-[var(--text-primary)]"
      : "hover:bg-[var(--surface-sunken)]",
  );

  if (item.kind === "route" && item.href) {
    return (
      <Link
        href={item.href}
        id={item.id}
        role="option"
        aria-selected={isActive}
        data-cmd-index={flatIndex}
        data-active={isActive || undefined}
        className={className}
        onMouseEnter={onHover}
        onClick={(e) => {
          e.preventDefault();
          onSelect(item);
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      id={item.id}
      role="option"
      aria-selected={isActive}
      data-cmd-index={flatIndex}
      data-active={isActive || undefined}
      className={className}
      onMouseEnter={onHover}
      onClick={() => onSelect(item)}
    >
      {content}
    </button>
  );
}

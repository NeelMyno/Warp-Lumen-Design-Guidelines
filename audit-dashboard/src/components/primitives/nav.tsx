"use client";

import { ReactNode, useState } from "react";
import { Plus, ChevronDown, Search as SearchIcon, Home, Bell, Inbox, Cart, User, Check } from "./icon";
import { FAB as LumenFab } from "./fab";
import { SplitButton as LumenSplitButton } from "./split-button";

/* ─────────────────────────  PAGINATION  ───────────────────────── */
export function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange?: (p: number) => void;
}) {
  const items: (number | "…")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) items.push(i);
  } else {
    items.push(1);
    if (current > 3) items.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) items.push(i);
    if (current < total - 2) items.push("…");
    items.push(total);
  }
  return (
    <nav aria-label="Pagination" className="inline-flex items-center gap-1">
      <PageBtn disabled={current === 1} onClick={() => onChange?.(current - 1)}>‹ Prev</PageBtn>
      {items.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-2 text-[color:var(--text-tertiary)] text-[var(--type-13)]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange?.(p)}
            aria-current={p === current ? "page" : undefined}
            className={[
              "h-8 min-w-[32px] px-3 rounded-[var(--radius-sm)] text-[var(--type-13)] lumen-mono transition-colors",
              p === current
                ? "bg-[var(--surface-inverse)] text-[color:var(--text-inverse)] font-semibold"
                : "text-[color:var(--text-secondary)] hover:bg-[var(--surface-sunken)]",
            ].join(" ")}
          >
            {p}
          </button>
        ),
      )}
      <PageBtn disabled={current === total} onClick={() => onChange?.(current + 1)}>Next ›</PageBtn>
    </nav>
  );
}
function PageBtn({ children, disabled, onClick }: { children: ReactNode; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="h-8 px-3 rounded-[var(--radius-sm)] text-body-xs text-[color:var(--text-secondary)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

/* ─────────────────────────  STEPPER (multi-step indicator)  ─────────────────────────
   v0.11.2 — full rebuild. Prior implementation laid out dot-LEFT + label-RIGHT
   with an absolute connector at top:14px, which placed the connector exactly
   on the label's text baseline → visible strikethrough through "Workspace" /
   "Team" labels (per user screenshot 2026-05-04). Rewritten to the canonical
   wizard pattern:

     ●─────●─────●─────○─────○
     Step  Step  Step  Step  Step
     desc  desc  desc  desc  desc

   Dot row is its own flex container; the connector flows in the same line as
   the dot at items-center, never crossing label text. Labels sit BELOW the
   dot, left-aligned to the dot's left edge (so they read in a familiar
   left-to-right wizard rhythm).

   States:
     done    — Spring-Green filled circle + check glyph; connector to next dot
               is Spring-Green.
     active  — surface-page fill + Spring-Green 2 px ring + soft accent glow;
               connector to next dot is hairline (next isn't earned yet).
     upcoming — surface-sunken fill + hairline border + tertiary text;
                connector is hairline.

   Accessibility:
     - <ol aria-label="Progress"> — semantic ordered list.
     - <li aria-current="step"> on the active step (WAI-ARIA recommended pattern).
     - Visually-hidden status string per step ("complete" / "current" / "upcoming")
       so SR users get linear context. */
export function Stepper({
  steps,
  current,
}: {
  steps: { label: string; description?: string }[];
  current: number;
}) {
  return (
    <ol className="flex w-full items-start" aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const isLast = i === steps.length - 1;
        return (
          <li
            key={s.label}
            className="flex-1 flex flex-col items-start min-w-0"
            aria-current={active ? "step" : undefined}
          >
            {/* Dot + connector live in one row at items-center so the line
                aligns with the dot's vertical center, never with text. */}
            <div className="flex items-center w-full">
              <span
                aria-hidden
                className={[
                  "relative z-[1] h-7 w-7 inline-flex items-center justify-center rounded-full text-[var(--type-12)] font-semibold lumen-mono transition-[background-color,color,box-shadow] duration-[var(--motion-base)] shrink-0",
                  done
                    ? "bg-[var(--lumen-accent-4)] text-[color:var(--lumen-accent-fg)]"
                    : active
                    ? "bg-[var(--surface-page)] text-[color:var(--text-primary)] shadow-[0_0_0_2px_var(--lumen-accent-4),var(--shadow-glow-accent)]"
                    : "bg-[var(--surface-sunken)] text-[color:var(--text-tertiary)] border border-[var(--border-default)]",
                ].join(" ")}
              >
                {done ? <Check size={14} /> : i + 1}
              </span>
              {!isLast && (
                <span
                  aria-hidden
                  className={[
                    "flex-1 h-px mx-2 transition-colors",
                    done
                      ? "bg-[var(--lumen-accent-4)]"
                      : "bg-[var(--border-default)]",
                  ].join(" ")}
                />
              )}
            </div>
            {/* Label + description — sit under the dot, left-aligned to the
                dot's left edge. pr-3 keeps long labels off the next dot. */}
            <div className="mt-3 flex flex-col gap-0.5 pr-3 min-w-0">
              <div
                className={[
                  "text-[var(--type-13)] font-medium tracking-[var(--tracking-tight)] truncate",
                  active
                    ? "text-[color:var(--text-primary)]"
                    : done
                    ? "text-[color:var(--text-secondary)]"
                    : "text-[color:var(--text-tertiary)]",
                ].join(" ")}
              >
                {s.label}
              </div>
              {s.description && (
                <div className="text-body-xs text-[color:var(--text-tertiary)] leading-[var(--leading-snug)] truncate">
                  {s.description}
                </div>
              )}
            </div>
            <span className="sr-only">
              {done
                ? `Step ${i + 1} of ${steps.length}, complete.`
                : active
                ? `Step ${i + 1} of ${steps.length}, current.`
                : `Step ${i + 1} of ${steps.length}, upcoming.`}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ─────────────────────────  ANCHOR LINKS / TOC  ───────────────────────── */
export function AnchorList({
  items,
}: {
  items: { id: string; label: string; level?: 1 | 2 }[];
}) {
  return (
    <ul className="flex flex-col gap-[var(--space-1_5)]">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            className={[
              "block text-[var(--type-12)] tracking-[var(--tracking-tight)] transition-colors",
              i.level === 2 ? "pl-3 text-[color:var(--text-tertiary)] hover:text-[color:var(--text-secondary)]" : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
            ].join(" ")}
          >
            {i.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ─────────────────────────  BREADCRUMB (extended)  ───────────────────────── */
// (existing /breadcrumb.tsx provides the simple version; library shows variants)

/* ─────────────────────────  MENU (popover content)  ───────────────────────── */
export function MenuList({ items }: { items: ({ kind?: "item" | "divider" | "label"; label?: string; shortcut?: string; danger?: boolean; icon?: ReactNode })[] }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-popover)] border border-[var(--border-default)] shadow-[var(--shadow-popover)] p-1 min-w-[200px]">
      {items.map((it, i) => {
        if (it.kind === "divider") return <div key={i} className="my-1 h-px bg-[var(--border-hairline)]" />;
        if (it.kind === "label") return <div key={i} className="px-2 py-1 lumen-eyebrow text-[10px]">{it.label}</div>;
        return (
          <button
            key={i}
            type="button"
            className={[
              "w-full flex items-center justify-between gap-3 px-2 py-[var(--space-1_5)] rounded-[var(--radius-sm)] text-[var(--type-13)]",
              it.danger ? "text-[color:var(--lumen-red-7)] hover:bg-[var(--lumen-red-0)]" : "text-[color:var(--text-primary)] hover:bg-[var(--surface-sunken)]",
            ].join(" ")}
          >
            <span className="flex items-center gap-2 min-w-0">
              {it.icon && <span className="text-[color:var(--text-tertiary)] shrink-0">{it.icon}</span>}
              <span className="truncate">{it.label}</span>
            </span>
            {it.shortcut && <span className="lumen-kbd">{it.shortcut}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  CONTEXT MENU (right-click)  ───────────────────────── */
// rendered statically in library

/* ─────────────────────────  MEGA MENU  ───────────────────────── */
export function MegaMenu() {
  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--surface-popover)] border border-[var(--border-default)] shadow-[var(--shadow-popover)] p-5 w-[640px] grid grid-cols-3 gap-5">
      <MegaCol title="By role" links={["Brokers", "Carriers", "Shippers", "Operations"]} />
      <MegaCol title="By need" links={["LTL & FTL rates", "Multi-stop quoting", "Freight audit", "Document AI"]} />
      <div className="rounded-[var(--radius-md)] bg-[var(--surface-tint-accent)] p-4 flex flex-col justify-between">
        <div>
          <div className="lumen-eyebrow text-[10px] mb-1">New</div>
          <div className="text-heading-h5">Lane intelligence v3</div>
          <p className="text-[var(--type-12)] text-[color:var(--text-secondary)] mt-1 leading-[var(--leading-snug)]">
            Real-time spot rates from 12,000 carriers — now with confidence scores.
          </p>
        </div>
        <a className="lumen-link text-[var(--type-12)] mt-3">See what's new →</a>
      </div>
    </div>
  );
}
function MegaCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="lumen-eyebrow text-[10px] mb-2">{title}</div>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l}>
            <a className="block text-body-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────  TOP NAVBAR  ───────────────────────── */
export function NavbarDemo() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] overflow-hidden">
      <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border-hairline)]">
        <div className="flex items-center gap-6">
          <div className="lumen-mono text-[var(--type-13)] font-bold tracking-[-0.02em]">warp.</div>
          <nav className="hidden sm:flex items-center gap-1">
            {["Lanes", "Quotes", "Shipments", "Carriers", "Reports"].map((l, i) => (
              <a
                key={l}
                className={[
                  "h-8 px-3 inline-flex items-center rounded-[var(--radius-sm)] text-[var(--type-13)] tracking-[var(--tracking-tight)] transition-colors",
                  i === 0 ? "bg-[var(--surface-sunken)] text-[color:var(--text-primary)] font-medium" : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                ].join(" ")}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex h-8 items-center gap-2 px-3 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-sunken)] text-[var(--type-12)] text-[color:var(--text-tertiary)]">
            <SearchIcon size={13} /> Search
            <span className="lumen-kbd ml-2">⌘K</span>
          </span>
          <button aria-label="Notifications" className="h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--surface-sunken)] text-[color:var(--text-secondary)]">
            <Bell size={15} />
          </button>
          <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-[var(--lumen-obsidian-9)] text-white text-[var(--type-12)] lumen-mono font-semibold">NT</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  SIDEBAR (simulation)  ───────────────────────── */
export function SidebarDemo() {
  const items = [
    { label: "Overview", icon: <Home size={14} />, count: undefined as number | undefined, active: true },
    { label: "Inbox", icon: <Inbox size={14} />, count: 12 },
    { label: "Lanes", icon: undefined as ReactNode | undefined, count: undefined },
    { label: "Quotes", icon: undefined, count: 3 },
    { label: "Shipments", icon: undefined, count: undefined },
  ];
  return (
    <div className="w-[224px] rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-3 flex flex-col gap-3">
      <div className="flex items-center gap-2 h-10 px-2">
        <span className="h-6 w-6 rounded-full bg-[var(--lumen-accent-4)]" />
        <span className="text-heading-h6">Acme Logistics</span>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((i) => (
          <button
            key={i.label}
            className={[
              "w-full h-8 px-2 inline-flex items-center justify-between rounded-[var(--radius-sm)] text-[var(--type-13)] transition-colors",
              i.active ? "bg-[var(--surface-sunken)] text-[color:var(--text-primary)]" : "text-[color:var(--text-secondary)] hover:bg-[var(--surface-sunken)]",
            ].join(" ")}
          >
            <span className="flex items-center gap-2">
              {i.icon && <span className="text-[color:var(--text-tertiary)]">{i.icon}</span>}
              <span>{i.label}</span>
            </span>
            {i.count !== undefined && (
              <span className="text-[var(--type-11)] lumen-mono text-[color:var(--text-tertiary)]">{i.count}</span>
            )}
          </button>
        ))}
      </div>
      <div className="lumen-eyebrow text-[10px] mt-2 px-2">Saved views</div>
      <div className="flex flex-col gap-1">
        {["High-priority lanes", "TX → CA"].map((l) => (
          <button key={l} className="w-full h-7 px-2 inline-flex items-center rounded-[var(--radius-sm)] text-[var(--type-12)] text-[color:var(--text-tertiary)] hover:bg-[var(--surface-sunken)] transition-colors">
            <span className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-full bg-[var(--lumen-amber-4)] mr-2" /> {l}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  TAB BAR (vs InlineTabs — this is the segmented underline tab)  ───────────────────────── */
export function TabBar({
  value,
  onChange,
  tabs,
}: {
  value: string;
  onChange: (v: string) => void;
  tabs: { value: string; label: string; count?: number }[];
}) {
  return (
    <div className="border-b border-[var(--border-hairline)] flex items-center gap-1">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-current={active ? "page" : undefined}
            onClick={() => onChange(t.value)}
            className={[
              "relative h-10 px-3 text-[var(--type-13)] tracking-[var(--tracking-tight)] inline-flex items-center gap-2 transition-colors",
              active ? "text-[color:var(--text-primary)] font-medium" : "text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]",
            ].join(" ")}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={["min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full text-[10px] lumen-mono", active ? "bg-[var(--surface-inverse)] text-[color:var(--text-inverse)]" : "bg-[var(--surface-sunken)] text-[color:var(--text-tertiary)]"].join(" ")}>{t.count}</span>
            )}
            {active && <span className="absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-[var(--lumen-accent-5)]" />}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  BOTTOM NAVIGATION (mobile)  ───────────────────────── */
export function BottomNav({ active = "home" }: { active?: string }) {
  const items = [
    { value: "home", label: "Home", icon: <Home size={18} /> },
    { value: "search", label: "Search", icon: <SearchIcon size={18} /> },
    { value: "cart", label: "Cart", icon: <Cart size={18} />, badge: "2" },
    { value: "you", label: "You", icon: <User size={18} /> },
  ];
  return (
    <nav role="navigation" aria-label="Bottom navigation" className="bg-[var(--surface-raised)] border-t border-[var(--border-hairline)] flex items-center justify-around h-14">
      {items.map((i) => {
        const isActive = i.value === active;
        return (
          <button
            key={i.value}
            type="button"
            aria-label={i.label}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-col items-center gap-1 relative"
          >
            <span className={["h-6 w-6 inline-flex items-center justify-center", isActive ? "text-[color:var(--text-primary)]" : "text-[color:var(--text-tertiary)]"].join(" ")}>
              {i.icon}
              {i.badge && (
                <span className="absolute -top-[2px] right-2 min-w-[14px] h-[14px] px-1 inline-flex items-center justify-center rounded-full bg-[var(--lumen-red-6)] text-white text-[9px] lumen-mono font-semibold">{i.badge}</span>
              )}
            </span>
            <span className={["text-[10px] tracking-[var(--tracking-wide)]", isActive ? "text-[color:var(--text-primary)] font-medium" : "text-[color:var(--text-tertiary)]"].join(" ")}>
              {i.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/* ─────────────────────────  FAB  ─────────────────────────
   v0.9 — Inline FAB now wraps the formal FAB primitive so the library demo
   and the canonical contract render identically. The label prop is forwarded
   as aria-label per v0.9 IconButton convention. */
export function FAB({ icon = <Plus size={18} />, label = "Compose" }: { icon?: ReactNode; label?: string }) {
  return (
    <LumenFab aria-label={label} intent="primary" size="xl">
      {icon}
    </LumenFab>
  );
}

/* ─────────────────────────  SPLIT BUTTON  ─────────────────────────
   v0.9 — Inline SplitButton now wraps the formal SplitButton primitive plus a
   local popover for the menu options (the formal primitive doesn't ship a menu
   — that's the consumer's job). */
export function SplitButton({ primary = "Save", options = ["Save and continue", "Save as draft", "Discard"] }: { primary?: string; options?: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-flex">
      <LumenSplitButton
        intent="primary"
        size="md"
        menuLabel="More save options"
        onMenuOpen={() => setOpen((s) => !s)}
      >
        {primary}
      </LumenSplitButton>
      {open && (
        <div className="absolute z-[var(--z-overlay)] right-0 top-full mt-1 min-w-[200px] rounded-[var(--radius-md)] bg-[var(--surface-popover)] border border-[var(--border-default)] shadow-[var(--shadow-popover)] p-1">
          {options.map((o) => (
            <button key={o} className="w-full text-left px-3 py-[var(--space-1_5)] rounded-[var(--radius-sm)] text-[var(--type-13)] text-[color:var(--text-primary)] hover:bg-[var(--surface-sunken)]">{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  COMMAND PALETTE (visual)  ───────────────────────── */
type PaletteItem =
  | { kind: "label"; label: string }
  | { kind: "divider" }
  | { kind: "item"; label: string; shortcut?: string; icon?: ReactNode };

export function CommandPalette() {
  const items: PaletteItem[] = [
    { kind: "label", label: "Quick actions" },
    { kind: "item", label: "New shipment", shortcut: "⌘N", icon: <Plus size={14} /> },
    { kind: "item", label: "Find a lane", shortcut: "⌘L", icon: <SearchIcon size={14} /> },
    { kind: "item", label: "Open inbox", shortcut: "G I", icon: <Inbox size={14} /> },
    { kind: "divider" },
    { kind: "label", label: "Recent" },
    { kind: "item", label: "Lane TX-CA-014" },
    { kind: "item", label: "Quote 3,442 — Sterling LTL" },
    { kind: "item", label: "Customer Estes Express" },
  ];
  return (
    <div className="w-[480px] rounded-[var(--radius-xl)] bg-[var(--surface-popover)] border border-[var(--border-default)] shadow-[var(--shadow-modal)] overflow-hidden">
      <div className="h-12 px-3 flex items-center gap-2 border-b border-[var(--border-hairline)]">
        <SearchIcon size={15} className="text-[color:var(--text-tertiary)]" />
        <input
          placeholder="Search lanes, quotes, customers, settings…"
          className="flex-1 bg-transparent text-[var(--type-13)] focus:outline-none placeholder:text-[color:var(--text-tertiary)]"
        />
        <span className="lumen-kbd">esc</span>
      </div>
      <div className="p-1 max-h-[280px] overflow-auto">
        {items.map((it, i) => {
          if (it.kind === "divider") return <div key={i} className="my-1 h-px bg-[var(--border-hairline)] mx-2" />;
          if (it.kind === "label") return <div key={i} className="px-3 py-[var(--space-1_5)] lumen-eyebrow text-[10px]">{it.label}</div>;
          const isFirst = i === 1;
          return (
            <div
              key={i}
              className={[
                "w-full flex items-center justify-between px-3 py-[var(--space-1_5)] rounded-[var(--radius-sm)] text-[var(--type-13)] cursor-pointer",
                isFirst ? "bg-[var(--surface-sunken)] text-[color:var(--text-primary)]" : "text-[color:var(--text-secondary)] hover:bg-[var(--surface-sunken)]",
              ].join(" ")}
            >
              <span className="flex items-center gap-2">
                {it.icon && <span className="text-[color:var(--text-tertiary)]">{it.icon}</span>}
                {it.label}
              </span>
              {it.shortcut && <span className="lumen-kbd">{it.shortcut}</span>}
            </div>
          );
        })}
      </div>
      <div className="px-3 h-10 flex items-center gap-3 border-t border-[var(--border-hairline)] text-[var(--type-11)] text-[color:var(--text-tertiary)]">
        <span className="flex items-center gap-1"><span className="lumen-kbd">↑</span><span className="lumen-kbd">↓</span> navigate</span>
        <span className="flex items-center gap-1"><span className="lumen-kbd">⏎</span> select</span>
        <span className="ml-auto">Lumen Command</span>
      </div>
    </div>
  );
}

/* ─────────────────────────  FOOTER  ───────────────────────── */
export function FooterDemo() {
  return (
    <footer className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-6">
      <div className="grid gap-8 md:grid-cols-[1.4fr_repeat(3,_1fr)]">
        <div>
          <div className="lumen-mono text-[var(--type-15)] font-bold tracking-[-0.02em]">warp.</div>
          <p className="text-[var(--type-12)] text-[color:var(--text-tertiary)] mt-3 max-w-[36ch] leading-[var(--leading-snug)]">
            The instrument panel for North-American freight. SOC 2 Type II · ISO 27001 · DOT MC-1077745.
          </p>
        </div>
        <FCol title="Product" links={["Lanes", "Quotes", "Shipments", "API"]} />
        <FCol title="Company" links={["About", "Customers", "Press", "Careers"]} />
        <FCol title="Resources" links={["Status", "Docs", "Trust", "Legal"]} />
      </div>
      <div className="mt-8 pt-5 border-t border-[var(--border-hairline)] flex items-center justify-between text-[var(--type-11)] text-[color:var(--text-tertiary)]">
        <span>© 2026 Warp Inc. All rights reserved.</span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-[var(--space-1_5)]"><span className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-full bg-[var(--lumen-accent-5)]" /> All systems operational</span>
        </div>
      </div>
    </footer>
  );
}
function FCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="lumen-eyebrow text-[10px] mb-3">{title}</div>
      <ul className="flex flex-col gap-[var(--space-1_5)]">
        {links.map((l) => <li key={l}><a className="text-[var(--type-12)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors">{l}</a></li>)}
      </ul>
    </div>
  );
}

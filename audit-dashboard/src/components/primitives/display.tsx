"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, Check, X, Plus, Search as SearchIcon } from "./icon";

/* ─────────────────────────  TAG / CHIP  ───────────────────────── */
type TagTone = "neutral" | "accent" | "info" | "warn" | "danger" | "success";
const TAG_TONE: Record<TagTone, string> = {
  neutral: "bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border-hairline)]",
  accent: "bg-[var(--lumen-accent-1)] text-[var(--lumen-accent-8)] border-[color-mix(in_oklab,var(--lumen-accent-4)_30%,transparent)]",
  info: "bg-[var(--lumen-cream-0)] text-[var(--lumen-cream-7)] border-[var(--lumen-cream-2)]",
  warn: "bg-[var(--lumen-amber-0)] text-[var(--lumen-amber-7)] border-[var(--lumen-amber-2)]",
  danger: "bg-[var(--lumen-red-0)] text-[var(--lumen-red-7)] border-[var(--lumen-red-2)]",
  success: "bg-[#ecfdf3] text-[var(--lumen-accent-8)] border-[var(--lumen-accent-2)]",
};
export function Tag({
  children,
  tone = "neutral",
  onRemove,
}: {
  children: ReactNode;
  tone?: TagTone;
  onRemove?: () => void;
}) {
  return (
    <span className={["inline-flex items-center gap-1 h-6 px-2 rounded-[var(--radius-full)] text-[var(--type-12)] border", TAG_TONE[tone]].join(" ")}>
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="Remove tag" className="opacity-60 hover:opacity-100 transition-opacity">
          <X size={10} />
        </button>
      )}
    </span>
  );
}

/* ─────────────────────────  STATUS PILL / DOT  ───────────────────────── */
export function StatusPill({
  tone = "neutral",
  children,
  pulse,
}: {
  tone?: TagTone;
  children: ReactNode;
  pulse?: boolean;
}) {
  const dotColor: Record<TagTone, string> = {
    neutral: "var(--lumen-cream-5)",
    accent: "var(--lumen-accent-5)",
    info: "var(--lumen-cream-5)",
    warn: "var(--lumen-amber-5)",
    danger: "var(--lumen-red-5)",
    success: "var(--lumen-accent-6)",
  };
  return (
    <span className={["inline-flex items-center gap-[var(--space-1_5)] h-6 px-2 rounded-[var(--radius-full)] text-[var(--type-12)] font-medium border", TAG_TONE[tone]].join(" ")}>
      <span className="relative inline-flex">
        <span className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-full" style={{ background: dotColor[tone] }} />
        {pulse && (
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: dotColor[tone], animation: "lumen-pulse-ring 1.6s ease-out infinite" }}
            aria-hidden
          />
        )}
      </span>
      {children}
      <style>{`@keyframes lumen-pulse-ring { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(2.4); opacity: 0; } }`}</style>
    </span>
  );
}

/* ─────────────────────────  TREND INDICATOR  ───────────────────────── */
export function Trend({ delta, suffix = "" }: { delta: number; suffix?: string }) {
  const up = delta >= 0;
  return (
    <span
      className={[
        "inline-flex items-center gap-1 h-5 px-[var(--space-1_5)] rounded-[var(--radius-full)] text-[var(--type-11)] font-medium lumen-mono",
        up ? "bg-[#ecfdf3] text-[var(--lumen-accent-8)]" : "bg-[var(--lumen-red-0)] text-[var(--lumen-red-7)]",
      ].join(" ")}
    >
      <span aria-hidden>{up ? "▲" : "▼"}</span>
      {Math.abs(delta).toFixed(1)}{suffix || "%"}
    </span>
  );
}

/* ─────────────────────────  SEVERITY / PRIORITY  ───────────────────────── */
export function Severity({ level }: { level: "low" | "med" | "high" | "critical" }) {
  const colors: Record<typeof level, [string, string, string]> = {
    low: ["var(--lumen-cream-1)", "var(--lumen-cream-7)", "Low"],
    med: ["var(--lumen-amber-1)", "var(--lumen-amber-7)", "Medium"],
    high: ["var(--lumen-amber-2)", "var(--lumen-amber-8)", "High"],
    critical: ["var(--lumen-red-1)", "var(--lumen-red-7)", "Critical"],
  };
  const [bg, fg, label] = colors[level];
  return (
    <span className="inline-flex items-center gap-[var(--space-1_5)] px-2 h-5 rounded-[4px] text-[var(--type-11)] font-semibold uppercase tracking-[var(--tracking-wider)]" style={{ background: bg, color: fg }}>
      <span className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-[1px]" style={{ background: fg }} />
      {label}
    </span>
  );
}

/* ─────────────────────────  ACCORDION (shadcn Accordion)  ───────────────────────── */
import {
  Accordion as ShadcnAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] overflow-hidden">
      <ShadcnAccordion type="single" collapsible defaultValue="item-0" className="divide-y divide-[var(--border-hairline)]">
        {items.map((it, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-b-0 px-4">
            <AccordionTrigger className="text-[var(--type-13)] font-medium text-[var(--text-primary)] hover:no-underline">
              {it.title}
            </AccordionTrigger>
            <AccordionContent className="text-body-xs text-[var(--text-secondary)] leading-[var(--leading-snug)]">
              {it.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </ShadcnAccordion>
    </div>
  );
}

/* ─────────────────────────  EMPTY STATE  ───────────────────────── */
export function EmptyState({
  illustration = <DefaultEmpty />,
  title,
  description,
  action,
}: {
  illustration?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-12 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-[var(--surface-raised)]">
      <div className="mb-4">{illustration}</div>
      <div className="text-heading-h5 text-[var(--text-primary)]">{title}</div>
      {description && (
        <p className="mt-2 max-w-[42ch] text-body-xs text-[var(--text-tertiary)] leading-[var(--leading-snug)]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
function DefaultEmpty() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
      <rect x="6" y="14" width="44" height="32" rx="4" stroke="var(--border-default)" strokeWidth="1.5" />
      <rect x="12" y="22" width="20" height="3" rx="1.5" fill="var(--border-default)" />
      <rect x="12" y="29" width="32" height="3" rx="1.5" fill="var(--border-hairline)" />
      <rect x="12" y="36" width="14" height="3" rx="1.5" fill="var(--border-hairline)" />
      <circle cx="44" cy="14" r="6" fill="var(--lumen-accent-4)" opacity="0.18" />
      <circle cx="44" cy="14" r="3" fill="var(--lumen-accent-5)" />
    </svg>
  );
}

/* ─────────────────────────  CODE BLOCK  ───────────────────────── */
export function CodeBlock({
  code,
  language = "ts",
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-sunken)] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-[var(--space-1_5)] border-b border-[var(--border-hairline)]">
        <span className="lumen-eyebrow text-[10px]">{language}</span>
        <button
          onClick={() => {
            if (typeof navigator !== "undefined") {
              navigator.clipboard?.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }
          }}
          className="h-6 px-2 inline-flex items-center gap-1 rounded-[var(--radius-sm)] text-[var(--type-11)] uppercase tracking-[var(--tracking-wider)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
        >
          {copied ? <Check size={11} /> : null}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-3 lumen-mono text-[var(--type-12)] text-[var(--text-primary)] overflow-x-auto leading-[var(--leading-normal)]">
        {code}
      </pre>
    </div>
  );
}

/* ─────────────────────────  LIST  ───────────────────────── */
export function ListGroup({ items, dividers = true }: { items: { title: string; meta?: string; trailing?: ReactNode; description?: string }[]; dividers?: boolean }) {
  return (
    <div className={["rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] overflow-hidden", dividers ? "divide-y divide-[var(--border-hairline)]" : ""].join(" ")}>
      {items.map((i, idx) => (
        <div key={idx} className="flex items-center justify-between gap-4 px-4 h-12">
          <div className="min-w-0 flex flex-col">
            <span className="text-[var(--type-13)] text-[var(--text-primary)] truncate">{i.title}</span>
            {i.description && <span className="text-[var(--type-12)] text-[var(--text-tertiary)] truncate">{i.description}</span>}
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[var(--type-12)] text-[var(--text-tertiary)] lumen-mono">
            {i.meta && <span>{i.meta}</span>}
            {i.trailing}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────  TABLE  ───────────────────────── */
export function DataTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string; align?: "left" | "right" }[];
  rows: Record<string, ReactNode>[];
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] overflow-hidden">
      <div className="flex items-center justify-between px-4 h-12 border-b border-[var(--border-hairline)]">
        <div className="flex items-center gap-2">
          <input className="h-8 px-3 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-sunken)] text-[var(--type-12)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-focus)] focus:shadow-[var(--shadow-focus)] w-[200px]" placeholder="Filter rows…" />
          <button className="h-8 px-2 rounded-[var(--radius-sm)] text-[var(--type-12)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]">+ Add filter</button>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[var(--type-11)] text-[var(--text-tertiary)] lumen-mono">{rows.length} rows</span>
          <button className="h-8 px-2 rounded-[var(--radius-sm)] text-[var(--type-12)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]">⋯</button>
        </div>
      </div>
      <table className="w-full text-[var(--type-13)]">
        <thead>
          <tr className="border-b border-[var(--border-hairline)] bg-[var(--surface-sunken)]/50">
            {columns.map((c) => (
              <th
                key={c.key}
                className={["px-4 h-10 text-[var(--type-11)] font-medium text-[var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]", c.align === "right" ? "text-right" : "text-left"].join(" ")}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[var(--border-hairline)] last:border-0 hover:bg-[var(--surface-sunken)]/40 transition-colors">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={["px-4 h-12 text-[var(--text-primary)]", c.align === "right" ? "text-right lumen-mono" : ""].join(" ")}
                >
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────  KANBAN  ───────────────────────── */
export function Kanban() {
  const cols = [
    { id: "todo", title: "To do", count: 4, items: [
      { title: "Audit Sterling LTL contract", meta: "Due Mon" },
      { title: "Configure spot rate alerts", meta: "Estes Express" },
      { title: "QA dashboard release v1.4", meta: "Eng" },
      { title: "Negotiate fuel surcharge", meta: "Old Dominion" },
    ] },
    { id: "doing", title: "In progress", count: 3, items: [
      { title: "Lane TX→CA spot quote", meta: "Quote 3,442" },
      { title: "Carrier onboarding — Saia", meta: "Jordan" },
      { title: "Driver vetting — 6 carriers", meta: "Compliance" },
    ] },
    { id: "review", title: "In review", count: 2, items: [
      { title: "Rate update for ABF Freight", meta: "Pricing" },
      { title: "Q2 carrier scorecard", meta: "Ops" },
    ] },
    { id: "done", title: "Done", count: 5, items: [
      { title: "Multi-stop quoting v2", meta: "Shipped" },
      { title: "Saia integration", meta: "Live" },
    ] },
  ];
  return (
    <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
      {cols.map((col) => (
        <div key={col.id} className="rounded-[var(--radius-lg)] bg-[var(--surface-sunken)] p-2 border border-[var(--border-hairline)]">
          <div className="flex items-center justify-between px-2 py-[var(--space-1_5)]">
            <div className="flex items-center gap-2">
              <span className="text-[var(--type-12)] font-semibold tracking-[var(--tracking-tight)]">{col.title}</span>
              <span className="text-[var(--type-11)] lumen-mono text-[var(--text-tertiary)]">{col.count}</span>
            </div>
            <button className="h-6 w-6 inline-flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:bg-[var(--surface-raised)]"><Plus size={12} /></button>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {col.items.map((it) => (
              <div key={it.title} className="rounded-[var(--radius-md)] bg-[var(--surface-raised)] border border-[var(--border-hairline)] p-3 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-shadow">
                <div className="text-[var(--type-13)] tracking-[var(--tracking-tight)] text-[var(--text-primary)] leading-[var(--leading-snug)]">{it.title}</div>
                <div className="text-[var(--type-11)] text-[var(--text-tertiary)] mt-2 lumen-mono">{it.meta}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────  TREE VIEW  ───────────────────────── */
export function TreeView() {
  type Node = { label: string; children?: Node[] };
  const tree: Node[] = [
    { label: "design-system", children: [
      { label: "00-foundations", children: [{ label: "principles.md" }, { label: "voice-and-tone.md" }] },
      { label: "01-tokens", children: [{ label: "primitives" }, { label: "semantic" }] },
      { label: "02-components", children: [{ label: "button" }, { label: "card" }, { label: "stat" }] },
    ] },
    { label: "audit-dashboard", children: [{ label: "src/app" }, { label: "src/components" }] },
  ];
  function Branch({ node, depth = 0, expanded = true }: { node: Node; depth?: number; expanded?: boolean }) {
    const [open, setOpen] = useState(expanded);
    const hasKids = !!node.children?.length;
    return (
      <div>
        <div
          className={["flex items-center gap-1 h-7 px-2 rounded-[var(--radius-sm)] cursor-pointer hover:bg-[var(--surface-sunken)] text-body-xs text-[var(--text-secondary)] lumen-mono"].join(" ")}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => hasKids && setOpen((s) => !s)}
        >
          {hasKids ? (
            <span className={["text-[var(--text-tertiary)] inline-block transition-transform duration-[var(--motion-fast)]", open ? "" : "-rotate-90"].join(" ")}>
              <ChevronDown size={12} />
            </span>
          ) : (
            <span className="w-3" />
          )}
          {hasKids ? <FolderIcon /> : <FileIcon />}
          <span>{node.label}</span>
        </div>
        {hasKids && open && (
          <div>
            {node.children!.map((c, i) => <Branch key={i} node={c} depth={depth + 1} expanded={depth < 1} />)}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-1 max-w-[320px]">
      {tree.map((n, i) => <Branch key={i} node={n} />)}
    </div>
  );
}
function FolderIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--lumen-amber-3)" aria-hidden><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
}
function FileIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" aria-hidden><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M14 3l6 6h-6V3z" /></svg>;
}

/* ─────────────────────────  TIMELINE  ───────────────────────── */
export function Timeline() {
  const events = [
    { time: "10:42 AM", title: "Quote sent", actor: "Lumen AI", tone: "accent" as const },
    { time: "10:38 AM", title: "Customer requested rate", actor: "Sterling LTL" },
    { time: "10:31 AM", title: "Lane created", actor: "Daniel S." },
    { time: "Yesterday", title: "Carrier scorecard updated", actor: "System" },
  ];
  return (
    <ol className="relative pl-6 border-l border-[var(--border-default)]">
      {events.map((e, i) => (
        <li key={i} className="pb-5 last:pb-0">
          <span
            className={[
              "absolute -left-[6px] mt-1 h-3 w-3 rounded-full border-2 border-[var(--surface-canvas)]",
              e.tone === "accent" ? "bg-[var(--lumen-accent-5)]" : "bg-[var(--border-strong)]",
            ].join(" ")}
          />
          <div className="flex items-center gap-2">
            <span className="text-[var(--type-13)] font-medium tracking-[var(--tracking-tight)]">{e.title}</span>
          </div>
          <div className="text-[var(--type-12)] text-[var(--text-tertiary)] lumen-mono mt-1">
            {e.actor} · {e.time}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ─────────────────────────  CAROUSEL (snap)  ───────────────────────── */
export function Carousel({ items }: { items: { title: string; subtitle?: string; bg?: string }[] }) {
  return (
    <div className="overflow-hidden">
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 scroll-smooth"
        style={{ scrollbarWidth: "thin" }}>
        {items.map((it, i) => (
          <div key={i} className="snap-start shrink-0 w-[260px] rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-hairline)] bg-[var(--surface-raised)] shadow-[var(--shadow-sm)]">
            <div className="h-32" style={{ background: it.bg ?? "var(--lumen-obsidian-7)" }} />
            <div className="p-3">
              <div className="text-[var(--type-13)] font-medium tracking-[var(--tracking-tight)]">{it.title}</div>
              {it.subtitle && <div className="text-[var(--type-12)] text-[var(--text-tertiary)] mt-1">{it.subtitle}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  GAUGE  ───────────────────────── */
export function Gauge({ value = 72, label = "Capacity" }: { value?: number; label?: string }) {
  const a = Math.PI;
  const r = 38;
  const cx = 50, cy = 50;
  const startX = cx - r, startY = cy;
  const endX = cx + r, endY = cy;
  const filled = Math.min(1, Math.max(0, value / 100));
  const filledRad = a * filled;
  const fx = cx + r * Math.cos(Math.PI - filledRad);
  const fy = cy - r * Math.sin(Math.PI - filledRad);
  return (
    <div className="inline-flex flex-col items-center gap-1">
      <svg width="100" height="60" viewBox="0 0 100 60" aria-label={`${label} ${value}%`}>
        <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`} fill="none" stroke="var(--surface-sunken)" strokeWidth="8" strokeLinecap="round" />
        <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${fx} ${fy}`} fill="none" stroke="var(--lumen-accent-5)" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <div className="text-center -mt-3">
        <div className="lumen-tnum text-[var(--type-22)] font-semibold tracking-[var(--tracking-tighter)]">{value}<span className="text-body-xs text-[var(--text-tertiary)] ml-1">%</span></div>
        <div className="text-[var(--type-11)] text-[var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">{label}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────  PROGRESS RING (variant)  ───────────────────────── */
// uses existing /progress.tsx ProgressRing — re-export for convenience patterns
// (left out — primitives/progress.tsx already exports it)

/* ─────────────────────────  RATING STARS  ───────────────────────── */
export function Stars({ value = 4, total = 5, size = 14 }: { value?: number; total?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rating ${value} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < value ? "var(--lumen-amber-4)" : "var(--surface-sunken)"} stroke={i < value ? "var(--lumen-amber-5)" : "var(--border-default)"} strokeWidth="1.5" strokeLinejoin="round">
          <path d="M12 2.6l3 6.5 7 1-5 5 1.2 7L12 18.7 5.8 22.1 7 15.1 2 10.1l7-1z" />
        </svg>
      ))}
    </span>
  );
}

/* ─────────────────────────  KEY VALUE / DESCRIPTION LIST  ───────────────────────── */
export function KeyValue({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-[180px_1fr] gap-y-2 gap-x-4">
      {items.map((it) => (
        <div key={it.label} className="contents">
          <dt className="text-[var(--type-12)] text-[var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">{it.label}</dt>
          <dd className="text-[var(--type-13)] text-[var(--text-primary)]">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ─────────────────────────  AVATAR GROUP OVERFLOW  ───────────────────────── */
// (existing AvatarGroup is fine — added here for additional patterns)

/* ─────────────────────────  PROGRESS / ETA BAR  ───────────────────────── */
export function ProgressTrack({ items }: { items: { label: string; pct: number; tone?: "accent" | "warn" | "danger" }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((i) => {
        const color = i.tone === "warn" ? "var(--lumen-amber-5)" : i.tone === "danger" ? "var(--lumen-red-5)" : "var(--lumen-accent-5)";
        return (
          <div key={i.label}>
            <div className="flex items-center justify-between mb-1 text-[var(--type-12)]">
              <span className="text-[var(--text-secondary)]">{i.label}</span>
              <span className="lumen-mono text-[var(--text-tertiary)]">{i.pct}%</span>
            </div>
            <div className="h-[var(--space-1_5)] rounded-full bg-[var(--surface-sunken)] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${i.pct}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  PRESENCE INDICATOR  ───────────────────────── */
export function Presence({ status = "online" }: { status?: "online" | "away" | "dnd" | "offline" }) {
  const colors: Record<string, string> = {
    online: "var(--lumen-accent-5)",
    away: "var(--lumen-amber-5)",
    dnd: "var(--lumen-red-5)",
    offline: "var(--lumen-cream-4)",
  };
  return <span className="inline-block h-2 w-2 rounded-full ring-2 ring-[var(--surface-raised)]" style={{ background: colors[status] }} aria-label={status} />;
}

/* ─────────────────────────  KBD ROW  ───────────────────────── */
export function KbdRow({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-sunken)] transition-colors">
      <span className="text-body-xs text-[var(--text-secondary)]">{label}</span>
      <span className="flex items-center gap-1">
        {keys.map((k, i) => (
          <span key={i} className="lumen-kbd">{k}</span>
        ))}
      </span>
    </div>
  );
}

/* ─────────────────────────  IMAGE FRAME (placeholder)  ───────────────────────── */
export function ImageFrame({ ratio = "16/10", label }: { ratio?: string; label?: string }) {
  return (
    <div
      className="w-full rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-sunken)] overflow-hidden flex items-center justify-center"
      style={{ aspectRatio: ratio }}
    >
      <div className="lumen-stripe-grid w-full h-full flex items-center justify-center">
        {label && (
          <span className="text-[var(--type-11)] uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]">{label}</span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────  ANATOMY BOX  ───────────────────────── */
export function ComponentSpec({ name, role, children }: { name: string; role?: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-hairline)]">
        <div className="flex items-center gap-2">
          <span className="text-heading-h6">{name}</span>
          {role && <span className="text-[var(--type-11)] text-[var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">{role}</span>}
        </div>
      </div>
      <div className="p-4 lumen-stripe-grid">
        <div className="bg-[var(--surface-raised)] inline-block w-full p-2">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  SHOWCASE FRAME  ───────────────────────── */
export function Showcase({
  label,
  children,
  variant = "default",
}: {
  label?: string;
  children: ReactNode;
  variant?: "default" | "tile" | "wide";
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && <div className="text-[10px] uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)] font-medium">{label}</div>}
      <div
        className={[
          "rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] flex items-center justify-center overflow-hidden",
          variant === "tile" ? "aspect-[4/3]" : variant === "wide" ? "p-6" : "p-5",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────  COMPARISON GRID  ───────────────────────── */
export function VariantRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-4 py-3 border-b border-[var(--border-hairline)] last:border-0">
      <div className="text-[var(--type-12)] text-[var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">{label}</div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

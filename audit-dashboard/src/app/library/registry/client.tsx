"use client";

/**
 * /library/registry — Lumen v0.13 Phase 6 registry browser.
 *
 * Data-driven view of every component in the @lumen/* shadcn registry.
 * Complement to /library (the existing live-component showcase) — this page
 * is the contract-level view: install commands, tokens consumed, mode badge,
 * SKILL.md NEVER-rule count, tier filter, and an alphabetical / NEVER-rule
 * sort.
 *
 * Loads `audit-dashboard/public/component-index.json` (produced by
 * `tools/build-component-index.ts`). The /library route at this codebase is
 * a 1,585-line showcase of rendering primitives; this page is intentionally
 * lighter-weight and operates on the contract metadata only.
 *
 * Mode-agnostic per hard rule 15. Token references render with the same
 * monospaced label treatment used elsewhere on the dashboard.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Copy, Check, Filter, X, AlertTriangle } from "lucide-react";

type Mode = "agnostic" | "restrained-only" | "expressive-only";

interface ComponentEntry {
  slug: string;
  name: string;
  tier: number;
  category: string;
  family?: string;
  status: string;
  deprecated: boolean;
  summary: string;
  installCommand: string;
  tokens: string[];
  mode: Mode;
  neverRuleCount: number;
  hasComponentJson: boolean;
  hasSkillMd: boolean;
  hasStorybook: boolean;
  hasTsx: boolean;
  platforms: string[];
  phase?: number;
  vercelAiElements?: string;
}

interface ComponentIndex {
  generated: string;
  version: string;
  totals: {
    components: number;
    byTier: Record<string, number>;
    deprecated: number;
  };
  components: ComponentEntry[];
}

const TIER_LABELS: Record<number, string> = {
  0: "Legacy",
  1: "T1 · Primitives",
  2: "T2 · Composed",
  3: "T3 · Signatures",
  4: "T4 · Freight",
  5: "T5 · AI",
};

const MODE_LABELS: Record<Mode, string> = {
  agnostic: "Mode-agnostic",
  "restrained-only": "Restrained-only",
  "expressive-only": "Expressive-only",
};

type SortKey = "name" | "neverRules" | "tier";

export function RegistryBrowserClient() {
  const [index, setIndex] = useState<ComponentIndex | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<number | "all">("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [selected, setSelected] = useState<ComponentEntry | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/component-index.json", { cache: "force-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`component-index.json: ${res.status}`);
        return res.json() as Promise<ComponentIndex>;
      })
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load component index",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!index) return [];
    const q = query.trim().toLowerCase();
    let list = index.components.filter((c) => {
      if (activeTier !== "all" && c.tier !== activeTier) return false;
      if (
        q &&
        !c.slug.toLowerCase().includes(q) &&
        !c.name.toLowerCase().includes(q) &&
        !c.summary.toLowerCase().includes(q) &&
        !(c.family && c.family.toLowerCase().includes(q))
      ) {
        return false;
      }
      return true;
    });
    if (sortKey === "neverRules") {
      list = list.slice().sort((a, b) => b.neverRuleCount - a.neverRuleCount);
    } else if (sortKey === "tier") {
      list = list
        .slice()
        .sort(
          (a, b) =>
            (a.tier === 0 ? 99 : a.tier) - (b.tier === 0 ? 99 : b.tier) ||
            a.name.localeCompare(b.name),
        );
    } else {
      list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [index, activeTier, query, sortKey]);

  function copy(label: string, value: string) {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1100);
    });
  }

  if (loadError) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6">
        <h1 className="text-heading-h4 text-[color:var(--text-primary)]">
          Registry Browser
        </h1>
        <p className="mt-3 text-body-sm text-[color:var(--text-secondary)]">
          Could not load <code>/component-index.json</code>: {loadError}.
        </p>
        <p className="mt-3 text-body-sm text-[color:var(--text-tertiary)]">
          Run <code className="lumen-mono-cap">pnpm component-index</code> from
          the repo root to rebuild the index.
        </p>
      </div>
    );
  }
  if (!index) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6">
        <p className="text-body-sm text-[color:var(--text-tertiary)]">
          Loading component index…
        </p>
      </div>
    );
  }

  const tierKeys: Array<number | "all"> = ["all", 1, 2, 3, 4, 5, 0];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-heading-h3 text-[color:var(--text-primary)]">
            Registry Browser
          </h1>
          <span className="inline-flex items-center h-6 px-2 rounded-[var(--radius-full)] text-overline border border-[var(--border-accent)] text-[color:var(--text-accent)] normal-case">
            v{index.version} · @lumen/*
          </span>
          <Link
            href="/library"
            className="ml-auto text-body-sm text-[color:var(--text-tertiary)] hover:text-[color:var(--text-accent)] underline-offset-4 hover:underline transition-colors duration-[var(--motion-fast)]"
          >
            → live component showcase at /library
          </Link>
        </div>
        <p className="text-body-sm text-[color:var(--text-secondary)] max-w-2xl">
          {index.totals.components.toLocaleString()} components across {Object.keys(index.totals.byTier).length} tiers. Each entry shows its install command, tokens consumed, mode behavior, and SKILL.md NEVER-rule count. Click any row for the full contract.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 min-w-[240px] max-w-md">
          <span className="sr-only">Search components</span>
          <Search
            size={14}
            strokeWidth={1.5}
            aria-hidden
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-tertiary)]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, slug, summary, family…"
            className="w-full h-control-md pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--surface-raised)] text-[color:var(--text-primary)] border border-[var(--border-default)] text-body-sm placeholder:text-[color:var(--text-tertiary)] focus-visible:outline-none focus-visible:border-[var(--border-accent)] focus-visible:shadow-[var(--shadow-focus)]"
          />
        </label>

        <div
          className="flex items-center gap-1 p-1 rounded-[var(--radius-full)] border border-[var(--border-hairline)] flex-wrap"
          role="tablist"
          aria-label="Component tier"
        >
          {tierKeys.map((t) => (
            <button
              key={String(t)}
              type="button"
              role="tab"
              aria-selected={activeTier === t}
              onClick={() => setActiveTier(t)}
              className={[
                "h-7 px-3 rounded-[var(--radius-full)] text-overline normal-case tracking-normal",
                "transition-colors duration-[var(--motion-fast)]",
                activeTier === t
                  ? "bg-[var(--surface-tint-accent)] text-[color:var(--text-accent)]"
                  : "text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]",
              ].join(" ")}
            >
              {t === "all"
                ? "all"
                : t === 0
                  ? `T0 (${index.totals.byTier["tier-0"] ?? 0})`
                  : `T${t} (${index.totals.byTier[`tier-${t}`] ?? 0})`}
            </button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2">
          <Filter
            size={14}
            strokeWidth={1.5}
            className="text-[color:var(--text-tertiary)]"
            aria-hidden
          />
          <span className="sr-only">Sort by</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="h-control-md px-3 rounded-[var(--radius-md)] bg-[var(--surface-raised)] text-[color:var(--text-primary)] border border-[var(--border-default)] text-body-sm focus-visible:outline-none focus-visible:border-[var(--border-accent)] focus-visible:shadow-[var(--shadow-focus)]"
          >
            <option value="name">sort: A→Z</option>
            <option value="tier">sort: tier ascending</option>
            <option value="neverRules">sort: NEVER-rule count ↓</option>
          </select>
        </label>

        <span className="ml-auto text-overline text-[color:var(--text-tertiary)]">
          {filtered.length.toLocaleString()} / {index.totals.components.toLocaleString()}
        </span>
      </div>

      {/* List + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-6">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-6 text-body-sm text-[color:var(--text-tertiary)]">
              No components match the current filters.
            </div>
          ) : (
            <ul className="max-h-[70vh] overflow-y-auto divide-y divide-[var(--border-hairline)]">
              {filtered.map((c) => {
                const isSel = selected?.slug === c.slug;
                return (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      aria-current={isSel ? "true" : undefined}
                      className={[
                        "w-full flex items-start gap-3 px-4 py-3 text-left",
                        "transition-colors duration-[var(--motion-fast)]",
                        isSel
                          ? "bg-[var(--surface-tint-accent)]"
                          : "hover:bg-[var(--surface-sunken)]",
                      ].join(" ")}
                    >
                      <span
                        aria-hidden
                        className="block h-8 w-8 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] text-overline normal-case text-[color:var(--text-tertiary)] flex items-center justify-center flex-shrink-0"
                      >
                        {c.tier === 0 ? "—" : `T${c.tier}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-label-md font-medium text-[color:var(--text-primary)] truncate">
                            {c.name}
                          </span>
                          {c.deprecated ? (
                            <span className="text-micro lumen-mono-cap normal-case text-[color:var(--text-tertiary)]">
                              deprecated
                            </span>
                          ) : null}
                          {c.family ? (
                            <span className="text-micro text-[color:var(--text-tertiary)]">
                              {c.family}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-body-sm text-[color:var(--text-tertiary)] line-clamp-2">
                          {c.summary || (
                            <span className="italic">No summary provided.</span>
                          )}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-micro lumen-mono-cap normal-case text-[color:var(--text-tertiary)]">
                          <span>{c.category}</span>
                          <span aria-hidden>·</span>
                          <span title={MODE_LABELS[c.mode]}>{c.mode}</span>
                          {c.neverRuleCount > 0 ? (
                            <>
                              <span aria-hidden>·</span>
                              <span
                                className="inline-flex items-center gap-1 text-[color:var(--lumen-amber-4)]"
                                title={`${c.neverRuleCount} NEVER rules in SKILL.md`}
                              >
                                <AlertTriangle size={10} strokeWidth={1.5} aria-hidden />
                                {c.neverRuleCount}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-6">
          {!selected ? (
            <div className="text-body-sm text-[color:var(--text-tertiary)]">
              Select a component from the list to see its install command, tokens consumed, mode behavior, and SKILL.md NEVER rules.
            </div>
          ) : (
            <ComponentDetail
              c={selected}
              onClose={() => setSelected(null)}
              onCopy={copy}
              copied={copied}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

interface ComponentDetailProps {
  c: ComponentEntry;
  onClose: () => void;
  onCopy: (label: string, value: string) => void;
  copied: string | null;
}

function ComponentDetail({ c, onClose, onCopy, copied }: ComponentDetailProps) {
  const skillMdPath = `design-system/02-components/${c.slug}/${c.slug}.skill.md`;
  const componentMdPath = `design-system/02-components/${c.slug}/${c.slug}.md`;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="text-heading-h5 text-[color:var(--text-primary)] break-words">
              {c.name}
            </h2>
            <span className="text-overline text-[color:var(--text-tertiary)]">
              {TIER_LABELS[c.tier] ?? "—"}
            </span>
          </div>
          <div className="text-overline text-[color:var(--text-tertiary)] mt-1">
            {c.category} · {MODE_LABELS[c.mode]}
            {c.family ? ` · family: ${c.family}` : ""}
            {c.phase ? ` · phase ${c.phase}` : ""}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail"
          className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-[var(--radius-sm)] p-1"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>

      {c.summary ? (
        <p className="text-body-sm text-[color:var(--text-secondary)] leading-relaxed">
          {c.summary}
        </p>
      ) : null}

      <DetailRow
        label="Install"
        value={c.installCommand}
        copy={() => onCopy("install", c.installCommand)}
        copied={copied === "install"}
      />

      {c.vercelAiElements ? (
        <DetailRow
          label="Vercel AI Elements"
          value={`npx ai-elements@latest add ${c.slug}`}
          copy={() =>
            onCopy("vercel", `npx ai-elements@latest add ${c.slug}`)
          }
          copied={copied === "vercel"}
        />
      ) : null}

      <div>
        <div className="text-overline text-[color:var(--text-tertiary)] mb-2">
          Tokens consumed ({c.tokens.length})
        </div>
        {c.tokens.length === 0 ? (
          <p className="text-body-sm text-[color:var(--text-tertiary)]">
            None declared in frontmatter. Either token-free (e.g. icon-only) or contract pending.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {c.tokens.map((t) => (
              <li key={t}>
                <Link
                  href={`/tokens?q=${encodeURIComponent(t)}`}
                  className="inline-flex items-center h-6 px-2 rounded-[var(--radius-full)] border border-[var(--border-hairline)] text-micro lumen-mono-cap normal-case text-[color:var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[color:var(--text-accent)] transition-colors duration-[var(--motion-fast)]"
                  title={`Search /tokens for ${t}`}
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FactPill
          label="component.json"
          value={c.hasComponentJson ? "yes" : "no"}
          tone={c.hasComponentJson ? "ok" : "soft"}
        />
        <FactPill
          label="SKILL.md"
          value={c.hasSkillMd ? "yes" : "no"}
          tone={c.hasSkillMd ? "ok" : "soft"}
        />
        <FactPill
          label="Storybook"
          value={c.hasStorybook ? "yes" : "no"}
          tone={c.hasStorybook ? "ok" : "soft"}
        />
        <FactPill
          label="TSX"
          value={c.hasTsx ? "yes" : "no"}
          tone={c.hasTsx ? "ok" : "soft"}
        />
        <FactPill
          label="NEVER rules"
          value={String(c.neverRuleCount)}
          tone={c.neverRuleCount > 0 ? "warn" : "soft"}
        />
        <FactPill label="Status" value={c.status} tone="soft" />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-overline text-[color:var(--text-tertiary)]">
          Source paths
        </span>
        <div className="text-micro text-[color:var(--text-secondary)] space-y-1">
          {c.hasComponentJson ? (
            <div>
              <code className="text-[color:var(--text-tertiary)]">json:</code>{" "}
              {`design-system/02-components/${c.slug}/component.json`}
            </div>
          ) : null}
          <div>
            <code className="text-[color:var(--text-tertiary)]">md:</code>{" "}
            {componentMdPath}
          </div>
          {c.hasSkillMd ? (
            <div>
              <code className="text-[color:var(--text-tertiary)]">skill:</code>{" "}
              {skillMdPath}
            </div>
          ) : null}
          {c.hasTsx ? (
            <div>
              <code className="text-[color:var(--text-tertiary)]">tsx:</code>{" "}
              {`design-system/02-components/${c.slug}/${c.slug}.tsx`}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  copy,
  copied,
}: {
  label: string;
  value: string;
  copy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-overline text-[color:var(--text-tertiary)]">{label}</span>
      <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] px-3 py-2">
        <code className="flex-1 text-label-sm text-[color:var(--text-primary)] break-all">
          {value}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label}`}
          className="shrink-0 text-[color:var(--text-tertiary)] hover:text-[color:var(--text-accent)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-[var(--radius-sm)] p-1"
        >
          {copied ? (
            <Check size={14} strokeWidth={1.5} className="text-[color:var(--text-accent)]" />
          ) : (
            <Copy size={14} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  );
}

function FactPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "soft";
}) {
  const cls =
    tone === "ok"
      ? "border-[var(--border-accent)] text-[color:var(--text-accent)]"
      : tone === "warn"
        ? "border-[var(--lumen-amber-4)] text-[color:var(--lumen-amber-4)]"
        : "border-[var(--border-hairline)] text-[color:var(--text-tertiary)]";
  return (
    <div
      className={`flex flex-col gap-0.5 rounded-[var(--radius-md)] border px-3 py-2 ${cls}`}
    >
      <span className="text-overline text-[color:var(--text-tertiary)] normal-case tracking-normal">
        {label}
      </span>
      <span className="text-label-md font-semibold">{value}</span>
    </div>
  );
}

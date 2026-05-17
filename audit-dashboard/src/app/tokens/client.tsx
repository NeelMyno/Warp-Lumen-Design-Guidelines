"use client";

/**
 * /tokens — Lumen v0.13 Phase 6 token browser.
 *
 * Loads the build-time-generated `audit-dashboard/public/token-index.json`
 * (produced by `tools/build-token-index.ts`) and renders an interactive
 * explorer with:
 *   - filter by layer (primitive / semantic / mode / component)
 *   - filter by category (color / spacing / radius / typography / …)
 *   - fuzzy search across token paths and descriptions
 *   - click any row → side panel showing:
 *       resolved value (alias-resolved across hops)
 *       CSS variable name (with copy button)
 *       DTCG path (with copy button)
 *       source file
 *       references list (component MDs + TSX that consume this token)
 *       a visual color swatch if the token is a color
 *
 * The route is mode-agnostic (per hard rule 15 — components don't branch on
 * mode). Mode flipping in the header still tints the surrounding chrome.
 *
 * Why a build-time index instead of runtime parsing:
 *   1. Avoids shipping 1,200 .tokens.json files to the client.
 *   2. The index includes already-resolved alias chains — no client-side
 *      resolver needed.
 *   3. References pass scans 144+ component files at build time; runtime
 *      scanning would be the Performance Profiler's worst nightmare.
 */

import { useEffect, useMemo, useState } from "react";
import { Search, Copy, Check, X, Layers, Filter } from "lucide-react";

interface TokenEntry {
  path: string;
  layer: "primitive" | "semantic" | "mode" | "component";
  category: string;
  file: string;
  value: unknown;
  resolvedValue: unknown;
  type: string;
  description: string;
  cssVar: string;
  mode?: "restrained" | "expressive";
}

interface TokenReference {
  type: string;
  file: string;
  line?: number;
}

interface TokenIndex {
  generated: string;
  version: string;
  totals: {
    tokens: number;
    references: number;
    byLayer: Record<string, number>;
    byCategory: Record<string, number>;
  };
  tokens: TokenEntry[];
  references: Record<string, TokenReference[]>;
}

const LAYERS = ["primitive", "semantic", "mode", "component"] as const;
type Layer = (typeof LAYERS)[number];

function isHexColor(v: unknown): v is string {
  return (
    typeof v === "string" && /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6,8})$/.test(v)
  );
}

function isCssColor(v: unknown): v is string {
  return (
    typeof v === "string" &&
    /^(#|rgb|rgba|hsl|hsla|oklch|oklab|color)\b/i.test(v)
  );
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return JSON.stringify(v, null, 2);
}

export function TokensClient() {
  const [index, setIndex] = useState<TokenIndex | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<Layer | "all">("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<TokenEntry | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/token-index.json", { cache: "force-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`token-index.json: ${res.status}`);
        return res.json() as Promise<TokenIndex>;
      })
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load token index",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    if (!index) return [];
    return Object.keys(index.totals.byCategory).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [index]);

  const filtered = useMemo(() => {
    if (!index) return [];
    const q = query.trim().toLowerCase();
    return index.tokens.filter((t) => {
      if (activeLayer !== "all" && t.layer !== activeLayer) return false;
      if (activeCategory !== "all" && t.category !== activeCategory)
        return false;
      if (
        q &&
        !t.path.toLowerCase().includes(q) &&
        !t.cssVar.toLowerCase().includes(q) &&
        !t.description.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [index, activeLayer, activeCategory, query]);

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
          Token Browser
        </h1>
        <p className="mt-3 text-body-sm text-[color:var(--text-secondary)]">
          Could not load <code>/token-index.json</code>: {loadError}.
        </p>
        <p className="mt-3 text-body-sm text-[color:var(--text-tertiary)]">
          Run <code className="lumen-mono-cap">pnpm token-index</code> from the
          repo root to rebuild the index.
        </p>
      </div>
    );
  }

  if (!index) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6">
        <p className="text-body-sm text-[color:var(--text-tertiary)]">
          Loading token index…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Layers
            size={20}
            strokeWidth={1.5}
            className="text-[color:var(--text-accent)]"
            aria-hidden
          />
          <h1 className="text-heading-h3 text-[color:var(--text-primary)]">
            Token Browser
          </h1>
          <span
            className="ml-2 inline-flex items-center h-6 px-2 rounded-[var(--radius-full)] text-overline border border-[var(--border-accent)] text-[color:var(--text-accent)] normal-case"
            title="DTCG 2025.10 format, alias-resolved"
          >
            v{index.version} · DTCG 2025.10
          </span>
        </div>
        <p className="text-body-sm text-[color:var(--text-secondary)] max-w-2xl">
          {index.totals.tokens.toLocaleString()} tokens across{" "}
          {index.totals.byLayer.primitive ?? 0} primitive ·{" "}
          {index.totals.byLayer.semantic ?? 0} semantic ·{" "}
          {index.totals.byLayer.mode ?? 0} mode ·{" "}
          {index.totals.byLayer.component ?? 0} component. {index.totals.references.toLocaleString()} references
          recorded across component MD + TSX. Click any token for resolved
          value, CSS variable, and references.
        </p>
      </header>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <label className="relative flex-1 min-w-[240px] max-w-md">
          <span className="sr-only">Search tokens</span>
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
            placeholder="Search by path, var name, or description…"
            className="w-full h-control-md pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--surface-raised)] text-[color:var(--text-primary)] border border-[var(--border-default)] text-body-sm placeholder:text-[color:var(--text-tertiary)] focus-visible:outline-none focus-visible:border-[var(--border-accent)] focus-visible:shadow-[var(--shadow-focus)]"
          />
        </label>

        {/* Layer filter */}
        <div
          className="flex items-center gap-1 p-1 rounded-[var(--radius-full)] border border-[var(--border-hairline)]"
          role="tablist"
          aria-label="Token layer"
        >
          {(["all", ...LAYERS] as const).map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={activeLayer === l}
              onClick={() => setActiveLayer(l)}
              className={[
                "h-7 px-3 rounded-[var(--radius-full)] text-overline normal-case tracking-normal",
                "transition-colors duration-[var(--motion-fast)]",
                activeLayer === l
                  ? "bg-[var(--surface-tint-accent)] text-[color:var(--text-accent)]"
                  : "text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]",
              ].join(" ")}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Category dropdown */}
        <label className="inline-flex items-center gap-2">
          <Filter
            size={14}
            strokeWidth={1.5}
            className="text-[color:var(--text-tertiary)]"
            aria-hidden
          />
          <span className="sr-only">Filter by category</span>
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="h-control-md px-3 rounded-[var(--radius-md)] bg-[var(--surface-raised)] text-[color:var(--text-primary)] border border-[var(--border-default)] text-body-sm focus-visible:outline-none focus-visible:border-[var(--border-accent)] focus-visible:shadow-[var(--shadow-focus)]"
          >
            <option value="all">all categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c} ({index.totals.byCategory[c]})
              </option>
            ))}
          </select>
        </label>

        <span className="ml-auto text-overline text-[color:var(--text-tertiary)]">
          {filtered.length.toLocaleString()} / {index.totals.tokens.toLocaleString()}
        </span>
      </div>

      {/* Body: list (left) + detail panel (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-6">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-6 text-body-sm text-[color:var(--text-tertiary)]">
              No tokens match the current filters.
            </div>
          ) : (
            <ul className="max-h-[70vh] overflow-y-auto divide-y divide-[var(--border-hairline)]">
              {filtered.slice(0, 500).map((t) => {
                const isSel = selected?.path === t.path;
                const valueStr = formatValue(t.resolvedValue);
                const isColor =
                  t.type === "color" ||
                  isHexColor(t.resolvedValue) ||
                  isCssColor(t.resolvedValue);
                return (
                  <li key={`${t.layer}-${t.file}-${t.path}`}>
                    <button
                      type="button"
                      onClick={() => setSelected(t)}
                      aria-current={isSel ? "true" : undefined}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-3 text-left",
                        "transition-colors duration-[var(--motion-fast)]",
                        isSel
                          ? "bg-[var(--surface-tint-accent)]"
                          : "hover:bg-[var(--surface-sunken)]",
                      ].join(" ")}
                    >
                      {isColor && typeof t.resolvedValue === "string" ? (
                        <span
                          aria-hidden
                          className="block h-6 w-6 rounded-[var(--radius-sm)] border border-[var(--border-hairline)]"
                          style={{ backgroundColor: t.resolvedValue }}
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="block h-6 w-6 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] text-[10px] uppercase tracking-[0.1em] text-[color:var(--text-tertiary)] flex items-center justify-center"
                        >
                          {t.type.slice(0, 3)}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-label-sm font-medium text-[color:var(--text-primary)] truncate">
                          {t.path}
                        </div>
                        <div className="text-micro lumen-mono-cap normal-case text-[color:var(--text-tertiary)] truncate">
                          {t.layer} · {t.category} · {t.type}
                          {t.mode ? ` · ${t.mode}` : ""}
                        </div>
                      </div>
                      <code className="text-micro text-[color:var(--text-secondary)] truncate max-w-[40%]">
                        {valueStr.slice(0, 80)}
                      </code>
                    </button>
                  </li>
                );
              })}
              {filtered.length > 500 && (
                <li className="px-4 py-3 text-micro text-[color:var(--text-tertiary)]">
                  Showing first 500 of {filtered.length.toLocaleString()} matches. Narrow filters to see the rest.
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Detail panel */}
        <aside className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-6">
          {!selected ? (
            <div className="text-body-sm text-[color:var(--text-tertiary)]">
              Select a token from the list to see its resolved value, CSS variable, source file, and references.
            </div>
          ) : (
            <TokenDetail
              token={selected}
              references={index.references[selected.path] ?? []}
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

interface TokenDetailProps {
  token: TokenEntry;
  references: TokenReference[];
  onClose: () => void;
  onCopy: (label: string, value: string) => void;
  copied: string | null;
}

function TokenDetail({
  token,
  references,
  onClose,
  onCopy,
  copied,
}: TokenDetailProps) {
  const valueStr = formatValue(token.resolvedValue);
  const aliasOf =
    typeof token.value === "string" && /^\{[^}]+\}$/.test(token.value)
      ? token.value
      : null;
  const isColor =
    token.type === "color" ||
    isHexColor(token.resolvedValue) ||
    isCssColor(token.resolvedValue);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        {isColor && typeof token.resolvedValue === "string" ? (
          <span
            aria-hidden
            className="block h-10 w-10 rounded-[var(--radius-md)] border border-[var(--border-hairline)] flex-shrink-0"
            style={{ backgroundColor: token.resolvedValue }}
          />
        ) : null}
        <div className="flex-1 min-w-0">
          <div className="text-label-md font-semibold text-[color:var(--text-primary)] break-words">
            {token.path}
          </div>
          <div className="text-overline text-[color:var(--text-tertiary)]">
            {token.layer} · {token.category} · {token.type}
            {token.mode ? ` · ${token.mode}` : ""}
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

      {token.description ? (
        <p className="text-body-sm text-[color:var(--text-secondary)] leading-relaxed">
          {token.description}
        </p>
      ) : null}

      <DetailRow
        label="Resolved value"
        value={valueStr}
        copy={() => onCopy("value", valueStr)}
        copied={copied === "value"}
      />
      {aliasOf ? (
        <DetailRow
          label="Alias of"
          value={aliasOf}
          copy={() => onCopy("alias", aliasOf)}
          copied={copied === "alias"}
        />
      ) : null}
      <DetailRow
        label="CSS variable"
        value={`var(${token.cssVar})`}
        copy={() => onCopy("cssVar", `var(${token.cssVar})`)}
        copied={copied === "cssVar"}
      />
      <DetailRow
        label="DTCG path"
        value={`{${token.path}}`}
        copy={() => onCopy("dtcgPath", `{${token.path}}`)}
        copied={copied === "dtcgPath"}
      />
      <DetailRow
        label="Source"
        value={token.file}
        copy={() => onCopy("source", token.file)}
        copied={copied === "source"}
      />

      <div>
        <div className="text-overline text-[color:var(--text-tertiary)] mb-2">
          References ({references.length})
        </div>
        {references.length === 0 ? (
          <p className="text-body-sm text-[color:var(--text-tertiary)]">
            No component MD or TSX files declare this token. Either unused or referenced via an alias to a parent token.
          </p>
        ) : (
          <ul className="space-y-1 max-h-48 overflow-y-auto">
            {references.slice(0, 30).map((r, i) => (
              <li
                key={`${r.file}-${i}`}
                className="flex items-baseline gap-2 text-body-sm text-[color:var(--text-secondary)]"
              >
                <code className="text-[color:var(--text-tertiary)] text-micro lumen-mono-cap normal-case shrink-0 w-28">
                  {r.type}
                </code>
                <code className="break-all flex-1">
                  {r.file}
                  {r.line ? `:${r.line}` : ""}
                </code>
              </li>
            ))}
            {references.length > 30 ? (
              <li className="text-micro text-[color:var(--text-tertiary)]">
                +{references.length - 30} more — see the index JSON for the full list.
              </li>
            ) : null}
          </ul>
        )}
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
            <Check
              size={14}
              strokeWidth={1.5}
              className="text-[color:var(--text-accent)]"
            />
          ) : (
            <Copy size={14} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  );
}

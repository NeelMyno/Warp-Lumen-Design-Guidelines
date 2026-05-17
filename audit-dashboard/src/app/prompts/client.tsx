"use client";

/**
 * /prompts — Lumen v0.13 Phase 6 prompt library browser.
 *
 * Loads `audit-dashboard/public/prompt-index.json` (produced by
 * `tools/build-prompt-index.ts`) and renders:
 *   - immutable style anchor (collapsed by default; click to expand)
 *   - 7 per-asset templates with their assembled prompt body
 *   - copy-prompt-to-clipboard
 *   - canonical-subject manifest sidecar (slug, snapshot, asset path)
 *   - reference PNG inline when present in repo, placeholder otherwise
 *   - CLI usage block for `pnpm prompts <template> --subject "..."`
 *
 * Mode-agnostic. The route shows what an engineer needs to copy-paste into
 * ChatGPT (with the gpt-image-2 model selected) and produce on-brand assets
 * without reading the underlying MD files.
 */

import { useEffect, useMemo, useState } from "react";
import { ImageIcon, Copy, Check, Lock, Terminal, X } from "lucide-react";

interface CanonicalSubject {
  slug: string;
  filePath: string;
  content: string;
}

interface PromptTemplate {
  slug: string;
  name: string;
  aspect: string;
  output: string;
  mode: string;
  filePath: string;
  content: string;
  contentAssembled: string;
  contentLength: number;
  canonicalSubject?: CanonicalSubject | null;
  referencePng?: string | null;
}

interface PromptIndex {
  generated: string;
  version: string;
  modelPin: string;
  anchor: { path: string; content: string; immutable: boolean };
  templates: PromptTemplate[];
}

export function PromptsClient() {
  const [index, setIndex] = useState<PromptIndex | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [showAnchor, setShowAnchor] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/prompt-index.json", { cache: "force-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`prompt-index.json: ${res.status}`);
        return res.json() as Promise<PromptIndex>;
      })
      .then((data) => {
        if (!cancelled) {
          setIndex(data);
          setActiveSlug(data.templates[0]?.slug ?? null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load prompt index",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const active = useMemo(
    () => index?.templates.find((t) => t.slug === activeSlug) ?? null,
    [index, activeSlug],
  );

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
          Prompt Library
        </h1>
        <p className="mt-3 text-body-sm text-[color:var(--text-secondary)]">
          Could not load <code>/prompt-index.json</code>: {loadError}.
        </p>
        <p className="mt-3 text-body-sm text-[color:var(--text-tertiary)]">
          Run <code className="lumen-mono-cap">pnpm prompt-index</code> from
          the repo root to rebuild the index.
        </p>
      </div>
    );
  }
  if (!index) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6">
        <p className="text-body-sm text-[color:var(--text-tertiary)]">
          Loading prompt index…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <ImageIcon
            size={20}
            strokeWidth={1.5}
            className="text-[color:var(--text-accent)]"
            aria-hidden
          />
          <h1 className="text-heading-h3 text-[color:var(--text-primary)]">
            Prompt Library
          </h1>
          <span
            className="inline-flex items-center h-6 px-2 rounded-[var(--radius-full)] text-overline border border-[var(--border-accent)] text-[color:var(--text-accent)] normal-case"
            title="Model snapshot pinned per master doc §11"
          >
            v{index.version} · {index.modelPin}
          </span>
        </div>
        <p className="text-body-sm text-[color:var(--text-secondary)] max-w-3xl">
          gpt-image-2 templates for Lumen-on-brand atmosphere. Every prompt opens with <code>@import ./style-anchor.md</code> (inlined here when you copy). Icons stay vector — see master doc §3.
        </p>
      </header>

      {/* CLI hint */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-sunken)] p-4 flex items-center gap-3">
        <Terminal
          size={14}
          strokeWidth={1.5}
          className="text-[color:var(--text-tertiary)] flex-shrink-0"
          aria-hidden
        />
        <code className="text-body-sm text-[color:var(--text-primary)] flex-1 break-all">
          pnpm prompts &lt;template&gt; --subject "..."
        </code>
        <button
          type="button"
          onClick={() =>
            copy(
              "cli",
              "pnpm prompts hero-background --subject \"route arc over a dim freight lane map\"",
            )
          }
          className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-accent)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-[var(--radius-sm)] p-1"
          aria-label="Copy CLI example"
        >
          {copied === "cli" ? (
            <Check size={14} strokeWidth={1.5} className="text-[color:var(--text-accent)]" />
          ) : (
            <Copy size={14} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Anchor disclosure */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-accent)] bg-[var(--surface-raised)] p-5">
        <div className="flex items-center gap-3">
          <Lock
            size={14}
            strokeWidth={1.5}
            className="text-[color:var(--text-accent)] flex-shrink-0"
            aria-hidden
          />
          <h2 className="text-heading-h5 text-[color:var(--text-primary)] flex-1">
            Style anchor (immutable)
          </h2>
          <button
            type="button"
            onClick={() => setShowAnchor((v) => !v)}
            className="text-overline text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors duration-[var(--motion-fast)]"
          >
            {showAnchor ? "hide" : "show"}
          </button>
          <button
            type="button"
            onClick={() => copy("anchor", index.anchor.content)}
            aria-label="Copy style anchor"
            className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-accent)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-[var(--radius-sm)] p-1"
          >
            {copied === "anchor" ? (
              <Check size={14} strokeWidth={1.5} className="text-[color:var(--text-accent)]" />
            ) : (
              <Copy size={14} strokeWidth={1.5} />
            )}
          </button>
        </div>
        <p className="text-body-sm text-[color:var(--text-tertiary)] mt-2">
          Source: <code>{index.anchor.path}</code>. Never edit in place —
          version-bump to <code>style-anchor.v2.md</code> if a change is truly
          required.
        </p>
        {showAnchor ? (
          <pre className="mt-3 max-h-96 overflow-auto rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] p-4 text-micro text-[color:var(--text-secondary)] whitespace-pre-wrap">
            {index.anchor.content}
          </pre>
        ) : null}
      </div>

      {/* Templates list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] gap-6">
        <nav
          className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-2"
          aria-label="Templates"
        >
          <ul className="space-y-1">
            {index.templates.map((t) => {
              const isSel = activeSlug === t.slug;
              return (
                <li key={t.slug}>
                  <button
                    type="button"
                    onClick={() => setActiveSlug(t.slug)}
                    aria-current={isSel ? "page" : undefined}
                    className={[
                      "w-full text-left px-3 py-2 rounded-[var(--radius-md)]",
                      "transition-colors duration-[var(--motion-fast)]",
                      isSel
                        ? "bg-[var(--surface-tint-accent)] text-[color:var(--text-accent)]"
                        : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[var(--surface-sunken)]",
                    ].join(" ")}
                  >
                    <div className="text-label-sm font-medium">{t.name}</div>
                    <div className="text-micro text-[color:var(--text-tertiary)] lumen-mono-cap normal-case">
                      {t.aspect} · {t.output} · {t.mode}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          {active ? (
            <TemplateDetail
              t={active}
              onCopy={copy}
              copied={copied}
              setCopied={setCopied}
            />
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-6">
              <p className="text-body-sm text-[color:var(--text-tertiary)]">
                Pick a template from the list to see the assembled prompt.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TemplateDetailProps {
  t: PromptTemplate;
  onCopy: (label: string, value: string) => void;
  copied: string | null;
  setCopied: (label: string | null) => void;
}

function TemplateDetail({ t, onCopy, copied, setCopied }: TemplateDetailProps) {
  const [showAssembled, setShowAssembled] = useState(false);
  void setCopied;
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-heading-h5 text-[color:var(--text-primary)]">
              {t.name}
            </h3>
            <p className="text-overline text-[color:var(--text-tertiary)] mt-1">
              {t.aspect} · {t.output} · mode: {t.mode} · {t.contentLength.toLocaleString()} chars assembled
            </p>
            <p className="text-body-sm text-[color:var(--text-tertiary)] mt-2 break-all">
              Source: <code>{t.filePath}</code>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onCopy("body", t.content)}
              className="inline-flex items-center gap-2 h-control-sm px-3 rounded-[var(--radius-full)] border border-[var(--border-hairline)] text-overline normal-case text-[color:var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[color:var(--text-primary)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
              aria-label="Copy raw template (with @import line)"
              title="Copy raw template (with @import line)"
            >
              {copied === "body" ? (
                <Check size={12} strokeWidth={1.5} className="text-[color:var(--text-accent)]" />
              ) : (
                <Copy size={12} strokeWidth={1.5} />
              )}
              raw
            </button>
            <button
              type="button"
              onClick={() => onCopy("assembled", t.contentAssembled)}
              className="inline-flex items-center gap-2 h-control-sm px-3 rounded-[var(--radius-full)] border border-[var(--border-accent)] text-overline normal-case text-[color:var(--text-accent)] bg-[var(--surface-tint-accent)] hover:shadow-[var(--shadow-button-glow-rest)] transition-[box-shadow] duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
              aria-label="Copy fully-assembled prompt (anchor inlined)"
              title="Copy fully-assembled prompt — paste directly into ChatGPT"
            >
              {copied === "assembled" ? (
                <Check size={12} strokeWidth={1.5} className="text-[color:var(--text-accent)]" />
              ) : (
                <Copy size={12} strokeWidth={1.5} />
              )}
              copy assembled
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAssembled((v) => !v)}
            className="text-overline text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors duration-[var(--motion-fast)]"
          >
            {showAssembled ? "hide" : "show"} assembled prompt
          </button>
        </div>

        {showAssembled ? (
          <pre className="mt-3 max-h-[60vh] overflow-auto rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] p-4 text-micro text-[color:var(--text-secondary)] whitespace-pre-wrap">
            {t.contentAssembled}
          </pre>
        ) : null}
      </div>

      {t.canonicalSubject ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-5">
          <h4 className="text-label-md font-semibold text-[color:var(--text-primary)]">
            Canonical subject
          </h4>
          <p className="text-overline text-[color:var(--text-tertiary)] mt-1">
            slug: {t.canonicalSubject.slug} ·{" "}
            <code>{t.canonicalSubject.filePath}</code>
          </p>
          <pre className="mt-3 max-h-72 overflow-auto rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] p-4 text-micro text-[color:var(--text-secondary)] whitespace-pre-wrap">
            {t.canonicalSubject.content}
          </pre>
        </div>
      ) : null}

      <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-5">
        <h4 className="text-label-md font-semibold text-[color:var(--text-primary)]">
          Reference asset
        </h4>
        {t.referencePng ? (
          <>
            <p className="text-body-sm text-[color:var(--text-tertiary)] mt-1">
              <code>{t.referencePng}</code>
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/${t.referencePng}`}
              alt={`Reference asset for ${t.name}`}
              className="mt-3 max-w-full rounded-[var(--radius-md)] border border-[var(--border-hairline)]"
            />
          </>
        ) : (
          <div className="mt-3 rounded-[var(--radius-md)] border border-dashed border-[var(--border-hairline)] bg-[var(--surface-sunken)] p-6 text-center">
            <X
              size={20}
              strokeWidth={1.5}
              aria-hidden
              className="mx-auto text-[color:var(--text-tertiary)]"
            />
            <p className="mt-2 text-body-sm text-[color:var(--text-tertiary)]">
              Reference PNG not materialized in this repo.
            </p>
            <p className="mt-1 text-micro text-[color:var(--text-tertiary)]">
              Run <code>pnpm prompts:generate-references</code> with{" "}
              <code>OPENAI_API_KEY</code> set, or check{" "}
              <code>examples/gpt-image-2/{t.slug}/</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

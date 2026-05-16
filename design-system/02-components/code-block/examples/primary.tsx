// Lumen CodeBlock — Web React example.
// Mono-typeface code with language/filename label, optional line numbers + highlight,
// and copy button.

"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: string;
  wrap?: "scroll" | "soft" | "wrap";
  copy?: boolean;
  maxHeight?: string;
};

function parseHighlights(spec?: string): Set<number> {
  if (!spec) return new Set();
  const out = new Set<number>();
  for (const part of spec.split(",")) {
    const [a, b] = part.split("-").map((v) => parseInt(v.trim(), 10));
    if (Number.isNaN(a)) continue;
    if (Number.isNaN(b)) out.add(a);
    else for (let i = a; i <= b; i++) out.add(i);
  }
  return out;
}

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers,
  highlightLines,
  wrap = "scroll",
  copy = true,
  maxHeight,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const lines = code.split("\n");
  const highlights = parseHighlights(highlightLines);
  const wrapClass: Record<typeof wrap, string> = {
    scroll: "overflow-x-auto whitespace-pre",
    soft:   "whitespace-pre-wrap break-words",
    wrap:   "whitespace-pre-wrap break-all",
  };

  return (
    <figure
      role="region"
      aria-label={`Code block${language ? `, ${language}` : ""}${filename ? `, ${filename}` : ""}`}
      className={[
        "rounded-[var(--radius-card-default)] border border-[var(--color-border-hairline)]",
        "bg-[var(--color-surface-sunken)] overflow-hidden",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2 px-[var(--space-inset-lg)] py-[var(--space-inset-md)] border-b border-[var(--color-border-subtle)]">
        <span className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)] truncate">
          {filename ?? language ?? ""}
        </span>
        {copy && (
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy code"
            aria-live="polite"
            className={[
              "shrink-0 inline-flex h-7 items-center gap-1 rounded-[var(--radius-control-sm)] px-2",
              "text-[var(--type-eyebrow-mono)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
              "hover:bg-[var(--color-action-ghost-bg-hover)]",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
              "transition-colors duration-150",
            ].join(" ")}
          >
            {copied ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        )}
      </div>
      <pre
        className={[
          "m-0 px-[var(--space-inset-lg)] py-[var(--space-inset-md)]",
          "text-[var(--color-text-primary)] text-[var(--type-code-md, 13px)] leading-relaxed",
          "font-mono",
          wrapClass[wrap],
        ].join(" ")}
        style={{ maxHeight, overflowY: maxHeight ? "auto" : undefined }}
      >
        <code>
          {lines.map((line, i) => {
            const n = i + 1;
            const hl = highlights.has(n);
            return (
              <span
                key={n}
                className={[
                  "block",
                  hl ? "-mx-[var(--space-inset-lg)] px-[var(--space-inset-lg)] bg-[var(--color-alpha-accent-12,rgba(0,250,138,0.12))] border-l-2 border-[var(--color-text-accent)]" : "",
                ].join(" ")}
              >
                {showLineNumbers && (
                  <span aria-hidden className="select-none mr-4 text-[var(--color-text-tertiary)] lumen-tnum">
                    {String(n).padStart(2, " ")}
                  </span>
                )}
                {line || " "}
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}

// Lumen CitationCard — Web React example.

import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";

export function CitationCard({
  index,
  source,
  excerpt,
  url,
  confidence,
  compact,
}: {
  index?: number;
  source: ReactNode;
  excerpt?: ReactNode;
  url?: string;
  confidence?: number;
  compact?: boolean;
}) {
  const Inner = (
    <>
      <div className="flex items-start gap-2">
        {index !== undefined && (
          <span className="lumen-tnum inline-flex h-5 min-w-5 px-1.5 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-surface-tint-accent)] text-[var(--color-text-accent)] text-[var(--type-eyebrow-mono)]">
            {index}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[var(--type-label-md)] font-medium text-[var(--color-text-primary)] truncate">
            {source}
            {url && <ExternalLink size={10} aria-hidden className="inline ml-1 opacity-70 align-baseline" />}
          </p>
          {excerpt && (
            <blockquote className="mt-1 text-[var(--type-body-sm)] italic text-[var(--color-text-secondary)] border-l-2 border-[var(--color-border-hairline)] pl-2">
              {excerpt}
            </blockquote>
          )}
          {confidence !== undefined && (
            <span className="mt-1 inline-block text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">
              {Math.round(confidence)}% confidence
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Source${index !== undefined ? ` ${index}` : ""}, ${typeof source === "string" ? source : ""}, opens in new tab`}
        className={[
          "block rounded-[var(--radius-card-default)] border border-[var(--color-border-hairline)]",
          "bg-[var(--color-surface-raised)] hover:border-[var(--color-border-accent)]",
          compact ? "p-[var(--space-inset-md)]" : "p-[var(--space-inset-lg)]",
          "transition-colors duration-[var(--motion-duration-fast)]",
          "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
        ].join(" ")}
      >
        {Inner}
      </a>
    );
  }
  return (
    <article
      className={[
        "rounded-[var(--radius-card-default)] border border-[var(--color-border-hairline)]",
        "bg-[var(--color-surface-raised)]",
        compact ? "p-[var(--space-inset-md)]" : "p-[var(--space-inset-lg)]",
      ].join(" ")}
    >
      {Inner}
    </article>
  );
}

import { ReactNode } from "react";

export type Crumb = { href?: string; label: ReactNode };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-[var(--type-13)] text-[var(--text-tertiary)] tracking-[var(--tracking-tight)] flex-wrap">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {c.href && !isLast ? (
                <a href={c.href} className="hover:text-[var(--text-primary)] transition-colors">{c.label}</a>
              ) : (
                <span className={isLast ? "text-[var(--text-primary)] font-medium" : ""}>{c.label}</span>
              )}
              {!isLast && (
                <span aria-hidden className="text-[var(--border-strong)]">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

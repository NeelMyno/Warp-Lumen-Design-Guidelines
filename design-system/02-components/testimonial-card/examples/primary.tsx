// Lumen TestimonialCard — Web React example.

import { Star } from "lucide-react";
import { ReactNode } from "react";

export function TestimonialCard({
  quote,
  author,
  role,
  company,
  avatar,
  rating,
  metric,
  variant = "marketing",
}: {
  quote: ReactNode;
  author: string;
  role?: string;
  company?: string;
  avatar?: ReactNode;
  rating?: number;
  metric?: ReactNode;
  variant?: "operator" | "marketing";
}) {
  return (
    <figure
      className={[
        "relative rounded-[var(--radius-card-lifted)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)]",
        variant === "marketing" ? "p-[var(--space-inset-xl)]" : "p-[var(--space-inset-lg,16px)]",
        variant === "marketing" ? "before:content-[''] before:absolute before:left-0 before:top-4 before:bottom-4 before:w-0.5 before:rounded-r-full before:bg-[var(--color-text-accent)]" : "",
      ].join(" ")}
    >
      {metric && (
        <p className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-accent)] mb-2">{metric}</p>
      )}
      <blockquote className={[variant === "marketing" ? "text-[var(--type-heading-h3)] font-medium tracking-tight" : "text-[var(--type-body-md)]", "text-[var(--color-text-primary)]"].join(" ")}>
        {quote}
      </blockquote>
      {typeof rating === "number" && (
        <div className="mt-3 inline-flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} of 5 stars`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={12} aria-hidden className={i <= Math.round(rating) ? "fill-[var(--color-status-warning-500)] text-[var(--color-status-warning-500)]" : "text-[var(--color-text-tertiary)]"} />
          ))}
        </div>
      )}
      <figcaption className="mt-4 flex items-center gap-3">
        {avatar && <span className="shrink-0">{avatar}</span>}
        <div>
          <p className="text-[var(--type-label-md)] font-medium text-[var(--color-text-primary)]">{author}</p>
          {(role || company) && (
            <p className="text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]">
              {role}{role && company ? ", " : ""}{company}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

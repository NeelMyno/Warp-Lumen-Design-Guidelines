import { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta?: ReactNode;
}) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="flex items-center gap-2 mb-4">
        <div className="lumen-eyebrow">{eyebrow}</div>
        {meta && <span className="text-[var(--text-tertiary)]">·</span>}
        {meta}
      </div>
      <h1 className="text-display-md md:text-display-lg text-[var(--text-primary)]">
        {title}
      </h1>
      <p className="mt-4 max-w-[60ch] text-body-md md:text-body-lg text-[var(--text-secondary)]">
        {description}
      </p>
    </header>
  );
}

export function Section({
  id,
  title,
  description,
  eyebrow,
  meta,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="lumen-reveal scroll-mt-32 border-t border-[var(--border-hairline)] pt-12 md:pt-16"
    >
      <div className="mb-8 md:mb-10 flex flex-col gap-2">
        {eyebrow && <div className="lumen-eyebrow mb-1">{eyebrow}</div>}
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h2 className="text-display-sm md:text-heading-h1 font-semibold text-[var(--text-primary)]">
            {title}
          </h2>
          {meta}
        </div>
        {description && (
          <p className="max-w-[68ch] text-body-sm md:text-body-md text-[var(--text-tertiary)]">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function SubSection({
  title,
  description,
  meta,
  children,
}: {
  title: string;
  description?: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div className="lumen-eyebrow">{title}</div>
          {description && (
            <div className="text-body-xs text-[var(--text-tertiary)]">
              {description}
            </div>
          )}
        </div>
        {meta}
      </div>
      {children}
    </div>
  );
}

import { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-12">
      <div className="dash-eyebrow mb-2">{eyebrow}</div>
      <h1 className="text-[var(--type-39)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)] text-[var(--text-primary)]">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-[var(--type-18)] text-[var(--text-secondary)] leading-[var(--leading-snug)]">
        {description}
      </p>
    </header>
  );
}

export function Section({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="mb-16 scroll-mt-32 border-t border-[var(--border-subtle)] pt-10"
    >
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-[var(--type-25)] font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-[var(--type-15)] text-[var(--text-secondary)] leading-[var(--leading-snug)]">
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
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="dash-eyebrow mb-3">{title}</div>
      {children}
    </div>
  );
}

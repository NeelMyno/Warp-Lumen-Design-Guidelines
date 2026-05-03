import { ReactNode } from "react";

export function Card({
  children,
  padding = "md",
  className = "",
}: {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}) {
  const pad =
    padding === "none"
      ? ""
      : padding === "sm"
        ? "p-3"
        : padding === "lg"
          ? "p-6"
          : "p-4";
  return (
    <div className={`dash-card ${pad} ${className}`}>{children}</div>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="text-[var(--type-15)] font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          {title}
        </div>
        {description && (
          <div className="text-[var(--type-13)] text-[var(--text-tertiary)]">
            {description}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

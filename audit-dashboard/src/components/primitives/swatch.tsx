import { ReactNode } from "react";

export function Swatch({
  name,
  value,
  role,
  cssVar,
  size = "md",
}: {
  name: string;
  value: string;
  role?: string;
  cssVar?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-12" : size === "lg" ? "h-20" : "h-16";
  return (
    <div className="dash-card flex flex-col overflow-hidden">
      <div
        className={`${dim} w-full`}
        style={{ background: cssVar ? `var(${cssVar})` : value }}
      />
      <div className="px-3 py-2.5 border-t border-[var(--border-subtle)] flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[var(--type-14)] font-medium text-[var(--text-primary)]">
            {name}
          </span>
          <code className="dash-mono text-[var(--type-12)] text-[var(--text-tertiary)]">
            {value}
          </code>
        </div>
        {role && (
          <div className="text-[var(--type-12)] text-[var(--text-tertiary)]">
            {role}
          </div>
        )}
      </div>
    </div>
  );
}

export function SwatchGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </div>
  );
}

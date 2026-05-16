// Lumen SearchField — Web React example.

"use client";

import { Search, X } from "lucide-react";
import { KeyboardEvent, ReactNode } from "react";

type Variant = "inline" | "prominent" | "command";
type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, string> = {
  sm: "h-8 text-[var(--type-label-sm)]",
  md: "h-9 text-[var(--type-body-md)]",
  lg: "h-11 text-[var(--type-body-md)]",
};

export function SearchField({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Search…",
  variant = "inline",
  size = "md",
  loading,
  kbdHint,
  ariaLabel = "Search",
}: {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  kbdHint?: ReactNode;
  ariaLabel?: string;
}) {
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      e.preventDefault();
      onSubmit();
    } else if (e.key === "Escape") {
      if (value) {
        e.preventDefault();
        onValueChange("");
      }
    }
  };

  if (variant === "command") {
    return (
      <button
        type="button"
        onClick={onSubmit}
        aria-label={ariaLabel}
        className={[
          "inline-flex items-center gap-2 px-3 rounded-[var(--radius-control-md)]",
          "border border-[var(--color-border-hairline)] bg-[var(--color-surface-input-rest)]",
          "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-action-ghost-bg-hover)]",
          SIZE[size],
          "outline-none focus-visible:shadow-[var(--shadow-focus)]",
          "transition-colors duration-[var(--motion-duration-fast)]",
        ].join(" ")}
      >
        <Search size={14} aria-hidden />
        <span>{placeholder}</span>
        {kbdHint && <span className="ml-2">{kbdHint}</span>}
      </button>
    );
  }

  return (
    <form
      role="search"
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}
      className={[
        "relative flex items-center gap-2 px-3 rounded-[var(--radius-control-md)]",
        "border border-[var(--color-border-default)] bg-[var(--color-surface-input-rest)]",
        "focus-within:border-[var(--color-border-focus)] focus-within:shadow-[var(--shadow-focus)]",
        SIZE[size],
        "transition-colors duration-[var(--motion-duration-fast)]",
      ].join(" ")}
    >
      {loading ? (
        <span aria-hidden className="size-3.5 rounded-full border-2 border-[var(--color-text-tertiary)] border-r-transparent animate-spin motion-reduce:animate-none" />
      ) : (
        <Search aria-hidden size={14} className="text-[var(--color-text-tertiary)] shrink-0" />
      )}
      <input
        type="search"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={onKey}
        className="flex-1 bg-transparent outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onValueChange("")}
          className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-[var(--radius-control-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-action-ghost-bg-hover)]"
        >
          <X size={10} aria-hidden />
        </button>
      )}
      {kbdHint && !value && <span className="shrink-0">{kbdHint}</span>}
    </form>
  );
}

// Lumen TagsInput — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/tags-input.tsx.
// Tokens come from dist/tailwind/lumen.css which you import in your global css.

"use client";

import { useState, useId, type KeyboardEvent } from "react";
import { X } from "lucide-react";

export type TagsInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  max?: number;
  name?: string;
  "aria-label"?: string;
};

export function TagsInput({
  value,
  onChange,
  placeholder = "Add tag…",
  size = "md",
  disabled,
  max,
  name,
  ...rest
}: TagsInputProps) {
  const [draft, setDraft] = useState("");
  const [announce, setAnnounce] = useState("");
  const liveId = useId();

  function add(raw: string) {
    const t = raw.trim();
    if (!t) return;
    if (value.includes(t)) {
      setDraft("");
      return;
    }
    if (max !== undefined && value.length >= max) return;
    onChange([...value, t]);
    setDraft("");
  }

  function remove(t: string) {
    onChange(value.filter((x) => x !== t));
    setAnnounce(`Removed ${t}`);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      e.preventDefault();
      remove(value[value.length - 1]);
    }
  }

  return (
    <>
      <div
        className="lumen-field"
        data-size={size === "md" ? undefined : size}
        data-disabled={disabled ? "true" : undefined}
        style={{
          height: "auto",
          minHeight: "var(--size-control-md)",
          flexWrap: "wrap",
          paddingBlock: "var(--space-1)",
          gap: "var(--space-1)",
        }}
      >
        {value.map((t) => (
          <span
            key={t}
            className="inline-flex items-center text-body-xs"
            style={{
              gap: "var(--space-1)",
              height: 24,
              paddingInline: "var(--space-2)",
              borderRadius: "var(--radius-sm)",
              background: "var(--color-surface-sunken)",
              color: "var(--color-text-secondary)",
              pointerEvents: "auto",
            }}
          >
            {t}
            <button
              type="button"
              onClick={() => remove(t)}
              disabled={disabled}
              aria-label={`Remove ${t}`}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={10} aria-hidden />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => add(draft)}
          disabled={disabled}
          placeholder={value.length ? "" : placeholder}
          className="min-w-[var(--space-20)]"
          style={{ width: "auto" }}
          {...rest}
        />
        {name && (
          <input type="hidden" name={name} value={value.join(",")} />
        )}
      </div>
      <span
        id={liveId}
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {announce}
      </span>
    </>
  );
}

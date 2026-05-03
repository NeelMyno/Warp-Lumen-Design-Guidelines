// Lumen Combobox — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/combobox.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.

"use client";

import {
  useState,
  useRef,
  useEffect,
  useId,
  type KeyboardEvent,
} from "react";
import { ChevronDown } from "lucide-react";

const cn = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

export type ComboboxOption = string | { label: string; value: string };

export type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  name?: string;
  maxVisible?: number;
  "aria-label"?: string;
};

const norm = (o: ComboboxOption) =>
  typeof o === "string" ? { label: o, value: o } : o;

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Type or pick…",
  size = "md",
  disabled,
  name,
  maxVisible = 8,
  ...rest
}: ComboboxProps) {
  const [draft, setDraft] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const matches = options
    .map(norm)
    .filter((o) => o.label.toLowerCase().includes(draft.toLowerCase()))
    .slice(0, maxVisible);

  function pick(v: string, label: string) {
    setDraft(label);
    onChange?.(v);
    setOpen(false);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => Math.min(i + 1, matches.length - 1));
      setOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      setHighlight(0);
    } else if (e.key === "End") {
      setHighlight(matches.length - 1);
    } else if (e.key === "Enter" && matches[highlight]) {
      e.preventDefault();
      pick(matches[highlight].value, matches[highlight].label);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative w-full">
      <div
        className="lumen-field"
        data-size={size === "md" ? undefined : size}
        data-disabled={disabled ? "true" : undefined}
      >
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => !disabled && setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            open && matches[highlight]
              ? `${listboxId}-${highlight}`
              : undefined
          }
          {...rest}
        />
        <span
          data-slot="trailing"
          aria-hidden
          className={cn(
            "transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-easing-standard)]",
            open && "rotate-180",
          )}
          style={{ color: "var(--combobox-trigger-caretColor, var(--color-text-tertiary))" }}
        >
          <ChevronDown size={14} />
        </span>
      </div>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 overflow-hidden p-1"
          style={{
            background: "var(--color-surface-popover)",
            border: "1px solid var(--color-border-default)",
            borderRadius: "var(--radius-popover)",
            boxShadow: "var(--shadow-popover)",
            maxHeight: "var(--combobox-listbox-maxHeight)",
            overflowY: "auto",
          }}
        >
          {matches.length === 0 ? (
            <div
              className="px-3 py-2 text-center text-body-xs"
              style={{
                color: "var(--color-text-tertiary)",
              }}
            >
              No matches
            </div>
          ) : (
            matches.map((o, i) => (
              <button
                key={o.value}
                id={`${listboxId}-${i}`}
                type="button"
                role="option"
                aria-selected={i === highlight}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => pick(o.value, o.label)}
                className="w-full text-left transition-colors text-body-sm"
                style={{
                  height: "var(--size-control-sm)",
                  paddingInline: "var(--space-2)",
                  paddingBlock: "var(--space-1)",
                  borderRadius: "var(--radius-xs)",
                  background:
                    i === highlight
                      ? "var(--color-surface-tint-accent)"
                      : "transparent",
                  color:
                    i === highlight
                      ? "var(--color-text-primary)"
                      : "var(--color-text-secondary)",
                }}
              >
                {o.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

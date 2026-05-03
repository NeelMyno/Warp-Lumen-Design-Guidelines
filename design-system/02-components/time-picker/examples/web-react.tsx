// Lumen TimePicker — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/time-picker.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.

"use client";

import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
} from "react";

const cn = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

export type TimePickerProps = {
  value?: string; // HH:MM 24h
  onChange?: (value: string) => void;
  format?: "12h" | "24h";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  name?: string;
};

function detectFormat(): "12h" | "24h" {
  if (typeof navigator === "undefined") return "24h";
  const sample = new Intl.DateTimeFormat(navigator.language, {
    hour: "numeric",
  }).format(new Date(2000, 0, 1, 13));
  return /am|pm/i.test(sample) ? "12h" : "24h";
}

function parse(value: string | undefined) {
  if (!value) return { h: 12, m: 0 };
  const [hStr, mStr] = value.split(":");
  return {
    h: Math.min(Math.max(parseInt(hStr, 10) || 0, 0), 23),
    m: Math.min(Math.max(parseInt(mStr, 10) || 0, 0), 59),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function TimePicker({
  value,
  onChange,
  format,
  size = "md",
  disabled,
  name,
}: TimePickerProps) {
  const formatRef = useRef<"12h" | "24h">(format ?? detectFormat());
  const [parsed, setParsed] = useState(parse(value));
  const [draftH, setDraftH] = useState(pad(parsed.h));
  const [draftM, setDraftM] = useState(pad(parsed.m));
  const minRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const next = parse(value);
    setParsed(next);
    setDraftH(pad(next.h));
    setDraftM(pad(next.m));
  }, [value]);

  function commit(h: number, m: number) {
    const next = `${pad(h)}:${pad(m)}`;
    setParsed({ h, m });
    onChange?.(next);
  }

  function onChangeH(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, "").slice(0, 2);
    setDraftH(v);
    if (v.length === 2) minRef.current?.focus();
  }
  function onChangeM(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, "").slice(0, 2);
    setDraftM(v);
  }
  function onBlurH() {
    const limit = formatRef.current === "12h" ? 12 : 23;
    const min = formatRef.current === "12h" ? 1 : 0;
    const h = Math.min(Math.max(parseInt(draftH, 10) || min, min), limit);
    setDraftH(pad(h));
    commit(formatRef.current === "12h" && parsed.h >= 12 ? (h % 12) + 12 : h, parsed.m);
  }
  function onBlurM() {
    const m = Math.min(Math.max(parseInt(draftM, 10) || 0, 0), 59);
    setDraftM(pad(m));
    commit(parsed.h, m);
  }

  const isPm = parsed.h >= 12;
  const setMeridiem = (next: "am" | "pm") => {
    const h12 = parsed.h % 12;
    const h24 = next === "pm" ? h12 + 12 : h12;
    commit(h24, parsed.m);
  };

  const hh = formatRef.current === "12h"
    ? pad(parsed.h % 12 || 12)
    : draftH;

  return (
    <div
      className="lumen-field"
      data-mono="true"
      data-size={size === "md" ? undefined : size}
      data-disabled={disabled ? "true" : undefined}
      style={{ width: "auto", paddingInline: "var(--space-2)" }}
    >
      <input
        value={formatRef.current === "12h" ? hh : draftH}
        onChange={onChangeH}
        onBlur={onBlurH}
        disabled={disabled}
        maxLength={2}
        inputMode="numeric"
        aria-label="Hours"
        className="text-center"
        style={{
          width: 28,
          fontVariantNumeric: "tabular-nums lining-nums",
          fontFeatureSettings: '"tnum" 1, "lnum" 1',
        }}
      />
      <span
        aria-hidden
        style={{
          color: "var(--color-text-tertiary)",
          pointerEvents: "none",
        }}
      >
        :
      </span>
      <input
        ref={minRef}
        value={draftM}
        onChange={onChangeM}
        onBlur={onBlurM}
        disabled={disabled}
        maxLength={2}
        inputMode="numeric"
        aria-label="Minutes"
        className="text-center"
        style={{
          width: 28,
          fontVariantNumeric: "tabular-nums lining-nums",
          fontFeatureSettings: '"tnum" 1, "lnum" 1',
        }}
      />
      {formatRef.current === "12h" && (
        <div
          role="radiogroup"
          aria-label="am or pm"
          className="ml-1 inline-flex p-1"
          style={{
            background: "var(--color-surface-sunken)",
            borderRadius: "var(--radius-sm)",
            pointerEvents: "auto",
          }}
        >
          {(["am", "pm"] as const).map((m) => {
            const active = m === (isPm ? "pm" : "am");
            return (
              <button
                key={m}
                data-interactive
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setMeridiem(m)}
                disabled={disabled}
                className={cn("transition-colors text-overline")}
                style={{
                  paddingInline: "var(--space-2)",
                  paddingBlock: "var(--space-1)",
                  borderRadius: "var(--radius-xs)",
                  background: active
                    ? "var(--color-surface-raised)"
                    : "transparent",
                  color: active
                    ? "var(--color-text-primary)"
                    : "var(--color-text-tertiary)",
                  boxShadow: active ? "var(--shadow-xs)" : undefined,
                }}
              >
                {m}
              </button>
            );
          })}
        </div>
      )}
      {name && (
        <input
          type="hidden"
          name={name}
          value={`${pad(parsed.h)}:${pad(parsed.m)}`}
        />
      )}
    </div>
  );
}

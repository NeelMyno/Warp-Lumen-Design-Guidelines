// Lumen OtpInput — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/otp-input.tsx.
// Tokens come from dist/tailwind/lumen.css which you import in your global css.

"use client";

import {
  useRef,
  useState,
  useEffect,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

export type OtpInputProps = {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  groupBy?: number;
  ariaLabel?: string;
};

const SIZE_PX: Record<NonNullable<OtpInputProps["size"]>, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  size = "lg",
  disabled,
  groupBy,
  ariaLabel = "One-time passcode",
}: OtpInputProps) {
  const [internal, setInternal] = useState<string[]>(
    Array(length).fill(""),
  );
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const cells =
    value !== undefined
      ? value.padEnd(length, "").split("").slice(0, length)
      : internal;

  function commit(next: string[]) {
    if (value === undefined) setInternal(next);
    const joined = next.join("");
    onChange?.(joined);
    if (joined.length === length && !next.includes("")) onComplete?.(joined);
  }

  function setAt(i: number, v: string) {
    const clean = v.replace(/\D/g, "").slice(0, 1);
    const next = [...cells];
    next[i] = clean;
    commit(next);
    if (clean && i < length - 1) refs.current[i + 1]?.focus();
  }

  function onKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !cells[i] && i > 0) {
      e.preventDefault();
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  }

  function onPaste(i: number, e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length - i);
    if (!pasted) return;
    e.preventDefault();
    const next = [...cells];
    for (let k = 0; k < pasted.length; k++) next[i + k] = pasted[k];
    commit(next);
    const lastFilled = Math.min(i + pasted.length - 1, length - 1);
    refs.current[lastFilled]?.focus();
  }

  useEffect(() => {
    if (value !== undefined) return;
  }, [value]);

  const cellPx = SIZE_PX[size];

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center"
      style={{ gap: "var(--space-2)" }}
    >
      {Array.from({ length }).map((_, i) => (
        <span key={i} style={{ display: "contents" }}>
          <div
            className="lumen-field"
            data-mono="true"
            data-size={size === "md" ? undefined : size}
            data-disabled={disabled ? "true" : undefined}
            style={{
              width: cellPx,
              // shell override — see ADR 0014; will be cleaned up in v0.9
              // via a `data-padding="none"` modifier on the lumen-field shell.
              padding: 0,
              justifyContent: "center",
            }}
          >
            <input
              ref={(el) => {
                refs.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              value={cells[i] ?? ""}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              onPaste={(e) => onPaste(i, e)}
              disabled={disabled}
              aria-label={`OTP digit ${i + 1} of ${length}`}
              className="text-center text-body-lg"
              style={{
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums lining-nums",
                fontFeatureSettings: '"tnum" 1, "lnum" 1, "zero" 1',
              }}
            />
          </div>
          {groupBy && (i + 1) % groupBy === 0 && i < length - 1 && (
            <span aria-hidden style={{ width: "var(--space-3)" }} />
          )}
        </span>
      ))}
    </div>
  );
}

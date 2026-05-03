// Lumen PasswordInput — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/password-input.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.

"use client";

import { useState, type InputHTMLAttributes, type KeyboardEvent } from "react";

const cn = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

export type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  size?: "sm" | "md" | "lg";
  showLabel?: string;
  hideLabel?: string;
};

export function PasswordInput({
  size = "md",
  disabled,
  showLabel = "Show",
  hideLabel = "Hide",
  autoComplete = "current-password",
  onKeyUp,
  className,
  ...rest
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  function trackCapsLock(e: KeyboardEvent<HTMLInputElement>) {
    setCapsLock(e.getModifierState?.("CapsLock") ?? false);
    onKeyUp?.(e);
  }

  return (
    <div>
      <div
        className={cn("lumen-field", className)}
        data-mono="true"
        data-size={size === "md" ? undefined : size}
        data-disabled={disabled ? "true" : undefined}
      >
        <input
          {...rest}
          type={show ? "text" : "password"}
          disabled={disabled}
          autoComplete={autoComplete}
          onKeyUp={trackCapsLock}
          style={{
            fontFamily: show ? undefined : "var(--font-mono)",
            letterSpacing: show ? undefined : "0.1em",
          }}
        />
        <span data-slot="trailing">
          <button
            type="button"
            data-interactive
            onClick={() => setShow((s) => !s)}
            aria-pressed={show}
            aria-label={show ? "Hide password" : "Show password"}
            disabled={disabled}
            className="transition-colors disabled:opacity-40 text-micro font-mono"
            style={{
              textTransform: "uppercase",
              paddingInline: "var(--space-2)",
              paddingBlock: "var(--space-1)",
              borderRadius: "var(--radius-xs)",
              color: "var(--color-text-secondary)",
            }}
          >
            {show ? hideLabel : showLabel}
          </button>
        </span>
      </div>
      {capsLock && (
        <p
          role="status"
          aria-live="polite"
          className="text-body-xs"
          style={{
            marginTop: "var(--space-1)",
            color: "var(--color-text-warning, var(--color-text-tertiary))",
          }}
        >
          Caps Lock is on
        </p>
      )}
    </div>
  );
}

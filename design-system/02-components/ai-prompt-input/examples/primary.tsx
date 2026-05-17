// Lumen AIPromptInput — Web React example. Auto-grow textarea + AI-shimmer send.

// lumen-allow-file: on-grid-px
// Lumen library example — inline layout pixels in a self-contained demo (4-pt grid). The audit-tokens.ts hard gate (excludes examples/ + audit-dashboard/) enforces the strict rule on shipped library source.
"use client";

import { Sparkles, Square, Paperclip } from "lucide-react";
import { KeyboardEvent, ReactNode, useEffect, useRef } from "react";

export function AIPromptInput({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Ask anything…",
  modelSelector,
  attachments,
  onAttach,
  tokenCount,
  tokenLimit,
  disabled,
  loading,
  onStop,
  maxRows = 8,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  modelSelector?: ReactNode;
  attachments?: ReactNode;
  onAttach?: () => void;
  tokenCount?: number;
  tokenLimit?: number;
  disabled?: boolean;
  loading?: boolean;
  onStop?: () => void;
  maxRows?: number;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  // Auto-grow
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const lineHeight = 20;
    ta.style.height = Math.min(maxRows * lineHeight, ta.scrollHeight) + "px";
  }, [value, maxRows]);

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!disabled && !loading && value.trim().length) onSubmit();
    }
  };

  return (
    <form
      role="form"
      aria-label="AI prompt"
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className={[
        "rounded-[var(--radius-card-default)] border border-[var(--color-border-default)]",
        "bg-[var(--color-surface-raised)] focus-within:border-[var(--color-border-focus)]",
        "p-[var(--space-inset-md)] flex flex-col gap-[var(--space-stack-sm)]",
        "transition-colors duration-[var(--motion-duration-fast)]",
      ].join(" ")}
    >
      {attachments && <div className="flex flex-wrap gap-1">{attachments}</div>}
      <textarea
        ref={taRef}
        aria-label="Prompt"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={onKey}
        disabled={disabled}
        rows={1}
        className={[
          "w-full bg-transparent resize-none outline-none",
          "text-[var(--type-body-md)] text-[var(--color-text-primary)]",
          "placeholder:text-[var(--color-text-tertiary)]",
          "min-h-[20px]",
        ].join(" ")}
      />
      <div className="flex items-center gap-2">
        {modelSelector}
        {onAttach && (
          <button
            type="button"
            onClick={onAttach}
            aria-label="Attach"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-control-md)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]"
          >
            <Paperclip size={14} aria-hidden />
          </button>
        )}
        {tokenCount !== undefined && (
          <span className="ml-auto text-[var(--type-eyebrow-mono)] text-[var(--color-text-tertiary)] lumen-tnum">
            {tokenCount}{tokenLimit !== undefined ? ` / ${tokenLimit}` : ""} tokens
          </span>
        )}
        {loading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="ml-auto inline-flex h-8 items-center gap-1.5 px-3 rounded-[var(--radius-control-md)] bg-[var(--color-action-secondary-bg-rest)] text-[var(--color-action-secondary-fg)] text-[var(--type-label-sm)] font-medium hover:bg-[var(--color-action-secondary-bg-hover)]"
          >
            <Square size={12} aria-hidden />
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={disabled || !value.trim().length}
            className={[
              "ml-auto inline-flex h-8 items-center gap-1.5 px-3 rounded-[var(--radius-control-md)] font-medium",
              "bg-[var(--color-action-ai-bg-rest)] text-[var(--color-action-ai-fg)] text-[var(--type-label-sm)]",
              "hover:bg-[var(--color-action-ai-bg-hover)]",
              "shadow-[var(--shadow-button-ai-shimmer)] motion-reduce:shadow-none",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
              "disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none",
            ].join(" ")}
          >
            <Sparkles size={12} aria-hidden />
            Send
          </button>
        )}
      </div>
    </form>
  );
}

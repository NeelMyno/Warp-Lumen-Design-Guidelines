// Lumen FileDropzone — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/file-dropzone.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.

"use client";

import { useState, useId, type DragEvent, type ChangeEvent } from "react";
import { Plus, X } from "lucide-react";

const cn = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

export type FileDropzoneProps = {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  hint?: string;
  title?: string;
  disabled?: boolean;
  name?: string;
};

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const allowed = accept.split(",").map((s) => s.trim().toLowerCase());
  const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
  const mime = file.type.toLowerCase();
  return allowed.some((rule) => {
    if (rule.startsWith(".")) return rule === ext;
    if (rule.endsWith("/*")) return mime.startsWith(rule.slice(0, -1));
    return rule === mime;
  });
}

export function FileDropzone({
  onFiles,
  accept,
  multiple = true,
  maxSize,
  hint = "PDF, CSV, XLSX up to 25 MB",
  title = "Drop files here or browse",
  disabled,
  name,
}: FileDropzoneProps) {
  const [over, setOver] = useState(false);
  const [picked, setPicked] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const liveId = useId();

  function accept_(files: File[]) {
    let next = files;
    if (accept) next = next.filter((f) => matchesAccept(f, accept));
    if (maxSize !== undefined) {
      const tooBig = next.find((f) => f.size > maxSize);
      if (tooBig) {
        setError(
          `${tooBig.name} is larger than ${(maxSize / 1024 / 1024).toFixed(1)} MB`,
        );
        next = next.filter((f) => f.size <= maxSize);
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
    if (!multiple) next = next.slice(0, 1);
    setPicked(next);
    onFiles?.(next);
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setOver(false);
    if (disabled) return;
    accept_(Array.from(e.dataTransfer.files));
  }

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    accept_(Array.from(e.target.files ?? []));
  }

  function remove(f: File) {
    const next = picked.filter((x) => x !== f);
    setPicked(next);
    onFiles?.(next);
  }

  return (
    <>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        aria-disabled={disabled || undefined}
        className={cn(
          "block w-full cursor-pointer text-center transition-[border-color,background-color]",
          disabled && "cursor-not-allowed opacity-60",
        )}
        style={{
          borderRadius: "var(--radius-lg)",
          borderStyle: "dashed",
          borderWidth: "1px",
          paddingInline: "var(--space-4)",
          paddingBlock: "var(--space-8)",
          borderColor: error
            ? "var(--color-border-error)"
            : over
              ? "var(--color-accent-500)"
              : "var(--color-border-default)",
          background: over
            ? "var(--color-alpha-accent-12, rgba(74,222,128,0.08))"
            : "transparent",
          transitionDuration: "var(--motion-duration-fast)",
          transitionTimingFunction: "var(--motion-easing-standard)",
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={onPick}
          className="sr-only"
          name={name}
        />
        <div className="flex flex-col items-center" style={{ gap: "var(--space-2)" }}>
          <span
            className="inline-flex items-center justify-center"
            style={{
              height: 40,
              width: 40,
              borderRadius: "var(--radius-full)",
              background: "var(--color-surface-sunken)",
              color: "var(--color-text-secondary)",
            }}
          >
            <Plus size={18} aria-hidden />
          </span>
          <div
            className="text-label-md"
            style={{
              color: "var(--color-text-primary)",
            }}
          >
            Drop files here or{" "}
            <span
              style={{
                color: "var(--color-text-accent)",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              browse
            </span>
          </div>
          <div className="text-body-xs" style={{ color: "var(--color-text-tertiary)" }}>
            {hint}
          </div>
        </div>

        {picked.length > 0 && (
          <div className="mt-4 text-left flex flex-col" style={{ gap: 4 }}>
            {picked.map((f) => (
              <div
                key={f.name}
                className="flex items-center justify-between"
                style={{
                  gap: "var(--space-2)",
                  paddingInline: "var(--space-2)",
                  paddingBlock: "var(--space-1)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface-sunken)",
                }}
              >
                <span
                  className="truncate text-body-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {f.name}
                </span>
                <span
                  className="inline-flex items-center text-overline"
                  style={{
                    gap: "var(--space-2)",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  {(f.size / 1024).toFixed(1)} KB
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      remove(f);
                    }}
                    aria-label={`Remove ${f.name}`}
                    className="opacity-60 hover:opacity-100"
                  >
                    <X size={12} aria-hidden />
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </label>

      {error && (
        <p
          role="alert"
          className="text-body-xs"
          style={{
            marginTop: "var(--space-1)",
            color: "var(--color-text-error)",
          }}
        >
          {error}
        </p>
      )}

      <span id={liveId} role="status" aria-live="polite" className="sr-only">
        {picked.length === 0
          ? ""
          : `${picked.length} file${picked.length === 1 ? "" : "s"} selected`}
      </span>
    </>
  );
}

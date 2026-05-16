// Lumen Panel — Web React example. In-flow section with optional collapse.
// Inspector variant adds a left-edge resize handle (keyboard-resizable).

"use client";

import { ChevronDown } from "lucide-react";
import { ReactNode, useId, useState, KeyboardEvent } from "react";

type Variant = "plain" | "bordered" | "inspector";
type Level = "h2" | "h3" | "h4";

export type PanelProps = {
  title: ReactNode;
  description?: ReactNode;
  variant?: Variant;
  collapsible?: boolean;
  defaultOpen?: boolean;
  headingLevel?: Level;
  leading?: ReactNode;
  trailing?: ReactNode;
  resizable?: boolean;
  initialWidth?: number;
  onWidthChange?: (px: number) => void;
  children: ReactNode;
};

export function Panel({
  title,
  description,
  variant = "plain",
  collapsible = false,
  defaultOpen = true,
  headingLevel = "h3",
  leading,
  trailing,
  resizable = false,
  initialWidth = 360,
  onWidthChange,
  children,
}: PanelProps) {
  const headerId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [width, setWidth] = useState(initialWidth);

  const wrapperChrome = variant === "bordered" || variant === "inspector"
    ? "border border-[var(--color-border-default)] rounded-[var(--radius-card-default)] bg-[var(--color-surface-raised)]"
    : "";
  const padding = variant === "plain" ? "" : "p-[var(--space-inset-xl)]";

  const Heading: keyof JSX.IntrinsicElements = headingLevel;

  const header = (
    <header className={["flex items-start justify-between gap-3", variant === "plain" ? "mb-[var(--space-stack-md)]" : "mb-[var(--space-stack-sm)]"].join(" ")}>
      <div className="min-w-0 flex items-start gap-3">
        {leading && <span className="shrink-0 mt-0.5">{leading}</span>}
        <div className="min-w-0">
          <Heading id={headerId} className="text-[var(--type-heading-h3)] font-medium tracking-tight text-[var(--color-text-primary)] truncate">
            {title}
          </Heading>
          {description && (
            <p className="mt-1 text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {trailing}
        {collapsible && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${headerId}-body`}
            onClick={() => setOpen((o) => !o)}
            className={[
              "inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-control-sm)]",
              "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]",
              "hover:bg-[var(--color-action-ghost-bg-hover)]",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
              "transition-colors duration-[var(--motion-duration-fast)]",
            ].join(" ")}
          >
            <ChevronDown
              size={14}
              aria-hidden
              className={[open ? "rotate-180" : "", "transition-transform duration-[var(--motion-duration-base)]"].join(" ")}
              style={{ transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)" }}
            />
          </button>
        )}
      </div>
    </header>
  );

  const onResizeKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!resizable) return;
    let next = width;
    if (e.key === "ArrowLeft") next -= 10;
    else if (e.key === "ArrowRight") next += 10;
    else if (e.key === "Home") next = 240;
    else if (e.key === "End") next = 640;
    else return;
    e.preventDefault();
    next = Math.min(640, Math.max(240, next));
    setWidth(next);
    onWidthChange?.(next);
  };

  return (
    <section
      aria-labelledby={headerId}
      data-variant={variant}
      className={[wrapperChrome, padding, "relative"].join(" ")}
      style={variant === "inspector" ? { width } : undefined}
    >
      {variant === "inspector" && resizable && (
        <button
          type="button"
          aria-label="Resize inspector"
          onKeyDown={onResizeKey}
          className={[
            "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize",
            "bg-transparent hover:bg-[var(--color-border-default)]",
            "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
          ].join(" ")}
        />
      )}
      {header}
      <div id={`${headerId}-body`} aria-hidden={!open} className={open ? "" : "hidden"}>
        {children}
      </div>
    </section>
  );
}

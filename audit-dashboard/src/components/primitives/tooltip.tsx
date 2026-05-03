"use client";

import { ReactNode, useState, useId } from "react";

/**
 * Lightweight CSS tooltip — no portal, no arrow tip, just a tasteful dark
 * bubble that appears on hover/focus. For complex tooltips with rich content,
 * promote to a Popover.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  delay = 350,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => setOpen(true), delay));
  }
  function hide() {
    if (timer) clearTimeout(timer);
    setOpen(false);
  }

  const placement: Record<string, string> = {
    top:    "bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2",
    bottom: "top-[calc(100%+6px)] left-1/2 -translate-x-1/2",
    left:   "right-[calc(100%+6px)] top-1/2 -translate-y-1/2",
    right:  "left-[calc(100%+6px)] top-1/2 -translate-y-1/2",
  };

  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <span aria-describedby={open ? id : undefined}>{children}</span>
      {open && (
        <span
          id={id}
          role="tooltip"
          className={[
            "absolute z-[var(--z-tooltip)] pointer-events-none",
            "px-2 py-1 rounded-[var(--radius-sm)] whitespace-nowrap",
            "bg-[var(--surface-inverse)] text-[var(--text-inverse)]",
            "text-[var(--type-11)] font-medium tracking-[var(--tracking-tight)]",
            "shadow-[var(--shadow-popover)]",
            "animate-[tt-in_120ms_cubic-bezier(0.2,0,0,1)_both]",
            placement[side],
          ].join(" ")}
        >
          {content}
        </span>
      )}
      <style>{`
        @keyframes tt-in {
          from { opacity: 0; transform: translate(-50%, 4px) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, 0)    scale(1);    }
        }
      `}</style>
    </span>
  );
}

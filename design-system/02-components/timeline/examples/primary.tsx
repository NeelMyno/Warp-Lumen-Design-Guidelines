// Lumen Timeline — Web React example.

import { ReactNode } from "react";

export type TimelineItem = {
  id: string;
  marker?: ReactNode;
  time: string;       // human label
  dateTime: string;   // ISO 8601 — for <time>
  actor?: string;
  title: ReactNode;
  body?: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

const TONE: Record<NonNullable<TimelineItem["tone"]>, { bg: string; fg: string }> = {
  neutral: { bg: "bg-[var(--color-surface-sunken)]",         fg: "text-[var(--color-text-tertiary)]" },
  success: { bg: "bg-[var(--color-status-success-bg)]",      fg: "text-[var(--color-status-success-fg)]" },
  warning: { bg: "bg-[var(--color-status-warning-bg)]",      fg: "text-[var(--color-status-warning-fg)]" },
  danger:  { bg: "bg-[var(--color-status-danger-bg)]",       fg: "text-[var(--color-status-danger-fg)]" },
  info:    { bg: "bg-[var(--color-status-info-bg)]",         fg: "text-[var(--color-status-info-fg)]" },
};

export function Timeline({
  items,
  orientation = "vertical",
  density = "regular",
  ariaLabel,
  showConnector = true,
}: {
  items: TimelineItem[];
  orientation?: "vertical" | "horizontal";
  density?: "compact" | "regular" | "comfortable";
  ariaLabel: string;
  showConnector?: boolean;
}) {
  const gap = density === "compact" ? "gap-3" : density === "comfortable" ? "gap-6" : "gap-4";
  return (
    <ol
      role="list"
      aria-label={ariaLabel}
      className={[
        orientation === "vertical" ? "flex flex-col" : "flex",
        gap,
      ].join(" ")}
    >
      {items.map((item, i) => {
        const tone = TONE[item.tone ?? "neutral"];
        const isLast = i === items.length - 1;
        return (
          <li key={item.id} className={[
            "relative",
            orientation === "vertical" ? "flex gap-3" : "flex-1 flex flex-col items-center text-center",
          ].join(" ")}>
            <div className={["relative flex items-start", orientation === "vertical" ? "" : "flex-col"].join(" ")}>
              <span
                aria-hidden
                className={[
                  "shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full",
                  tone.bg,
                  tone.fg,
                  "border border-[var(--color-border-subtle)]",
                ].join(" ")}
              >
                {item.marker ?? <span className="block size-1.5 rounded-full bg-current" />}
              </span>
              {showConnector && !isLast && (
                <span
                  aria-hidden
                  className={[
                    "bg-[var(--color-border-hairline)]",
                    orientation === "vertical"
                      ? "absolute left-1/2 top-6 -translate-x-1/2 bottom-[-1rem] w-px"
                      : "absolute top-1/2 left-6 right-[-1rem] -translate-y-1/2 h-px",
                  ].join(" ")}
                />
              )}
            </div>
            <div className={["min-w-0 flex-1", orientation === "vertical" ? "pb-1" : ""].join(" ")}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <time dateTime={item.dateTime} className="lumen-tnum text-[var(--type-micro)] uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  {item.time}
                </time>
                {item.actor && (
                  <span className="text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]">· {item.actor}</span>
                )}
              </div>
              <p className={["mt-0.5 text-[var(--type-label-md)] text-[var(--color-text-primary)]"].join(" ")}>
                {item.title}
              </p>
              {item.body && (
                <div className="mt-1 text-[var(--type-body-sm)] text-[var(--color-text-secondary)]">{item.body}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

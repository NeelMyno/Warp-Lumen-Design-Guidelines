/**
 * @lumen/shipment-timeline — v0.13 Phase 2 freight-domain composite.
 * ----------------------------------------------------------------------------
 * Vertical timeline for freight stages. Active stage = LiveDot pulse + lime
 * accent. Pending stages can carry an ETA bubble. Status conveyed via icon +
 * label, never color alone.
 */
import * as React from "react";
import { Check, AlertCircle, Clock, Circle } from "lucide-react";

import { cn } from "@/lib/utils";
import { LiveDot } from "../live-dot/live-dot";

export type StageStatus = "pending" | "active" | "done" | "failed";

export type Stage = {
  id: string;
  label: string;
  status: StageStatus;
  timestamp?: string;
  etaIso?: string;
  note?: string;
};

const STATUS_ICON: Record<StageStatus, React.ReactNode> = {
  pending: <Clock size={12} aria-hidden />,
  active: <Circle size={12} aria-hidden className="fill-current" />,
  done: <Check size={12} aria-hidden />,
  failed: <AlertCircle size={12} aria-hidden />,
};

function nodeChrome(status: StageStatus): { bg: string; fg: string; ring?: string } {
  if (status === "done") return { bg: "var(--color-accent)", fg: "var(--color-action-primary-fg)" };
  if (status === "active") return { bg: "var(--color-accent)", fg: "var(--color-action-primary-fg)" };
  if (status === "failed")
    return { bg: "var(--lumen-red-5)", fg: "#fff", ring: "var(--lumen-red-5)" };
  return { bg: "var(--surface-raised)", fg: "var(--text-tertiary)", ring: "var(--border-default)" };
}

export type ShipmentTimelineProps = {
  stages: Stage[];
  density?: "default" | "compact";
  className?: string;
};

export function ShipmentTimeline({ stages, density = "default", className }: ShipmentTimelineProps) {
  const pad = density === "compact" ? "py-2" : "py-3";
  return (
    <ol
      data-slot="shipment-timeline"
      className={cn("relative flex flex-col", className)}
    >
      {stages.map((s, i) => {
        const isLast = i === stages.length - 1;
        const chrome = nodeChrome(s.status);
        return (
          <li
            key={s.id}
            data-status={s.status}
            aria-current={s.status === "active" ? "step" : undefined}
            className={cn("relative flex gap-3", pad)}
          >
            {/* Rail */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[13px] top-7 bottom-0 w-px bg-[var(--border-hairline)]"
              />
            )}
            {/* Node */}
            <span
              aria-hidden
              className="relative shrink-0 inline-flex items-center justify-center size-7 rounded-full border z-10"
              style={{
                background: chrome.bg,
                color: chrome.fg,
                borderColor: chrome.ring ?? chrome.bg,
              }}
            >
              {STATUS_ICON[s.status]}
            </span>
            {/* Content */}
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={cn(
                    "font-medium text-[length:var(--type-13)]",
                    s.status === "done"
                      ? "text-[color:var(--text-secondary)]"
                      : s.status === "active"
                        ? "text-[color:var(--text-primary)]"
                        : s.status === "failed"
                          ? "text-[color:var(--lumen-red-5)]"
                          : "text-[color:var(--text-tertiary)]",
                  )}
                >
                  {s.label}
                </span>
                {s.timestamp && (
                  <span className="lumen-mono lumen-tnum text-[length:var(--type-11)] text-[color:var(--text-tertiary)] shrink-0">
                    {s.timestamp}
                  </span>
                )}
              </div>
              {s.status === "active" && <LiveDot label="Live" />}
              {s.status === "pending" && s.etaIso && (
                <span className="inline-flex w-fit items-center gap-1 px-1.5 h-5 rounded-[var(--radius-full)] text-[length:var(--type-10)] font-medium bg-[var(--pill-info-bg)] text-[var(--pill-info-fg)] border border-[var(--pill-info-border)] lumen-tnum">
                  <Clock size={10} aria-hidden /> ETA {new Date(s.etaIso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              {s.note && (
                <p className="text-[length:var(--type-11)] text-[color:var(--text-tertiary)] mt-0.5">
                  {s.note}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

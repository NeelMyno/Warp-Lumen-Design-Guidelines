// Lumen ChatBubble — Web React example.

// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

"use client";

import { Sparkles } from "lucide-react";
import { ReactNode } from "react";

type Speaker = "you" | "them" | "ai" | "system";

export function ChatBubble({
  speaker = "them",
  author,
  avatar,
  time,
  dateTime,
  body,
  streaming,
  reactions,
  actions,
  edited,
}: {
  speaker?: Speaker;
  author?: string;
  avatar?: ReactNode;
  time?: string;
  dateTime?: string;
  body: ReactNode;
  streaming?: boolean;
  reactions?: ReactNode;
  actions?: ReactNode;
  edited?: boolean;
}) {
  const isYou = speaker === "you";
  const isAi = speaker === "ai";
  const surface =
    isYou ? "bg-[var(--color-surface-tint-accent)] text-[var(--color-text-primary)]"
    : isAi ? "bg-[var(--color-action-ai-bg-rest)] text-[var(--color-action-ai-fg)] shadow-[var(--shadow-button-ai-shimmer)] motion-reduce:shadow-none"
    : speaker === "system" ? "bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] italic"
    : "bg-[var(--color-surface-raised)] border border-[var(--color-border-hairline)] text-[var(--color-text-primary)]";

  return (
    <li
      role="listitem"
      aria-busy={streaming || undefined}
      className={["group flex gap-2 max-w-full", isYou ? "flex-row-reverse" : ""].join(" ")}
    >
      {!isYou && avatar && <span className="shrink-0">{avatar}</span>}
      <div className={["max-w-[min(640px,75%)] min-w-0 flex flex-col gap-1", isYou ? "items-end" : ""].join(" ")}>
        {(author || time) && (
          <div className="flex items-baseline gap-2 text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">
            {isAi && <Sparkles size={10} aria-hidden className="text-[var(--color-text-accent)]" />}
            {author && <span>{author}</span>}
            {time && dateTime && (
              <time dateTime={dateTime} className="lumen-tnum">{time}</time>
            )}
            {edited && <span className="text-[var(--color-text-tertiary)] italic">(edited)</span>}
          </div>
        )}
        <div className={[
          "rounded-[var(--radius-card-default)] px-[var(--space-inset-lg)] py-[var(--space-inset-md)]",
          "text-[var(--type-body-md)] whitespace-pre-wrap break-words",
          surface,
        ].join(" ")}>
          {body}
          {streaming && (
            <span aria-hidden className="inline-flex ml-1 align-baseline gap-0.5">
              <span className="size-1 rounded-full bg-current animate-pulse motion-reduce:animate-none" />
              <span className="size-1 rounded-full bg-current animate-pulse motion-reduce:animate-none" style={{ animationDelay: "100ms" }} />
              <span className="size-1 rounded-full bg-current animate-pulse motion-reduce:animate-none" style={{ animationDelay: "200ms" }} />
            </span>
          )}
        </div>
        {(reactions || actions) && (
          <div className="flex items-center gap-2">
            {reactions}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">{actions}</span>
          </div>
        )}
      </div>
    </li>
  );
}

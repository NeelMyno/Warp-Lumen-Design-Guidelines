// Lumen CommentThread — Web React example. Simplified.

"use client";

import { Check, MessageSquare } from "lucide-react";
import { ReactNode } from "react";

export type Comment = {
  id: string;
  author: string;
  avatar?: ReactNode;
  time: string;
  dateTime: string;
  body: ReactNode;
  reactions?: ReactNode;
  edited?: boolean;
  replies?: Comment[];
};

export function CommentThread({
  comments,
  resolved,
  onResolve,
  composerSlot,
  ariaLabel = "Comment thread",
}: {
  comments: Comment[];
  resolved?: boolean;
  onResolve?: () => void;
  composerSlot?: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <section
      role="region"
      aria-label={ariaLabel}
      className={[
        "rounded-[var(--radius-card-default)] border border-[var(--color-border-hairline)]",
        "bg-[var(--color-surface-raised)] p-[var(--space-inset-lg)]",
        resolved ? "opacity-70" : "",
      ].join(" ")}
    >
      <header className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-2 text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">
          <MessageSquare size={12} aria-hidden />
          <span className="lumen-tnum">{comments.length}</span> Comments
          {resolved && <span className="text-[var(--color-text-accent)]">· Resolved</span>}
        </span>
        {onResolve && !resolved && (
          <button
            type="button"
            onClick={onResolve}
            className="inline-flex h-7 items-center gap-1 px-2 rounded-[var(--radius-control-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)] text-[var(--type-body-sm)]"
          >
            <Check size={12} aria-hidden />
            Resolve
          </button>
        )}
      </header>
      <ol role="log" aria-live="polite" className="flex flex-col gap-3">
        {comments.map((c) => (
          <CommentRow key={c.id} comment={c} depth={0} />
        ))}
      </ol>
      {composerSlot && <div className="mt-3 border-t border-[var(--color-border-hairline)] pt-3">{composerSlot}</div>}
    </section>
  );
}

function CommentRow({ comment, depth }: { comment: Comment; depth: number }) {
  return (
    <li className={[depth === 1 ? "pl-8 border-l border-[var(--color-border-subtle)]" : ""].join(" ")}>
      <div className="flex gap-2">
        {comment.avatar && <span className="shrink-0 mt-0.5">{comment.avatar}</span>}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 text-[var(--type-label-md)]">
            <span className="font-medium text-[var(--color-text-primary)]">{comment.author}</span>
            <time dateTime={comment.dateTime} className="lumen-tnum text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">
              {comment.time}
            </time>
            {comment.edited && <span className="text-[var(--type-eyebrow-mono)] text-[var(--color-text-tertiary)]">(edited)</span>}
          </div>
          <div className="text-[var(--type-body-md)] text-[var(--color-text-primary)] mt-0.5 whitespace-pre-wrap">{comment.body}</div>
          {comment.reactions && <div className="mt-1">{comment.reactions}</div>}
          {comment.replies && depth === 0 && (
            <ol className="mt-2 flex flex-col gap-2">
              {comment.replies.map((r) => (
                <CommentRow key={r.id} comment={r} depth={depth + 1} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </li>
  );
}

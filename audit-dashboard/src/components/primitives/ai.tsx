"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, Plus, Search as SearchIcon, Bell, Inbox, Check, X, Code } from "./icon";

/* ─────────────────────────  AI BADGE  ───────────────────────── */
export function AIBadge({ label = "AI generated" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-[var(--radius-full)] text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--text-accent)] bg-[var(--surface-tint-accent)] border border-[color-mix(in_oklab,var(--lumen-accent-4)_30%,transparent)]">
      <Sparkles size={10} />
      {label}
    </span>
  );
}
function Sparkles({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.6 5.2L18.8 9l-5.2 1.6L12 16l-1.6-5.4L5.2 9l5.2-1.8z" />
      <path d="M19 16l.8 2 2 .8-2 .8L19 22l-.8-2-2-.8 2-.8z" opacity="0.7" />
    </svg>
  );
}

/* ─────────────────────────  AI THINKING INDICATOR  ───────────────────────── */
export function AIThinking() {
  return (
    <div className="inline-flex items-center gap-2 text-[var(--type-13)] text-[var(--text-tertiary)]">
      <span className="relative inline-flex h-4 w-4">
        <Sparkles size={14} />
      </span>
      <span>Thinking</span>
      <span className="inline-flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-[var(--text-tertiary)]"
            style={{ animation: `lumen-bounce 0.9s ${i * 0.12}s infinite ease-in-out` }}
          />
        ))}
      </span>
      <style>{`@keyframes lumen-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4 } 40% { transform: translateY(-3px); opacity: 1 } }`}</style>
    </div>
  );
}

/* ─────────────────────────  AI CONFIDENCE LABEL  ───────────────────────── */
export function AIConfidence({ score }: { score: number }) {
  const tone = score >= 0.8 ? ["var(--lumen-accent-7)", "var(--lumen-accent-1)"] : score >= 0.5 ? ["var(--lumen-amber-7)", "var(--lumen-amber-1)"] : ["var(--lumen-red-7)", "var(--lumen-red-1)"];
  return (
    <span className="inline-flex items-center gap-1.5 h-5 px-1.5 rounded-[var(--radius-full)] text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)]" style={{ color: tone[0], background: tone[1] }}>
      <span className="lumen-mono">{Math.round(score * 100)}%</span> confidence
    </span>
  );
}

/* ─────────────────────────  AI PROMPT INPUT  ───────────────────────── */
export function AIPromptInput() {
  const [val, setVal] = useState("Generate a quote for 8 pallets, dry van, Dallas to Long Beach, pickup Friday");
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] shadow-[var(--shadow-sm)] overflow-hidden">
      <div className="px-3 pt-2 pb-1 flex items-center gap-2 border-b border-[var(--border-hairline)]">
        <span className="text-[var(--text-accent)]"><Sparkles size={14} /></span>
        <span className="text-[var(--type-12)] text-[var(--text-tertiary)]">Lumen AI · Lane Suggestion</span>
        <select className="ml-auto text-[var(--type-11)] text-[var(--text-tertiary)] bg-transparent focus:outline-none lumen-mono">
          <option>opus 4.7</option><option>sonnet 4.6</option><option>haiku 4.5</option>
        </select>
      </div>
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={3}
        className="w-full p-3 bg-transparent text-[var(--type-13)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none resize-none leading-[var(--leading-normal)]"
      />
      <div className="px-3 py-2 flex items-center justify-between border-t border-[var(--border-hairline)]">
        <div className="flex items-center gap-1">
          <button className="h-7 px-2 inline-flex items-center gap-1 rounded-[var(--radius-sm)] text-[var(--type-12)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]"><Plus size={12} /> Attach</button>
          <button className="h-7 px-2 rounded-[var(--radius-sm)] text-[var(--type-12)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]">Templates</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="lumen-kbd">⌘⏎</span>
          <button className="h-8 px-3 inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] text-[var(--type-12)] font-semibold">
            <Sparkles size={11} /> Generate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  AI SUGGESTION CARD  ───────────────────────── */
export function AISuggestion() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-tint-accent)] p-4 max-w-[480px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-accent)]"><Sparkles size={13} /></span>
          <span className="text-[var(--type-12)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--text-accent)]">Lumen suggestion</span>
        </div>
        <AIConfidence score={0.86} />
      </div>
      <div className="text-[var(--type-15)] font-semibold tracking-[var(--tracking-tight)] mb-2">
        Reroute via Albuquerque to save $284
      </div>
      <p className="text-[var(--type-13)] text-[var(--text-secondary)] leading-[var(--leading-snug)]">
        Saia carries this lane at $0.18/mi vs current $0.24/mi. Adds 38 mi but stays inside SLA.
        Sterling LTL has 4 active loads on the new path so capacity is reliable.
      </p>
      <div className="flex items-center gap-2 mt-3">
        <button className="h-8 px-3 rounded-[var(--radius-md)] bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] text-[var(--type-12)] font-semibold">Apply</button>
        <button className="h-8 px-3 rounded-[var(--radius-md)] bg-[var(--surface-raised)] border border-[var(--border-default)] text-[var(--type-12)] font-medium">Dismiss</button>
        <span className="ml-auto text-[var(--type-11)] text-[var(--text-tertiary)] flex items-center gap-2">
          <button aria-label="Helpful" className="hover:text-[var(--text-primary)]">👍</button>
          <button aria-label="Not helpful" className="hover:text-[var(--text-primary)]">👎</button>
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────  AI CITATION  ───────────────────────── */
export function AICitation({ index = 1, source = "Sterling LTL contract — Section 4.2", excerpt = "All multi-stop shipments under 12,000 lbs are billed at base rate plus $42 per additional stop." }: { index?: number; source?: string; excerpt?: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-3 max-w-[420px] flex gap-3">
      <span className="h-5 w-5 inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-tint-accent)] text-[var(--text-accent)] text-[10px] font-semibold lumen-mono">{index}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[var(--type-12)] font-semibold tracking-[var(--tracking-tight)] truncate">{source}</div>
        <p className="text-[var(--type-12)] text-[var(--text-tertiary)] mt-1 leading-[var(--leading-snug)] line-clamp-2">{excerpt}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────  AI LOADING SHIMMER  ───────────────────────── */
export function AIShimmer() {
  return (
    <div className="space-y-2">
      {[100, 88, 70, 92].map((w, i) => (
        <span
          key={i}
          className="block h-3 rounded-[3px] bg-[linear-gradient(90deg,var(--surface-sunken),var(--surface-tint-accent),var(--surface-sunken))] bg-[length:200%_100%]"
          style={{ width: `${w}%`, animation: `lumen-shimmer 1.6s ${i * 0.12}s ease-in-out infinite` }}
        />
      ))}
      <style>{`@keyframes lumen-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
    </div>
  );
}

/* ─────────────────────────  CHAT BUBBLE  ───────────────────────── */
export function ChatBubble({ from, children, time }: { from: "you" | "them" | "ai"; children: ReactNode; time?: string }) {
  const isYou = from === "you";
  return (
    <div className={["flex gap-2 max-w-[80%]", isYou ? "ml-auto flex-row-reverse" : ""].join(" ")}>
      {!isYou && (
        <span className={[
          "h-7 w-7 shrink-0 rounded-full inline-flex items-center justify-center text-[var(--type-11)] font-semibold lumen-mono text-white",
          from === "ai" ? "bg-[var(--lumen-accent-5)]" : "bg-[var(--lumen-navy-7)]",
        ].join(" ")}>
          {from === "ai" ? <Sparkles size={12} /> : "DS"}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <div
          className={[
            "rounded-[var(--radius-lg)] px-3.5 py-2 text-[var(--type-13)] leading-[var(--leading-snug)]",
            isYou
              ? "bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] rounded-tr-[6px]"
              : from === "ai"
              ? "bg-[var(--surface-tint-accent)] text-[var(--text-primary)] border border-[color-mix(in_oklab,var(--lumen-accent-4)_30%,transparent)] rounded-tl-[6px]"
              : "bg-[var(--surface-sunken)] text-[var(--text-primary)] rounded-tl-[6px]",
          ].join(" ")}
        >
          {children}
        </div>
        {time && <span className="text-[10px] text-[var(--text-tertiary)] lumen-mono">{time}</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────  CHAT COMPOSER  ───────────────────────── */
export function ChatComposer() {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] flex items-end gap-2 px-3 py-2">
      <button className="h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:bg-[var(--surface-sunken)]"><Plus size={14} /></button>
      <textarea rows={1} placeholder="Message…" className="flex-1 bg-transparent text-[var(--type-13)] placeholder:text-[var(--text-tertiary)] focus:outline-none resize-none py-1.5" />
      <button className="h-8 px-3 rounded-[var(--radius-md)] bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] text-[var(--type-12)] font-semibold">Send</button>
    </div>
  );
}

/* ─────────────────────────  TYPING INDICATOR  ───────────────────────── */
export function TypingIndicator({ name = "Daniel" }: { name?: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[var(--type-12)] text-[var(--text-tertiary)]">
      <span className="inline-flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[var(--text-tertiary)]"
            style={{ animation: `lumen-bounce 0.9s ${i * 0.12}s infinite ease-in-out` }}
          />
        ))}
      </span>
      <span>{name} is typing</span>
    </div>
  );
}

/* ─────────────────────────  NOTIFICATION ITEM  ───────────────────────── */
export function NotificationItem({
  title,
  body,
  time,
  unread,
  icon = <Bell size={14} />,
  tone = "info",
}: {
  title: string;
  body?: string;
  time: string;
  unread?: boolean;
  icon?: ReactNode;
  tone?: "info" | "warn" | "danger" | "success";
}) {
  const toneBg: Record<string, string> = {
    info: "var(--lumen-sky-1)",
    warn: "var(--lumen-amber-1)",
    danger: "var(--lumen-red-1)",
    success: "var(--lumen-accent-1)",
  };
  const toneFg: Record<string, string> = {
    info: "var(--lumen-sky-7)",
    warn: "var(--lumen-amber-7)",
    danger: "var(--lumen-red-7)",
    success: "var(--lumen-accent-7)",
  };
  return (
    <div className={["flex gap-3 px-3 py-2.5", unread ? "bg-[var(--surface-tint-accent)]/50" : ""].join(" ")}>
      <span
        className="h-8 w-8 rounded-full inline-flex items-center justify-center shrink-0"
        style={{ background: toneBg[tone], color: toneFg[tone] }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[var(--type-13)] font-medium tracking-[var(--tracking-tight)] truncate">{title}</span>
          {unread && <span className="h-1.5 w-1.5 rounded-full bg-[var(--lumen-accent-5)]" />}
        </div>
        {body && <div className="text-[var(--type-12)] text-[var(--text-tertiary)] mt-0.5 line-clamp-2 leading-[var(--leading-snug)]">{body}</div>}
        <div className="text-[10px] text-[var(--text-tertiary)] lumen-mono mt-1">{time}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────  NOTIFICATION CENTER  ───────────────────────── */
export function NotificationCenter() {
  return (
    <div className="w-[380px] rounded-[var(--radius-xl)] bg-[var(--surface-popover)] border border-[var(--border-default)] shadow-[var(--shadow-popover)] overflow-hidden">
      <div className="h-12 px-4 flex items-center justify-between border-b border-[var(--border-hairline)]">
        <span className="text-[var(--type-13)] font-semibold tracking-[var(--tracking-tight)] flex items-center gap-2"><Inbox size={14} /> Inbox <span className="lumen-mono text-[var(--text-tertiary)]">3</span></span>
        <button className="text-[var(--type-12)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">Mark all read</button>
      </div>
      <div className="divide-y divide-[var(--border-hairline)]">
        <NotificationItem unread title="New rate accepted" body="Sterling LTL accepted your $1,840 quote on Lane TX→CA-014." time="2 min ago" tone="success" icon={<Check size={14} />} />
        <NotificationItem unread title="Saia capacity dropped 18% this week" body="Six pending quotes on Saia routes need re-evaluation." time="14 min ago" tone="warn" />
        <NotificationItem title="Driver vetting completed for Estes Express" time="1 h ago" tone="info" />
        <NotificationItem title="Carrier scorecard exported to Slack" time="Yesterday" tone="info" />
      </div>
    </div>
  );
}

/* ─────────────────────────  COPILOT SIDE PANEL  ───────────────────────── */
export function CopilotPanel() {
  return (
    <div className="w-[360px] rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] shadow-[var(--shadow-modal)] overflow-hidden flex flex-col h-[460px]">
      <div className="h-12 px-3 flex items-center justify-between border-b border-[var(--border-hairline)]">
        <span className="flex items-center gap-2 text-[var(--type-13)] font-semibold tracking-[var(--tracking-tight)]">
          <span className="text-[var(--text-accent)]"><Sparkles size={13} /></span>
          Lumen Copilot
        </span>
        <button aria-label="Close" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><X size={13} /></button>
      </div>
      <div className="p-3 flex flex-col gap-3 overflow-auto flex-1">
        <ChatBubble from="them" time="10:42 AM">Why is our spot rate exposure up this week?</ChatBubble>
        <ChatBubble from="ai" time="10:42 AM">Three lanes shifted to spot pricing because the contracted carrier (Saia) hit capacity. <span className="lumen-mono text-[var(--text-tertiary)]">$842 estimated impact this week.</span></ChatBubble>
        <AICitation index={1} />
        <ChatBubble from="them" time="10:43 AM">Suggest a fix that doesn't break SLA.</ChatBubble>
        <AIThinking />
      </div>
      <div className="p-3 border-t border-[var(--border-hairline)]">
        <ChatComposer />
      </div>
    </div>
  );
}

/* ─────────────────────────  COMMENT THREAD  ───────────────────────── */
export function CommentThread() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-4 max-w-[420px]">
      <div className="flex gap-3 mb-3">
        <span className="h-7 w-7 rounded-full bg-[var(--lumen-navy-7)] text-white inline-flex items-center justify-center text-[var(--type-11)] lumen-mono font-semibold shrink-0">DS</span>
        <div className="flex-1">
          <div className="text-[var(--type-13)]">
            <span className="font-semibold tracking-[var(--tracking-tight)]">Daniel Sokolovsky</span>
            <span className="text-[var(--text-tertiary)] ml-2 text-[var(--type-12)]">14 min ago</span>
          </div>
          <p className="text-[var(--type-13)] text-[var(--text-secondary)] mt-1 leading-[var(--leading-snug)]">
            Can we get a sanity check on the @sterling-ltl numbers? Their fuel surcharge looks 11% high.
          </p>
          <div className="flex items-center gap-3 mt-2 text-[var(--type-11)] text-[var(--text-tertiary)]">
            <button className="hover:text-[var(--text-primary)]">Reply</button>
            <button className="hover:text-[var(--text-primary)]">Resolve</button>
            <span className="lumen-mono">2 replies</span>
          </div>
        </div>
      </div>
      <div className="ml-10 pl-4 border-l border-[var(--border-hairline)] flex gap-3">
        <span className="h-7 w-7 rounded-full bg-[var(--lumen-amber-5)] text-white inline-flex items-center justify-center text-[var(--type-11)] lumen-mono font-semibold shrink-0">JK</span>
        <div className="flex-1">
          <div className="text-[var(--type-13)]">
            <span className="font-semibold tracking-[var(--tracking-tight)]">Jordan Kim</span>
            <span className="text-[var(--text-tertiary)] ml-2 text-[var(--type-12)]">3 min ago</span>
          </div>
          <p className="text-[var(--type-13)] text-[var(--text-secondary)] mt-1">Pulled the underlying — they re-baselined yesterday. Numbers check out.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  EMOJI REACTION BAR  ───────────────────────── */
export function ReactionBar() {
  const items = [["🎉", 4], ["👍", 12], ["🚀", 3], ["🤔", 1]] as const;
  return (
    <div className="inline-flex items-center gap-1">
      {items.map(([e, n]) => (
        <button key={e} className="inline-flex items-center gap-1 h-6 px-1.5 rounded-[var(--radius-full)] bg-[var(--surface-sunken)] hover:bg-[var(--surface-tint-accent)] border border-[var(--border-hairline)] text-[var(--type-11)]">
          <span>{e}</span>
          <span className="lumen-mono text-[var(--text-tertiary)]">{n}</span>
        </button>
      ))}
      <button className="h-6 w-6 rounded-[var(--radius-full)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] inline-flex items-center justify-center">+</button>
    </div>
  );
}

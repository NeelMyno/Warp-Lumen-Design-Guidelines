"use client";

import { ReactNode, useState } from "react";
import { Sparkles } from "lucide-react";
import { ChevronDown, Plus, Search as SearchIcon, Bell, Inbox, Check, X, Code } from "./icon";
import { Button } from "./button";

/* ─────────────────────────  AI BADGE  ───────────────────────── */
export function AIBadge({ label = "AI generated" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 h-5 px-[var(--space-1_5)] rounded-[var(--radius-full)] text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[color:var(--text-accent)] bg-[var(--surface-tint-accent)] border border-[color-mix(in_oklab,var(--lumen-accent-4)_30%,transparent)]">
      <Sparkles size={10} strokeWidth={2} aria-hidden focusable={false} />
      {label}
    </span>
  );
}

/* ─────────────────────────  AI THINKING INDICATOR  ───────────────────────── */
export function AIThinking() {
  return (
    <div className="inline-flex items-center gap-2 text-body-xs text-[color:var(--text-tertiary)]">
      <span className="relative inline-flex h-4 w-4">
        <Sparkles size={14} strokeWidth={2} aria-hidden focusable={false} />
      </span>
      <span>Thinking</span>
      <span className="inline-flex items-end gap-1">
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

/* ─────────────────────────  AI CONFIDENCE LABEL  ─────────────────────────
   v0.11.3 — switched to --pill-{success,warn,danger}-* tokens for AAA mode-
   aware contrast. ≥80% = success tone, 50–79% = warn tone, <50% = danger tone.
   The aria-label spells out the score for screen readers (the visual % glyph
   is decorative). */
export function AIConfidence({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const cls =
    score >= 0.8
      ? "bg-[var(--pill-success-bg)] text-[var(--pill-success-fg)] border-[var(--pill-success-border)]"
      : score >= 0.5
      ? "bg-[var(--pill-warn-bg)] text-[var(--pill-warn-fg)] border-[var(--pill-warn-border)]"
      : "bg-[var(--pill-danger-bg)] text-[var(--pill-danger-fg)] border-[var(--pill-danger-border)]";
  return (
    <span
      className={[
        "inline-flex items-center gap-[var(--space-1_5)] h-5 px-[var(--space-1_5)] rounded-[var(--radius-full)] text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] border",
        cls,
      ].join(" ")}
      aria-label={`AI confidence ${pct} percent`}
    >
      <span className="lumen-mono" aria-hidden>{pct}%</span>
      <span aria-hidden>confidence</span>
    </span>
  );
}

/* ─────────────────────────  AI PROMPT INPUT  ───────────────────────── */
export function AIPromptInput() {
  const [val, setVal] = useState("Generate a quote for 8 pallets, dry van, Dallas to Long Beach, pickup Friday");
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] shadow-[var(--shadow-sm)] overflow-hidden">
      <div className="px-3 pt-2 pb-1 flex items-center gap-2 border-b border-[var(--border-hairline)]">
        <span className="text-[color:var(--text-accent)]"><Sparkles size={14} /></span>
        <span className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">Lumen AI · Lane Suggestion</span>
        <select className="ml-auto text-[length:var(--type-11)] text-[color:var(--text-tertiary)] bg-transparent focus:outline-none lumen-mono">
          <option>opus 4.7</option><option>sonnet 4.6</option><option>haiku 4.5</option>
        </select>
      </div>
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={3}
        className="w-full p-3 bg-transparent text-[length:var(--type-13)] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none resize-none leading-[var(--leading-normal)]"
      />
      <div className="px-3 py-2 flex items-center justify-between border-t border-[var(--border-hairline)]">
        <div className="flex items-center gap-1">
          <button className="h-7 px-2 inline-flex items-center gap-1 rounded-[var(--radius-sm)] text-[length:var(--type-12)] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] hover:bg-[var(--surface-sunken)]"><Plus size={12} /> Attach</button>
          <button className="h-7 px-2 rounded-[var(--radius-sm)] text-[length:var(--type-12)] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] hover:bg-[var(--surface-sunken)]">Templates</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="lumen-kbd">⌘⏎</span>
          <Button intent="primary" size="sm" leadingIcon={<Sparkles size={11} aria-hidden />}>
            Generate
          </Button>
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
          <span className="text-[color:var(--text-accent)]"><Sparkles size={13} /></span>
          <span className="text-[length:var(--type-12)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[color:var(--text-accent)]">Lumen suggestion</span>
        </div>
        <AIConfidence score={0.86} />
      </div>
      <div className="text-heading-h5 mb-2">
        Reroute via Albuquerque to save $284
      </div>
      <p className="text-body-xs text-[color:var(--text-secondary)] leading-[var(--leading-snug)]">
        Saia carries this lane at $0.18/mi vs current $0.24/mi. Adds 38 mi but stays inside SLA.
        Sterling LTL has 4 active loads on the new path so capacity is reliable.
      </p>
      <div className="flex items-center gap-2 mt-3">
        <Button intent="primary" size="sm">Apply</Button>
        <Button intent="secondary" size="sm">Dismiss</Button>
        <span className="ml-auto text-[length:var(--type-11)] text-[color:var(--text-tertiary)] flex items-center gap-2">
          <button aria-label="Helpful" className="hover:text-[color:var(--text-primary)]">👍</button>
          <button aria-label="Not helpful" className="hover:text-[color:var(--text-primary)]">👎</button>
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────  AI CITATION  ───────────────────────── */
export function AICitation({ index = 1, source = "Sterling LTL contract — Section 4.2", excerpt = "All multi-stop shipments under 12,000 lbs are billed at base rate plus $42 per additional stop." }: { index?: number; source?: string; excerpt?: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-3 max-w-[420px] flex gap-3">
      <span className="h-5 w-5 inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-tint-accent)] text-[color:var(--text-accent)] text-[10px] font-semibold lumen-mono">{index}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[length:var(--type-12)] font-semibold tracking-[var(--tracking-tight)] truncate">{source}</div>
        <p className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)] mt-1 leading-[var(--leading-snug)] line-clamp-2">{excerpt}</p>
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
        /* v0.11.13.3 — fg color is conditional. AI variant (lime bg) gets the
            canonical accent-fg (#07120D); the obsidian-7 variant keeps white.
            No more white-on-lime — see ADR 0016. */
        <span className={[
          "h-7 w-7 shrink-0 rounded-full inline-flex items-center justify-center text-[length:var(--type-11)] font-semibold lumen-mono",
          from === "ai"
            ? "bg-[var(--lumen-accent-5)] text-[color:var(--lumen-accent-fg)]"
            : "bg-[var(--lumen-obsidian-7)] text-white",
        ].join(" ")}>
          {from === "ai" ? <Sparkles size={12} /> : "DS"}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <div
          className={[
            "rounded-[var(--radius-lg)] px-4 py-2 text-[length:var(--type-13)] leading-[var(--leading-snug)]",
            isYou
              ? "bg-[var(--lumen-accent-4)] text-[color:var(--lumen-accent-fg)] rounded-tr-[6px]"
              : from === "ai"
              ? "bg-[var(--surface-tint-accent)] text-[color:var(--text-primary)] border border-[color-mix(in_oklab,var(--lumen-accent-4)_30%,transparent)] rounded-tl-[6px]"
              : "bg-[var(--surface-sunken)] text-[color:var(--text-primary)] rounded-tl-[6px]",
          ].join(" ")}
        >
          {children}
        </div>
        {time && <span className="text-[10px] text-[color:var(--text-tertiary)] lumen-mono">{time}</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────  CHAT COMPOSER  ───────────────────────── */
export function ChatComposer() {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] flex items-end gap-2 px-3 py-2">
      <button className="h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-sm)] text-[color:var(--text-tertiary)] hover:bg-[var(--surface-sunken)]"><Plus size={14} /></button>
      <textarea rows={1} placeholder="Message…" className="flex-1 bg-transparent text-[length:var(--type-13)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none resize-none py-[var(--space-1_5)]" />
      <Button intent="primary" size="sm">Send</Button>
    </div>
  );
}

/* ─────────────────────────  TYPING INDICATOR  ───────────────────────── */
export function TypingIndicator({ name = "Daniel" }: { name?: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">
      <span className="inline-flex items-end gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-full bg-[var(--text-tertiary)]"
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
    info: "var(--lumen-cream-1)",
    warn: "var(--lumen-amber-1)",
    danger: "var(--lumen-red-1)",
    success: "var(--lumen-accent-1)",
  };
  const toneFg: Record<string, string> = {
    info: "var(--lumen-cream-7)",
    warn: "var(--lumen-amber-7)",
    danger: "var(--lumen-red-7)",
    success: "var(--lumen-accent-7)",
  };
  return (
    <div className={["flex gap-3 px-3 py-2", unread ? "bg-[var(--surface-tint-accent)]/50" : ""].join(" ")}>
      <span
        className="h-8 w-8 rounded-full inline-flex items-center justify-center shrink-0"
        style={{ background: toneBg[tone], color: toneFg[tone] }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[length:var(--type-13)] font-medium tracking-[var(--tracking-tight)] truncate">{title}</span>
          {unread && <span className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-full bg-[var(--lumen-accent-5)]" />}
        </div>
        {body && <div className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)] mt-1 line-clamp-2 leading-[var(--leading-snug)]">{body}</div>}
        <div className="text-[10px] text-[color:var(--text-tertiary)] lumen-mono mt-1">{time}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────  NOTIFICATION CENTER  ───────────────────────── */
export function NotificationCenter() {
  return (
    <div className="w-[380px] rounded-[var(--radius-xl)] bg-[var(--surface-popover)] border border-[var(--border-default)] shadow-[var(--shadow-popover)] overflow-hidden">
      <div className="h-12 px-4 flex items-center justify-between border-b border-[var(--border-hairline)]">
        <span className="text-heading-h6 flex items-center gap-2"><Inbox size={14} /> Inbox <span className="lumen-mono text-[color:var(--text-tertiary)]">3</span></span>
        <button className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]">Mark all read</button>
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
        <span className="flex items-center gap-2 text-heading-h6">
          <span className="text-[color:var(--text-accent)]"><Sparkles size={13} /></span>
          Lumen Copilot
        </span>
        <button aria-label="Close" className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]"><X size={13} /></button>
      </div>
      <div className="p-3 flex flex-col gap-3 overflow-auto flex-1">
        <ChatBubble from="them" time="10:42 AM">Why is our spot rate exposure up this week?</ChatBubble>
        <ChatBubble from="ai" time="10:42 AM">Three lanes shifted to spot pricing because the contracted carrier (Saia) hit capacity. <span className="lumen-mono text-[color:var(--text-tertiary)]">$842 estimated impact this week.</span></ChatBubble>
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
        <span className="h-7 w-7 rounded-full bg-[var(--lumen-obsidian-7)] text-white inline-flex items-center justify-center text-[length:var(--type-11)] lumen-mono font-semibold shrink-0">AM</span>
        <div className="flex-1">
          <div className="text-[length:var(--type-13)]">
            <span className="font-semibold tracking-[var(--tracking-tight)]">Avery Mercer</span>
            <span className="text-[color:var(--text-tertiary)] ml-2 text-[length:var(--type-12)]">14 min ago</span>
          </div>
          <p className="text-body-xs text-[color:var(--text-secondary)] mt-1 leading-[var(--leading-snug)]">
            Can we get a sanity check on the @sterling-ltl numbers? Their fuel surcharge looks 11% high.
          </p>
          <div className="flex items-center gap-3 mt-2 text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">
            <button className="hover:text-[color:var(--text-primary)]">Reply</button>
            <button className="hover:text-[color:var(--text-primary)]">Resolve</button>
            <span className="lumen-mono">2 replies</span>
          </div>
        </div>
      </div>
      <div className="ml-10 pl-4 border-l border-[var(--border-hairline)] flex gap-3">
        <span className="h-7 w-7 rounded-full bg-[var(--lumen-amber-5)] text-white inline-flex items-center justify-center text-[length:var(--type-11)] lumen-mono font-semibold shrink-0">JK</span>
        <div className="flex-1">
          <div className="text-[length:var(--type-13)]">
            <span className="font-semibold tracking-[var(--tracking-tight)]">Jordan Kim</span>
            <span className="text-[color:var(--text-tertiary)] ml-2 text-[length:var(--type-12)]">3 min ago</span>
          </div>
          <p className="text-body-xs text-[color:var(--text-secondary)] mt-1">Pulled the underlying — they re-baselined yesterday. Numbers check out.</p>
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
        <button key={e} className="inline-flex items-center gap-1 h-6 px-[var(--space-1_5)] rounded-[var(--radius-full)] bg-[var(--surface-sunken)] hover:bg-[var(--surface-tint-accent)] border border-[var(--border-hairline)] text-[length:var(--type-11)]">
          <span>{e}</span>
          <span className="lumen-mono text-[color:var(--text-tertiary)]">{n}</span>
        </button>
      ))}
      <button className="h-6 w-6 rounded-[var(--radius-full)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] inline-flex items-center justify-center">+</button>
    </div>
  );
}

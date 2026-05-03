"use client";

import { ReactNode, useState } from "react";
import { Search as SearchIcon, Bell, ChevronDown, X, Plus, Check, Home, Cart, User } from "./icon";

/* ─────────────────────────  PHONE FRAME  ───────────────────────── */
export function PhoneFrame({
  os = "ios",
  children,
  height = 600,
}: {
  os?: "ios" | "android";
  children: ReactNode;
  height?: number;
}) {
  return (
    <div
      className={[
        "relative w-[320px] mx-auto rounded-[40px] border bg-[var(--surface-canvas)] overflow-hidden shadow-[var(--shadow-2xl)]",
        os === "ios"
          ? "border-[var(--lumen-obsidian-9)]"
          : "border-[var(--lumen-cream-7)]",
      ].join(" ")}
      style={{ height, padding: "var(--space-3)" }}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center pointer-events-none">
        {os === "ios" ? (
          <div className="mt-2 h-7 w-[112px] rounded-full bg-[var(--lumen-obsidian-10)]" />
        ) : (
          <div className="mt-3 h-3 w-3 rounded-full border border-[var(--lumen-cream-4)] bg-[var(--lumen-obsidian-9)]" />
        )}
      </div>
      <div
        className="rounded-[30px] h-full bg-[var(--surface-canvas)] overflow-hidden flex flex-col relative"
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────  STATUS BAR  ───────────────────────── */
export function StatusBar({ time = "9:41", carrier = "Verizon" }: { time?: string; carrier?: string }) {
  return (
    <div className="h-10 px-5 flex items-center justify-between text-[12px] font-semibold lumen-mono text-[var(--text-primary)] shrink-0">
      <span>{time}</span>
      <div className="flex items-center gap-[var(--space-1_5)]">
        <span className="hidden sm:inline">{carrier}</span>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}
function SignalIcon() {
  return <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden><rect x="0" y="6" width="2" height="4" rx="0.5" fill="currentColor" /><rect x="3.5" y="4" width="2" height="6" rx="0.5" fill="currentColor" /><rect x="7" y="2" width="2" height="8" rx="0.5" fill="currentColor" /><rect x="10.5" y="0" width="2" height="10" rx="0.5" fill="currentColor" /></svg>;
}
function WifiIcon() {
  return <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><path d="M2 4a8 8 0 0 1 10 0" /><path d="M4 6a5 5 0 0 1 6 0" /><circle cx="7" cy="8.5" r="1" fill="currentColor" /></svg>;
}
function BatteryIcon() {
  return <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden><rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1" /><rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor" /><rect x="19.5" y="3.5" width="2" height="3" rx="0.6" fill="currentColor" /></svg>;
}

/* ─────────────────────────  BOTTOM SHEET  ───────────────────────── */
export function BottomSheet({
  title,
  children,
  detents = ["50%"],
  height = "60%",
}: {
  title?: string;
  children: ReactNode;
  detents?: string[];
  height?: string;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 rounded-t-[24px] bg-[var(--surface-popover)] shadow-[var(--shadow-modal)] border-t border-[var(--border-hairline)] flex flex-col" style={{ height }}>
      <div className="pt-2 pb-2 flex justify-center"><span className="h-1 w-10 rounded-full bg-[var(--border-strong)]" /></div>
      {title && (
        <div className="px-4 pb-2 text-center">
          <span className="text-heading-h5">{title}</span>
        </div>
      )}
      <div className="px-4 pb-6 overflow-y-auto flex-1">{children}</div>
    </div>
  );
}

/* ─────────────────────────  ACTION SHEET (iOS-style)  ───────────────────────── */
export function ActionSheet({ items }: { items: { label: string; danger?: boolean; cancel?: boolean }[] }) {
  const main = items.filter((i) => !i.cancel);
  const cancel = items.find((i) => i.cancel);
  return (
    <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2">
      <div className="rounded-[14px] bg-[var(--surface-popover)] backdrop-blur-md overflow-hidden border border-[var(--border-hairline)]">
        {main.map((it, i) => (
          <button
            key={i}
            className={[
              "w-full h-12 text-[var(--type-15)] text-center transition-colors",
              i < main.length - 1 ? "border-b border-[var(--border-hairline)]" : "",
              it.danger ? "text-[var(--lumen-red-7)]" : "text-[var(--text-link)]",
            ].join(" ")}
          >
            {it.label}
          </button>
        ))}
      </div>
      {cancel && (
        <button className="rounded-[14px] bg-[var(--surface-popover)] h-12 text-[var(--type-15)] font-semibold text-[var(--text-link)] border border-[var(--border-hairline)]">
          {cancel.label}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────  PERMISSION PROMPT (iOS)  ───────────────────────── */
export function PermissionPrompt({
  appName = "Warp",
  permission = "Use Your Location",
  description = "Used to estimate ETA and recommend nearby pickup points.",
}: {
  appName?: string;
  permission?: string;
  description?: string;
}) {
  return (
    <div className="absolute inset-0 bg-black/30 flex items-center justify-center px-6">
      <div className="w-full max-w-[280px] rounded-[14px] bg-[var(--surface-popover)] overflow-hidden">
        <div className="px-5 pt-5 pb-4 text-center">
          <div className="text-heading-h5">Allow "{appName}" to {permission}?</div>
          <div className="text-body-xs text-[var(--text-tertiary)] mt-2 leading-[var(--leading-snug)]">{description}</div>
        </div>
        <div className="border-t border-[var(--border-hairline)]">
          <button className="w-full h-control-touch text-[var(--type-14)] text-[var(--text-link)] border-b border-[var(--border-hairline)]">Allow Once</button>
          <button className="w-full h-control-touch text-[var(--type-14)] text-[var(--text-link)] border-b border-[var(--border-hairline)]">Allow While Using App</button>
          <button className="w-full h-control-touch text-[var(--type-14)] text-[var(--text-link)]">Don't Allow</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  PULL-TO-REFRESH  ───────────────────────── */
export function PullToRefresh() {
  return (
    <div className="flex items-center justify-center gap-2 py-3 text-[var(--type-12)] text-[var(--text-tertiary)]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
        <path d="M3 12a9 9 0 0 1 15.5-6.5L21 8" /><path d="M21 4v4h-4" />
      </svg>
      Refreshing…
    </div>
  );
}

/* ─────────────────────────  MOBILE LIST ITEM (iOS-style)  ───────────────────────── */
export function MobileListItem({
  title,
  meta,
  trailing,
  description,
  swipeable,
}: {
  title: string;
  meta?: string;
  trailing?: ReactNode;
  description?: string;
  swipeable?: boolean;
}) {
  return (
    <div className={["flex items-center gap-3 px-4 py-3 bg-[var(--surface-raised)]", swipeable ? "relative overflow-hidden" : ""].join(" ")}>
      <div className="flex-1 min-w-0">
        <div className="text-[var(--type-14)] font-medium tracking-[var(--tracking-tight)] truncate">{title}</div>
        {description && <div className="text-[var(--type-12)] text-[var(--text-tertiary)] truncate mt-1">{description}</div>}
      </div>
      <div className="flex items-center gap-2 shrink-0 text-[var(--type-12)] text-[var(--text-tertiary)] lumen-mono">
        {meta && <span>{meta}</span>}
        {trailing}
      </div>
    </div>
  );
}

/* ─────────────────────────  SWIPE ACTIONS (visual)  ───────────────────────── */
export function SwipeAction({ children, action = "Archive", danger }: { children: ReactNode; action?: string; danger?: boolean }) {
  return (
    <div className="relative overflow-hidden bg-[var(--surface-canvas)]">
      <div className="absolute inset-y-0 right-0 flex">
        <button className={["px-5 text-white text-[var(--type-13)] font-semibold", danger ? "bg-[var(--lumen-red-5)]" : "bg-[var(--lumen-amber-5)]"].join(" ")}>{action}</button>
      </div>
      <div className="relative bg-[var(--surface-raised)] -translate-x-[80px] transition-transform">{children}</div>
    </div>
  );
}

/* ─────────────────────────  BIOMETRIC PROMPT  ───────────────────────── */
export function FaceIDPrompt() {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-6">
      <div className="w-[260px] rounded-[14px] bg-[var(--surface-popover)] p-4 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-[var(--surface-sunken)] flex items-center justify-center mb-2">
          <FaceIcon />
        </div>
        <div className="text-[var(--type-14)] font-semibold tracking-[var(--tracking-tight)]">Face ID</div>
        <div className="text-[var(--type-12)] text-[var(--text-tertiary)] mt-1">Authenticate to continue</div>
      </div>
    </div>
  );
}
function FaceIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 8V6a1 1 0 0 1 1-1h2M19 8V6a1 1 0 0 0-1-1h-2M5 16v2a1 1 0 0 0 1 1h2M19 16v2a1 1 0 0 1-1 1h-2M9 9.5v1M15 9.5v1M9 15c1.7 1.5 4.3 1.5 6 0M12 9v4l-1 1" /></svg>;
}

/* ─────────────────────────  KEYBOARD ACCESSORY  ───────────────────────── */
export function KeyboardAccessoryBar() {
  return (
    <div className="border-t border-[var(--border-hairline)] bg-[var(--surface-sunken)] px-3 h-10 flex items-center justify-between">
      <div className="flex items-center gap-3 text-[var(--text-secondary)]">
        <button className="text-[var(--type-13)] font-semibold">Bold</button>
        <button className="text-[var(--type-13)]">Italic</button>
        <button className="text-[var(--type-13)]">Link</button>
      </div>
      <button className="text-[var(--type-13)] text-[var(--text-link)] font-semibold">Done</button>
    </div>
  );
}

/* ─────────────────────────  COACH MARK  ───────────────────────── */
export function CoachMark() {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--lumen-obsidian-9)] text-white p-3 max-w-[260px] shadow-[var(--shadow-modal)]">
      <div className="text-heading-h6">New: Quick rates</div>
      <p className="text-[var(--type-12)] text-[var(--lumen-obsidian-2)] mt-1 leading-[var(--leading-snug)]">
        Quote a lane in three taps. Swipe up from the bottom edge to begin.
      </p>
      <div className="flex items-center justify-between mt-3 text-[var(--type-11)]">
        <span className="lumen-mono text-[var(--lumen-obsidian-3)]">Step 2 of 4</span>
        <button className="bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] px-3 h-control-touch rounded-[var(--radius-sm)] font-semibold">Got it</button>
      </div>
    </div>
  );
}

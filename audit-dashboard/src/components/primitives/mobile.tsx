// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

"use client";

import { ReactNode, useState } from "react";
import { BatteryFull, Loader2, ScanFace, SignalHigh, Wifi } from "lucide-react";
import { Search as SearchIcon, Bell, ChevronDown, X, Plus, Check, Home, Cart, User } from "./icon";
import { Button } from "./button";

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

/* ─────────────────────────  STATUS BAR  ─────────────────────────
   v0.12.9 — the `carrier` default of "Verizon" was being truncated to
   "...on" inside every iOS PhoneFrame in the live audit because the
   112×28 px dynamic-island blob at the top-center occluded the
   carrier text's left edge. Modern iOS 17+ doesn't render the carrier
   name in the status bar at all (it moved to Control Center years
   ago); we now follow suit by leaving `carrier` undefined by default.
   Android frame showcases still pass `carrier="T-Mobile"` explicitly
   and render correctly because the Android punch-hole is tiny. */
export function StatusBar({ time = "9:41", carrier }: { time?: string; carrier?: string }) {
  return (
    <div className="h-10 px-5 flex items-center justify-between text-[12px] font-semibold lumen-mono text-[color:var(--text-primary)] shrink-0">
      <span>{time}</span>
      <div className="flex items-center gap-[var(--space-1_5)]">
        {carrier && <span className="hidden sm:inline">{carrier}</span>}
        <SignalHigh size={14} strokeWidth={2} aria-hidden focusable={false} />
        <Wifi size={14} strokeWidth={2} aria-hidden focusable={false} />
        <BatteryFull size={18} strokeWidth={1.5} aria-hidden focusable={false} />
      </div>
    </div>
  );
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
              "w-full h-12 text-[length:var(--type-15)] text-center transition-colors",
              i < main.length - 1 ? "border-b border-[var(--border-hairline)]" : "",
              it.danger ? "text-[color:var(--lumen-red-7)]" : "text-[color:var(--text-link)]",
            ].join(" ")}
          >
            {it.label}
          </button>
        ))}
      </div>
      {cancel && (
        <button className="rounded-[14px] bg-[var(--surface-popover)] h-12 text-[length:var(--type-15)] font-semibold text-[color:var(--text-link)] border border-[var(--border-hairline)]">
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
          <div className="text-body-xs text-[color:var(--text-tertiary)] mt-2 leading-[var(--leading-snug)]">{description}</div>
        </div>
        <div className="border-t border-[var(--border-hairline)]">
          <button className="w-full h-control-touch text-[length:var(--type-14)] text-[color:var(--text-link)] border-b border-[var(--border-hairline)]">Allow Once</button>
          <button className="w-full h-control-touch text-[length:var(--type-14)] text-[color:var(--text-link)] border-b border-[var(--border-hairline)]">Allow While Using App</button>
          <button className="w-full h-control-touch text-[length:var(--type-14)] text-[color:var(--text-link)]">Don't Allow</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  PULL-TO-REFRESH  ───────────────────────── */
export function PullToRefresh() {
  return (
    <div className="flex items-center justify-center gap-2 py-3 text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">
      <Loader2 size={14} strokeWidth={2} className="animate-spin" aria-hidden focusable={false} />
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
        <div className="text-[length:var(--type-14)] font-medium tracking-[var(--tracking-tight)] truncate">{title}</div>
        {description && <div className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)] truncate mt-1">{description}</div>}
      </div>
      <div className="flex items-center gap-2 shrink-0 text-[length:var(--type-12)] text-[color:var(--text-tertiary)] lumen-mono">
        {meta && <span>{meta}</span>}
        {trailing}
      </div>
    </div>
  );
}

/* ─────────────────────────  SWIPE ACTIONS (visual)  ─────────────────────────
   v0.12.3 — swipe-open offset migrated from `-translate-x-[80px]` Tailwind
   arbitrary class to inline `style.transform`, matching the PricingToggle
   migration (commerce.tsx). Same root cause: Tailwind v4's content scanner
   intermittently drops arbitrary translate utilities, leaving the row at its
   un-swiped position and silently hiding the swipe-action button. Inline
   style is scanner-independent. See ADR 0015 / ADR 0016 for the broader
   pattern; this is the cascade-fix to that direction for the two remaining
   `translate-x-[*px]` callers in the codebase. */
export function SwipeAction({ children, action = "Archive", danger }: { children: ReactNode; action?: string; danger?: boolean }) {
  return (
    <div className="relative overflow-hidden bg-[var(--surface-canvas)]">
      <div className="absolute inset-y-0 right-0 flex">
        <button className={["px-5 text-white text-[length:var(--type-13)] font-semibold", danger ? "bg-[var(--lumen-red-5)]" : "bg-[var(--lumen-amber-5)]"].join(" ")}>{action}</button>
      </div>
      <div
        className="relative bg-[var(--surface-raised)] transition-transform"
        style={{ transform: "translateX(-80px)" }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────  BIOMETRIC PROMPT  ───────────────────────── */
export function FaceIDPrompt() {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-6">
      <div className="w-[260px] rounded-[14px] bg-[var(--surface-popover)] p-4 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-[var(--surface-sunken)] flex items-center justify-center mb-2">
          <ScanFace size={24} strokeWidth={1.5} aria-hidden focusable={false} />
        </div>
        <div className="text-[length:var(--type-14)] font-semibold tracking-[var(--tracking-tight)]">Face ID</div>
        <div className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)] mt-1">Authenticate to continue</div>
      </div>
    </div>
  );
}

/* ─────────────────────────  KEYBOARD ACCESSORY  ───────────────────────── */
export function KeyboardAccessoryBar() {
  return (
    <div className="border-t border-[var(--border-hairline)] bg-[var(--surface-sunken)] px-3 h-10 flex items-center justify-between">
      <div className="flex items-center gap-3 text-[color:var(--text-secondary)]">
        <button className="text-[length:var(--type-13)] font-semibold">Bold</button>
        <button className="text-[length:var(--type-13)]">Italic</button>
        <button className="text-[length:var(--type-13)]">Link</button>
      </div>
      <button className="text-[length:var(--type-13)] text-[color:var(--text-link)] font-semibold">Done</button>
    </div>
  );
}

/* ─────────────────────────  COACH MARK  ───────────────────────── */
export function CoachMark() {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--lumen-obsidian-9)] text-white p-3 max-w-[260px] shadow-[var(--shadow-modal)]">
      <div className="text-heading-h6">New: Quick rates</div>
      <p className="text-[length:var(--type-12)] text-[color:var(--lumen-obsidian-2)] mt-1 leading-[var(--leading-snug)]">
        Quote a lane in three taps. Swipe up from the bottom edge to begin.
      </p>
      <div className="flex items-center justify-between mt-3 text-[length:var(--type-11)]">
        {/* v0.11.15 — Step counter wrapped in lumen-tnum so the digit column
            holds steady as the wizard advances 1/4 -> 2/4 -> 3/4 -> 4/4. */}
        <span className="lumen-mono lumen-tnum text-[color:var(--text-tertiary)]">Step 2 of 4</span>
        <Button intent="primary" size="sm">Got it</Button>
      </div>
    </div>
  );
}

"use client";

import { ReactNode, useState } from "react";
import { Cart as CartIcon, Plus, X, Check, Search as SearchIcon } from "./icon";
import { Stars } from "./display";
import { Button } from "./button";

/* ─────────────────────────  PRICING CARD  ───────────────────────── */
export function PricingCard({
  name,
  description,
  price,
  period = "mo",
  features,
  recommended,
  cta = "Get started",
}: {
  name: string;
  description?: string;
  price: string;
  period?: string;
  features: string[];
  recommended?: boolean;
  cta?: string;
}) {
  return (
    <div
      className={[
        "relative rounded-[var(--radius-xl)] p-5 flex flex-col gap-4 border",
        recommended
          ? "border-[var(--lumen-accent-4)] bg-[var(--surface-tint-accent)] shadow-[var(--shadow-glow-accent)]"
          : "border-[var(--border-hairline)] bg-[var(--surface-raised)] shadow-[var(--shadow-xs)]",
      ].join(" ")}
    >
      {recommended && (
        // lumen-lint-allow: off-grid — 10 px optical overlap of pill above card edge.
        <span className="absolute -top-2.5 left-5 inline-flex items-center gap-1 h-5 px-2 rounded-[var(--radius-full)] bg-[var(--lumen-accent-4)] text-[color:var(--lumen-accent-fg)] text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)]">
          Most popular
        </span>
      )}
      <div>
        <div className="text-heading-h5">{name}</div>
        {description && <div className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)] mt-1 leading-[var(--leading-snug)]">{description}</div>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="lumen-tnum text-[length:var(--type-44)] font-semibold tracking-[var(--tracking-tighter)] leading-[var(--leading-flat)]">{price}</span>
        <span className="text-body-xs text-[color:var(--text-tertiary)]">/{period}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-body-xs text-[color:var(--text-secondary)]">
            <span className="mt-1 text-[color:var(--lumen-accent-6)]"><Check size={13} /></span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {/* v0.11.13.3 — recommended tier uses Button intent="primary"; the
          ungated tier uses intent="secondary". Single source of truth for
          both surfaces is now the .lumen-btn-* CSS classes. */}
      <Button intent={recommended ? "primary" : "secondary"} fullWidth>
        {cta}
      </Button>
    </div>
  );
}

/* ─────────────────────────  PRICING TOGGLE (M/Y)  ─────────────────────────
   v0.12.3 — thumb position migrated from Tailwind arbitrary translate classes
   (`translate-x-[22px]` / `translate-x-0.5`) to inline `style.left` + native
   transition. User screenshot 2026-05-06 caught the bug on /library: clicking
   the toggle produced an empty track + a thumb floating ~22 px past the
   track's right edge, overlapping the "Y" of "Yearly".

   Two-part root cause:
   1. Tailwind v4's content scanner intermittently dropped the `translate-x-[22px]`
      arbitrary class — DOM inspection showed `transform: none` despite the
      className carrying it. Same scanner fragility ADR 0015 (v0.8.1) and ADR 0016
      (v0.9) retired for Buttons by moving to defensive `.lumen-btn-*` CSS classes.
   2. Even after fixing (1) with inline `style.transform`, the thumb still
      overshot — the parent `<button>` has the browser-default `text-align: center`,
      which combined with the absolute-positioned span's `left: auto` gave a
      computed static position of `left: 21px` (the layout engine's centered
      static offset for an inline span inside a button). Adding `translateX(22px)`
      on top of that 21-px static offset put the thumb at ~43 px from the
      button's content-left — ~1 px past the 42-px content-box right edge, with
      the 18-px-wide thumb visually escaping into the surrounding gap.

   Final fix: anchor `left: <value>` explicitly via inline style so the
   static-position rules don't apply, and animate `left` with the same easing
   the rest of the system uses for control-state transitions. Math: track
   inner width = 44 px outer − 2 px borders = 42 px. Thumb width = 18 px.
   Symmetric 2-px inset → monthly at left:2, yearly at left:22. Yearly
   thumb-right = 22 + 18 = 40 px → 2 px from inner-right edge ✓. */
export function PricingToggle({ value, onChange }: { value: "monthly" | "yearly"; onChange: (v: "monthly" | "yearly") => void }) {
  return (
    <div className="inline-flex items-center gap-3">
      <span className={["text-[length:var(--type-13)]", value === "monthly" ? "text-[color:var(--text-primary)] font-medium" : "text-[color:var(--text-tertiary)]"].join(" ")}>Monthly</span>
      <button
        onClick={() => onChange(value === "monthly" ? "yearly" : "monthly")}
        className="relative h-6 w-11 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-default)] transition-colors"
        aria-pressed={value === "yearly"}
      >
        <span
          className="absolute top-0.5 h-[18px] w-[18px] rounded-full bg-[var(--lumen-accent-4)] shadow-[var(--shadow-xs)]"
          style={{
            left: value === "yearly" ? 22 : 2,
            transition: "left 120ms cubic-bezier(0.2, 0, 0, 1)",
          }}
        />
      </button>
      <span className={["text-[length:var(--type-13)]", value === "yearly" ? "text-[color:var(--text-primary)] font-medium" : "text-[color:var(--text-tertiary)]"].join(" ")}>
        Yearly <span className="text-[color:var(--lumen-accent-7)] lumen-mono text-[length:var(--type-11)]">−2 mo</span>
      </span>
    </div>
  );
}

/* ─────────────────────────  PAYMENT BUTTONS  ───────────────────────── */
export function ApplePay() {
  return (
    <button className="h-12 px-5 rounded-[var(--radius-md)] bg-[#000] text-white inline-flex items-center justify-center gap-2 text-[length:var(--type-14)] font-semibold w-full">
      <ApplePayLogo /> <span>Pay</span>
    </button>
  );
}
export function GooglePay() {
  return (
    <button className="h-12 px-5 rounded-[var(--radius-md)] bg-[#000] text-white inline-flex items-center justify-center gap-2 text-[length:var(--type-14)] font-semibold w-full">
      <span className="lumen-mono font-bold">G</span> Pay
    </button>
  );
}
export function ShopPay() {
  return (
    <button className="h-12 rounded-[var(--radius-md)] bg-[#5a31f4] text-white inline-flex items-center justify-center gap-2 text-[length:var(--type-14)] font-semibold w-full">
      <span className="lumen-mono font-bold">shop</span> Pay
    </button>
  );
}
export function PayPal() {
  return (
    <button className="h-12 rounded-[var(--radius-md)] bg-[#ffc439] text-[#003087] inline-flex items-center justify-center gap-2 text-[length:var(--type-14)] font-bold tracking-tight w-full">
      <i style={{ fontStyle: "italic" }}>Pay</i><span className="text-[#0070ba] -ml-[2px]">Pal</span>
    </button>
  );
}
export function Klarna() {
  return (
    <button className="h-12 rounded-[var(--radius-md)] bg-[#ffa8cd] text-[#17120c] inline-flex items-center justify-center text-[length:var(--type-14)] font-semibold w-full">
      Klarna
    </button>
  );
}
export function Afterpay() {
  return (
    <button className="h-12 rounded-[var(--radius-md)] bg-[#b2fce4] text-[#08263a] inline-flex items-center justify-center text-[length:var(--type-14)] font-semibold w-full">
      afterpay
    </button>
  );
}
function ApplePayLogo() {
  return <svg width="34" height="14" viewBox="0 0 34 14" fill="white" aria-hidden><path d="M5.7 4.6c-.4.5-1 .9-1.6.8-.1-.6.2-1.3.6-1.8.4-.5 1-.9 1.6-1 .1.7-.1 1.4-.6 2zm1.1 0c-.9-.1-1.7.5-2.2.5s-1.1-.5-1.9-.5c-1 0-1.9.6-2.4 1.5-1 1.7-.3 4.3.7 5.7.5.7 1 1.5 1.8 1.5.7 0 1-.5 1.9-.5s1.1.5 1.9.5c.8 0 1.3-.7 1.8-1.4.5-.8.8-1.6.8-1.6 0 0-1.5-.6-1.5-2.4 0-1.5 1.3-2.2 1.3-2.3-.7-1-1.8-1.1-2.2-1.1z" /></svg>;
}

/* ─────────────────────────  RATING + STARS  ───────────────────────── */
export function RatingBlock({ value = 4.6, count = 1284 }: { value?: number; count?: number }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Stars value={Math.floor(value)} />
      <span className="lumen-tnum text-heading-h5">{value.toFixed(1)}</span>
      <span className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">({count.toLocaleString()} reviews)</span>
    </div>
  );
}

/* ─────────────────────────  COUPON INPUT  ───────────────────────── */
export function CouponInput() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2 w-[320px]">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Discount code"
          className="flex-1 h-10 px-3 rounded-[var(--radius-md)] bg-[var(--surface-raised)] border border-[var(--border-default)] text-[length:var(--type-14)] lumen-mono uppercase placeholder:text-[color:var(--text-tertiary)] placeholder:normal-case focus:outline-none focus:border-[var(--border-focus)] focus:shadow-[var(--shadow-focus)]"
        />
        <button
          onClick={() => { if (code) setApplied(code); }}
          className="h-10 px-3 rounded-[var(--radius-md)] bg-[var(--surface-inverse)] text-[color:var(--text-inverse)] text-[length:var(--type-14)] font-medium hover:opacity-90"
        >
          Apply
        </button>
      </div>
      {applied && (
        <div className="text-[length:var(--type-12)] text-[color:var(--lumen-accent-7)] flex items-center gap-[var(--space-1_5)]">
          <Check size={12} />
          Code <span className="lumen-mono">{applied}</span> applied — 12% off
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  INVENTORY STATUS  ───────────────────────── */
export function InventoryStatus({ status }: { status: "in-stock" | "low-stock" | "backorder" | "preorder" | "sold-out" }) {
  const config: Record<typeof status, { label: string; color: string }> = {
    "in-stock": { label: "In stock", color: "var(--lumen-accent-7)" },
    "low-stock": { label: "Low stock — 3 left", color: "var(--lumen-amber-7)" },
    "backorder": { label: "Backorder · ships in 2 weeks", color: "var(--lumen-cream-7)" },
    "preorder": { label: "Preorder · arrives May 19", color: "var(--lumen-cream-7)" },
    "sold-out": { label: "Sold out", color: "var(--lumen-red-7)" },
  };
  const c = config[status];
  return (
    <span className="inline-flex items-center gap-[var(--space-1_5)] text-[length:var(--type-12)] font-medium" style={{ color: c.color }}>
      <span className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-full" style={{ background: c.color }} />
      {c.label}
    </span>
  );
}

/* ─────────────────────────  PRODUCT GALLERY  ───────────────────────── */
export function ProductGallery({ count = 5 }: { count?: number }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid grid-cols-[64px_1fr] gap-3">
      <div className="flex flex-col gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={[
              "h-16 w-16 rounded-[var(--radius-md)] border bg-[var(--surface-sunken)] overflow-hidden transition-[border-color,box-shadow]",
              i === active ? "border-[var(--lumen-obsidian-9)]" : "border-[var(--border-hairline)] hover:border-[var(--border-strong)]",
            ].join(" ")}
          >
            <div className="lumen-stripe-grid h-full w-full" />
          </button>
        ))}
      </div>
      <div className="aspect-[4/5] rounded-[var(--radius-lg)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] overflow-hidden">
        <div className="lumen-stripe-grid h-full w-full flex items-center justify-center">
          <span className="text-[length:var(--type-12)] uppercase tracking-[var(--tracking-widest)] text-[color:var(--text-tertiary)]">Product image {active + 1}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  CART DRAWER  ───────────────────────── */
export function CartDrawer() {
  const items = [
    { name: "Aero Trail Runner v2", variant: "Granite · 10.5", qty: 1, price: 168 },
    { name: "Heather Wool Tee", variant: "Pebble · M", qty: 2, price: 64 },
    { name: "Trail Sock — 3 Pack", variant: "Charcoal", qty: 1, price: 24 },
  ];
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  return (
    <div className="w-[380px] rounded-[var(--radius-xl)] bg-[var(--surface-raised)] border border-[var(--border-default)] shadow-[var(--shadow-modal)] overflow-hidden flex flex-col">
      <div className="h-12 px-4 flex items-center justify-between border-b border-[var(--border-hairline)]">
        <span className="text-heading-h6 flex items-center gap-2"><CartIcon size={14} /> Your bag <span className="lumen-mono text-[color:var(--text-tertiary)]">({items.length})</span></span>
        <button aria-label="Close cart" className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]"><X size={14} /></button>
      </div>
      <div className="p-4 flex flex-col gap-4 overflow-auto">
        {items.map((it) => (
          <div key={it.name} className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] lumen-stripe-grid" />
            <div className="flex-1 min-w-0">
              <div className="text-[length:var(--type-13)] font-medium tracking-[var(--tracking-tight)] truncate">{it.name}</div>
              <div className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">{it.variant}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center h-7 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-raised)] overflow-hidden text-[length:var(--type-12)]">
                  <button className="px-2 hover:bg-[var(--surface-sunken)]">−</button>
                  <span className="px-2 lumen-mono">{it.qty}</span>
                  <button className="px-2 hover:bg-[var(--surface-sunken)]">+</button>
                </div>
                <button className="text-[length:var(--type-11)] uppercase tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]">Remove</button>
              </div>
            </div>
            <span className="lumen-tnum text-[length:var(--type-13)] font-medium">${(it.qty * it.price).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border-hairline)] p-4 space-y-2">
        <div className="flex items-center justify-between text-[length:var(--type-13)]">
          <span className="text-[color:var(--text-secondary)]">Subtotal</span>
          <span className="lumen-tnum">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">
          <span>Shipping calculated at checkout</span>
        </div>
        {/* v0.11.13.3 — Button primitive. The lg variant matches the prior 48-px height
            and inherits the canonical primary surface fg from .lumen-btn-primary. */}
        <div className="mt-2">
          <Button intent="primary" size="lg" fullWidth>Checkout</Button>
        </div>
        <Button intent="ghost" fullWidth>Continue shopping</Button>
      </div>
    </div>
  );
}

/* ─────────────────────────  ORDER SUMMARY  ───────────────────────── */
export function OrderSummary() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-4">
      <div className="text-heading-h6 mb-3">Order summary</div>
      <div className="flex flex-col gap-[var(--space-1_5)] text-[length:var(--type-13)]">
        <Row label="Subtotal" value="$256.00" />
        <Row label="Shipping" value="$8.50" />
        <Row label="Tax (8.875%)" value="$23.49" />
        <Row label="Discount · WELCOME12" value="−$30.72" tone="success" />
        <hr className="border-[var(--border-hairline)] my-2" />
        <Row label={<span className="font-semibold">Total</span>} value={<span className="lumen-tnum text-[length:var(--type-17)] font-semibold">$257.27</span>} />
      </div>
    </div>
  );
}
function Row({ label, value, tone }: { label: ReactNode; value: ReactNode; tone?: "success" }) {
  return (
    <div className="flex items-center justify-between">
      <span className={tone === "success" ? "text-[color:var(--lumen-accent-7)]" : "text-[color:var(--text-secondary)]"}>{label}</span>
      <span className={["lumen-tnum", tone === "success" ? "text-[color:var(--lumen-accent-7)]" : "text-[color:var(--text-primary)]"].join(" ")}>{value}</span>
    </div>
  );
}

/* ─────────────────────────  CHECKOUT PROGRESS  ─────────────────────────
   v0.11.2 — connector now goes Spring-Green for completed segments and
   neutral hairline for the rest, mirroring the Stepper logic. Active step
   gets a Spring-Green ring (subtle on a 20 px dot — 1 px ring instead of
   the Stepper's 2 px). aria-current="step" added for SR users. */
export function CheckoutProgress() {
  const current = 2;
  const steps = ["Cart", "Information", "Shipping", "Payment", "Confirm"];
  return (
    <ol className="flex items-center gap-2 text-[length:var(--type-12)]" aria-label="Checkout progress">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const isLast = i === steps.length - 1;
        return (
          <li key={s} className="flex items-center gap-2" aria-current={active ? "step" : undefined}>
            <span
              aria-hidden
              className={[
                "h-5 w-5 inline-flex items-center justify-center rounded-full text-[10px] font-semibold lumen-mono shrink-0",
                done
                  ? "bg-[var(--lumen-accent-4)] text-[color:var(--lumen-accent-fg)]"
                  : active
                  ? "bg-[var(--surface-page)] text-[color:var(--text-primary)] shadow-[0_0_0_1.5px_var(--lumen-accent-4)]"
                  : "bg-[var(--surface-sunken)] text-[color:var(--text-tertiary)] border border-[var(--border-default)]",
              ].join(" ")}
            >
              {done ? <Check size={10} /> : i + 1}
            </span>
            <span
              className={[
                active
                  ? "text-[color:var(--text-primary)] font-medium"
                  : done
                  ? "text-[color:var(--text-secondary)]"
                  : "text-[color:var(--text-tertiary)]",
              ].join(" ")}
            >
              {s}
            </span>
            {!isLast && (
              <span
                aria-hidden
                className={[
                  "h-px w-6 shrink-0",
                  done ? "bg-[var(--lumen-accent-4)]" : "bg-[var(--border-default)]",
                ].join(" ")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ─────────────────────────  FEATURE COMPARISON TABLE  ───────────────────────── */
export function ComparisonTable() {
  const features = [
    { name: "Live carrier rates", starter: true, growth: true, scale: true },
    { name: "Multi-stop quoting", starter: false, growth: true, scale: true },
    { name: "API access", starter: false, growth: true, scale: true },
    { name: "Dedicated account manager", starter: false, growth: false, scale: true },
    { name: "SLA · 99.95% uptime", starter: false, growth: false, scale: true },
    { name: "SOC 2 audit assistance", starter: false, growth: false, scale: true },
  ];
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] overflow-hidden">
      <table className="w-full text-[length:var(--type-13)]">
        <thead>
          <tr className="border-b border-[var(--border-hairline)] text-[length:var(--type-12)] text-[color:var(--text-tertiary)] uppercase tracking-[var(--tracking-wider)]">
            <th className="px-4 py-3 text-left font-medium">Feature</th>
            <th className="px-4 py-3 text-center font-medium">Starter</th>
            <th className="px-4 py-3 text-center font-medium bg-[var(--surface-tint-accent)] text-[color:var(--text-accent)]">Growth</th>
            <th className="px-4 py-3 text-center font-medium">Scale</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f) => (
            <tr key={f.name} className="border-b border-[var(--border-hairline)] last:border-0">
              <td className="px-4 py-3 text-[color:var(--text-secondary)]">{f.name}</td>
              <td className="px-4 py-3 text-center">{f.starter ? <Check size={14} className="inline text-[color:var(--lumen-accent-6)]" /> : <span className="text-[color:var(--text-disabled)]">—</span>}</td>
              <td className="px-4 py-3 text-center bg-[var(--surface-tint-accent)]/40">{f.growth ? <Check size={14} className="inline text-[color:var(--lumen-accent-6)]" /> : <span className="text-[color:var(--text-disabled)]">—</span>}</td>
              <td className="px-4 py-3 text-center">{f.scale ? <Check size={14} className="inline text-[color:var(--lumen-accent-6)]" /> : <span className="text-[color:var(--text-disabled)]">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────  TRUST BADGE STRIP  ───────────────────────── */
export function TrustStrip() {
  const items = ["SOC 2 Type II", "ISO 27001", "GDPR-ready", "HIPAA-eligible", "PCI DSS"];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((b) => (
        <span key={b} className="inline-flex items-center gap-[var(--space-1_5)] h-7 px-3 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] text-[length:var(--type-11)] uppercase tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)]">
          <span className="h-[var(--size-dot-sm)] w-[var(--size-dot-sm)] rounded-[1px] bg-[var(--lumen-accent-5)]" />
          {b}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────  COLOR SWATCH SELECTOR  ───────────────────────── */
export function ColorSwatchSelector({
  value,
  onChange,
  options = [
    { color: "#1c1b16", label: "Charcoal" },
    { color: "#b3b1a4", label: "Pebble" },
    { color: "#4592e8", label: "Sky" },
    { color: "#22c55e", label: "Pine" },
    { color: "#e23b3b", label: "Brick" },
  ],
}: {
  value: string;
  onChange: (v: string) => void;
  options?: { color: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[length:var(--type-12)] text-[color:var(--text-secondary)]">
        Color: <span className="text-[color:var(--text-primary)] font-medium">{options.find((o) => o.color === value)?.label}</span>
      </div>
      <div className="flex items-center gap-2">
        {options.map((o) => (
          <button
            key={o.color}
            onClick={() => onChange(o.color)}
            aria-label={o.label}
            className={[
              "relative h-8 w-8 rounded-full border-2 transition-transform",
              value === o.color ? "border-[var(--lumen-obsidian-9)] scale-110" : "border-transparent ring-1 ring-[var(--border-default)] hover:scale-110",
            ].join(" ")}
            style={{ background: o.color }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  SIZE SELECTOR  ───────────────────────── */
export function SizeSelector({
  sizes = ["6", "7", "8", "9", "10", "10.5", "11", "12", "13"],
  value,
  onChange,
}: {
  sizes?: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-[var(--space-1_5)]">
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={[
            "min-w-[48px] h-10 px-3 rounded-[var(--radius-md)] text-[length:var(--type-14)] lumen-mono transition-[background-color,border-color]",
            s === value
              ? "bg-[var(--surface-inverse)] text-[color:var(--text-inverse)] border border-[var(--surface-inverse)]"
              : "bg-[var(--surface-raised)] border border-[var(--border-default)] text-[color:var(--text-secondary)] hover:border-[var(--border-strong)]",
          ].join(" ")}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

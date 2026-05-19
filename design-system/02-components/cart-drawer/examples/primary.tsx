// Lumen CartDrawer — Web React example. Composes Drawer + cart line items + sticky checkout.

// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

"use client";

import { Minus, Plus, X } from "lucide-react";
import { ReactNode } from "react";

export type CartLine = {
  id: string;
  image?: string;
  title: ReactNode;
  variant?: string;
  qty: number;
  price: ReactNode;
  lineTotal: ReactNode;
};

export function CartDrawer({
  items,
  onQtyChange,
  onRemove,
  subtotal,
  discount,
  shipping,
  tax,
  total,
  checkoutLabel = "Checkout",
  onCheckout,
  freeShippingProgress,
}: {
  items: CartLine[];
  onQtyChange?: (id: string, next: number) => void;
  onRemove?: (id: string) => void;
  subtotal: ReactNode;
  discount?: ReactNode;
  shipping?: ReactNode;
  tax?: ReactNode;
  total: ReactNode;
  checkoutLabel?: string;
  onCheckout: () => void;
  freeShippingProgress?: number;
}) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Your cart" className="flex flex-col h-full max-w-[480px] w-full bg-[var(--color-surface-raised)]">
      <header className="flex items-center justify-between gap-3 px-[var(--space-inset-xl)] pt-[var(--space-inset-xl)] pb-2">
        <h2 className="text-[var(--type-heading-h3)] font-medium tracking-tight">Your cart</h2>
        <span className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)] lumen-tnum">{items.length} items</span>
      </header>
      {typeof freeShippingProgress === "number" && freeShippingProgress < 100 && (
        <div className="px-[var(--space-inset-xl)] pb-2">
          <div className="text-[var(--type-body-sm)] text-[var(--color-text-secondary)] mb-1">
            <span className="lumen-tnum">{Math.round(freeShippingProgress)}%</span> to free shipping
          </div>
          <div className="h-1 w-full rounded-[var(--radius-pill)] bg-[var(--color-surface-sunken)] overflow-hidden">
            <span className="block h-full rounded-[var(--radius-pill)] bg-[var(--color-accent-500)]" style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>
      )}
      <ul role="list" className="flex-1 overflow-y-auto divide-y divide-[var(--color-border-hairline)]">
        {items.map((line) => (
          <li
            key={line.id}
            aria-label={`${typeof line.title === "string" ? line.title : "item"}, quantity ${line.qty}`}
            className="flex gap-3 px-[var(--space-inset-xl)] py-3"
          >
            {line.image && <img src={line.image} alt="" className="size-16 rounded-[var(--radius-control-md)] object-cover bg-[var(--color-surface-sunken)]" />}
            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <p className="text-[var(--type-label-md)] text-[var(--color-text-primary)]">{line.title}</p>
              {line.variant && <p className="text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]">{line.variant}</p>}
              <p className="lumen-tnum text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]">{line.price}</p>
              <div className="mt-1 inline-flex items-center gap-2">
                <span role="group" aria-label="Quantity" className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--color-border-hairline)]">
                  <button type="button" aria-label="Decrement" onClick={() => onQtyChange?.(line.id, Math.max(1, line.qty - 1))} className="inline-flex h-6 w-6 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                    <Minus size={10} aria-hidden />
                  </button>
                  <span aria-live="polite" className="lumen-tnum w-6 text-center text-[var(--type-label-sm)] text-[var(--color-text-primary)]">{line.qty}</span>
                  <button type="button" aria-label="Increment" onClick={() => onQtyChange?.(line.id, line.qty + 1)} className="inline-flex h-6 w-6 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                    <Plus size={10} aria-hidden />
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => onRemove?.(line.id)}
                  aria-label={`Remove ${typeof line.title === "string" ? line.title : "item"}`}
                  className="text-[var(--type-body-sm)] text-[var(--color-action-danger-soft-fg)] hover:bg-[var(--color-action-danger-soft-bg-hover)] rounded-[var(--radius-control-md)] px-2 py-0.5"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="lumen-tnum text-[var(--type-label-md)] text-[var(--color-text-primary)]">{line.lineTotal}</p>
          </li>
        ))}
      </ul>
      <footer className="shrink-0 border-t border-[var(--color-border-hairline)] p-[var(--space-inset-xl)] flex flex-col gap-3">
        <dl className="flex flex-col gap-1 text-[var(--type-body-sm)]">
          <Row label="Subtotal" value={subtotal} />
          {discount && <Row label="Discount" value={discount} tone="accent" />}
          {shipping && <Row label="Shipping" value={shipping} />}
          {tax && <Row label="Tax" value={tax} />}
          <Row label="Total" value={total} bold />
        </dl>
        <button
          type="button"
          onClick={onCheckout}
          className="h-11 rounded-[var(--radius-control-md)] bg-[var(--color-action-primary-bg-rest)] text-[var(--color-action-primary-fg)] font-medium text-[var(--type-label-md)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]"
        >
          {checkoutLabel}
        </button>
      </footer>
    </div>
  );
}

function Row({ label, value, bold, tone }: { label: string; value: ReactNode; bold?: boolean; tone?: "accent" }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={["text-[var(--color-text-secondary)]", bold ? "font-medium text-[var(--color-text-primary)]" : ""].join(" ")}>{label}</dt>
      <dd className={["lumen-tnum", bold ? "text-[var(--type-label-md)] font-semibold text-[var(--color-text-primary)]" : tone === "accent" ? "text-[var(--color-text-accent)]" : "text-[var(--color-text-primary)]"].join(" ")}>{value}</dd>
    </div>
  );
}

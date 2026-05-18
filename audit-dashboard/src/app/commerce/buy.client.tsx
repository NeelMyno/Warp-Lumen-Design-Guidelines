"use client";

import { useState } from "react";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { ArrowRight, Cart, Check, ChevronDown } from "@/components/primitives/icon";

/**
 * v0.12.8 — interactive product-detail buy panel.
 *
 * Why this exists: pre-v0.12.8 the Buy panel rendered color swatches and
 * size buttons as static showcase mockups with hardcoded `i === 0` /
 * `s === "M"` selection. Clicking a color or size produced no visual
 * feedback, which read as a broken control rather than a deliberate mock.
 *
 * The R2 audit walked the storefront in dark mode + light mode and caught
 * this: PDP buy panels carry the highest user-attention budget on any
 * commerce page (color + size pickers ARE the decision-making moment per
 * Premium Psychology principle 3 — peak-end), so leaving them inert
 * undermined the whole reference implementation's polish.
 *
 * v0.12.8 extracts Buy into a small client island and wires real useState
 * for color + size selection. The label "Color · {currentColor}" tracks
 * the chosen variant, the swatch ring moves on click, the size button
 * border tracks the chosen size. No backend, no cart — but the front-end
 * affordance lands.
 *
 * The rest of /commerce/page.tsx stays a server component (preserves
 * metadata export + the storefront chrome stays static).
 */

const COLORS: ReadonlyArray<readonly [hex: string, name: string]> = [
  ["#525c44", "Olive Drab"],
  ["#1a1f29", "Storm Navy"],
  ["#7a6042", "Ranger Tan"],
  ["#454545", "Slate"],
] as const;

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export function Buy() {
  const [color, setColor] = useState<string>("Olive Drab");
  const [size, setSize] = useState<string>("M");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="lumen-eyebrow mb-2">Workhorse Series</div>
        <h1 className="text-display-md md:text-display-lg">
          Field Jacket Mk II
        </h1>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="lumen-mono lumen-tnum text-heading-h2">$248</span>
          <span className="lumen-mono lumen-tnum text-body-md text-[color:var(--text-tertiary)] line-through">
            $320
          </span>
          <Badge status="accent">22% off</Badge>
        </div>
      </div>

      <p className="text-body-md text-[color:var(--text-secondary)] max-w-[52ch]">
        Waxed organic cotton, branched seams, two-way main zip. Built to take a
        beating and to age the way good things do.
      </p>

      <div>
        {/* v0.12.8 — label tracks selected color, matching the canonical
            "Color · {name}" convention used in Shopify / BigCommerce PDPs. */}
        <div className="lumen-eyebrow mb-3">Color · {color}</div>
        <div className="flex gap-2">
          {COLORS.map(([hex, name]) => {
            const selected = name === color;
            return (
              <button
                key={name}
                type="button"
                aria-label={name}
                aria-pressed={selected}
                onClick={() => setColor(name)}
                className="h-control-cozy w-[var(--size-control-cozy)] rounded-full transition-shadow focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
                style={{
                  background: hex,
                  boxShadow: selected
                    ? "0 0 0 2px var(--surface-page), 0 0 0 4px var(--text-primary)"
                    : "0 0 0 2px var(--surface-page), 0 0 0 3px var(--border-default)",
                }}
              />
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <div className="lumen-eyebrow">Size</div>
          <a
            href="#"
            className="text-micro text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] underline underline-offset-2"
          >
            Size guide
          </a>
        </div>
        <div className="grid grid-cols-6 gap-[var(--space-1_5)]">
          {SIZES.map((s) => {
            const selected = s === size;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={selected}
                onClick={() => setSize(s)}
                className={[
                  "h-10 rounded-[var(--radius-md)] border text-label-sm transition-colors focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
                  selected
                    ? "border-[var(--text-primary)] bg-[var(--surface-raised)] text-[color:var(--text-primary)]"
                    : "border-[var(--border-hairline)] text-[color:var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[color:var(--text-primary)]",
                ].join(" ")}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <Button intent="primary" size="lg" leadingIcon={<Cart size={16} />}>
          Add to cart · $248
        </Button>
        <Button intent="secondary" size="md" trailingIcon={<ArrowRight size={14} />}>
          Buy with shop pay
        </Button>
        <p className="text-body-xs text-[color:var(--text-secondary)] mt-2 flex items-start gap-2">
          <Check size={14} /> Ships in 2 days · 30-day returns · Lifetime repair
        </p>
      </div>

      {/* v0.12.5 — accordions use the .lumen-summary marker contract so the
          lucide ChevronDown is the sole disclosure cue on every browser.
          See AGENTS.md hard rule 14 + ADR follow-ups. */}
      <details className="border-t border-[var(--border-hairline)] pt-4 group">
        <summary className="lumen-summary flex justify-between cursor-pointer text-label-lg list-none">
          Materials &amp; care
          <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
        </summary>
        <p className="mt-2 text-body-sm text-[color:var(--text-secondary)]">
          11oz organic cotton, beeswax-finished. Spot clean. Re-wax annually with our Tin No. 4.
        </p>
      </details>
      <details className="border-t border-[var(--border-hairline)] pt-4 group">
        <summary className="lumen-summary flex justify-between cursor-pointer text-label-lg list-none">
          Shipping &amp; returns
          <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
        </summary>
        <p className="mt-2 text-body-sm text-[color:var(--text-secondary)]">
          Free freight on orders over $200, fulfilled by Warp. 30-day no-questions returns.
        </p>
      </details>
    </div>
  );
}

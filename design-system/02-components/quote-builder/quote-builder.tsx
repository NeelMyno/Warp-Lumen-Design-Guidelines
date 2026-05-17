"use client";

/**
 * @lumen/quote-builder — v0.13 Phase 2 freight-domain composite.
 * ----------------------------------------------------------------------------
 * Quote flow centerpiece. Lane + weight + accessorials → rate + book.
 * Composes Combobox + Input + Tag + Stat + Button.
 */
import * as React from "react";
import { Loader2, ArrowRight, Package, MapPin, Calculator } from "lucide-react";

import { cn } from "@/lib/utils";
import { Combobox, type ComboboxOption } from "../combobox/combobox";
import { Stat } from "../stat/stat";
import { LaneCode } from "../lane-code/lane-code";

export type QuoteForm = {
  origin?: string;
  destination?: string;
  weightLbs?: number;
  accessorials: string[];
};

export type Quote = {
  rate: string;
  etaIso?: string;
};

export type QuoteBuilderProps = {
  originOptions?: ComboboxOption[];
  destinationOptions?: ComboboxOption[];
  accessorialOptions?: string[];
  onQuote?: (form: QuoteForm) => Promise<Quote>;
  onBook?: (form: QuoteForm, quote: Quote) => void;
  className?: string;
};

const DEFAULT_ACCESSORIALS = ["Liftgate", "Inside delivery", "Residential", "Limited access", "Appointment"];

export function QuoteBuilder({
  originOptions = [],
  destinationOptions = [],
  accessorialOptions = DEFAULT_ACCESSORIALS,
  onQuote,
  onBook,
  className,
}: QuoteBuilderProps) {
  const [form, setForm] = React.useState<QuoteForm>({ accessorials: [] });
  const [quote, setQuote] = React.useState<Quote | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  const ready = !!(form.origin && form.destination && form.weightLbs && form.weightLbs > 0);

  // Re-quote on form change (debounced; clears quote when form changes after first quote).
  React.useEffect(() => {
    setQuote(null);
  }, [form.origin, form.destination, form.weightLbs, form.accessorials]);

  const handleQuote = async () => {
    if (!ready || !onQuote) return;
    setLoading(true);
    setTouched(true);
    try {
      const q = await onQuote(form);
      setQuote(q);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccessorial = (a: string) => {
    setForm((f) => ({
      ...f,
      accessorials: f.accessorials.includes(a)
        ? f.accessorials.filter((x) => x !== a)
        : [...f.accessorials, a],
    }));
  };

  return (
    <form
      data-slot="quote-builder"
      className={cn(
        "grid grid-cols-1 md:grid-cols-5 gap-6 p-6 bg-[var(--surface-raised)] border border-[var(--border-hairline)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        if (quote) onBook?.(form, quote);
        else handleQuote();
      }}
    >
      {/* Left column — inputs */}
      <div className="md:col-span-3 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="lumen-mono-cap text-[length:var(--type-10)] tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)]">
            <MapPin size={10} aria-hidden className="inline mr-1" /> Lane
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Combobox
              options={originOptions}
              value={form.origin}
              onChange={(v) => setForm((f) => ({ ...f, origin: v }))}
              placeholder="Origin"
            />
            <Combobox
              options={destinationOptions}
              value={form.destination}
              onChange={(v) => setForm((f) => ({ ...f, destination: v }))}
              placeholder="Destination"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="lumen-mono-cap text-[length:var(--type-10)] tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)]">
            <Package size={10} aria-hidden className="inline mr-1" /> Weight
          </label>
          <input
            type="number"
            value={form.weightLbs ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                weightLbs: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            placeholder="Pounds"
            min="0"
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-input-rest)] px-3 text-[length:var(--type-14)] text-[color:var(--text-primary)] outline-none focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-input-focus)] lumen-tnum"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="lumen-mono-cap text-[length:var(--type-10)] tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)]">
            Accessorials
          </label>
          <div className="flex flex-wrap gap-1.5">
            {accessorialOptions.map((a) => {
              const active = form.accessorials.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAccessorial(a)}
                  aria-pressed={active}
                  className={cn(
                    "h-7 px-2 rounded-[var(--radius-full)] text-[length:var(--type-11)] font-medium border transition-colors duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
                    active
                      ? "bg-[var(--pill-accent-bg)] text-[var(--pill-accent-fg)] border-[var(--pill-accent-border)]"
                      : "bg-[var(--surface-sunken)] text-[color:var(--text-secondary)] border-[var(--border-hairline)] hover:text-[color:var(--text-primary)]",
                  )}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right column — output */}
      <div className="md:col-span-2 flex flex-col gap-4 md:border-l md:border-[var(--border-hairline)] md:pl-6">
        <div className="flex items-center justify-between gap-2">
          <span className="lumen-mono-cap text-[length:var(--type-10)] tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)]">
            <Calculator size={10} aria-hidden className="inline mr-1" /> Rate
          </span>
          {form.origin && form.destination && (
            <LaneCode origin={form.origin} destination={form.destination} size="sm" />
          )}
        </div>

        <div aria-live="polite" className="min-h-[80px] flex items-center" aria-busy={loading || undefined}>
          {quote ? (
            <Stat label="Total" value={quote.rate} size="xl" polarity="neutral" />
          ) : loading ? (
            <div className="inline-flex items-center gap-2 text-[color:var(--text-tertiary)]">
              <Loader2 size={16} className="animate-spin" aria-hidden />
              <span>Quoting…</span>
            </div>
          ) : touched ? (
            <span className="text-[length:var(--type-13)] text-[color:var(--text-tertiary)]">
              Update form to re-quote.
            </span>
          ) : (
            <span className="text-[length:var(--type-13)] text-[color:var(--text-tertiary)]">
              Fill in the lane + weight to see your rate.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {!quote && (
            <button
              type="button"
              onClick={handleQuote}
              disabled={!ready || loading}
              className="lumen-btn lumen-btn-secondary lumen-btn-md w-full"
              aria-busy={loading || undefined}
            >
              {loading ? <Loader2 size={14} className="animate-spin shrink-0" aria-hidden /> : null}
              {loading ? "Quoting…" : "Get rate"}
            </button>
          )}
          {quote && (
            <button
              type="submit"
              className="lumen-btn lumen-btn-primary lumen-btn-md w-full inline-flex items-center justify-center gap-2"
            >
              Book this rate
              <ArrowRight size={14} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

import { PageHeader } from "@/components/section";
import { Card, CardHeader } from "@/components/primitives/card";
import { Stat, StatGrid } from "@/components/primitives/stat";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { LiveDot } from "@/components/primitives/live-dot";
import {
  ArrowRight,
  Code,
  Plus,
  Truck,
  MapPin,
  Box,
  Filter,
  Check,
} from "@/components/primitives/icon";

export const metadata = { title: "Web Tool · Lumen" };

export default function ToolPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tab 4 of 7"
        title="Web Tool"
        description="A single-purpose utility surface. Centered canvas, focused control panel, output result. The pattern for any internal calculator, simulator, or one-shot job."
      />

      <div className="lumen-card overflow-hidden">
        {/* Tool top bar */}
        <header className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-[var(--radius-sm)] bg-[var(--color-accent)] grid place-items-center text-[var(--text-on-accent)] lumen-mono text-[var(--type-12)] font-bold">
              W
            </div>
            <span className="text-[var(--type-14)] font-semibold tracking-[var(--tracking-tight)]">
              Quote Builder
            </span>
            <Badge status="neutral">v0.4</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button intent="tertiary" size="sm" leadingIcon={<Code size={14} />}>
              View JSON
            </Button>
            <Button intent="secondary" size="sm">Save preset</Button>
          </div>
        </header>

        <div className="grid grid-cols-[260px_1fr_320px] min-h-[640px]">
          {/* Left: presets */}
          <aside className="border-r border-[var(--border-subtle)] bg-[var(--surface-raised)] p-3 flex flex-col gap-2">
            <div className="lumen-eyebrow px-2 mb-1">Presets</div>
            {[
              { name: "Standard LTL", active: true },
              { name: "Refrigerated" },
              { name: "Flatbed open-deck" },
              { name: "Cross-dock express" },
              { name: "Last-mile residential" },
            ].map((p) => (
              <button
                key={p.name}
                className={[
                  "text-left px-2.5 py-2 rounded-[var(--radius-md)] text-[var(--type-14)]",
                  p.active
                    ? "bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] text-[var(--text-primary)] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]",
                ].join(" ")}
              >
                {p.name}
              </button>
            ))}
            <button className="mt-2 flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-md)] text-[var(--text-tertiary)] text-[var(--type-14)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]">
              <Plus size={14} /> New preset
            </button>
          </aside>

          {/* Center: canvas */}
          <main className="bg-[var(--surface-page)] p-8 flex flex-col gap-6 overflow-y-auto">
            <Card padding="lg">
              <CardHeader title="Lane" description="Where the freight starts and ends" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Origin (ZIP or IATA)" value="LAX" mono />
                <Field label="Destination" value="SFO" mono />
                <Field label="Pickup date" value="2026-05-04" mono />
                <Field label="Delivery date" value="2026-05-05" mono />
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Cargo" description="One commodity per row" />
              <div className="lumen-row-divider">
                <Row weight="520 lb" pieces="2 pallets" class="65" stackable />
                <Row weight="180 lb" pieces="1 carton" class="100" />
                <Row weight="2,100 lb" pieces="4 pallets" class="55" stackable />
              </div>
              <Button intent="tertiary" size="sm" leadingIcon={<Plus size={14} />} className="mt-3">
                Add commodity
              </Button>
            </Card>

            <Card padding="lg">
              <CardHeader title="Accessorials" description="Extras the carrier needs to know about" />
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Liftgate at pickup", true],
                  ["Liftgate at delivery", true],
                  ["Inside delivery", false],
                  ["Residential pickup", false],
                  ["Sort + segregate", false],
                  ["Hazardous material", false],
                ].map(([name, on]) => (
                  <Toggle key={name as string} label={name as string} checked={on as boolean} />
                ))}
              </div>
            </Card>

            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="lumen-mono text-[var(--type-13)] text-[var(--text-tertiary)]">
                <LiveDot label="Auto-saving every 4s" />
              </div>
              <Button intent="primary" size="lg" trailingIcon={<ArrowRight size={16} />}>
                Get rates
              </Button>
            </div>
          </main>

          {/* Right: output */}
          <aside className="border-l border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="lumen-eyebrow">Live preview</div>
              <Button intent="tertiary" size="sm" leadingIcon={<Filter size={14} />}>
                Filter
              </Button>
            </div>

            <Card padding="md" className="!border-[var(--color-accent)]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="text-[var(--type-15)] font-semibold">Sterling LTL</div>
                  <div className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)]">
                    LAX → SFO · 1d transit
                  </div>
                </div>
                <Badge status="accent">Best value</Badge>
              </div>
              <Stat label="Total" value="$262" unit=".00" size="sm" />
              <Button intent="primary" fullWidth size="sm" className="mt-3" trailingIcon={<ArrowRight size={14} />}>
                Book now
              </Button>
            </Card>

            {[
              { c: "Estes Express", price: "$285", days: "1d" },
              { c: "ODFL",          price: "$298", days: "2d" },
              { c: "Saia Motor",    price: "$310", days: "1d" },
              { c: "ABF",           price: "$330", days: "2d" },
              { c: "FedEx Freight", price: "$352", days: "1d" },
            ].map((q) => (
              <Card key={q.c} padding="sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="text-[var(--type-14)] font-medium truncate">{q.c}</div>
                    <div className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)]">
                      {q.days} · LAX → SFO
                    </div>
                  </div>
                  <div className="lumen-mono lumen-tnum text-[var(--type-16)] font-semibold">
                    {q.price}
                  </div>
                </div>
              </Card>
            ))}

            <div className="text-[var(--type-12)] text-[var(--text-tertiary)] mt-2">
              Showing 6 of 14 carriers. Quotes refresh every 60 s.
            </div>
          </aside>
        </div>

        {/* Footer with shortcuts */}
        <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-sunken)] px-4 py-2 flex items-center gap-4 lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)]">
          <span><kbd className="border border-[var(--border-subtle)] rounded px-1">⌘ ↵</kbd> Quote</span>
          <span><kbd className="border border-[var(--border-subtle)] rounded px-1">⌘ S</kbd> Save preset</span>
          <span><kbd className="border border-[var(--border-subtle)] rounded px-1">?</kbd> Help</span>
          <span className="ml-auto">Connected · 12 ms p50</span>
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="lumen-eyebrow">{label}</span>
      <input
        defaultValue={value}
        className={[
          "h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)] px-3",
          "text-[var(--type-15)] focus-visible:border-[var(--border-focus)] outline-none",
          mono ? "lumen-mono lumen-tnum" : "",
        ].join(" ")}
      />
    </label>
  );
}

function Row({
  weight,
  pieces,
  class: cls,
  stackable,
}: {
  weight: string;
  pieces: string;
  class: string;
  stackable?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0">
      <div className="h-8 w-8 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] grid place-items-center text-[var(--text-tertiary)]">
        <Box size={14} />
      </div>
      <div className="grid grid-cols-3 gap-3 flex-1 text-[var(--type-14)]">
        <div>
          <div className="lumen-eyebrow">Weight</div>
          <div className="lumen-mono lumen-tnum">{weight}</div>
        </div>
        <div>
          <div className="lumen-eyebrow">Pieces</div>
          <div>{pieces}</div>
        </div>
        <div>
          <div className="lumen-eyebrow">Class · Stackable</div>
          <div className="flex items-center gap-2">
            <span className="lumen-mono">{cls}</span>
            {stackable && <Badge status="success" leadingDot>Yes</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked }: { label: string; checked: boolean }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-[var(--type-14)] text-[var(--text-secondary)]">
      <span
        className={[
          "h-5 w-9 rounded-full transition-colors duration-[var(--motion-fast)] relative",
          checked ? "bg-[var(--color-accent)]" : "bg-[var(--border-strong)]",
        ].join(" ")}
      >
        <span
          className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-[var(--shadow-xs)] transition-transform duration-[var(--motion-fast)]"
          style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
        />
      </span>
      <span className="text-[var(--text-primary)]">{label}</span>
    </label>
  );
}

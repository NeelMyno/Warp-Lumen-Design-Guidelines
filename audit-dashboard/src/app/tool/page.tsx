import { PageHeader } from "@/components/section";
import { Card, CardHeader } from "@/components/primitives/card";
import { Stat } from "@/components/primitives/stat";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { LiveDot } from "@/components/primitives/live-dot";
import { Field } from "@/components/primitives/field";
import { Switch } from "@/components/primitives/switch";
import { Avatar } from "@/components/primitives/avatar";
import { ProgressBar } from "@/components/primitives/progress";
import {
  ArrowRight, Code, Plus, Box, Filter,
} from "@/components/primitives/icon";

export const metadata = { title: "Web Tool · Lumen" };

export default function ToolPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Single-purpose surface"
        title="Web Tool"
        description="Centered canvas, focused control panel, output result. The pattern for any calculator, simulator, or one-shot job."
        meta={<Badge status="neutral">v0.12.1 · beta</Badge>}
      />

      <div className="rounded-[var(--radius-xl)] overflow-hidden border border-[var(--border-hairline)] shadow-[var(--shadow-md)] bg-[var(--surface-page)]">
        {/* TITLE BAR */}
        <header className="flex items-center justify-between gap-3 px-4 h-12 border-b border-[var(--border-hairline)] bg-[var(--surface-raised)]">
          <div className="flex items-center gap-inline-sm">
            <div className="h-6 w-6 rounded-[var(--radius-sm)] bg-[var(--color-accent)] grid place-items-center text-[color:var(--text-on-accent)] lumen-mono text-micro font-bold">
              W
            </div>
            <span className="text-heading-h6 text-[color:var(--text-primary)]">
              Quote Builder
            </span>
            <Badge status="neutral" size="sm">v0.12.1</Badge>
            <LiveDot label="Auto-quoting" />
          </div>
          <div className="flex items-center gap-[var(--space-1_5)]">
            <Button intent="tertiary" size="sm" leadingIcon={<Code size={12} />}>View JSON</Button>
            <Button intent="secondary" size="sm">Save preset</Button>
            <Button intent="primary" size="sm" trailingIcon={<ArrowRight size={12} />}>Get rates</Button>
          </div>
        </header>

        <div className="grid grid-cols-[260px_1fr_320px] min-h-[680px]">
          {/* LEFT — presets */}
          <aside className="border-r border-[var(--border-hairline)] bg-[var(--surface-raised)] p-3 flex flex-col gap-1">
            <div className="lumen-eyebrow px-2 mb-2">Presets</div>
            {[
              { name: "Standard LTL", active: true },
              { name: "Refrigerated" },
              { name: "Flatbed open-deck" },
              { name: "Cross-dock express" },
              { name: "Last-mile residential" },
              { name: "International ocean" },
            ].map((p) => (
              <button
                key={p.name}
                className={[
                  "text-left px-3 py-[var(--space-1_5)] rounded-[var(--radius-md)] text-label-sm transition-colors duration-[var(--motion-fast)]",
                  p.active
                    ? "bg-[var(--surface-tint-accent)] text-[color:var(--text-primary)] font-semibold"
                    : "text-[color:var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-primary)]",
                ].join(" ")}
              >
                {p.name}
              </button>
            ))}
            <button className="mt-3 flex items-center gap-2 px-3 py-[var(--space-1_5)] rounded-[var(--radius-md)] text-[color:var(--text-tertiary)] text-body-xs hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-primary)] transition-colors">
              <Plus size={13} /> New preset
            </button>

            <div className="mt-auto px-2 pt-3 border-t border-[var(--border-hairline)]">
              <div className="lumen-eyebrow mb-2">Templates</div>
              <p className="text-micro text-[color:var(--text-tertiary)]">
                Saved presets persist across sessions and sync to teammates with the same workspace.
              </p>
            </div>
          </aside>

          {/* CENTER — canvas */}
          <main className="bg-[var(--surface-page)] p-8 flex flex-col gap-6 overflow-y-auto">
            <Card padding="lg">
              <CardHeader title="Lane" description="Where the freight starts and ends" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Origin (ZIP or IATA)" defaultValue="LAX" mono />
                <Field label="Destination" defaultValue="SFO" mono />
                <Field label="Pickup date" defaultValue="2026-05-04" mono />
                <Field label="Delivery date" defaultValue="2026-05-05" mono />
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader
                title="Cargo"
                description="One commodity per row"
                action={<Button intent="tertiary" size="xs" leadingIcon={<Plus size={12} />}>Add</Button>}
              />
              <div className="lumen-row-divider -mx-4">
                <CargoRow weight="520 lb"   pieces="2 pallets" cls="65"  stackable />
                <CargoRow weight="180 lb"   pieces="1 carton"  cls="100" />
                <CargoRow weight="2,100 lb" pieces="4 pallets" cls="55"  stackable />
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Accessorials" description="Extras the carrier needs to know about" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <Switch label="Liftgate at pickup"   defaultChecked />
                <Switch label="Liftgate at delivery" defaultChecked />
                <Switch label="Inside delivery" />
                <Switch label="Residential pickup" />
                <Switch label="Sort + segregate" />
                <Switch label="Hazardous material" />
              </div>
            </Card>

            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="lumen-mono text-micro text-[color:var(--text-tertiary)] flex items-center gap-2">
                <LiveDot /> Auto-saving every 4 s
              </div>
              <div className="flex items-center gap-2">
                <Button intent="tertiary" size="md">Reset</Button>
                <Button intent="primary" size="md" trailingIcon={<ArrowRight size={14} />}>
                  Get rates
                </Button>
              </div>
            </div>
          </main>

          {/* RIGHT — output */}
          <aside className="border-l border-[var(--border-hairline)] bg-[var(--surface-raised)] p-4 flex flex-col gap-3 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="lumen-eyebrow">Live preview</div>
              <Button intent="tertiary" size="xs" leadingIcon={<Filter size={12} />}>Filter</Button>
            </div>

            {/* Best-value highlight */}
            <Card padding="md" elevation="lifted" className="!border-[var(--color-accent)]">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Avatar name="Sterling LTL" size="xs" />
                  <div className="flex flex-col gap-[2px]">
                    <div className="text-heading-h6 text-[color:var(--text-primary)]">Sterling LTL</div>
                    <div className="lumen-mono text-micro text-[color:var(--text-tertiary)]">
                      LAX → SFO · 1d transit
                    </div>
                  </div>
                </div>
                <Badge status="accent" leadingDot>Best value</Badge>
              </div>
              <Stat label="Total" value="$262" unit=".00" size="md" />
              <Button intent="primary" fullWidth size="sm" className="mt-3" trailingIcon={<ArrowRight size={12} />}>
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
              <Card key={q.c} padding="sm" className="hover:border-[var(--border-default)] transition-colors cursor-pointer">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={q.c} size="xs" />
                    <div className="flex flex-col min-w-0 gap-[2px]">
                      <div className="text-label-sm truncate">{q.c}</div>
                      <div className="lumen-mono text-micro text-[color:var(--text-tertiary)]">
                        {q.days} · LAX → SFO
                      </div>
                    </div>
                  </div>
                  <div className="lumen-mono lumen-tnum text-data-md font-semibold">
                    {q.price}
                  </div>
                </div>
              </Card>
            ))}

            <ProgressBar value={6 / 14 * 100} tone="accent" size="sm" />
            {/* v0.11.16 — numbers wrapped in lumen-tnum so the count column doesn't
                shift when the carrier list pagination advances; freshness clause
                drops to text-tertiary so the page-of count carries the AA weight. */}
            <div className="text-[length:var(--type-12)] text-[color:var(--text-secondary)] -mt-1 lumen-tnum">
              Showing 6 of 14 carriers
              <span className="text-[color:var(--text-tertiary)]"> · refreshes every 60 s</span>
            </div>
          </aside>
        </div>

        {/* FOOTER — keyboard shortcut bar */}
        <footer className="border-t border-[var(--border-hairline)] bg-[var(--surface-sunken)] px-4 py-2 flex items-center gap-4 lumen-mono text-micro text-[color:var(--text-tertiary)]">
          <span><kbd className="lumen-kbd">⌘</kbd><kbd className="lumen-kbd">↵</kbd> Quote</span>
          <span><kbd className="lumen-kbd">⌘</kbd><kbd className="lumen-kbd">S</kbd> Save preset</span>
          <span><kbd className="lumen-kbd">⌘</kbd><kbd className="lumen-kbd">/</kbd> Find</span>
          <span><kbd className="lumen-kbd">?</kbd> Help</span>
          <span className="ml-auto flex items-center gap-2">
            <LiveDot /> Connected · 12 ms p50
          </span>
        </footer>
      </div>
    </div>
  );
}

function CargoRow({
  weight, pieces, cls, stackable,
}: {
  weight: string; pieces: string; cls: string; stackable?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3 px-4">
      <div className="h-8 w-8 rounded-[var(--radius-sm)] border border-[var(--border-hairline)] grid place-items-center text-[color:var(--text-tertiary)]">
        <Box size={14} />
      </div>
      <div className="grid grid-cols-3 gap-3 flex-1 text-body-xs">
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
            {stackable && <Badge status="success" size="sm" leadingDot>Yes</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
}

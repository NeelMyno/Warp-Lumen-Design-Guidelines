import { PageHeader } from "@/components/section";
import { Card } from "@/components/primitives/card";
import { Stat } from "@/components/primitives/stat";
import { Badge } from "@/components/primitives/badge";
import { LiveDot } from "@/components/primitives/live-dot";
import {
  Home,
  Box,
  MapPin,
  Bell,
  Search,
  ArrowRight,
  Plus,
  Inbox,
} from "@/components/primitives/icon";

export const metadata = { title: "Mobile · Lumen" };

export default function MobilePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tab 6 of 7"
        title="Mobile"
        description="iOS and Android frames side-by-side. Same Lumen visual language; platform-native chrome (HIG nav bar + tab bar on iOS, Material 3 top app bar + nav rail on Android)."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <DeviceColumn
          name="iOS · iPhone 17 Pro"
          notes="Satoshi mapped to Apple Dynamic Type · 8pt grid · 16pt safe-area padding · navigation back arrow + large title."
        >
          <IOSFrame />
        </DeviceColumn>
        <DeviceColumn
          name="Android · Material 3"
          notes="Satoshi mapped to Material 3 type roles · 4dp grid · top app bar + bottom navigation · ripple on press."
        >
          <AndroidFrame />
        </DeviceColumn>
      </div>
    </div>
  );
}

function DeviceColumn({
  name,
  notes,
  children,
}: {
  name: string;
  notes: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="lumen-eyebrow mb-1">{name}</div>
        <p className="text-[var(--type-13)] text-[var(--text-secondary)]">{notes}</p>
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

function IOSFrame() {
  return (
    <div
      className="rounded-[44px] p-2 bg-[#1a1a1a] shadow-[var(--shadow-2xl)]"
      style={{ width: 360 }}
    >
      <div
        className="rounded-[36px] overflow-hidden bg-[var(--surface-page)] flex flex-col"
        style={{ height: 720 }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-2 text-[var(--type-13)] font-semibold">
          <span className="lumen-mono lumen-tnum">9:41</span>
          <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-24 h-6 rounded-full bg-black" aria-hidden />
          <div className="flex items-center gap-1.5">
            <span className="lumen-mono lumen-tnum text-[var(--type-12)]">5G</span>
            <span className="lumen-mono lumen-tnum text-[var(--type-12)]">100%</span>
          </div>
        </div>

        {/* Large title / nav */}
        <div className="px-6 pt-4 pb-2">
          <div className="text-[var(--type-13)] text-[var(--text-tertiary)]">Today</div>
          <h2 className="text-[var(--type-31)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]">
            Shipments
          </h2>
        </div>

        {/* Search */}
        <div className="px-6 mt-2">
          <div className="bg-[var(--surface-sunken)] rounded-[var(--radius-md)] h-10 flex items-center gap-2 px-3">
            <Search size={14} />
            <span className="text-[var(--type-14)] text-[var(--text-tertiary)]">Search lanes…</span>
          </div>
        </div>

        {/* Stat */}
        <div className="px-6 mt-4">
          <Card padding="md" className="!shadow-none">
            <div className="flex items-center justify-between">
              <Stat label="On time" value="98.2" unit="%" size="sm" />
              <Badge status="accent">
                <LiveDot color="currentColor" /> Live
              </Badge>
            </div>
          </Card>
        </div>

        {/* List */}
        <div className="px-6 mt-3 flex flex-col gap-2 flex-1 overflow-y-auto">
          <div className="lumen-eyebrow mt-1">Active</div>
          {[
            { id: "WRP-9824", lane: "LAX → SFO", status: "On time" },
            { id: "WRP-9825", lane: "ORD → ATL", status: "Pickup" },
            { id: "WRP-9826", lane: "DFW → PHX", status: "At risk" },
            { id: "WRP-9827", lane: "SEA → DEN", status: "On time" },
          ].map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between bg-[var(--surface-raised)] rounded-[var(--radius-md)] px-3 py-2.5 border border-[var(--border-subtle)]"
            >
              <div className="flex flex-col">
                <span className="text-[var(--type-15)] font-semibold">{s.lane}</span>
                <code className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)]">{s.id}</code>
              </div>
              <Badge
                status={
                  s.status === "On time"
                    ? "success"
                    : s.status === "At risk"
                      ? "warning"
                      : "info"
                }
                leadingDot
              >
                {s.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-overlay)] backdrop-blur px-6 pt-2 pb-4 flex items-center justify-around">
          {[
            { I: Home, label: "Home", active: true },
            { I: Box, label: "Quotes" },
            { I: MapPin, label: "Lanes" },
            { I: Bell, label: "Alerts" },
          ].map(({ I, label, active }) => (
            <button
              key={label}
              className={[
                "flex flex-col items-center gap-1 text-[var(--type-12)]",
                active ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]",
              ].join(" ")}
            >
              <I size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-1.5">
          <div className="h-1 w-32 rounded-full bg-[var(--text-primary)] opacity-60" />
        </div>
      </div>
    </div>
  );
}

function AndroidFrame() {
  return (
    <div
      className="rounded-[40px] p-2 bg-[#101012] shadow-[var(--shadow-2xl)]"
      style={{ width: 360 }}
    >
      <div
        className="rounded-[32px] overflow-hidden bg-[var(--surface-page)] flex flex-col"
        style={{ height: 720 }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 text-[var(--type-13)] font-medium">
          <span className="lumen-mono lumen-tnum">9:41</span>
          <div className="flex items-center gap-1.5 lumen-mono text-[var(--type-12)]">
            <span>5G</span>
            <span>•</span>
            <span>100%</span>
          </div>
        </div>

        {/* Top app bar */}
        <div className="px-5 py-3 flex items-center gap-3 border-b border-[var(--border-subtle)]">
          <Inbox size={20} />
          <div className="flex-1 text-[var(--type-18)] font-semibold tracking-[var(--tracking-tight)]">Shipments</div>
          <Search size={18} />
          <Bell size={18} />
        </div>

        {/* FAB-style primary action band */}
        <div className="px-5 mt-3">
          <button className="w-full h-12 rounded-[var(--radius-2xl)] bg-[var(--color-accent)] text-[var(--text-on-accent)] font-medium flex items-center justify-center gap-2 shadow-[var(--shadow-glow-accent)]">
            <Plus size={16} /> New shipment
          </button>
        </div>

        {/* Section header */}
        <div className="px-5 mt-4 flex items-center justify-between">
          <div className="lumen-eyebrow">Active · 12</div>
          <button className="text-[var(--type-13)] text-[var(--text-secondary)] flex items-center gap-1">
            All <ArrowRight size={12} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto mt-2">
          {[
            { id: "WRP-9824", lane: "LAX → SFO", eta: "Today · 04:18", status: "On time" },
            { id: "WRP-9825", lane: "ORD → ATL", eta: "Today · 07:42", status: "Pickup" },
            { id: "WRP-9826", lane: "DFW → PHX", eta: "Today · 08:05", status: "At risk" },
            { id: "WRP-9827", lane: "SEA → DEN", eta: "Today · 12:30", status: "On time" },
            { id: "WRP-9828", lane: "MIA → JFK", eta: "Tomorrow",      status: "Late"    },
          ].map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--border-subtle)]"
            >
              <div className="h-10 w-10 rounded-full bg-[var(--surface-sunken)] grid place-items-center text-[var(--text-primary)]">
                <Box size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[var(--type-15)] font-medium truncate">{s.lane}</div>
                <div className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)]">
                  {s.id} · {s.eta}
                </div>
              </div>
              <Badge
                status={
                  s.status === "On time"
                    ? "success"
                    : s.status === "At risk"
                      ? "warning"
                      : s.status === "Late"
                        ? "danger"
                        : "info"
                }
                leadingDot
              >
                {s.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="border-t border-[var(--border-subtle)] flex items-center justify-around py-2">
          {[
            { I: Home, label: "Home", active: true },
            { I: Box, label: "Quotes" },
            { I: MapPin, label: "Lanes" },
            { I: Bell, label: "Alerts" },
          ].map(({ I, label, active }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-[var(--type-12)]"
            >
              <span
                className={[
                  "h-7 w-14 rounded-full grid place-items-center transition-colors",
                  active ? "bg-[color-mix(in_oklab,var(--color-accent)_22%,transparent)]" : "",
                ].join(" ")}
              >
                <I size={18} />
              </span>
              <span
                className={
                  active
                    ? "text-[var(--text-primary)] font-medium"
                    : "text-[var(--text-tertiary)]"
                }
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

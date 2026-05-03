import { PageHeader } from "@/components/section";
import { Card } from "@/components/primitives/card";
import { Stat } from "@/components/primitives/stat";
import { Badge } from "@/components/primitives/badge";
import { LiveDot } from "@/components/primitives/live-dot";
import { Avatar } from "@/components/primitives/avatar";
import {
  Home, Box, MapPin, Bell, Search, ArrowRight, Plus, Inbox,
} from "@/components/primitives/icon";

export const metadata = { title: "Mobile · Lumen" };

export default function MobilePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tab 7 of 8 · Mobile surfaces"
        title="Mobile"
        description="iOS and Android frames side-by-side. Same Lumen visual language; platform-native chrome — HIG nav bar + tab bar on iOS, Material 3 top app bar + bottom navigation on Android."
      />

      <div className="grid gap-10 lg:grid-cols-2 items-start">
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
  name, notes, children,
}: {
  name: string; notes: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="self-start">
        <div className="lumen-eyebrow mb-1.5">{name}</div>
        <p className="text-[var(--type-13)] text-[var(--text-tertiary)] leading-snug max-w-[42ch]">{notes}</p>
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

/* ──────────────────  iOS  ────────────────── */

function IOSFrame() {
  return (
    <div
      className="rounded-[44px] p-2 bg-[#0d0e10] shadow-[var(--shadow-2xl)] ring-1 ring-black/40"
      style={{ width: 360 }}
    >
      <div
        className="rounded-[36px] overflow-hidden bg-[var(--surface-page)] flex flex-col relative"
        style={{ height: 720 }}
      >
        {/* Status bar */}
        <div className="relative flex items-center justify-between px-7 pt-3 pb-1 text-[var(--type-13)] font-semibold lumen-tnum">
          <span>9:41</span>
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2 w-[105px] h-[28px] rounded-full bg-black" />
          <div className="flex items-center gap-1.5 lumen-mono lumen-tnum text-[var(--type-12)]">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Large title */}
        <div className="px-6 pt-4 pb-2">
          <div className="text-[var(--type-13)] text-[var(--text-tertiary)] tracking-[var(--tracking-tight)]">Today</div>
          <h2 className="text-[var(--type-31)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]">
            Shipments
          </h2>
        </div>

        {/* Search */}
        <div className="px-6 mt-2">
          <div className="bg-[var(--surface-sunken)] rounded-[var(--radius-lg)] h-9 flex items-center gap-2 px-3 text-[var(--text-tertiary)]">
            <Search size={14} />
            <span className="text-[var(--type-14)]">Search lanes…</span>
          </div>
        </div>

        {/* Stat strip */}
        <div className="px-6 mt-4 grid grid-cols-2 gap-3">
          <Card padding="sm" elevation="flat">
            <Stat label="On time" value="98.2" unit="%" size="xs" />
          </Card>
          <Card padding="sm" elevation="flat">
            <div className="flex items-center justify-between">
              <Stat label="Live" value="1,284" size="xs" />
              <LiveDot />
            </div>
          </Card>
        </div>

        {/* List */}
        <div className="px-6 mt-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          <div className="lumen-eyebrow mt-1">Active</div>
          {[
            { id: "WRP-9824", lane: "LAX → SFO", status: "On time", carrier: "Sterling LTL" },
            { id: "WRP-9825", lane: "ORD → ATL", status: "Pickup",  carrier: "Estes" },
            { id: "WRP-9826", lane: "DFW → PHX", status: "At risk", carrier: "Saia" },
            { id: "WRP-9827", lane: "SEA → DEN", status: "On time", carrier: "ODFL" },
          ].map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 bg-[var(--surface-raised)] rounded-[var(--radius-lg)] px-3 py-2.5 border border-[var(--border-hairline)]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={s.carrier} size="xs" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[var(--type-15)] font-semibold leading-tight">{s.lane}</span>
                  <code className="lumen-mono text-[var(--type-11)] text-[var(--text-tertiary)]">{s.id}</code>
                </div>
              </div>
              <Badge
                size="sm"
                status={
                  s.status === "On time"  ? "success" :
                  s.status === "At risk"  ? "warning" :
                                            "info"
                }
                leadingDot
              >
                {s.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="border-t border-[var(--border-hairline)] bg-[var(--surface-overlay)] backdrop-blur px-6 pt-2 pb-5 flex items-center justify-around" style={{ WebkitBackdropFilter: "blur(20px)" }}>
          {[
            { I: Home,  label: "Home",   active: true },
            { I: Box,   label: "Quotes" },
            { I: MapPin,label: "Lanes"  },
            { I: Bell,  label: "Alerts" },
          ].map(({ I, label, active }) => (
            <button
              key={label}
              className={[
                "flex flex-col items-center gap-1 text-[var(--type-11)]",
                active ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]",
              ].join(" ")}
            >
              <I size={22} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[5px] w-[120px] rounded-full bg-[var(--text-primary)] opacity-70" />
      </div>
    </div>
  );
}

/* ──────────────────  ANDROID  ────────────────── */

function AndroidFrame() {
  return (
    <div
      className="rounded-[40px] p-2 bg-[#0a0b0e] shadow-[var(--shadow-2xl)] ring-1 ring-black/40"
      style={{ width: 360 }}
    >
      <div
        className="rounded-[32px] overflow-hidden bg-[var(--surface-page)] flex flex-col"
        style={{ height: 720 }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 text-[var(--type-12)] font-medium lumen-tnum">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 lumen-mono">
            <span>5G</span><span>•</span><span>100%</span>
          </div>
        </div>

        {/* Top app bar */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-[var(--border-hairline)] bg-[var(--surface-raised)]">
          <Inbox size={20} />
          <div className="flex-1 text-[var(--type-18)] font-semibold tracking-[var(--tracking-tight)]">Shipments</div>
          <Search size={18} />
          <span className="relative">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </span>
        </div>

        {/* FAB-style primary action */}
        <div className="px-4 mt-4">
          <button className="w-full h-12 rounded-[var(--radius-2xl)] bg-[var(--color-accent)] text-[var(--text-on-accent)] font-semibold flex items-center justify-center gap-2 shadow-[var(--shadow-glow-accent)]">
            <Plus size={16} /> New shipment
          </button>
        </div>

        {/* Section header */}
        <div className="px-4 mt-5 flex items-center justify-between">
          <div className="lumen-eyebrow">Active · 12</div>
          <button className="text-[var(--type-12)] text-[var(--text-secondary)] flex items-center gap-1 font-medium">
            All <ArrowRight size={12} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto mt-2">
          {[
            { id: "WRP-9824", lane: "LAX → SFO", eta: "Today · 04:18", status: "On time", carrier: "Sterling" },
            { id: "WRP-9825", lane: "ORD → ATL", eta: "Today · 07:42", status: "Pickup",  carrier: "Estes"    },
            { id: "WRP-9826", lane: "DFW → PHX", eta: "Today · 08:05", status: "At risk", carrier: "Saia"     },
            { id: "WRP-9827", lane: "SEA → DEN", eta: "Today · 12:30", status: "On time", carrier: "ODFL"     },
            { id: "WRP-9828", lane: "MIA → JFK", eta: "Tomorrow",      status: "Late",    carrier: "FedEx"    },
          ].map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border-hairline)]"
            >
              <Avatar name={s.carrier} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-[var(--type-15)] font-medium truncate leading-tight">{s.lane}</div>
                <div className="lumen-mono text-[var(--type-11)] text-[var(--text-tertiary)]">
                  {s.id} · {s.eta}
                </div>
              </div>
              <Badge
                size="sm"
                status={
                  s.status === "On time"  ? "success" :
                  s.status === "At risk"  ? "warning" :
                  s.status === "Late"     ? "danger"  :
                                            "info"
                }
                leadingDot
              >
                {s.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="border-t border-[var(--border-hairline)] flex items-center justify-around py-2 bg-[var(--surface-raised)]">
          {[
            { I: Home,   label: "Home",   active: true },
            { I: Box,    label: "Quotes" },
            { I: MapPin, label: "Lanes"  },
            { I: Bell,   label: "Alerts" },
          ].map(({ I, label, active }) => (
            <button key={label} className="flex flex-col items-center gap-0.5 px-3 py-1 text-[var(--type-11)]">
              <span
                className={[
                  "h-7 w-14 rounded-full grid place-items-center transition-colors",
                  active ? "bg-[var(--surface-tint-accent)]" : "",
                ].join(" ")}
              >
                <I size={18} />
              </span>
              <span className={active ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-tertiary)] font-medium"}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

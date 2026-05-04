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
        eyebrow="Mobile surfaces"
        title="Mobile"
        description="iOS and Android, side-by-side. Same Lumen visual language; platform-native chrome — HIG on iOS, Material 3 on Android."
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
    <div className="flex flex-col gap-stack-md items-center">
      <div className="self-start">
        <div className="lumen-eyebrow mb-2">{name}</div>
        <p className="text-body-xs text-[var(--text-tertiary)] max-w-[42ch]">{notes}</p>
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

/* ──────────────────  iOS  ──────────────────
   Large-title pattern — `Today` eyebrow + 31 px bold title + search field +
   2-up stat strip + active list. Typography rides Lumen semantic presets:
   `text-heading-h1` for the large title (31/36 compact 1.16 — close to iOS
   34pt Large Title at SF Pro Display Bold), `text-label-md` for list rows
   (14 medium snug-body 1.30 — Apple HIG row title weight). Tabular rows
   carry `lumen-mono lumen-tnum` for column alignment without leaving
   Satoshi (v0.10 Lumen is Satoshi-only). Status-bar text and tab labels
   sit at `text-micro` (12 medium) to honor Lumen's 12 px UI floor — one
   step above iOS's actual 10–11 pt, deliberately.
*/
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
        <div className="relative flex items-center justify-between px-7 pt-3 pb-1 text-label-sm lumen-tnum">
          <span>9:41</span>
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2 w-[105px] h-[28px] rounded-full bg-black" />
          <div className="flex items-center gap-[var(--space-1_5)] lumen-mono lumen-tnum text-micro">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Large title */}
        <div className="px-6 pt-5 pb-3 flex flex-col gap-[var(--space-1_5)]">
          <div className="text-eyebrow-sans text-[var(--text-tertiary)]">Today</div>
          <h2 className="text-heading-h1 text-[var(--text-primary)]">
            Shipments
          </h2>
        </div>

        {/* Search */}
        <div className="px-6 mt-1">
          <div className="bg-[var(--surface-sunken)] rounded-[var(--radius-lg)] h-control-cozy flex items-center gap-2 px-3 text-[var(--text-tertiary)]">
            <Search size={14} />
            <span className="text-body-sm">Search lanes…</span>
          </div>
        </div>

        {/* Stat strip — Stat sm (25 px value) reads at the right scale on a
            360 px-wide frame; xs at 20 px reads underweight inside this card. */}
        <div className="px-6 mt-5 grid grid-cols-2 gap-3">
          <Card padding="sm" elevation="flat">
            <Stat label="On time" value="98.2" unit="%" size="sm" />
          </Card>
          <Card padding="sm" elevation="flat">
            <div className="flex items-start justify-between gap-2">
              <Stat label="Live" value="1,284" size="sm" />
              <LiveDot />
            </div>
          </Card>
        </div>

        {/* List */}
        <div className="px-6 mt-5 flex flex-col gap-2 flex-1 overflow-y-auto">
          <div className="lumen-eyebrow mt-1 mb-1">Active</div>
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
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={s.carrier} size="sm" />
                <div className="flex flex-col min-w-0 gap-[2px]">
                  <span className="text-label-md text-[var(--text-primary)]">{s.lane}</span>
                  <code className="lumen-mono text-micro text-[var(--text-tertiary)]">{s.id}</code>
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
                "flex flex-col items-center gap-1 text-micro",
                active ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]",
              ].join(" ")}
            >
              <I size={22} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[5px] w-[120px] rounded-full bg-[var(--text-primary)] opacity-70" />
      </div>
    </div>
  );
}

/* ──────────────────  ANDROID  ──────────────────
   Material 3 top app bar + filled FAB-style primary + outlined card list
   + bottom navigation. Top app bar title sits at `text-heading-h3` (20 px
   semibold, snug-body 1.30) — close to M3's Title Large 22 sp. Bottom-nav
   labels ride `text-micro` (12 medium) instead of M3's 11 sp Label Small,
   matching iOS for cross-platform consistency and Lumen's 12 px floor.
*/
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
        <div className="flex items-center justify-between px-5 py-2 text-label-sm lumen-tnum">
          <span>9:41</span>
          <div className="flex items-center gap-[var(--space-1_5)] lumen-mono text-micro">
            <span>5G</span><span>•</span><span>100%</span>
          </div>
        </div>

        {/* Top app bar */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-[var(--border-hairline)] bg-[var(--surface-raised)]">
          <Inbox size={20} />
          <h2 className="flex-1 text-heading-h3 text-[var(--text-primary)]">Shipments</h2>
          <Search size={20} />
          <span className="relative">
            <Bell size={20} />
            <span className="absolute -top-[2px] -right-[2px] h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </span>
        </div>

        {/* FAB-style primary action */}
        <div className="px-4 mt-4">
          <button className="w-full h-12 rounded-[var(--radius-2xl)] bg-[var(--color-accent)] text-[var(--text-on-accent)] text-label-md flex items-center justify-center gap-2 font-semibold">
            <Plus size={16} /> New shipment
          </button>
        </div>

        {/* Section header */}
        <div className="px-4 mt-5 mb-1 flex items-center justify-between">
          <div className="lumen-eyebrow">Active · 12</div>
          <button className="text-micro text-[var(--text-secondary)] flex items-center gap-1">
            All <ArrowRight size={12} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
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
              <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                <div className="text-label-md text-[var(--text-primary)] truncate">{s.lane}</div>
                <div className="lumen-mono text-micro text-[var(--text-tertiary)] truncate">
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
            <button key={label} className="flex flex-col items-center gap-1 px-3 py-1 text-micro">
              <span
                className={[
                  "h-7 w-14 rounded-full grid place-items-center transition-colors",
                  active ? "bg-[var(--surface-tint-accent)]" : "",
                ].join(" ")}
              >
                <I size={18} />
              </span>
              <span className={active ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-tertiary)]"}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

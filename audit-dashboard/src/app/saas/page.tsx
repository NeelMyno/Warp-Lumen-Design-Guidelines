import { PageHeader } from "@/components/section";
import { Card, CardHeader } from "@/components/primitives/card";
import { Stat, StatGrid } from "@/components/primitives/stat";
import { LiveDot } from "@/components/primitives/live-dot";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import {
  Home,
  Truck,
  Box,
  MapPin,
  Inbox,
  Settings,
  Bell,
  Search,
  Plus,
  Filter,
  ArrowRight,
  Code,
} from "@/components/primitives/icon";

export const metadata = { title: "SaaS Dashboard · Lumen" };

export default function SaaSPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tab 2 of 7"
        title="SaaS Dashboard"
        description="Internal product UI: navigation, KPI grid, live tables, status, and inspector. The pattern Warp uses for its operator portal — dense, scannable, instrument-panel."
      />

      <div className="lumen-card overflow-hidden">
        <div className="grid grid-cols-[220px_1fr]">
          <Sidebar />
          <div className="flex flex-col min-w-0 bg-[var(--surface-page)]">
            <TopBar />
            <main className="flex-1 p-6 flex flex-col gap-6">
              <KpiRow />
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <ShipmentsTable />
                <SidePanel />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const sections: Array<{
    title: string;
    items: Array<{ icon: React.ComponentType<{ size?: number }>; label: string; active?: boolean; badge?: string }>;
  }> = [
    {
      title: "Operate",
      items: [
        { icon: Home, label: "Overview", active: true },
        { icon: Truck, label: "Shipments", badge: "12" },
        { icon: MapPin, label: "Lanes" },
        { icon: Box, label: "Quotes" },
        { icon: Inbox, label: "Tasks", badge: "3" },
      ],
    },
    {
      title: "Build",
      items: [
        { icon: Code, label: "API & CLI" },
        { icon: Settings, label: "Integrations" },
      ],
    },
  ];
  return (
    <aside className="bg-[var(--surface-raised)] border-r border-[var(--border-subtle)] py-4 flex flex-col gap-5 min-h-[760px]">
      <div className="flex items-center gap-2 px-4">
        <div className="h-7 w-7 rounded-[var(--radius-sm)] bg-[var(--color-accent)] grid place-items-center text-[var(--text-on-accent)] lumen-mono text-[var(--type-13)] font-bold">
          W
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[var(--type-14)] font-semibold tracking-[var(--tracking-tight)]">
            Warp
          </span>
          <span className="text-[var(--type-12)] text-[var(--text-tertiary)]">Acme Logistics</span>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-2">
        {sections.map((s) => (
          <div key={s.title} className="flex flex-col">
            <div className="lumen-eyebrow px-2 mb-1.5">{s.title}</div>
            {s.items.map((item) => {
              const I = item.icon;
              return (
                <a
                  key={item.label}
                  href="#"
                  className={[
                    "flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-md)]",
                    "text-[var(--type-14)]",
                    item.active
                      ? "bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] text-[var(--text-primary)] font-medium"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]",
                  ].join(" ")}
                >
                  <I size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)]">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-auto px-3 py-3 mx-3 mb-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-sunken)] flex flex-col gap-1.5">
        <LiveDot label="API healthy" />
        <div className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)]">
          v2.18.4 · 12ms p50
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="flex items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)] px-6 py-3">
      <h1 className="text-[var(--type-18)] font-semibold tracking-[var(--tracking-tight)]">
        Overview
      </h1>
      <Badge status="accent">
        <LiveDot color="currentColor" /> Live
      </Badge>
      <div className="ml-4 flex items-center gap-2 flex-1 max-w-md">
        <div className="flex items-center gap-2 w-full bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-3 h-9">
          <Search size={14} />
          <input
            placeholder="Search shipments, lanes, quotes…"
            className="bg-transparent flex-1 outline-none text-[var(--type-14)]"
          />
          <kbd className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] px-1.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>
      <Button intent="tertiary" leadingIcon={<Bell size={16} />} size="sm" aria-label="Notifications">
        3
      </Button>
      <Button intent="primary" leadingIcon={<Plus size={16} />}>
        New shipment
      </Button>
    </header>
  );
}

function KpiRow() {
  return (
    <Card padding="lg">
      <StatGrid cols={4}>
        <Stat label="Shipments today" value="1,284" delta="+12.4% wow" trend="up" />
        <Stat label="On-time %" value="98.2" unit="%" delta="+0.4 pts" trend="up" />
        <Stat label="Avg cost / pallet" value="$42.10" delta="-3.6%" trend="down" />
        <Stat label="Active lanes" value="1,547" delta="+18 this wk" trend="up" />
      </StatGrid>
    </Card>
  );
}

function ShipmentsTable() {
  type Row = {
    id: string;
    lane: string;
    carrier: string;
    eta: string;
    weight: string;
    cost: string;
    status: "On time" | "At risk" | "Late" | "Delivered" | "Pickup";
  };
  const rows: Row[] = [
    { id: "WRP-9824",  lane: "LAX → SFO", carrier: "Sterling LTL",   eta: "04:18",     weight: "520 lb",  cost: "$262",   status: "On time" },
    { id: "WRP-9825",  lane: "ORD → ATL", carrier: "Estes Express",  eta: "07:42",     weight: "1,240 lb", cost: "$485",  status: "Pickup"  },
    { id: "WRP-9826",  lane: "DFW → PHX", carrier: "Saia Motor",     eta: "08:05",     weight: "612 lb",  cost: "$390",   status: "At risk" },
    { id: "WRP-9827",  lane: "SEA → DEN", carrier: "ODFL",           eta: "12:30",     weight: "2,100 lb", cost: "$612",  status: "On time" },
    { id: "WRP-9828",  lane: "MIA → JFK", carrier: "FedEx Freight",  eta: "Tomorrow",  weight: "880 lb",  cost: "$724",   status: "Late"    },
    { id: "WRP-9829",  lane: "BOS → CLT", carrier: "ABF",            eta: "Tomorrow",  weight: "350 lb",  cost: "$540",   status: "Delivered" },
    { id: "WRP-9830",  lane: "MSP → MCI", carrier: "Old Dominion",   eta: "Wed 10:00", weight: "740 lb",  cost: "$280",   status: "On time" },
  ];
  const statusBadge = (s: Row["status"]) => {
    const map = {
      "On time":   <Badge status="success" leadingDot>On time</Badge>,
      "Pickup":    <Badge status="info" leadingDot>Pickup</Badge>,
      "At risk":   <Badge status="warning" leadingDot>At risk</Badge>,
      "Late":      <Badge status="danger" leadingDot>Late</Badge>,
      "Delivered": <Badge status="neutral" leadingDot>Delivered</Badge>,
    } as const;
    return map[s];
  };
  return (
    <Card padding="none">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <h2 className="text-[var(--type-15)] font-semibold tracking-[var(--tracking-tight)]">
            Shipments
          </h2>
          <Badge status="neutral">{rows.length}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button intent="tertiary" leadingIcon={<Filter size={14} />} size="sm">
            Filter
          </Button>
          <Button intent="secondary" size="sm" trailingIcon={<ArrowRight size={14} />}>
            Open queue
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[var(--type-14)]">
          <thead>
            <tr className="text-left text-[var(--text-tertiary)] lumen-eyebrow">
              <Th>ID</Th>
              <Th>Lane</Th>
              <Th>Carrier</Th>
              <Th align="right">ETA</Th>
              <Th align="right">Weight</Th>
              <Th align="right">Cost</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-t border-[var(--border-subtle)] hover:bg-[var(--surface-sunken)] transition-colors duration-[var(--motion-fast)]"
              >
                <Td><code className="lumen-mono">{r.id}</code></Td>
                <Td>{r.lane}</Td>
                <Td className="text-[var(--text-secondary)]">{r.carrier}</Td>
                <Td align="right" mono>{r.eta}</Td>
                <Td align="right" mono>{r.weight}</Td>
                <Td align="right" mono>{r.cost}</Td>
                <Td>{statusBadge(r.status)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={`px-4 py-2.5 font-medium ${align === "right" ? "text-right" : ""}`}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  align = "left",
  mono,
  className = "",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  mono?: boolean;
  className?: string;
}) {
  return (
    <td
      className={[
        "px-4 py-2.5",
        align === "right" ? "text-right" : "",
        mono ? "lumen-mono lumen-tnum" : "",
        className,
      ].join(" ")}
    >
      {children}
    </td>
  );
}

function SidePanel() {
  return (
    <aside className="flex flex-col gap-4">
      <Card>
        <CardHeader title="Activity" description="Last 24 h" />
        <ul className="lumen-row-divider">
          {[
            { icon: <Truck size={14} />,  who: "Sterling LTL", what: "picked up at LAX",  when: "12 min ago" },
            { icon: <Box size={14} />,    who: "Estes",        what: "tendered ORD → ATL", when: "27 min ago" },
            { icon: <MapPin size={14} />, who: "ODFL",         what: "scanned at SLC hub", when: "48 min ago" },
            { icon: <Bell size={14} />,   who: "Quote engine", what: "reduced 16 lanes by 4.2%", when: "2 h ago" },
          ].map((a, i) => (
            <li key={i} className="flex items-start gap-3 py-2.5">
              <span className="mt-0.5 text-[var(--text-tertiary)]">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[var(--type-14)] text-[var(--text-primary)]">
                  <span className="font-medium">{a.who}</span>{" "}
                  <span className="text-[var(--text-secondary)]">{a.what}</span>
                </div>
                <div className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)]">{a.when}</div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Quote a lane" description="One-line quoting" />
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Field label="From" value="LAX" />
            <Field label="To" value="SFO" />
          </div>
          <Field label="Weight" value="520 lb" />
          <Button intent="primary" fullWidth trailingIcon={<ArrowRight size={14} />}>
            Get rates
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Empty state preview" description="What appears when there's nothing yet" />
        <div className="flex flex-col items-center text-center gap-2 py-8 px-4">
          <div className="h-10 w-10 rounded-full border border-[var(--border-default)] grid place-items-center text-[var(--text-tertiary)]">
            <Inbox size={18} />
          </div>
          <div className="text-[var(--type-15)] font-semibold">No tasks today</div>
          <p className="text-[var(--type-13)] text-[var(--text-secondary)] max-w-[240px]">
            When a shipment needs your attention, it will appear here. Try creating a new quote.
          </p>
          <Button intent="secondary" size="sm" leadingIcon={<Plus size={14} />}>
            New quote
          </Button>
        </div>
      </Card>
    </aside>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[var(--type-12)] text-[var(--text-secondary)]">{label}</span>
      <input
        defaultValue={value}
        className="h-9 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)] px-2.5 text-[var(--type-14)] focus-visible:border-[var(--border-focus)] outline-none"
      />
    </label>
  );
}

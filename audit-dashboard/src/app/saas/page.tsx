import { PageHeader } from "@/components/section";
import { Card, CardHeader } from "@/components/primitives/card";
import { Stat, StatGrid } from "@/components/primitives/stat";
import { LiveDot } from "@/components/primitives/live-dot";
import { Badge } from "@/components/primitives/badge";
import { Button, IconButton } from "@/components/primitives/button";
import { Avatar, AvatarGroup } from "@/components/primitives/avatar";
import { Field } from "@/components/primitives/field";
import { InlineTabs } from "@/components/primitives/tabs-inline";
import { Tooltip } from "@/components/primitives/tooltip";
import { ProgressRing } from "@/components/primitives/progress";
import {
  Home, Truck, Box, MapPin, Inbox, Settings, Bell, Search, Plus,
  Filter, ArrowRight, Code, ChevronLeft, ChevronRight,
} from "@/components/primitives/icon";

export const metadata = { title: "SaaS Dashboard · Lumen" };

export default function SaaSPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Application surface"
        title="SaaS Dashboard"
        description="Navigation, KPI grid, live table, side panel. The operator-portal pattern — dense, scannable, instrument-panel."
        meta={<Badge status="accent" leadingDot>Live · 1,284 today</Badge>}
      />

      {/* v0.14 R9 — collapse the fixed-240px sidebar at < md.
          Pre-R9 the grid was `grid-cols-[240px_1fr]` with no responsive variant,
          so at 320 px the sidebar consumed the full content area and the
          dashboard main column was clipped off-screen. Now: 1-col stack at
          mobile (sidebar hidden — see Sidebar's hidden md:flex), full grid at
          ≥ md. The operator-portal pattern is desktop-first by design; at < md
          the dashboard shows the work surface (KPIs, table, activity) and the
          workspace-nav sidebar reveals at ≥ md. */}
      <div className="rounded-[var(--radius-xl)] overflow-hidden border border-[var(--border-hairline)] shadow-[var(--shadow-md)] bg-[var(--surface-page)]">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
          <Sidebar />
          <div className="flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-6 bg-[var(--surface-page)]">
              <KpiRow />
              <div className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_320px] items-start">
                <div className="flex flex-col gap-4 md:gap-6 min-w-0">
                  <ShipmentsTable />
                  <LanePerf />
                </div>
                <SidePanel />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────  SIDEBAR  ────────────────── */

type NavSection = {
  title: string;
  items: Array<{
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    active?: boolean;
    badge?: string;
  }>;
};

function Sidebar() {
  const sections: NavSection[] = [
    {
      title: "Operate",
      items: [
        { icon: Home, label: "Today", active: true },
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
    <aside className="hidden md:flex bg-[var(--surface-raised)] border-r border-[var(--border-hairline)] py-3 flex-col gap-5">
      {/* workspace switcher */}
      <button className="mx-3 flex items-center gap-inline-sm px-2 py-[var(--space-1_5)] rounded-[var(--radius-md)] hover:bg-[var(--surface-sunken)] transition-colors group">
        <div className="h-7 w-7 rounded-[var(--radius-sm)] bg-[var(--color-accent)] grid place-items-center text-[color:var(--text-on-accent)] lumen-mono text-label-sm font-bold">
          A
        </div>
        <div className="flex flex-col min-w-0 text-left gap-[2px]">
          <span className="text-heading-h6 truncate">
            Acme Logistics
          </span>
          <span className="text-micro text-[color:var(--text-tertiary)]">Workspace</span>
        </div>
        <span className="ml-auto text-[color:var(--text-tertiary)] group-hover:text-[color:var(--text-secondary)]">⌃</span>
      </button>

      <div className="flex flex-col gap-5 px-2">
        {sections.map((s) => (
          <div key={s.title} className="flex flex-col gap-1">
            <div className="lumen-eyebrow px-2 mb-2">{s.title}</div>
            {s.items.map((item) => {
              const I = item.icon;
              return (
                <a
                  key={item.label}
                  href="#"
                  className={[
                    "flex items-center gap-inline-sm px-2 py-[var(--space-1_5)] rounded-[var(--radius-md)]",
                    "text-label-sm",
                    "transition-colors duration-[var(--motion-fast)]",
                    item.active
                      ? "bg-[var(--surface-tint-accent)] text-[color:var(--text-primary)] font-semibold"
                      : "text-[color:var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-primary)]",
                  ].join(" ")}
                >
                  <I size={15} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="lumen-mono lumen-tnum text-micro text-[color:var(--text-tertiary)]">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        ))}
      </div>

      {/* status footer */}
      <div className="mt-auto mx-3 mb-2 px-3 py-2 rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-sunken)] flex flex-col gap-[var(--space-1_5)]">
        <LiveDot label="API healthy" />
        <div className="flex items-center justify-between lumen-mono lumen-tnum text-micro text-[color:var(--text-tertiary)]">
          <span>v2.18.4</span>
          <span>12 ms p50</span>
        </div>
      </div>
    </aside>
  );
}

/* ──────────────────  TOP BAR  ────────────────── */

function TopBar() {
  return (
    /* v0.14 R9 — mobile responsive condensation. At < md the search bar +
       avatar group + bell collapse, and "New shipment" tightens to its
       leading icon + a shorter label. The Today + Live badge anchor stays
       visible. The full row reveals at ≥ md (the operator-portal's native
       density). */
    <header className="flex items-center gap-3 md:gap-4 border-b border-[var(--border-hairline)] bg-[var(--surface-raised)] px-4 md:px-6 h-14">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <h1 className="text-heading-h4 md:text-heading-h3 text-[color:var(--text-primary)] truncate">
          Today
        </h1>
        <Badge status="accent" leadingDot size="md">Live</Badge>
        <span className="text-micro text-[color:var(--text-tertiary)] hidden lg:inline">
          Thursday · May 7 · UTC
        </span>
      </div>

      <div className="hidden md:flex flex-1 max-w-md">
        <button className="w-full flex items-center gap-inline-md h-control-cozy px-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-sunken)] text-[color:var(--text-tertiary)] text-body-xs hover:border-[var(--border-default)] transition-colors">
          <Search size={14} />
          <span className="flex-1 text-left">Search shipments, lanes, quotes…</span>
          <span className="flex items-center gap-1">
            <kbd className="lumen-kbd">⌘</kbd>
            <kbd className="lumen-kbd">K</kbd>
          </span>
        </button>
      </div>

      <div className="ml-auto md:ml-0 flex items-center gap-1 md:gap-2">
        {/* Mobile-only Search icon — opens the same ⌘K palette flow. The
            wrapper carries the visibility class because `.lumen-btn`
            declares `display: inline-flex` outside Tailwind's @layer
            utilities, so utility `hidden` loses the cascade if applied
            directly to the button. */}
        <span className="md:hidden">
          <Tooltip content="Search" side="bottom">
            <IconButton aria-label="Search shipments, lanes, quotes" intent="tertiary">
              <Search size={15} />
            </IconButton>
          </Tooltip>
        </span>
        <span className="hidden md:inline-flex">
          <Tooltip content="3 unread notifications" side="bottom">
            <IconButton aria-label="Notifications — 3 unread" intent="tertiary">
              <span className="relative inline-flex">
                <Bell size={15} />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              </span>
            </IconButton>
          </Tooltip>
        </span>
        <div className="hidden lg:flex">
          <AvatarGroup names={["A Mercer", "J Park", "A Reyes"]} max={3} size="sm" />
        </div>
        <Button intent="primary" size="sm" leadingIcon={<Plus size={14} />}>
          <span className="hidden sm:inline">New shipment</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
    </header>
  );
}

/* ──────────────────  KPI ROW  ────────────────── */

function KpiRow() {
  /* v0.11.12 — every Stat now uses the new sparkData / polarity API.
     The AVG COST card carries `polarity="good-down"` so falling cost
     reads as success in BOTH the trend pill and the sparkline (prior
     to the fix the pill was red while the spark was green — visible
     contradiction). All sparks now show a live endpoint pulse. */
  return (
    <Card padding="lg" className="lumen-stat-card">
      <StatGrid cols={4} divided>
        <Stat label="Shipments today" value="1,284" delta="+12.4% wow" trend="up" size="lg"
          sparkData={[3,4,3,5,6,5,7,8,7,9,10,12]} />
        <Stat label="On time" value="98.2" unit="%" delta="+0.4 pts" trend="up" size="lg"
          sparkData={[95,96,96,97,97,98,98,98,98,98,98,98]} />
        <Stat label="Avg cost / pallet" value="$42.10" delta="-3.6%" trend="down" size="lg"
          polarity="good-down"
          sparkData={[48,47,46,45,46,44,43,43,42,42,42,42]} />
        <Stat label="Active lanes" value="1,547" delta="+18 wk" trend="up" size="lg"
          sparkData={[1480,1490,1495,1500,1510,1520,1525,1530,1535,1540,1545,1547]} />
      </StatGrid>
    </Card>
  );
}

/* ──────────────────  SHIPMENTS TABLE  ────────────────── */

type Row = {
  id: string;
  lane: string;
  carrier: string;
  carrierAvatar: string;
  eta: string;
  weight: string;
  cost: string;
  status: "On time" | "At risk" | "Late" | "Delivered" | "Pickup";
};

function ShipmentsTable() {
  const rows: Row[] = [
    { id: "WRP-9824", lane: "LAX → SFO", carrier: "Sterling LTL",  carrierAvatar: "ST", eta: "Today · 04:18", weight: "520 lb",   cost: "$262",   status: "On time" },
    { id: "WRP-9825", lane: "ORD → ATL", carrier: "Estes Express", carrierAvatar: "EE", eta: "Today · 07:42", weight: "1,240 lb", cost: "$485",   status: "Pickup"  },
    { id: "WRP-9826", lane: "DFW → PHX", carrier: "Saia Motor",    carrierAvatar: "SA", eta: "Today · 08:05", weight: "612 lb",   cost: "$390",   status: "At risk" },
    { id: "WRP-9827", lane: "SEA → DEN", carrier: "ODFL",          carrierAvatar: "OD", eta: "Today · 12:30", weight: "2,100 lb", cost: "$612",   status: "On time" },
    { id: "WRP-9828", lane: "MIA → JFK", carrier: "FedEx Freight", carrierAvatar: "FX", eta: "Tomorrow",      weight: "880 lb",   cost: "$724",   status: "Late"    },
    { id: "WRP-9829", lane: "BOS → CLT", carrier: "ABF",           carrierAvatar: "AB", eta: "Tomorrow",      weight: "350 lb",   cost: "$540",   status: "Delivered" },
    { id: "WRP-9830", lane: "MSP → MCI", carrier: "Old Dominion",  carrierAvatar: "OD", eta: "Wed 10:00",     weight: "740 lb",   cost: "$280",   status: "On time" },
  ];
  const statusBadge = (s: Row["status"]) => {
    const map = {
      "On time":   <Badge status="success" leadingDot>On time</Badge>,
      "Pickup":    <Badge status="info"    leadingDot>Pickup</Badge>,
      "At risk":   <Badge status="warning" leadingDot>At risk</Badge>,
      "Late":      <Badge status="danger"  leadingDot>Late</Badge>,
      "Delivered": <Badge status="neutral">Delivered</Badge>,
    } as const;
    return map[s];
  };
  return (
    <Card padding="none">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border-hairline)]">
        <div className="flex items-center gap-3">
          <h2 className="text-heading-h5">
            Shipments
          </h2>
          <Badge status="neutral">{rows.length}</Badge>
        </div>
        <div className="hidden md:block">
          <InlineTabs
            variant="pill"
            size="sm"
            defaultId="active"
            items={[
              { id: "all",    label: "All" },
              { id: "active", label: "Active", badge: 12 },
              { id: "delivered", label: "Done" },
            ]}
          />
        </div>
        <div className="flex items-center gap-1">
          <Button intent="tertiary" size="sm" leadingIcon={<Filter size={12} />}>Filter</Button>
          <Button intent="secondary" size="sm" trailingIcon={<ArrowRight size={12} />}>Open queue</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-body-xs">
          <thead>
            <tr className="text-left text-[color:var(--text-tertiary)]">
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
                className="border-t border-[var(--border-hairline)] hover:bg-[var(--surface-sunken)] transition-colors duration-[var(--motion-fast)] cursor-pointer"
              >
                <Td><code className="lumen-mono text-[color:var(--text-secondary)]">{r.id}</code></Td>
                <Td><span className="font-medium text-[color:var(--text-primary)]">{r.lane}</span></Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={r.carrier} size="xs" />
                    <span className="text-[color:var(--text-secondary)]">{r.carrier}</span>
                  </div>
                </Td>
                <Td align="right" mono>{r.eta}</Td>
                <Td align="right" mono>{r.weight}</Td>
                <Td align="right" mono className="font-medium text-[color:var(--text-primary)]">{r.cost}</Td>
                <Td>{statusBadge(r.status)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* v0.11.15 — pagination footer rebuilt:
          (1) numbers wrapped in lumen-tnum so they don't shift width as the
              page index advances ("9 of 1,284" should sit on the same column
              grid as "7 of 1,284"),
          (2) text tier bumped from text-tertiary to text-secondary so the
              footer is AA Normal at 12 px on the dark canvas (was 3.6:1 — AA
              Large only — at the prior tier),
          (3) Prev / Next gain directional chevron icons so they read as
              pagination affordances rather than ambiguous tertiary buttons,
          (4) the freshness clause keeps text-tertiary so the "refreshed N s
              ago" reads as ambient metadata while the page-of count carries
              the AA-tier weight. */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-t border-[var(--border-hairline)] bg-[var(--surface-raised)] text-[length:var(--type-12)]">
        <span className="lumen-tnum text-[color:var(--text-secondary)]">
          7 of 1,284
          <span className="text-[color:var(--text-tertiary)]"> · refreshed 12 s ago</span>
        </span>
        <div className="flex items-center gap-1">
          <Button intent="tertiary" size="xs" leadingIcon={<ChevronLeft size={12} />}>Prev</Button>
          <Button intent="tertiary" size="xs" trailingIcon={<ChevronRight size={12} />}>Next</Button>
        </div>
      </div>
    </Card>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={["px-4 py-2 lumen-eyebrow font-semibold", align === "right" ? "text-right" : ""].join(" ")}>
      {children}
    </th>
  );
}

function Td({
  children, align = "left", mono, className = "",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  mono?: boolean;
  className?: string;
}) {
  return (
    <td
      className={[
        "px-4 py-3",
        align === "right" ? "text-right" : "",
        mono ? "lumen-mono lumen-tnum" : "",
        className,
      ].join(" ")}
    >
      {children}
    </td>
  );
}

/* ──────────────────  SIDE PANEL  ────────────────── */

function SidePanel() {
  return (
    <aside className="flex flex-col gap-4">
      <Card>
        <CardHeader
          title="Activity"
          description="Last 24 h"
          action={<Badge status="accent" size="sm" leadingDot>Live</Badge>}
        />
        <ul className="lumen-row-divider -mx-4">
          {[
            { who: "Sterling LTL", what: "picked up at LAX",      when: "12 min ago", icon: <Truck size={12} /> },
            { who: "Estes",        what: "tendered ORD → ATL",     when: "27 min ago", icon: <Box size={12} /> },
            { who: "ODFL",         what: "scanned at SLC hub",     when: "48 min ago", icon: <MapPin size={12} /> },
            { who: "Quote engine", what: "reduced 16 lanes by 4.2%", when: "2 h ago",  icon: <Code size={12} /> },
          ].map((a, i) => (
            <li key={i} className="flex items-start gap-3 px-4 py-2">
              <span className="mt-1 h-6 w-6 grid place-items-center rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] text-[color:var(--text-tertiary)] shrink-0">
                {a.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-body-xs text-[color:var(--text-primary)]">
                  <span className="font-medium">{a.who}</span>{" "}
                  <span className="text-[color:var(--text-secondary)]">{a.what}</span>
                </div>
                <div className="lumen-mono text-micro text-[color:var(--text-tertiary)] mt-1">{a.when}</div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Quote a lane" description="One-line quoting" />
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="From" defaultValue="LAX" mono size="sm" />
            <Field label="To"   defaultValue="SFO" mono size="sm" />
          </div>
          <Field label="Weight" defaultValue="520" trailingAddon="lb" size="sm" mono />
          <Button intent="primary" fullWidth trailingIcon={<ArrowRight size={14} />}>
            Get rates
          </Button>
        </div>
      </Card>

      <Card className="lumen-stat-card">
        <CardHeader title="On-time index" description="14-day rolling average" />
        <div className="flex items-center gap-4">
          <ProgressRing value={98} tone="success" size={64} stroke={5} />
          <div className="flex flex-col gap-1">
            <div className="text-micro text-[color:var(--text-tertiary)]">vs last period</div>
            <div className="lumen-mono lumen-tnum text-data-md font-semibold text-[var(--status-success-fg)]">
              ▲ +0.4 pts
            </div>
            <div className="text-micro text-[color:var(--text-tertiary)]">target 97%</div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="No tasks today" />
        <div className="flex flex-col items-start gap-3">
          <p className="text-body-xs text-[color:var(--text-tertiary)] leading-snug">
            When a shipment needs your attention it appears here. Try creating a new quote.
          </p>
          <Button intent="secondary" size="sm" leadingIcon={<Plus size={14} />}>
            New quote
          </Button>
        </div>
      </Card>
    </aside>
  );
}

/* ──────────────────  LANE PERF  ──────────────────
   Below-table footer band that fills the middle column to height-match
   the right SidePanel (4 stacked cards). 4 micro-stats with a sparkline
   each — reads as the "telemetry strip" pattern used across operator
   portals. Same Stat primitive as KpiRow above, dialed down a step.
*/

function LanePerf() {
  /* v0.11.12 — sparkData drives auto-tone + endpoint pulse.
     DFW → PHX is the only lane with negative trend; auto-derived
     danger tone matches the red pill on its own. */
  return (
    <Card padding="lg" className="lumen-stat-card">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <div className="lumen-eyebrow">Lane performance · 7d</div>
          <div className="text-body-xs text-[color:var(--text-tertiary)]">
            Top 4 lanes by volume — quote acceptance vs market floor.
          </div>
        </div>
        {/* v0.11.15 — refresh-indicator pattern. The LiveDot prefix communicates
            that the value auto-updates (per the v0.11.12 live-telemetry signals);
            without it, a static "Refreshed N s ago" text reads as a snapshot
            timestamp rather than a live data feed. The "12" is wrapped in
            lumen-tnum so the column doesn't shift when the freshness counter
            advances 9 s -> 12 s -> 18 s. */}
        <Badge status="neutral" size="sm">
          <LiveDot size={6} hideLabel />
          Refreshed <span className="lumen-tnum">12</span> s ago
        </Badge>
      </div>
      <StatGrid cols={4} divided>
        <Stat label="LAX → SFO" value="98" unit="%" delta="+1.2 pts" trend="up" size="md"
          sparkData={[92,93,94,94,95,96,97,98]} />
        <Stat label="ORD → ATL" value="94" unit="%" delta="+0.4 pts" trend="up" size="md"
          sparkData={[91,91,92,93,93,94,94,94]} />
        <Stat label="DFW → PHX" value="89" unit="%" delta="-0.8 pts" trend="down" size="md"
          sparkData={[91,90,90,89,89,89,89,89]} />
        <Stat label="SEA → DEN" value="96" unit="%" delta="+0.6 pts" trend="up" size="md"
          sparkData={[94,94,95,95,96,96,96,96]} />
      </StatGrid>
    </Card>
  );
}

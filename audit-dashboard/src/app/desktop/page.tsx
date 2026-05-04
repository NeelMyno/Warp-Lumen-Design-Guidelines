import { PageHeader } from "@/components/section";
import { Stat } from "@/components/primitives/stat";
import { Badge } from "@/components/primitives/badge";
import { LiveDot } from "@/components/primitives/live-dot";
import { Button } from "@/components/primitives/button";
import { Avatar } from "@/components/primitives/avatar";
import {
  Home, Box, MapPin, Inbox, Settings, Search, Truck, Plus,
} from "@/components/primitives/icon";

export const metadata = { title: "Native Desktop · Lumen" };

export default function DesktopPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tab 8 of 8 · Native desktop"
        title="Native Desktop"
        description="macOS and Windows frames side-by-side. Same Lumen visual language with platform-native chrome — traffic-light + sidebar with vibrancy on Mac; Mica titlebar + segmented sidebar on Windows."
      />

      <div className="grid gap-10 lg:grid-cols-2 items-start">
        <Frame
          os="macOS · Tahoe"
          notes="Traffic-light + translucent sidebar (vibrancy) · 8pt grid · system-wide accent honored only when user accent is unset."
        >
          <MacFrame />
        </Frame>
        <Frame
          os="Windows · 11"
          notes="Mica titlebar · 4dp grid · WinUI 3 segmented sidebar · ClearType-safe Satoshi at 14px+."
        >
          <WindowsFrame />
        </Frame>
      </div>
    </div>
  );
}

function Frame({
  os, notes, children,
}: {
  os: string; notes: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="lumen-eyebrow mb-2">{os}</div>
        <p className="text-body-xs text-[var(--text-tertiary)] leading-snug max-w-[48ch]">{notes}</p>
      </div>
      {children}
    </div>
  );
}

/* ──────────────────  macOS  ────────────────── */

function MacFrame() {
  return (
    <div className="rounded-[12px] overflow-hidden border border-[var(--border-hairline)] shadow-[var(--shadow-2xl)] bg-[var(--surface-page)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 h-[34px] border-b border-[var(--border-hairline)] bg-[var(--surface-raised)] relative">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57] hover:bg-[#ee5046] transition-colors" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e] hover:bg-[#ed9e25] transition-colors" />
        <span className="h-3 w-3 rounded-full bg-[#28c840] hover:bg-[#20a635] transition-colors" />
        <div className="absolute left-1/2 -translate-x-1/2 text-label-sm text-[var(--text-secondary)]">
          Warp · Operator
        </div>
      </div>

      <div className="grid grid-cols-[210px_1fr]" style={{ minHeight: 480 }}>
        {/* Sidebar — vibrancy feel */}
        <aside
          className="border-r border-[var(--border-hairline)] py-3 px-2 flex flex-col gap-3"
          style={{
            background: "color-mix(in oklab, var(--surface-sunken) 75%, white)",
          }}
        >
          {/* workspace switcher */}
          <button className="mx-2 flex items-center gap-2 px-2 py-1 rounded-[var(--radius-sm)] hover:bg-[var(--surface-raised)] transition-colors">
            <Avatar name="Acme Logistics" size="xs" />
            <span className="text-micro font-semibold flex-1 text-left truncate">Acme</span>
            <span className="text-[var(--text-tertiary)]">⌃</span>
          </button>

          <div>
            <div className="lumen-eyebrow px-2 mb-1">Operate</div>
            {[
              { I: Home,  label: "Today", active: true },
              { I: Truck, label: "Shipments", badge: "12" },
              { I: MapPin,label: "Lanes" },
              { I: Box,   label: "Quotes" },
              { I: Inbox, label: "Tasks", badge: "3" },
            ].map(({ I, label, active, badge }) => (
              <button
                key={label}
                className={[
                  "w-full flex items-center gap-2 px-2 py-1 rounded-[var(--radius-sm)] text-micro",
                  "transition-colors duration-[var(--motion-fast)]",
                  active
                    ? "bg-[var(--surface-tint-accent)] text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]",
                ].join(" ")}
              >
                <I size={14} />
                <span className="flex-1 text-left">{label}</span>
                {badge && (
                  <span className="lumen-mono lumen-tnum text-micro text-[var(--text-tertiary)]">{badge}</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-auto px-2 py-2 rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--surface-raised)]">
            <LiveDot label="API healthy" />
            <div className="lumen-mono lumen-tnum text-micro text-[var(--text-tertiary)] mt-1">
              v2.18.4 · 12 ms
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex flex-col">
          <header className="flex items-center gap-3 border-b border-[var(--border-hairline)] px-4 h-11 bg-[var(--surface-raised)]">
            <h2 className="text-heading-h6 text-[var(--text-primary)]">Today</h2>
            <Badge status="accent" size="sm" leadingDot>Live</Badge>
            <div className="flex-1" />
            <div className="flex items-center gap-[var(--space-1_5)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] rounded-[var(--radius-sm)] px-2 h-6 text-micro text-[var(--text-tertiary)]">
              <Search size={11} />
              Search…
              <kbd className="lumen-kbd ml-1">⌘K</kbd>
            </div>
          </header>
          <main className="p-4 flex flex-col gap-3 flex-1">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Today" value="284" size="sm" />
              <Stat label="On time" value="98.2" unit="%" size="sm" />
              <Stat label="Avg cost" value="$42" size="sm" />
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-3 flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="lumen-eyebrow">Recent</div>
                <Badge status="accent" size="sm" leadingDot>Live</Badge>
              </div>
              <ul className="lumen-row-divider -mx-3">
                {[
                  ["WRP-9824", "LAX → SFO", "Sterling LTL"],
                  ["WRP-9825", "ORD → ATL", "Estes"],
                  ["WRP-9826", "DFW → PHX", "Saia"],
                  ["WRP-9827", "SEA → DEN", "ODFL"],
                ].map(([id, lane, c]) => (
                  <li key={id} className="flex items-center justify-between gap-3 px-3 py-2 text-body-xs">
                    <code className="lumen-mono text-[var(--text-tertiary)]">{id}</code>
                    <span className="font-medium text-[var(--text-primary)]">{lane}</span>
                    <span className="text-[var(--text-secondary)] flex-1 text-right">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────  Windows  ────────────────── */

function WindowsFrame() {
  return (
    <div
      className="rounded-[6px] overflow-hidden border border-[var(--border-hairline)] shadow-[var(--shadow-2xl)]"
      style={{ background: "var(--surface-page)" }}
    >
      {/* Mica titlebar */}
      <div className="flex items-center gap-inline-sm px-2 h-control-cozy border-b border-[var(--border-hairline)] bg-[var(--surface-raised)]">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-[2px] bg-[var(--color-accent)] grid place-items-center text-[var(--text-on-accent)] text-[8px] font-bold">
            W
          </div>
          <span className="text-micro">Warp Operator</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center text-[var(--text-tertiary)]">
          <span className="h-7 w-10 grid place-items-center hover:bg-[var(--surface-sunken)] rounded-[2px] cursor-pointer text-[10px]">_</span>
          <span className="h-7 w-10 grid place-items-center hover:bg-[var(--surface-sunken)] rounded-[2px] cursor-pointer text-[10px]">▢</span>
          <span className="h-7 w-10 grid place-items-center hover:bg-[#c42b1c] hover:text-white rounded-[2px] cursor-pointer text-[12px]">×</span>
        </div>
      </div>

      <div className="grid grid-cols-[56px_210px_1fr]" style={{ minHeight: 480 }}>
        {/* Nav rail */}
        <aside className="bg-[var(--surface-sunken)] flex flex-col gap-1 py-2 items-center border-r border-[var(--border-hairline)]">
          {[
            { Ico: Home,   label: "Home" },
            { Ico: Truck,  label: "Shipments" },
            { Ico: MapPin, label: "Lanes" },
            { Ico: Box,    label: "Quotes" },
            { Ico: Inbox,  label: "Inbox" },
          ].map(({ Ico, label }, i) => (
            <button
              key={label}
              aria-label={label}
              className={[
                "h-control-cozy w-[var(--size-control-cozy)] grid place-items-center rounded-[3px]",
                i === 0
                  ? "bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-hairline)]"
                  : "text-[var(--text-tertiary)] hover:bg-[var(--surface-raised)]",
              ].join(" ")}
            >
              <Ico size={16} />
            </button>
          ))}
          <div className="flex-1" />
          <button aria-label="Settings" className="h-control-cozy w-[var(--size-control-cozy)] grid place-items-center text-[var(--text-tertiary)] hover:bg-[var(--surface-raised)] rounded-[3px]">
            <Settings size={16} />
          </button>
        </aside>

        {/* Secondary nav */}
        <aside className="bg-[var(--surface-raised)] border-r border-[var(--border-hairline)] py-3 px-2 flex flex-col gap-1">
          <div className="lumen-eyebrow px-2 mb-2">Today</div>
          {[
            { name: "Overview", active: true },
            { name: "Active shipments" },
            { name: "Pending pickups" },
            { name: "Exceptions", badge: "3" },
            { name: "Delivered" },
          ].map((item) => (
            <button
              key={item.name}
              className={[
                "flex items-center gap-2 px-3 py-[var(--space-1_5)] rounded-[3px] text-micro",
                item.active
                  ? "bg-[var(--surface-tint-accent)] text-[var(--text-primary)] font-semibold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]",
              ].join(" ")}
            >
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge && (
                <span className="lumen-mono lumen-tnum text-micro text-[var(--text-tertiary)]">{item.badge}</span>
              )}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="p-4 flex flex-col gap-3">
          <header className="flex items-center justify-between gap-3">
            <h2 className="text-heading-h4 text-[var(--text-primary)]">Overview</h2>
            <Button intent="primary" size="sm" leadingIcon={<Plus size={13} />}>
              New shipment
            </Button>
          </header>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Today" value="284" size="sm" />
            <Stat label="On time" value="98.2" unit="%" size="sm" />
            <Stat label="Avg cost" value="$42" size="sm" />
          </div>
          <div className="rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-3 flex-1">
            <div className="lumen-eyebrow mb-2">Live activity</div>
            <ul className="lumen-row-divider -mx-3">
              {[
                { who: "Sterling LTL", what: "picked up at LAX",   when: "12 min ago" },
                { who: "Estes",        what: "tendered ORD → ATL",  when: "27 min ago" },
                { who: "ODFL",         what: "scanned at SLC hub",  when: "48 min ago" },
                { who: "Quote engine", what: "reduced 16 lanes",    when: "2 h ago" },
              ].map((a) => (
                <li key={a.when} className="flex items-baseline gap-2 px-3 py-[var(--space-1_5)] text-body-xs">
                  <span className="font-medium text-[var(--text-primary)]">{a.who}</span>
                  <span className="text-[var(--text-secondary)] flex-1">{a.what}</span>
                  <span className="lumen-mono text-micro text-[var(--text-tertiary)]">{a.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

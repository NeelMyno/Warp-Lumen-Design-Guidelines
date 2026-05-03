import { PageHeader } from "@/components/section";
import { Stat } from "@/components/primitives/stat";
import { Badge } from "@/components/primitives/badge";
import { LiveDot } from "@/components/primitives/live-dot";
import { Button } from "@/components/primitives/button";
import {
  Home,
  Box,
  MapPin,
  Inbox,
  Settings,
  Search,
  Bell,
  Truck,
  Plus,
} from "@/components/primitives/icon";

export const metadata = { title: "Native Desktop · Lumen" };

export default function DesktopPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tab 7 of 7"
        title="Native Desktop"
        description="macOS and Windows frames side-by-side. Same Lumen visual language with platform-native chrome — traffic-light + sidebar + vibrancy on Mac; Mica titlebar + sidebar with squared corners on Windows."
      />

      <div className="grid gap-8 lg:grid-cols-2">
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
  os,
  notes,
  children,
}: {
  os: string;
  notes: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="lumen-eyebrow mb-1">{os}</div>
        <p className="text-[var(--type-13)] text-[var(--text-secondary)]">{notes}</p>
      </div>
      {children}
    </div>
  );
}

function MacFrame() {
  return (
    <div className="rounded-[12px] overflow-hidden border border-[var(--border-subtle)] shadow-[var(--shadow-2xl)] bg-[var(--surface-page)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <div className="flex-1 text-center text-[var(--type-13)] text-[var(--text-secondary)]">
          Warp · Operator
        </div>
      </div>

      <div className="grid grid-cols-[200px_1fr]" style={{ minHeight: 460 }}>
        {/* Sidebar — translucent / vibrancy feel */}
        <aside className="bg-[color-mix(in_oklab,var(--surface-sunken)_85%,white)] border-r border-[var(--border-subtle)] py-3 px-2 flex flex-col gap-3">
          <div className="lumen-eyebrow px-2">Operate</div>
          {[
            { I: Home, label: "Today", active: true },
            { I: Truck, label: "Shipments", badge: "12" },
            { I: MapPin, label: "Lanes" },
            { I: Box, label: "Quotes" },
            { I: Inbox, label: "Tasks", badge: "3" },
          ].map(({ I, label, active, badge }) => (
            <button
              key={label}
              className={[
                "flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-md)] text-[var(--type-14)]",
                active
                  ? "bg-[color-mix(in_oklab,var(--color-accent)_18%,transparent)] text-[var(--text-primary)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]",
              ].join(" ")}
            >
              <I size={16} />
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)]">
                  {badge}
                </span>
              )}
            </button>
          ))}
          <div className="mt-auto px-2 py-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-raised)]">
            <LiveDot label="API healthy" />
            <div className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)] mt-1">
              v2.18.4
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex flex-col">
          <header className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3 bg-[var(--surface-raised)]">
            <h2 className="text-[var(--type-15)] font-semibold tracking-[var(--tracking-tight)]">
              Today
            </h2>
            <div className="flex-1" />
            <div className="flex items-center gap-2 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-2 h-7 text-[var(--type-13)] text-[var(--text-tertiary)]">
              <Search size={12} />
              Search…
              <kbd className="lumen-mono text-[var(--type-12)] border border-[var(--border-subtle)] rounded px-1 ml-1">⌘K</kbd>
            </div>
          </header>
          <main className="p-4 flex flex-col gap-3 flex-1">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Today" value="284" size="sm" />
              <Stat label="On time" value="98.2" unit="%" size="sm" />
              <Stat label="Avg cost" value="$42" size="sm" />
            </div>
            <div className="lumen-card flex-1 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="lumen-eyebrow">Recent</div>
                <Badge status="accent">
                  <LiveDot color="currentColor" /> Live
                </Badge>
              </div>
              <ul className="lumen-row-divider">
                {[
                  ["WRP-9824", "LAX → SFO", "Sterling LTL"],
                  ["WRP-9825", "ORD → ATL", "Estes"],
                  ["WRP-9826", "DFW → PHX", "Saia"],
                ].map(([id, lane, c]) => (
                  <li key={id} className="flex items-center justify-between py-1.5 text-[var(--type-13)]">
                    <span className="lumen-mono text-[var(--text-tertiary)]">{id}</span>
                    <span>{lane}</span>
                    <span className="text-[var(--text-secondary)]">{c}</span>
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

function WindowsFrame() {
  return (
    <div
      className="rounded-[6px] overflow-hidden border border-[var(--border-subtle)] shadow-[var(--shadow-2xl)]"
      style={{ background: "var(--surface-page)" }}
    >
      {/* Mica titlebar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)]"
        style={{
          background:
            "linear-gradient(180deg, var(--surface-raised) 0%, color-mix(in oklab, var(--surface-page) 88%, var(--color-accent)) 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-[3px] bg-[var(--color-accent)] grid place-items-center text-[var(--text-on-accent)] text-[8px] font-bold">
            W
          </div>
          <span className="text-[var(--type-13)] font-medium">Warp Operator</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1 text-[var(--text-tertiary)]">
          <span className="h-7 w-9 grid place-items-center hover:bg-[var(--surface-sunken)] rounded-[2px]">_</span>
          <span className="h-7 w-9 grid place-items-center hover:bg-[var(--surface-sunken)] rounded-[2px]">▢</span>
          <span className="h-7 w-9 grid place-items-center hover:bg-[#c42b1c] hover:text-white rounded-[2px]">×</span>
        </div>
      </div>

      <div className="grid grid-cols-[60px_220px_1fr]" style={{ minHeight: 460 }}>
        {/* Nav rail */}
        <aside className="bg-[var(--surface-sunken)] flex flex-col gap-1 py-2 items-center border-r border-[var(--border-subtle)]">
          {[
            { I: Home, active: true },
            { I: Truck },
            { I: MapPin },
            { I: Box },
            { I: Inbox },
          ].map(({ I, active }, i) => (
            <button
              key={i}
              className={[
                "h-10 w-10 grid place-items-center rounded-[4px]",
                active ? "bg-[var(--surface-raised)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:bg-[var(--surface-raised)]",
              ].join(" ")}
            >
              <I size={18} />
            </button>
          ))}
          <div className="flex-1" />
          <button className="h-10 w-10 grid place-items-center text-[var(--text-tertiary)]">
            <Settings size={18} />
          </button>
        </aside>

        {/* Secondary nav */}
        <aside className="bg-[var(--surface-raised)] border-r border-[var(--border-subtle)] py-3 px-2 flex flex-col gap-1">
          <div className="lumen-eyebrow px-2 mb-1">Today</div>
          {[
            { name: "Overview", active: true },
            { name: "Active shipments" },
            { name: "Pending pickups" },
            { name: "Exceptions" },
          ].map((item) => (
            <button
              key={item.name}
              className={[
                "text-left px-2.5 py-1.5 rounded-[4px] text-[var(--type-13)]",
                item.active ? "bg-[color-mix(in_oklab,var(--color-accent)_18%,transparent)] text-[var(--text-primary)] font-medium" : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]",
              ].join(" ")}
            >
              {item.name}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="p-4 flex flex-col gap-3">
          <header className="flex items-center justify-between gap-3">
            <h2 className="text-[var(--type-18)] font-semibold tracking-[var(--tracking-tight)]">Overview</h2>
            <Button intent="primary" size="sm" leadingIcon={<Plus size={14} />}>
              New shipment
            </Button>
          </header>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Today" value="284" size="sm" />
            <Stat label="On time" value="98.2" unit="%" size="sm" />
            <Stat label="Avg cost" value="$42" size="sm" />
          </div>
          <div className="lumen-card flex-1 p-3">
            <div className="lumen-eyebrow mb-2">Live activity</div>
            <ul className="lumen-row-divider">
              {[
                { who: "Sterling LTL",  what: "picked up at LAX", when: "12 min ago" },
                { who: "Estes",         what: "tendered ORD → ATL", when: "27 min ago" },
                { who: "ODFL",          what: "scanned at SLC hub", when: "48 min ago" },
              ].map((a) => (
                <li key={a.when} className="flex items-baseline gap-3 py-1.5 text-[var(--type-13)]">
                  <span className="font-medium">{a.who}</span>
                  <span className="text-[var(--text-secondary)] flex-1">{a.what}</span>
                  <span className="lumen-mono text-[var(--type-12)] text-[var(--text-tertiary)]">{a.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

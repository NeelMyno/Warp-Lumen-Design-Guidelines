import { PageHeader, Section, SubSection } from "@/components/section";
import { Swatch, SwatchGrid } from "@/components/primitives/swatch";
import { Stat, StatGrid } from "@/components/primitives/stat";
import { LiveDot } from "@/components/primitives/live-dot";
import { RateTicker } from "@/components/primitives/rate-ticker";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Card, CardHeader } from "@/components/primitives/card";
import { MotionDemo } from "@/components/primitives/motion-demo";
import {
  ArrowRight,
  Plus,
  Search,
  Truck,
  Box,
  Bell,
  Home,
  Settings,
  MapPin,
  Inbox,
  Filter,
  Code,
  Cart,
  User,
  Check,
  X,
} from "@/components/primitives/icon";

export const metadata = { title: "Foundations · Lumen" };

export default function FoundationsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tab 1 of 7"
        title="Foundations"
        description="The primitives the rest of the system stands on. Color, typography, spacing, radius, elevation, motion, iconography, and the live-data signatures Warp's brand is built around."
      />

      {/* ---------- Color ---------- */}
      <Section
        id="color"
        title="Color"
        description="Warm-paper canvas, near-black ink, and one disciplined accent — Warp lime green — that plays exactly one role across the entire system: action / live / success."
      >
        <SubSection title="Brand ramp">
          <SwatchGrid>
            <Swatch name="brand/50"  cssVar="--brand-50"  value="#f4f5f7" role="page tints" />
            <Swatch name="brand/100" cssVar="--brand-100" value="#e4e6ea" role="hover surfaces" />
            <Swatch name="brand/200" cssVar="--brand-200" value="#c5c9d1" role="dividers" />
            <Swatch name="brand/300" cssVar="--brand-300" value="#9aa0ab" role="muted ui" />
            <Swatch name="brand/400" cssVar="--brand-400" value="#6b7280" role="captions" />
            <Swatch name="brand/500" cssVar="--brand-500" value="#334155" role="secondary text" />
            <Swatch name="brand/600" cssVar="--brand-600" value="#253040" role="border strong" />
            <Swatch name="brand/700" cssVar="--brand-700" value="#1a2332" role="surface 2 (dark)" />
            <Swatch name="brand/800" cssVar="--brand-800" value="#141c2b" role="surface 1 (dark)" />
            <Swatch name="brand/900" cssVar="--brand-900" value="#131c2a" role="canvas (dark)" />
          </SwatchGrid>
        </SubSection>

        <SubSection title="Accent — Warp lime (the only loud color)">
          <SwatchGrid>
            <Swatch name="accent/50"  cssVar="--accent-50"  value="#f0fdf4" role="bg tints" />
            <Swatch name="accent/100" cssVar="--accent-100" value="#dcfce7" role="bg tints" />
            <Swatch name="accent/200" cssVar="--accent-200" value="#bbf7d0" />
            <Swatch name="accent/300" cssVar="--accent-300" value="#86efac" />
            <Swatch name="accent/500" cssVar="--accent-500" value="#4ade80" role="primary action" />
            <Swatch name="accent/600" cssVar="--accent-600" value="#34c977" role="hover" />
            <Swatch name="accent/700" cssVar="--accent-700" value="#22c55e" role="press / success" />
            <Swatch name="accent/800" cssVar="--accent-800" value="#16a34a" role="text on light" />
            <Swatch name="accent/900" cssVar="--accent-900" value="#14532d" />
            <Swatch name="accent/fg"  cssVar="--accent-fg"  value="#071109" role="text on accent" />
          </SwatchGrid>
        </SubSection>

        <SubSection title="Surfaces, text, borders">
          <SwatchGrid>
            <Swatch name="surface/page"     cssVar="--surface-page"     value="auto" role="canvas" />
            <Swatch name="surface/raised"   cssVar="--surface-raised"   value="auto" role="cards" />
            <Swatch name="surface/sunken"   cssVar="--surface-sunken"   value="auto" role="rows / inputs bg" />
            <Swatch name="surface/inverse"  cssVar="--surface-inverse"  value="auto" role="dark contrast" />
            <Swatch name="text/primary"     cssVar="--text-primary"     value="auto" role="body / titles" />
            <Swatch name="text/secondary"   cssVar="--text-secondary"   value="auto" role="captions" />
            <Swatch name="text/tertiary"    cssVar="--text-tertiary"    value="auto" role="hints" />
            <Swatch name="border/subtle"    cssVar="--border-subtle"    value="auto" role="hairlines" />
            <Swatch name="border/default"   cssVar="--border-default"   value="auto" role="card borders" />
            <Swatch name="border/strong"    cssVar="--border-strong"    value="auto" role="emphasis" />
          </SwatchGrid>
        </SubSection>

        <SubSection title="Status (always paired with a label or shape — never color alone)">
          <SwatchGrid>
            <Swatch name="success/bg" cssVar="--status-success-bg" value="auto" />
            <Swatch name="success/fg" cssVar="--status-success-fg" value="auto" />
            <Swatch name="warning/bg" cssVar="--status-warning-bg" value="auto" />
            <Swatch name="warning/fg" cssVar="--status-warning-fg" value="auto" />
            <Swatch name="danger/bg"  cssVar="--status-danger-bg"  value="auto" />
            <Swatch name="danger/fg"  cssVar="--status-danger-fg"  value="auto" />
            <Swatch name="info/bg"    cssVar="--status-info-bg"    value="auto" />
            <Swatch name="info/fg"    cssVar="--status-info-fg"    value="auto" />
          </SwatchGrid>
        </SubSection>

        <SubSection title="Accent in context — buttons + status">
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <Button intent="primary" trailingIcon={<ArrowRight />}>
                Get a quote
              </Button>
              <Button intent="secondary">View shipments</Button>
              <Button intent="tertiary" leadingIcon={<Plus />}>New lane</Button>
              <Button intent="danger">Cancel order</Button>
              <span className="mx-3 h-6 w-px bg-[var(--border-default)]" />
              <Badge status="success" leadingDot>On time</Badge>
              <Badge status="warning" leadingDot>At risk</Badge>
              <Badge status="danger" leadingDot>Late</Badge>
              <Badge status="info" leadingDot>Picked up</Badge>
              <Badge status="accent">
                <LiveDot color="currentColor" /> Tracking live
              </Badge>
            </div>
          </Card>
        </SubSection>
      </Section>

      {/* ---------- Typography ---------- */}
      <Section
        id="typography"
        title="Typography"
        description="Satoshi for UI and display, JetBrains Mono for numerics, code, and tabular cells. Type scale is 1.25 (Major Third) on a 16px base — clean integer steps, maps cleanly to iOS Dynamic Type and Material 3."
      >
        <Card padding="lg">
          <div className="flex flex-col gap-6">
            <TypeRow role="Display XL" sample="More shipments. Same routes." cls="text-[var(--type-76)] font-bold tracking-[var(--tracking-tightest)] leading-[var(--leading-tight)]" px="76 / 4.75rem" weight="700" />
            <TypeRow role="Display L"  sample="The open source freight network." cls="text-[var(--type-49)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]" px="49 / 3.06rem" weight="700" />
            <TypeRow role="Display M"  sample="Built by people who've lived every layer of freight." cls="text-[var(--type-39)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]" px="39 / 2.44rem" weight="700" />
            <TypeRow role="H1"         sample="Shipments dashboard" cls="text-[var(--type-31)] font-bold tracking-[var(--tracking-tight)] leading-[var(--leading-snug)]" px="31 / 1.94rem" weight="700" />
            <TypeRow role="H2"         sample="Active lanes" cls="text-[var(--type-25)] font-semibold tracking-[var(--tracking-tight)] leading-[var(--leading-snug)]" px="25 / 1.56rem" weight="600" />
            <TypeRow role="H3"         sample="Recent activity" cls="text-[var(--type-20)] font-medium leading-[var(--leading-snug)]" px="20 / 1.25rem" weight="500" />
            <TypeRow role="Body L"     sample="One command quotes. One books. JSON out, pipes in." cls="text-[var(--type-18)] leading-[var(--leading-normal)]" px="18 / 1.13rem" weight="400" />
            <TypeRow role="Body"       sample="Stop logging into 10 carrier portals every morning." cls="text-[var(--type-16)] leading-[var(--leading-normal)]" px="16 / 1.00rem" weight="400" />
            <TypeRow role="Body S"     sample="Auto-save will retry every 12 seconds while offline." cls="text-[var(--type-14)] leading-[var(--leading-normal)]" px="14 / 0.88rem" weight="400" />
            <TypeRow role="Caption"    sample="Updated 4 minutes ago by Sokolovsky" cls="text-[var(--type-13)] text-[var(--text-secondary)]" px="13 / 0.81rem" weight="400" />
            <TypeRow role="Micro"      sample="ETA · BOL · DOT" cls="text-[var(--type-12)] uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]" px="12 / 0.75rem" weight="500" />
          </div>
        </Card>

        <SubSection title="Mono companion — JetBrains Mono">
          <Card padding="lg">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="dash-mono text-[var(--type-31)] font-bold dash-tnum text-[var(--text-primary)]">$1,243.50</div>
              <div className="dash-mono text-[var(--type-16)] dash-tnum text-[var(--text-secondary)]">
                LAX → SFO  ·  $262  ·  ETA 04:18
              </div>
              <div className="dash-mono text-[var(--type-13)] text-[var(--text-secondary)]">
                $ warp quote --from=LAX --to=SFO --weight=520lb
              </div>
              <pre className="dash-mono text-[var(--type-13)] text-[var(--text-secondary)] whitespace-pre">
{`{
  "lane": "LAX-SFO",
  "rate": 262,
  "carrier_count": 14
}`}
              </pre>
            </div>
          </Card>
        </SubSection>

        <SubSection title="Recommended pairing tradeoffs">
          <Card>
            <ul className="dash-row-divider">
              <PairRow primary="Satoshi" secondary="JetBrains Mono" use="Default — UI + numerics + code. The recommended pair." />
              <PairRow primary="Satoshi" secondary="Source Serif 4" use="Editorial — long-form blog, marketing essays, changelog with editorial tone." />
              <PairRow primary="Inter" secondary="JetBrains Mono" use="Plan B — if Satoshi licensing or Windows ClearType rendering ever becomes a blocker." />
            </ul>
          </Card>
        </SubSection>
      </Section>

      {/* ---------- Spacing ---------- */}
      <Section
        id="spacing"
        title="Spacing"
        description="A 4-based scale. 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128. Apple's 8pt grid with 4pt half-steps for dense surfaces."
      >
        <Card padding="lg">
          <div className="flex flex-col gap-3">
            {[4,8,12,16,20,24,32,40,48,64,80,96,128].map((px) => (
              <div key={px} className="flex items-center gap-4">
                <div className="dash-mono text-[var(--type-13)] text-[var(--text-tertiary)] w-16">
                  {px}px
                </div>
                <div
                  className="bg-[var(--accent-500)]"
                  style={{ width: px, height: 12, borderRadius: 2 }}
                />
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* ---------- Radius ---------- */}
      <Section
        id="radius"
        title="Radius"
        description="Soft-but-not-playful. Inputs at 6px, cards at 10–14px, hero surfaces at 20px. Pills only for status badges and counters."
      >
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          {[
            ["xs",  "var(--radius-xs)",  "2px"],
            ["sm",  "var(--radius-sm)",  "4px"],
            ["md",  "var(--radius-md)",  "6px"],
            ["lg",  "var(--radius-lg)",  "10px"],
            ["xl",  "var(--radius-xl)",  "14px"],
            ["2xl", "var(--radius-2xl)", "20px"],
            ["full","var(--radius-full)","9999px"],
          ].map(([name, v, px]) => (
            <Card key={name} className="flex flex-col items-center gap-3">
              <div
                className="h-16 w-16 bg-[var(--accent-500)]"
                style={{ borderRadius: `var(--radius-${name})` as string }}
              />
              <div className="flex flex-col items-center gap-0.5">
                <div className="text-[var(--type-14)] font-medium text-[var(--text-primary)]">
                  {name}
                </div>
                <code className="dash-mono text-[var(--type-12)] text-[var(--text-tertiary)]">{px}</code>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------- Elevation ---------- */}
      <Section
        id="elevation"
        title="Elevation"
        description="Hairlines do most of the separation work. Shadows are present-but-imperceptible, reserved for floating surfaces (popovers, modals, toasts)."
      >
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {["xs","sm","md","lg","xl","2xl"].map((level) => (
            <div
              key={level}
              className="bg-[var(--surface-raised)] rounded-[var(--radius-lg)] p-5 flex flex-col items-center gap-2"
              style={{ boxShadow: `var(--shadow-${level})` }}
            >
              <div className="text-[var(--type-14)] font-medium">{level}</div>
              <code className="dash-mono text-[var(--type-12)] text-[var(--text-tertiary)]">
                shadow-{level}
              </code>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Motion ---------- */}
      <Section
        id="motion"
        title="Motion"
        description="Decelerate, don't bounce. Default is a 180ms standard ease-out for everything; ramp to 260ms for state changes. Always honor prefers-reduced-motion."
      >
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["fast",   "120ms"],
            ["base",   "180ms"],
            ["slow",   "260ms"],
            ["slower", "400ms"],
          ].map(([name, ms]) => (
            <Card key={name}>
              <div className="text-[var(--type-14)] font-medium">{name}</div>
              <div className="dash-mono text-[var(--type-12)] text-[var(--text-tertiary)] mb-3">
                {ms} · easing-standard
              </div>
              <MotionDemo token={name as string} ms={ms as string} />
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------- Iconography ---------- */}
      <Section
        id="iconography"
        title="Iconography"
        description="Single 1.5px stroke, 24px grid, rounded ends, no fills. Custom logistics set sits inside the same drawing language."
      >
        <Card padding="lg">
          <div className="grid gap-4 grid-cols-3 sm:grid-cols-6 md:grid-cols-8">
            {[
              [Home, "home"],
              [Inbox, "inbox"],
              [Box, "box"],
              [Truck, "truck"],
              [MapPin, "map-pin"],
              [Settings, "settings"],
              [Bell, "bell"],
              [Search, "search"],
              [Filter, "filter"],
              [Code, "code"],
              [Cart, "cart"],
              [User, "user"],
              [Plus, "plus"],
              [Check, "check"],
              [X, "x"],
              [ArrowRight, "arrow-right"],
            ].map(([Ico, name]) => {
              const I = Ico as React.ComponentType<{ size?: number }>;
              return (
                <div key={name as string} className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                    <I size={20} />
                  </div>
                  <code className="dash-mono text-[var(--type-12)] text-[var(--text-tertiary)]">
                    {name as string}
                  </code>
                </div>
              );
            })}
          </div>
        </Card>
      </Section>

      {/* ---------- Live data signatures ---------- */}
      <Section
        id="live-data"
        title="Live-data signatures"
        description="Three primitives that carry Warp's instrument-panel mood across every surface in the system: the Stat, the LiveDot, and the RateTicker."
      >
        <SubSection title="Stat — big bold number, mono unit, optional delta">
          <Card padding="lg">
            <StatGrid cols={4}>
              <Stat label="Shipments today"   value="1,284" delta="+12.4% wow" trend="up" />
              <Stat label="On-time %"         value="98.2"   unit="%" delta="+0.4 pts" trend="up" />
              <Stat label="Avg cost / pallet" value="$42.10" delta="-3.6%"   trend="down" />
              <Stat label="Active lanes"      value="1,547" delta="+18"     trend="up" />
            </StatGrid>
          </Card>
        </SubSection>

        <SubSection title="LiveDot — pulsing 8px green dot for live state">
          <Card padding="lg">
            <div className="flex flex-wrap items-center gap-8">
              <LiveDot label="Tracking live" />
              <LiveDot label="API healthy" />
              <LiveDot label="Quote refreshing" />
              <LiveDot color="var(--status-warning-fg)" label="Network slow" />
              <LiveDot color="var(--status-danger-fg)"  label="Carrier offline" />
            </div>
          </Card>
        </SubSection>

        <SubSection title="RateTicker — scrolling lane rates">
          <RateTicker />
        </SubSection>
      </Section>

      {/* ---------- Card surfaces ---------- */}
      <Section
        id="surfaces"
        title="Surfaces"
        description="Cards use 1px hairline borders by default. Elevation is reserved for floating UI. Internal padding is generous; density lives inside, not around."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader title="Quiet card" description="Default surface — hairline only" />
            <p className="text-[var(--type-14)] text-[var(--text-secondary)]">
              Used for content blocks, list rows, and most data surfaces.
            </p>
          </Card>
          <Card className="!shadow-[var(--shadow-md)]">
            <CardHeader title="Lifted card" description="Hover or active state" />
            <p className="text-[var(--type-14)] text-[var(--text-secondary)]">
              Reach for shadow only when the surface needs to feel like it left the plane.
            </p>
          </Card>
          <Card className="!shadow-[var(--shadow-xl)]">
            <CardHeader title="Floating card" description="Popover, menu, toast" />
            <p className="text-[var(--type-14)] text-[var(--text-secondary)]">
              Reserved for interfaces that genuinely overlay other content.
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
}

function TypeRow({
  role,
  sample,
  cls,
  px,
  weight,
}: {
  role: string;
  sample: string;
  cls: string;
  px: string;
  weight: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_120px_60px] items-baseline gap-2 md:gap-6 border-b border-[var(--border-subtle)] pb-4 last:border-b-0 last:pb-0">
      <div className="dash-eyebrow">{role}</div>
      <div className={cls + " text-[var(--text-primary)]"}>{sample}</div>
      <code className="dash-mono text-[var(--type-12)] text-[var(--text-tertiary)]">{px}</code>
      <code className="dash-mono text-[var(--type-12)] text-[var(--text-tertiary)]">w{weight}</code>
    </div>
  );
}

function PairRow({ primary, secondary, use }: { primary: string; secondary: string; use: string }) {
  return (
    <li className="flex items-baseline gap-4 py-3">
      <div className="flex-1">
        <span className="font-semibold text-[var(--text-primary)]">{primary}</span>
        <span className="text-[var(--text-tertiary)] mx-2">+</span>
        <span className="font-semibold text-[var(--text-primary)]">{secondary}</span>
      </div>
      <div className="text-[var(--type-14)] text-[var(--text-secondary)] flex-[2]">{use}</div>
    </li>
  );
}

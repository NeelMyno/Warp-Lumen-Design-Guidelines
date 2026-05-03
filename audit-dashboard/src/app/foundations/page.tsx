import { PageHeader, Section, SubSection } from "@/components/section";
import { Swatch, SwatchGrid, SwatchRamp } from "@/components/primitives/swatch";
import { Stat, StatGrid, Sparkline } from "@/components/primitives/stat";
import { LiveDot } from "@/components/primitives/live-dot";
import { RateTicker } from "@/components/primitives/rate-ticker";
import { Button, IconButton } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Card, CardHeader } from "@/components/primitives/card";
import { MotionDemo } from "@/components/primitives/motion-demo";
import { Avatar, AvatarGroup } from "@/components/primitives/avatar";
import { Skeleton } from "@/components/primitives/skeleton";
import { Spinner } from "@/components/primitives/spinner";
import { Switch } from "@/components/primitives/switch";
import { Slider } from "@/components/primitives/slider";
import { ProgressBar, ProgressRing } from "@/components/primitives/progress";
import { Field } from "@/components/primitives/field";
import { Checkbox } from "@/components/primitives/checkbox";
import { InlineTabs } from "@/components/primitives/tabs-inline";
import { Tooltip } from "@/components/primitives/tooltip";
import { Breadcrumb } from "@/components/primitives/breadcrumb";
import { Divider, VerticalDivider } from "@/components/primitives/divider";
import {
  ArrowRight, Plus, Search, Truck, Box, Bell, Home, Settings,
  MapPin, Inbox, Filter, Code, Cart, User, Check, X, ChevronDown,
} from "@/components/primitives/icon";

export const metadata = { title: "Foundations · Lumen" };

export default function FoundationsPage() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_180px] lg:gap-x-12">
      <article className="min-w-0">
        <PageHeader
          eyebrow="Tab 1 of 7 · System primitives"
          title="Foundations"
          description="Color, typography, spacing, geometry, elevation, motion, iconography, and the components Warp's instrument panel is built from. The whole system on one page — composed in the same restraint it asks of every consumer."
          meta={<Badge status="accent" leadingDot>v0.2.0 · Quiet Industrial</Badge>}
        />

        {/* COLOR */}
        <Section
          id="color"
          eyebrow="01 · Foundations"
          title="Color"
          description="Mantine-shaped 10-shade scales tuned for Warp. Three families do the work: warm gray (light surfaces), navy (Warp's production dark ladder), accent (the lime green that plays exactly one role)."
        >
          <SubSection title="Gray · warm paper neutrals" description="Light-mode scaffolding. Click any swatch to copy its token.">
            <SwatchRamp prefix="gray" family="lumen-gray" />
          </SubSection>

          <SubSection title="Navy · Warp's production dark ladder" description="Verbatim from Warp's compiled CSS. The page-bg through hover-surface progression that defines the dark-mode silhouette.">
            <SwatchRamp prefix="navy" family="lumen-navy" />
          </SubSection>

          <SubSection title="Accent · Warp lime — the only loud color" description="Used for action / live / success. Never decorative. Adding a second loud color is a brand violation.">
            <SwatchRamp prefix="accent" family="lumen-accent" />
          </SubSection>

          <SubSection title="Status palettes" description="Used as bg/fg pairs on badges, banners, toasts. Always paired with a label or shape — never color alone.">
            <div className="grid gap-3 sm:grid-cols-3">
              <StatusRamp family="lumen-red"   />
              <StatusRamp family="lumen-amber" />
              <StatusRamp family="lumen-sky"   />
            </div>
          </SubSection>

          <SubSection title="Surface roles" description="The semantic ladder consumers reach for. Theme-aware (these change between light + dark).">
            <SwatchGrid>
              <Swatch name="surface.page"     cssVar="--surface-page"     role="canvas" />
              <Swatch name="surface.raised"   cssVar="--surface-raised"   role="cards, panels" />
              <Swatch name="surface.sunken"   cssVar="--surface-sunken"   role="inputs, hover" />
              <Swatch name="surface.popover"  cssVar="--surface-popover"  role="menus, popovers" />
              <Swatch name="surface.inverse"  cssVar="--surface-inverse"  role="contrast moments" />
              <Swatch name="surface.tint-accent" cssVar="--surface-tint-accent" role="accent hover bg" />
            </SwatchGrid>
          </SubSection>

          <SubSection title="Text & border roles">
            <SwatchGrid>
              <Swatch name="text.primary"   cssVar="--text-primary"   role="body, titles" />
              <Swatch name="text.secondary" cssVar="--text-secondary" role="captions" />
              <Swatch name="text.tertiary"  cssVar="--text-tertiary"  role="hints (≥18px)" />
              <Swatch name="text.accent"    cssVar="--text-accent"    role="emphasis text" />
              <Swatch name="border.hairline" cssVar="--border-hairline" role="card edges" />
              <Swatch name="border.default" cssVar="--border-default" role="controls" />
              <Swatch name="border.strong"  cssVar="--border-strong"  role="emphasis" />
              <Swatch name="border.focus"   cssVar="--border-focus"   role="focus ring" />
            </SwatchGrid>
          </SubSection>

          <SubSection title="Accent in context" description="The green appears precisely where action happens — and nowhere else.">
            <Card padding="lg">
              <div className="flex flex-wrap items-center gap-3">
                <Button intent="primary" trailingIcon={<ArrowRight size={14} />}>Get rates</Button>
                <Button intent="secondary">View shipments</Button>
                <Button intent="tertiary" leadingIcon={<Plus size={14} />}>New lane</Button>
                <Button intent="ghost">Filter</Button>
                <Button intent="danger">Cancel order</Button>
                <VerticalDivider height="20px" />
                <Badge status="accent" leadingDot>Live</Badge>
                <Badge status="success" leadingDot>On time</Badge>
                <Badge status="warning" leadingDot>At risk</Badge>
                <Badge status="danger"  leadingDot>Late</Badge>
                <Badge status="info"    leadingDot>Picked up</Badge>
                <Badge status="neutral">Delivered</Badge>
              </div>
            </Card>
          </SubSection>
        </Section>

        {/* TYPOGRAPHY */}
        <Section
          id="typography"
          eyebrow="02 · Foundations"
          title="Typography"
          description="Satoshi for UI and display. JetBrains Mono for any number, ID, money, or code. 1.25 modular scale on a 16 px base — clean integer steps that map cleanly to iOS Dynamic Type and Material 3."
        >
          <Card padding="lg">
            <div className="flex flex-col gap-7 lumen-row-divider">
              <TypeRow role="display.xl" sample="Operations as instruments." cls="text-[var(--type-72)] md:text-[var(--type-76)] font-bold tracking-[var(--tracking-tightest)] leading-[var(--leading-flat)]" px="76 / 4.75rem" weight="700" />
              <TypeRow role="display.lg" sample="The freight network for builders." cls="text-[var(--type-49)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]" px="49 / 3.06rem" weight="700" />
              <TypeRow role="display.md" sample="Same routes. Lower cost per pallet." cls="text-[var(--type-39)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]" px="39 / 2.44rem" weight="700" />
              <TypeRow role="heading.h1" sample="Shipments dashboard" cls="text-[var(--type-31)] font-bold tracking-[var(--tracking-tight)] leading-[var(--leading-snug)]" px="31 / 1.94rem" weight="700" />
              <TypeRow role="heading.h2" sample="Active lanes" cls="text-[var(--type-25)] font-semibold tracking-[var(--tracking-tight)] leading-[var(--leading-snug)]" px="25 / 1.56rem" weight="600" />
              <TypeRow role="heading.h3" sample="Recent activity" cls="text-[var(--type-20)] font-medium leading-[var(--leading-snug)]" px="20 / 1.25rem" weight="500" />
              <TypeRow role="body.lg"    sample="One command quotes. One books. JSON out, pipes in." cls="text-[var(--type-18)] leading-[var(--leading-normal)]" px="18 / 1.13rem" weight="400" />
              <TypeRow role="body.md"    sample="Stop logging into 10 carrier portals every morning." cls="text-[var(--type-16)] leading-[var(--leading-normal)]" px="16 / 1.00rem" weight="400" />
              <TypeRow role="body.sm"    sample="Auto-save will retry every 12 seconds while offline." cls="text-[var(--type-14)] leading-[var(--leading-normal)]" px="14 / 0.88rem" weight="400" />
              <TypeRow role="caption"    sample="Updated 4 minutes ago by Sokolovsky" cls="text-[var(--type-13)] text-[var(--text-secondary)]" px="13 / 0.81rem" weight="400" />
              <TypeRow role="micro"      sample="ETA · BOL · DOT" cls="text-[var(--type-12)] uppercase tracking-[var(--tracking-widest)] text-[var(--text-tertiary)]" px="12 / 0.75rem" weight="500" />
            </div>
          </Card>

          <SubSection title="Numerics — JetBrains Mono with tabular-nums + slashed-zero">
            <Card padding="lg">
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <div className="lumen-eyebrow mb-1.5">money</div>
                  <div className="lumen-mono lumen-tnum text-[var(--type-31)] font-bold text-[var(--text-primary)]">$1,243.50</div>
                </div>
                <div>
                  <div className="lumen-eyebrow mb-1.5">lane code</div>
                  <div className="lumen-mono text-[var(--type-31)] font-bold text-[var(--text-primary)]">LAX→SFO</div>
                </div>
                <div>
                  <div className="lumen-eyebrow mb-1.5">eta</div>
                  <div className="lumen-mono lumen-tnum text-[var(--type-31)] font-bold text-[var(--text-primary)]">04:18</div>
                </div>
                <div>
                  <div className="lumen-eyebrow mb-1.5">command</div>
                  <pre className="lumen-mono text-[var(--type-13)] text-[var(--text-secondary)] whitespace-pre">{`$ warp quote --from=LAX \\
       --to=SFO --weight=520lb`}</pre>
                </div>
                <div className="md:col-span-2">
                  <div className="lumen-eyebrow mb-1.5">payload</div>
                  <pre className="lumen-mono text-[var(--type-13)] text-[var(--text-secondary)] whitespace-pre">{`{ "lane": "LAX-SFO",
  "rate": 262,
  "carrier_count": 14,
  "transit_days": 1 }`}</pre>
                </div>
              </div>
            </Card>
          </SubSection>

          <SubSection title="Pairings" description="Recommended companions to Satoshi.">
            <Card padding="none">
              <ul className="lumen-row-divider">
                <PairRow primary="Satoshi" secondary="JetBrains Mono" use="Default — UI + numerics + code. The recommended pair." note="ITF-FFL + OFL · free for commercial use" />
                <PairRow primary="Satoshi" secondary="Source Serif 4" use="Editorial — long-form blog, marketing essays." note="OFL · variable optical-size axis" />
                <PairRow primary="Inter"   secondary="JetBrains Mono" use="Plan B — if Satoshi licensing or Windows ClearType ever blocks." note="OFL · widest hinting on Windows" />
              </ul>
            </Card>
          </SubSection>
        </Section>

        {/* SPACING */}
        <Section
          id="spacing"
          eyebrow="03 · Foundations"
          title="Spacing"
          description="A 4-based scale with 2-step half-stops where dense surfaces need them. 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 128 — the same intervals Apple's 8pt grid prescribes, with halves for table density."
        >
          <Card padding="lg">
            <div className="flex flex-col gap-2.5">
              {[2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 128].map((px) => (
                <div key={px} className="flex items-center gap-4">
                  <div className="lumen-mono lumen-tnum text-[var(--type-12)] text-[var(--text-tertiary)] w-12 shrink-0">{px}</div>
                  <div
                    className="bg-[var(--color-accent)]"
                    style={{ width: px, height: 8, borderRadius: 2 }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* RADIUS */}
        <Section
          id="radius"
          eyebrow="04 · Foundations"
          title="Radius"
          description="Soft but disciplined. Inputs at 7 px, cards at 10–14, hero surfaces at 18–24. Pills only for status badges and counters."
        >
          <div className="grid gap-3 grid-cols-3 sm:grid-cols-5 lg:grid-cols-9">
            {[
              ["xs",  "3px"], ["sm",  "5px"], ["md",  "7px"],
              ["lg",  "10px"], ["xl",  "14px"], ["2xl", "18px"],
              ["3xl", "24px"], ["4xl", "32px"], ["full","∞"],
            ].map(([name, px]) => (
              <Card key={name} className="flex flex-col items-center gap-3" padding="md">
                <div
                  className="h-14 w-14 bg-[var(--color-accent)]"
                  style={{ borderRadius: `var(--radius-${name})` }}
                />
                <div className="flex flex-col items-center gap-0.5">
                  <div className="text-[var(--type-13)] font-medium text-[var(--text-primary)]">{name}</div>
                  <code className="lumen-mono lumen-tnum text-[var(--type-11)] text-[var(--text-tertiary)]">{px}</code>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* ELEVATION */}
        <Section
          id="elevation"
          eyebrow="05 · Foundations"
          title="Elevation"
          description="Hairline borders do most of the surface separation work in Lumen. Shadows are multi-layer, reserved for genuine lift — popovers, drawers, modals, toasts."
        >
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((level) => (
              <div
                key={level}
                className="bg-[var(--surface-raised)] rounded-[var(--radius-lg)] border border-[var(--border-hairline)] p-5 flex flex-col items-center gap-2"
                style={{ boxShadow: `var(--shadow-${level})` }}
              >
                <div className="text-[var(--type-13)] font-medium text-[var(--text-primary)]">{level}</div>
                <code className="lumen-mono text-[var(--type-11)] text-[var(--text-tertiary)]">
                  shadow.{level}
                </code>
              </div>
            ))}
          </div>
        </Section>

        {/* MOTION */}
        <Section
          id="motion"
          eyebrow="06 · Foundations"
          title="Motion"
          description="Decelerate, don't bounce. Hover the play button to fire each duration; click to replay. The standard easing carries 95% of UI motion. The pulse on LiveDot and the marquee on RateTicker are the only signature loops."
        >
          <Card padding="lg">
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              <MotionDemo token="micro" ms="80ms" />
              <MotionDemo token="fast" ms="140ms" />
              <MotionDemo token="base" ms="180ms" />
              <MotionDemo token="slow" ms="280ms" />
              <MotionDemo token="slower" ms="420ms" />
            </div>
          </Card>
        </Section>

        {/* ICONOGRAPHY */}
        <Section
          id="iconography"
          eyebrow="07 · Foundations"
          title="Iconography"
          description="Single 1.5 px stroke, 24 px grid, rounded ends, no fills. Custom logistics set sits inside the same drawing language."
        >
          <Card padding="lg">
            <div className="grid gap-3 grid-cols-4 sm:grid-cols-8 md:grid-cols-12">
              {[
                [Home, "home"], [Inbox, "inbox"], [Box, "box"], [Truck, "truck"],
                [MapPin, "map-pin"], [Settings, "settings"], [Bell, "bell"], [Search, "search"],
                [Filter, "filter"], [Code, "code"], [Cart, "cart"], [User, "user"],
                [Plus, "plus"], [Check, "check"], [X, "x"], [ArrowRight, "arrow-right"],
                [ChevronDown, "chevron-down"],
              ].map(([Ico, name]) => {
                const I = Ico as React.ComponentType<{ size?: number }>;
                return (
                  <Tooltip key={name as string} content={`icon.${name as string}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] transition-colors">
                      <I size={18} />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </Card>
        </Section>

        {/* CONTROLS */}
        <Section
          id="controls"
          eyebrow="08 · Components"
          title="Controls"
          description="Inputs, switches, sliders, and the form scaffolding around them. Every control honours focus visibility and screen-reader semantics."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card padding="lg">
              <CardHeader title="Buttons" description="Five intents · four sizes · loading + disabled states" />
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button intent="primary"   leadingIcon={<Plus size={14} />}>Primary</Button>
                  <Button intent="secondary">Secondary</Button>
                  <Button intent="tertiary">Tertiary</Button>
                  <Button intent="ghost">Ghost</Button>
                  <Button intent="danger">Danger</Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button intent="primary" size="xs">xs</Button>
                  <Button intent="primary" size="sm">sm</Button>
                  <Button intent="primary" size="md">md</Button>
                  <Button intent="primary" size="lg">lg</Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button intent="primary" loading>Submitting</Button>
                  <Button intent="secondary" disabled>Disabled</Button>
                  <IconButton aria-label="Notifications"><Bell size={15} /></IconButton>
                  <IconButton aria-label="Settings" intent="secondary"><Settings size={15} /></IconButton>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Form fields" description="Field bundles label, hint, error, leading/trailing slots" />
              <div className="flex flex-col gap-4">
                <Field label="Pickup ZIP" placeholder="90045" leadingIcon={<MapPin size={14} />} mono />
                <Field label="Quote name" defaultValue="Standard LTL" trailingAddon="STD" />
                <Field label="Email" placeholder="ops@warp.example" type="email" hint="We'll send the booking confirmation here." />
                <Field label="Weight" defaultValue="abc" trailingAddon="lb" error="Weight must be a positive number." />
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Switches & checkboxes" description="Binary controls for instant-effect settings" />
              <div className="flex flex-col gap-4">
                <Switch label="Auto-save" description="Saves quote drafts every 12 seconds." defaultChecked />
                <Switch label="Live tracking" description="Subscribes to carrier ping stream while quote is open." defaultChecked />
                <Switch label="Email me on exception" description="Carrier missed pickup, ETA slipped > 4 h." />
                <Divider />
                <Checkbox label="Liftgate at pickup" defaultChecked />
                <Checkbox label="Inside delivery" />
                <Checkbox label="Hazardous material" description="Adds compliance flow and DOT routing surcharge." />
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Sliders & progress" description="Ranges, ratios, completion" />
              <div className="flex flex-col gap-6">
                <Slider label="Rate ceiling" defaultValue={260} min={50} max={1000} step={10} unit="/lane" />
                <Slider label="Pickup window" defaultValue={4} min={1} max={12} unit="h" />
                <ProgressBar label="Carrier coverage" value={84} showValue />
                <ProgressBar label="Quote freshness" value={42} tone="warning" showValue />
                <div className="flex items-center gap-6 pt-2">
                  <ProgressRing value={92} tone="success" />
                  <ProgressRing value={64} tone="accent" />
                  <ProgressRing value={28} tone="danger" />
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* DISPLAY */}
        <Section
          id="display"
          eyebrow="09 · Components"
          title="Display"
          description="Identity, presence, status, and the placeholders that stand in while data loads."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <Card padding="lg">
              <CardHeader title="Avatars" description="Initials by default, deterministic palette per name" />
              <div className="flex items-center gap-3 mb-4">
                <Avatar name="D Sokolovsky" size="xl" />
                <Avatar name="J Park"        size="lg" />
                <Avatar name="A Reyes"       size="md" />
                <Avatar name="K Chen"        size="sm" />
                <Avatar name="M B"           size="xs" />
              </div>
              <div className="flex items-center gap-3">
                <AvatarGroup names={["D Sokolovsky", "J Park", "A Reyes", "K Chen", "M B", "T Q", "R Hu"]} max={4} />
                <span className="text-[var(--type-13)] text-[var(--text-tertiary)]">+3 collaborators</span>
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Skeletons" description="Shimmer placeholders while content loads" />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton width={36} height={36} rounded="9999px" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton width={140} />
                    <Skeleton width={88} height={11} />
                  </div>
                </div>
                <Skeleton />
                <Skeleton width="86%" />
                <Skeleton width="72%" />
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Spinners & tooltips" description="Loading state + on-hover hints" />
              <div className="flex items-center gap-6 mb-4">
                <Spinner size={14} />
                <Spinner size={18} />
                <Spinner size={28} />
              </div>
              <div className="flex flex-wrap gap-3">
                <Tooltip content="Hold ⌘ to multi-select"><Button intent="secondary" size="sm">Hover me</Button></Tooltip>
                <Tooltip content="Filter by status, lane, carrier" side="bottom"><IconButton aria-label="Filter"><Filter size={14} /></IconButton></Tooltip>
              </div>
            </Card>
          </div>
        </Section>

        {/* NAVIGATION */}
        <Section
          id="navigation"
          eyebrow="10 · Components"
          title="Navigation"
          description="Inline tabs, breadcrumbs, and the patterns that orient users without taking the page over."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card padding="lg">
              <CardHeader title="Inline tabs · underline" />
              <InlineTabs
                items={[
                  { id: "all",    label: "All shipments", badge: 1284 },
                  { id: "active", label: "Active",        badge: 187 },
                  { id: "delivered", label: "Delivered" },
                  { id: "exceptions", label: "Exceptions", badge: 3 },
                ]}
              />
            </Card>
            <Card padding="lg">
              <CardHeader title="Inline tabs · pill" />
              <InlineTabs
                variant="pill"
                items={[
                  { id: "day",   label: "Day"   },
                  { id: "week",  label: "Week"  },
                  { id: "month", label: "Month" },
                  { id: "year",  label: "Year"  },
                ]}
              />
            </Card>
            <Card padding="lg" className="md:col-span-2">
              <CardHeader title="Breadcrumb" />
              <Breadcrumb items={[
                { href: "#", label: "Operate" },
                { href: "#", label: "Shipments" },
                { href: "#", label: "WRP-9824" },
                { label: "Edit" },
              ]} />
            </Card>
          </div>
        </Section>

        {/* LIVE DATA */}
        <Section
          id="live-data"
          eyebrow="11 · Warp signatures"
          title="Live-data signatures"
          description="The three primitives that carry Warp's instrument-panel mood across every surface — Stat, LiveDot, RateTicker. Without them, Lumen would be just another competent SaaS system."
        >
          <SubSection title="Stat — big bold number, mono unit, optional delta + sparkline">
            <Card padding="lg">
              <StatGrid cols={4} divided>
                <Stat label="Shipments today"   value="1,284"  delta="+12.4% wow" trend="up"
                  spark={<Sparkline data={[3,4,3,5,6,5,7,8,7,9,10,12]} />} />
                <Stat label="On-time %"         value="98.2"   unit="%" delta="+0.4 pts"  trend="up"
                  spark={<Sparkline data={[95,96,96,97,97,98,98,98,98,98,98,98]} />} />
                <Stat label="Avg cost / pallet" value="$42.10" delta="-3.6%"      trend="down"
                  spark={<Sparkline data={[48,47,46,45,46,44,43,43,42,42,42,42]} tone="success" />} />
                <Stat label="Active lanes"      value="1,547"  delta="+18 wk"     trend="up"
                  spark={<Sparkline data={[1480,1490,1495,1500,1510,1520,1525,1530,1535,1540,1545,1547]} />} />
              </StatGrid>
            </Card>

            <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card padding="lg"><Stat label="Routed in 2025" value="655K+" size="hero" /></Card>
              <Card padding="lg"><Stat label="Lanes" value="1,547" size="xl" /></Card>
              <Card padding="lg"><Stat label="Cost down" value="27" unit="%" size="lg" /></Card>
              <Card padding="lg"><Stat label="Carriers" value="42" size="md" /></Card>
            </div>
          </SubSection>

          <SubSection title="LiveDot — 3s pulse · the system's signature loop">
            <Card padding="lg">
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <LiveDot label="Tracking live" />
                <LiveDot label="API healthy" />
                <LiveDot label="Quote refreshing" />
                <LiveDot color="var(--lumen-amber-5)" label="Network slow" />
                <LiveDot color="var(--lumen-red-5)"   label="Carrier offline" />
                <LiveDot color="var(--lumen-sky-5)"   label="Beta channel" />
              </div>
            </Card>
          </SubSection>

          <SubSection title="RateTicker — windowed view onto a stream">
            <RateTicker />
          </SubSection>
        </Section>

        {/* SURFACES */}
        <Section
          id="surfaces"
          eyebrow="12 · Components"
          title="Surfaces"
          description="The card system. Hairline border by default; reach for shadow only when the surface is genuinely lifting."
        >
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card padding="lg" elevation="flat">
              <CardHeader title="Flat" description="Border only — content blocks" />
              <p className="text-[var(--type-13)] text-[var(--text-secondary)]">
                Used for content that sits IN the page, not on top of it.
              </p>
            </Card>
            <Card padding="lg" elevation="card">
              <CardHeader title="Card" description="Default · hairline + shadow.sm" />
              <p className="text-[var(--type-13)] text-[var(--text-secondary)]">
                Workhorse surface. KPI tiles, list rows, panels.
              </p>
            </Card>
            <Card padding="lg" elevation="lifted">
              <CardHeader title="Lifted" description="Hover state on interactive cards" />
              <p className="text-[var(--type-13)] text-[var(--text-secondary)]">
                Reach when the card needs to feel like it left the plane.
              </p>
            </Card>
            <Card padding="lg" elevation="popover">
              <CardHeader title="Popover" description="Floating menus, dropdowns, tooltips" />
              <p className="text-[var(--type-13)] text-[var(--text-secondary)]">
                Multi-layer shadow + border-subtle for off-canvas surfaces.
              </p>
            </Card>
          </div>
        </Section>
      </article>

      {/* ON-PAGE NAV */}
      <aside className="hidden lg:block">
        <nav className="sticky top-32 flex flex-col gap-1.5 text-[var(--type-12)]">
          <div className="lumen-eyebrow mb-2">On this page</div>
          {[
            ["color", "Color"],
            ["typography", "Typography"],
            ["spacing", "Spacing"],
            ["radius", "Radius"],
            ["elevation", "Elevation"],
            ["motion", "Motion"],
            ["iconography", "Iconography"],
            ["controls", "Controls"],
            ["display", "Display"],
            ["navigation", "Navigation"],
            ["live-data", "Live data"],
            ["surfaces", "Surfaces"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors py-1 border-l border-transparent hover:border-[var(--border-strong)] pl-3 -ml-3"
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}

/* helpers */

function TypeRow({
  role, sample, cls, px, weight,
}: { role: string; sample: string; cls: string; px: string; weight: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_120px_56px] items-baseline gap-2 md:gap-6">
      <code className="lumen-mono text-[var(--type-11)] text-[var(--text-tertiary)] uppercase tracking-[var(--tracking-widest)] font-semibold">{role}</code>
      <div className={`${cls} text-[var(--text-primary)]`}>{sample}</div>
      <code className="lumen-mono lumen-tnum text-[var(--type-11)] text-[var(--text-tertiary)]">{px}</code>
      <code className="lumen-mono lumen-tnum text-[var(--type-11)] text-[var(--text-tertiary)]">w{weight}</code>
    </div>
  );
}

function PairRow({
  primary, secondary, use, note,
}: { primary: string; secondary: string; use: string; note?: string }) {
  return (
    <li className="flex items-baseline gap-4 py-3 px-4 first:pt-4 last:pb-4">
      <div className="flex items-baseline gap-2 w-[200px] shrink-0">
        <span className="font-semibold text-[var(--text-primary)] text-[var(--type-15)]">{primary}</span>
        <span className="text-[var(--text-tertiary)]">+</span>
        <span className="font-semibold text-[var(--text-primary)] text-[var(--type-15)]">{secondary}</span>
      </div>
      <div className="flex-1 text-[var(--type-13)] text-[var(--text-secondary)] leading-snug">{use}</div>
      {note && (
        <div className="hidden md:block text-[var(--type-12)] text-[var(--text-tertiary)] lumen-mono shrink-0">
          {note}
        </div>
      )}
    </li>
  );
}

function StatusRamp({ family }: { family: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <code className="lumen-mono text-[var(--type-11)] text-[var(--text-tertiary)]">{family}</code>
        <span className="text-[var(--type-11)] text-[var(--text-tertiary)]">10 stops</span>
      </div>
      <div className="grid grid-cols-10 gap-0 rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-hairline)]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-9" style={{ background: `var(--${family}-${i})` }} title={`var(--${family}-${i})`} />
        ))}
      </div>
    </div>
  );
}

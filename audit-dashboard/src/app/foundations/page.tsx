import { Section, SubSection } from "@/components/section";
import { Swatch, SwatchGrid, SwatchRamp } from "@/components/primitives/swatch";
import { Stat, StatGrid } from "@/components/primitives/stat";
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
import { Divider } from "@/components/primitives/divider";
import {
  ArrowRight, Plus, Search, Truck, Box, Bell, Home, Settings,
  MapPin, Inbox, Filter, Code, Cart, User, Check, X, ChevronDown,
} from "@/components/primitives/icon";

export const metadata = { title: "Foundations · Lumen" };

export default function FoundationsPage() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_200px] lg:gap-x-12">
      <article className="min-w-0">
        {/* HERO — brutalist hairline frame; v0.11.5 fills the frame with a
            system-at-a-glance row so the most expensive real estate proves the
            system instead of just labelling itself. Premium Psychology
            principle 1 (50ms halo) lands on color + motion + type primitives,
            not on an empty card. */}
        <header>
          <div className="flex items-center gap-3 mb-6 lumen-mono-cap text-[color:var(--text-tertiary)]">
            <span>System primitives</span>
            <span aria-hidden>·</span>
            <span className="text-[color:var(--text-accent)]">obsidian</span>
          </div>
          <div className="lumen-frame-brutalist">
            <h1 className="text-display-lg sm:text-display-2xl lg:text-display-2xl text-[color:var(--text-primary)]">
              Foundations.{" "}
              {/* lumen-lint-allow: typography — italic accent override on display heading; brand-specific tracking override */}
              <em className="not-italic font-bold tracking-[var(--tracking-tightest)] text-[color:var(--text-accent)]">
                Tuned.
              </em>
            </h1>
            {/* v0.11.6 — system-at-a-glance row inside the brutalist frame.
                Color stops + motion (live dot) + type specimen, separated by
                hairline rule-offs. v0.11.8 — tightened headline→divider→row
                rhythm from mt-10/pt-8 (72px) to mt-8/pt-6 (56px); the
                brutalist-frame outer padding (up to 80px) made the original
                gap read as oversized empty space. */}
            <div className="mt-8 pt-6 border-t border-dashed border-[var(--border-hairline)] flex flex-wrap items-center gap-x-8 gap-y-5">
              {/* Brand color stops — v0.11.10: equal-weight specimens for the
                  50ms halo. All five tiles get a consistent border-default so
                  the canvas+raised pair is recognisable as a specimen (not a
                  ghost outline) and the row reads as five equal anchors of
                  the system rather than three saturated colours plus two
                  faint outlines. */}
              <div className="flex items-center gap-2" aria-label="Color anchors">
                <span className="h-7 w-7 rounded-[var(--radius-sm)] border border-[var(--border-default)]" style={{ background: "var(--surface-canvas)" }} title="surface.canvas" />
                <span className="h-7 w-7 rounded-[var(--radius-sm)] border border-[var(--border-default)]" style={{ background: "var(--surface-raised)" }} title="surface.raised" />
                <span className="h-7 w-7 rounded-[var(--radius-sm)] border border-[var(--border-default)]" style={{ background: "var(--lumen-accent-4)" }} title="accent.500 · #00FA8A" />
                <span className="h-7 w-7 rounded-[var(--radius-sm)] border border-[var(--border-default)]" style={{ background: "var(--lumen-amber-5)" }} title="status.warning" />
                <span className="h-7 w-7 rounded-[var(--radius-sm)] border border-[var(--border-default)]" style={{ background: "var(--lumen-red-5)" }} title="status.danger" />
              </div>
              <span aria-hidden className="hidden sm:inline-block h-8 w-px bg-[var(--border-hairline)]" />
              {/* Live indicator */}
              <div className="flex items-center gap-2 lumen-mono-cap text-[color:var(--text-tertiary)]">
                <span className="lumen-dot-pulse" aria-hidden />
                <span className="text-[color:var(--text-accent)]">Live</span>
              </div>
              <span aria-hidden className="hidden sm:inline-block h-8 w-px bg-[var(--border-hairline)]" />
              {/* Satoshi specimen */}
              <div className="flex items-baseline gap-3">
                <span className="text-display-md font-bold text-[color:var(--text-primary)] leading-none">Aa</span>
                <span className="lumen-mono text-body-xs text-[color:var(--text-tertiary)]">Satoshi · 300–900 · OpenType</span>
              </div>
            </div>
          </div>
          {/* lumen-lint-allow: typography — type-17 mobile lead; intermediate body density between body-md (16) and body-lg (18) */}
          <p className="mt-8 max-w-[58ch] text-[length:var(--type-17)] md:text-body-lg text-[color:var(--text-secondary)] leading-[var(--leading-snug)]">
            One mood. One mark. Seven principles. Color, typography, spacing, motion — assembled from the same restraint Lumen asks of every consumer.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* v0.11.13 — hero CTA promoted to lg + glow per first-impression.md
                §2 Pattern A. The brutalist frame above weights heavily; the
                standard md primary glow ladder lost the halo war. lg + glow
                lays the lime halo cleanly across the page-axis. */}
            <Button intent="primary" size="lg" pill glow trailingIcon={<ArrowRight size={14} />}>
              Browse foundations
            </Button>
            <Badge status="neutral" leadingDot>v0.12.0 · Obsidian</Badge>
            <Badge status="neutral">8-point soft grid</Badge>
            <Badge status="neutral">WCAG 2.2 AA</Badge>
          </div>
        </header>

        {/* COLOR */}
        <Section
          id="color"
          eyebrow="01 · Foundations"
          title="Color"
          description="Three families do the work — obsidian (canvas, neutral near-black at #0D0D0D), neutral (paper + cool grays), accent (Spring Green #00FA8A, the only loud color). Status hues stay polite. v0.12 retires the v0.11 mint undertone; the single-accent discipline is unchanged."
        >
          <SubSection title="Obsidian · the canvas ramp" description="11 stops from paper to void. v0.12 — neutral near-black at #0D0D0D, no chromatic tilt at any stop on the dark portion (R = G = B). Replaces the v0.11 obsidian-mint canvas (which had a faint G+2 undertone reported as 'weird green'). The dark-mode silhouette and the deep-ink moments in light mode.">
            <SwatchRamp prefix="obsidian" family="lumen-obsidian" />
          </SubSection>

          <SubSection title="Neutral · paper + cool grays" description="Light-mode canvas and cool-neutral grays on dark. v0.11 retired the warm-cream ramp; the v0.11 alias `--lumen-neutral-N` resolves to the underlying `--lumen-cream-N` ramp until v1.0 retires the legacy name.">
            <SwatchRamp prefix="neutral" family="lumen-neutral" />
          </SubSection>

          <SubSection title="Accent · Spring Green — the only loud color" description="Reads as 'laser' against the neutral obsidian canvas — and even more so in v0.12 with the green undertone retired from the canvas (the accent now has the entire hue stage to itself). Used for action / live / success. Never decorative. Adding a second loud color is a brand violation. v0.11 retuned from Warp lime #4ade80 to Spring Green #00FA8A; the discipline is unchanged.">
            <SwatchRamp prefix="accent" family="lumen-accent" />
          </SubSection>

          <SubSection title="Status palettes" description="Used as bg/fg pairs on badges, banners, toasts. Always paired with a label or shape — never color alone.">
            <div className="grid gap-3 sm:grid-cols-2">
              <StatusRamp family="lumen-red"   />
              <StatusRamp family="lumen-amber" />
            </div>
          </SubSection>

          <SubSection title="Surface roles" description="The semantic ladder consumers reach for. Theme-aware (these change between dark + light).">
            <SwatchGrid>
              <Swatch name="surface.canvas"     cssVar="--surface-canvas"     role="page background" />
              <Swatch name="surface.raised"     cssVar="--surface-raised"     role="cards, panels" />
              <Swatch name="surface.sunken"     cssVar="--surface-sunken"     role="inputs, hover" />
              <Swatch name="surface.popover"    cssVar="--surface-popover"    role="menus, popovers" />
              <Swatch name="surface.glass"      cssVar="--surface-glass"      role="floating shells" />
              <Swatch name="surface.tint-accent" cssVar="--surface-tint-accent" role="accent hover bg" />
              <Swatch name="surface.tint-strong" cssVar="--surface-tint-strong" role="accent emphasis bg" />
              <Swatch name="surface.inverse"    cssVar="--surface-inverse"    role="contrast moments" />
            </SwatchGrid>
          </SubSection>

          <SubSection title="Text & border roles">
            <SwatchGrid>
              <Swatch name="text.primary"     cssVar="--text-primary"   role="body, titles" />
              <Swatch name="text.secondary"   cssVar="--text-secondary" role="captions" />
              <Swatch name="text.tertiary"    cssVar="--text-tertiary"  role="hints (≥18px)" />
              <Swatch name="text.accent"      cssVar="--text-accent"    role="emphasis text" />
              <Swatch name="border.hairline"  cssVar="--border-hairline" role="card edges" />
              <Swatch name="border.default"   cssVar="--border-default" role="controls" />
              <Swatch name="border.strong"    cssVar="--border-strong"  role="emphasis" />
              <Swatch name="border.frame"     cssVar="--border-frame"   role="brutalist frames" />
              <Swatch name="border.accent"    cssVar="--border-accent"  role="lime hairline" />
              <Swatch name="border.focus"     cssVar="--border-focus"   role="focus ring" />
            </SwatchGrid>
          </SubSection>

          <SubSection title="Accent in context" description="The green appears precisely where action happens — and nowhere else.">
            <Card padding="lg">
              {/* v0.11.8 — split into two visual rows: actions, then status. The
                  combined wrapping row left "Delivered" orphaned on a second
                  line at common viewport widths. Splitting matches the
                  hierarchy rule (one focal action group per row) and removes
                  the orphan. */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button intent="primary" trailingIcon={<ArrowRight size={14} />}>Get rates</Button>
                  <Button intent="secondary">View shipments</Button>
                  <Button intent="tertiary" leadingIcon={<Plus size={14} />}>New lane</Button>
                  <Button intent="ghost">Filter</Button>
                  <Button intent="danger">Cancel order</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge status="accent" leadingDot>Live</Badge>
                  <Badge status="success" leadingDot>On time</Badge>
                  <Badge status="warning" leadingDot>At risk</Badge>
                  <Badge status="danger"  leadingDot>Late</Badge>
                  <Badge status="info"    leadingDot>Picked up</Badge>
                  <Badge status="neutral">Delivered</Badge>
                </div>
              </div>
            </Card>
          </SubSection>
        </Section>

        {/* TYPOGRAPHY */}
        <Section
          id="typography"
          eyebrow="02 · Foundations"
          title="Typography"
          description="Satoshi does everything. UI, display, numerics, code, editorial — one typeface, one weight ladder, one set of OpenType features. v0.10 retired JetBrains Mono and Source Serif 4; numeric and code moments now ride Satoshi's tabular-nums + slashed-zero feature set. The display ceiling stays at 128 px so brutalist headlines breathe; italic accents stay reserved for one signature word."
        >
          <Card padding="lg">
            <div className="flex flex-col gap-7 lumen-row-divider">
              {/* lumen-lint-allow-block: typography — TypeRow `cls` strings are intentional documentation
                  showing the raw recipe each semantic preset expands to. They are demoed as sample text
                  inside the TypeRow component, not used as component-author API. Do not refactor. */}
              <TypeRow role="display.xxl" sample="Stop re-designing." cls="text-[length:var(--type-96)] md:text-[length:var(--type-128)] font-bold tracking-[var(--tracking-tightest)] leading-[var(--leading-flat)]" px="128 / 8rem" weight="700" />
              <TypeRow role="display.xl"  sample="Operations as instruments." cls="text-[length:var(--type-72)] md:text-[length:var(--type-84)] font-bold tracking-[var(--tracking-tightest)] leading-[var(--leading-tight)]" px="84 / 5.25rem" weight="700" />
              <TypeRow role="display.lg"  sample={<>The freight network for <em className="not-italic text-[color:var(--text-accent)]">builders</em>.</>} cls="text-[length:var(--type-49)] md:text-[length:var(--type-56)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]" px="56 / 3.5rem" weight="700" />
              <TypeRow role="display.md"  sample="Same routes. Lower cost per pallet." cls="text-[length:var(--type-39)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]" px="39 / 2.44rem" weight="700" />
              <TypeRow role="heading.h1"  sample="Shipments dashboard" cls="text-[length:var(--type-31)] font-bold tracking-[var(--tracking-tight)] leading-[var(--leading-snug)]" px="31 / 1.94rem" weight="700" />
              <TypeRow role="heading.h2"  sample="Active lanes" cls="text-[length:var(--type-25)] font-semibold tracking-[var(--tracking-tight)] leading-[var(--leading-snug)]" px="25 / 1.56rem" weight="600" />
              <TypeRow role="heading.h3"  sample="Recent activity" cls="text-[length:var(--type-20)] font-medium leading-[var(--leading-snug)]" px="20 / 1.25rem" weight="500" />
              <TypeRow role="body.lg"     sample="One command quotes. One books. JSON out, pipes in." cls="text-[length:var(--type-18)] leading-[var(--leading-normal)]" px="18 / 1.13rem" weight="400" />
              <TypeRow role="body.md"     sample="Stop logging into 10 carrier portals every morning." cls="text-[length:var(--type-16)] leading-[var(--leading-normal)]" px="16 / 1.00rem" weight="400" />
              <TypeRow role="body.sm"     sample="Auto-save will retry every 12 seconds while offline." cls="text-[length:var(--type-14)] leading-[var(--leading-normal)]" px="14 / 0.88rem" weight="400" />
              <TypeRow role="caption"     sample="Updated 4 minutes ago by Sokolovsky" cls="text-[length:var(--type-13)] text-[color:var(--text-secondary)]" px="13 / 0.81rem" weight="400" />
              <TypeRow role="mono.cap"    sample="@ DIGITAL HQ · GLOBAL ACCESS · SYSTEM V0.11 LIVE" cls="lumen-mono-cap text-[color:var(--text-accent)]" px="11 · +0.16em" weight="500" />
              {/* lumen-lint-allow-end: typography */}
            </div>
          </Card>

          <SubSection title="Numerics — Satoshi with tabular-nums + slashed-zero">
            <Card padding="lg">
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <div className="lumen-mono-cap mb-2 text-[color:var(--text-tertiary)]">money</div>
                  <div className="text-metric-md text-[color:var(--text-primary)]">$1,243.50</div>
                </div>
                <div>
                  <div className="lumen-mono-cap mb-2 text-[color:var(--text-tertiary)]">lane code</div>
                  <div className="text-metric-md text-[color:var(--text-primary)]">LAX→SFO</div>
                </div>
                <div>
                  <div className="lumen-mono-cap mb-2 text-[color:var(--text-tertiary)]">countdown</div>
                  <div className="text-metric-md text-[color:var(--text-primary)]">12.02.05</div>
                </div>
                <div>
                  <div className="lumen-mono-cap mb-2 text-[color:var(--text-tertiary)]">command</div>
                  <pre className="text-code-block text-[color:var(--text-secondary)] whitespace-pre">{`$ warp quote --from=LAX \\
       --to=SFO --weight=520lb`}</pre>
                </div>
                <div className="md:col-span-2">
                  <div className="lumen-mono-cap mb-2 text-[color:var(--text-tertiary)]">payload</div>
                  <pre className="text-code-block text-[color:var(--text-secondary)] whitespace-pre">{`{ "lane": "LAX-SFO",
  "rate": 262,
  "carrier_count": 14,
  "transit_days": 1 }`}</pre>
                </div>
              </div>
            </Card>
          </SubSection>

          <SubSection title="One typeface, every job" description="v0.10 collapsed Lumen to a single typeface. Satoshi covers UI, display, numerics, code, and editorial — separated by weight, size, and OpenType feature flags rather than by family.">
            <Card padding="none">
              <ul className="lumen-row-divider">
                <PairRow primary="Satoshi" secondary="UI · display" use="Body, headings, marketing display, controls. Weights 300–900 with italic VF. The default everywhere." note="ITF-FFL · free for commercial use · self-hosted" />
                <PairRow primary="Satoshi" secondary="numerics + code" use=".lumen-mono / .text-data-* / .text-code-* — Satoshi with calt off, tabular-nums + slashed-zero on. Reads as instrument-panel data without leaving the family." note="OpenType: tnum · lnum · zero · case · pnum" />
                <PairRow primary="Satoshi" secondary="editorial" use=".prose-lumen / .text-prose-* — Satoshi at editorial scale with ligatures + proportional figures. Italic accents handle one-word display moments." note="OpenType: liga · pnum · ss01–ss04 · italic VF" />
              </ul>
            </Card>
          </SubSection>
        </Section>

        {/* SPACING */}
        <Section
          id="spacing"
          eyebrow="03 · Foundations"
          title="Spacing · 4-point base, 8-point soft"
          description="Lumen runs on a 4-point base, 8-point soft grid. Every structural pixel snaps to 4; most snap to 8. Section gaps, control heights, paddings, and gaps between siblings prefer multiples of 8 (8, 16, 24, 32, 40, 48, 64, 80, 96, 128). The 4-step is the standard fine-tune; 6 (--space-1_5) is the documented sub-grid stop for genuine optical work. Decorative pixels (border radius, focus ring, dot indicators) stay free of the grid."
        >
          <SubSection title="Grid ladder · structural multiples of 8">
            <Card padding="lg">
              <div className="flex flex-col gap-3">
                {[
                  { px: 8,   tier: "1", role: "smallest gap · between icon and label" },
                  { px: 16,  tier: "2", role: "default gap · card padding md" },
                  { px: 24,  tier: "3", role: "card padding lg · sub-section gap" },
                  { px: 32,  tier: "4", role: "section internal · column gap" },
                  { px: 40,  tier: "5", role: "control height md · CTA padding" },
                  { px: 48,  tier: "6", role: "control height lg · card padding xl" },
                  { px: 64,  tier: "8", role: "between sections" },
                  { px: 80,  tier: "10", role: "between major content groups" },
                  { px: 96,  tier: "12", role: "page top · hero internal" },
                  { px: 128, tier: "16", role: "hero margin · marketing breathing room" },
                ].map((s) => (
                  <div key={s.px} className="flex items-center gap-4">
                    {/* lumen-lint-allow: typography — mono tabular at 12 grid metrics; no semantic preset for mono+regular at 12 */}
                    <div className="lumen-mono lumen-tnum text-[length:var(--type-12)] text-[color:var(--text-primary)] w-10 shrink-0 text-right">{s.px}</div>
                    <div className="text-eyebrow-mono text-[color:var(--text-tertiary)] w-10 shrink-0">G{s.tier}</div>
                    <div
                      className="bg-[var(--color-accent)]"
                      style={{ width: s.px, height: 8, borderRadius: 2 }}
                    />
                    {/* lumen-lint-allow: typography — type-12 plain caption; no semantic preset for 12 regular */}
                    <div className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">{s.role}</div>
                  </div>
                ))}
              </div>
            </Card>
          </SubSection>

          <SubSection title="True exceptions · off-grid pixels with a job to do" description="These are the only structural values that intentionally break the 4-point grid. Every one is documented at the token level (--space-1_5, --size-control-cozy, --radius-xs, --size-dot-md, --shadow-focus-ring). Don't add new exceptions without a token.">
            <Card padding="lg">
              <div className="flex flex-col gap-3">
                {[
                  { px: 2,  role: "radius.xs · hairline corner softening (--radius-xs)" },
                  { px: 3,  role: "focus ring outset · WCAG 2.4.7 visible focus (--shadow-focus)" },
                  { px: 6,  role: "sub-grid optical stop (--space-1_5) · used by lumen-kbd, tag-chip insets" },
                  { px: 19, role: "LiveDot pulse glow radius — odd to keep the dot optically centered" },
                  { px: 36, role: "size.control.cozy · settings-panel sweet spot, Switch track height (--size-control-cozy)" },
                ].map((s) => (
                  <div key={s.px} className="flex items-center gap-4">
                    {/* lumen-lint-allow: typography — mono tabular at 12 spacing metric; no preset for mono+regular at 12 */}
                    <div className="lumen-mono lumen-tnum text-[length:var(--type-12)] text-[color:var(--text-tertiary)] w-10 shrink-0 text-right">{s.px}</div>
                    {/* lumen-lint-allow: typography — 10px ornamental marker label with widest tracking; below the semantic scale */}
                    <div className="text-[10px] uppercase tracking-[var(--tracking-widest)] text-[color:var(--text-tertiary)] w-10 shrink-0">soft</div>
                    <div className="bg-[var(--lumen-amber-4)]" style={{ width: s.px, height: 8, borderRadius: 2 }} />
                    {/* lumen-lint-allow: typography — type-12 plain caption; no semantic preset for 12 regular */}
                    <div className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">{s.role}</div>
                  </div>
                ))}
              </div>
            </Card>
          </SubSection>

          <SubSection title="Grid overlay · what 'on grid' looks like" description="An 8 × 8 grid with major lines every 64 px. Use the visual to test whether a layout's spacing rhythm holds.">
            <Card padding="md" className="overflow-hidden">
              <div className="lumen-grid-8-major rounded-[var(--radius-lg)] p-6 bg-[var(--surface-canvas)]">
                <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6 flex items-center justify-between gap-4 shadow-[var(--shadow-sm)]">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-[var(--radius-sm)] bg-[var(--lumen-accent-4)]" />
                    <div className="flex flex-col gap-1">
                      <div className="text-heading-h5">Card on grid</div>
                      {/* lumen-lint-allow: typography — type-12 plain caption; no semantic preset for 12 regular */}
                      <div className="text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">8 / 16 / 24 / 32 / 40 / 48 — every measurement is a multiple of 8</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button intent="secondary" size="sm">Cancel</Button>
                    <Button intent="primary" size="md">Confirm</Button>
                  </div>
                </div>
              </div>
            </Card>
          </SubSection>

          <SubSection title="Control-height ladder · v0.8 expanded" description="Every interactive control snaps to one of six tokenized heights. v0.8 fills out the ladder: sm, cozy, md, touch, lg, xl all carry --size-control-* tokens. cozy (36) is the settings-panel sweet spot; touch (44) is the Apple HIG floor for fingertip targets.">
            <Card padding="lg">
              <div className="flex items-end gap-4 flex-wrap">
                <HeightSpec h={32} label="sm · 32"    sub="--size-control-sm" />
                <HeightSpec h={36} label="cozy · 36"  sub="--size-control-cozy · v0.8" />
                <HeightSpec h={40} label="md · 40"    sub="--size-control-md · default" />
                <HeightSpec h={44} label="touch · 44" sub="--size-control-touch · iOS HIG" tone="soft" />
                <HeightSpec h={48} label="lg · 48"    sub="--size-control-lg" />
                <HeightSpec h={56} label="xl · 56"    sub="--size-control-xl · hero" />
              </div>
            </Card>
          </SubSection>
        </Section>

        {/* RADIUS */}
        <Section
          id="radius"
          eyebrow="04 · Foundations"
          title="Radius"
          description="The radius scale reads as 'modern' against the neutral obsidian canvas. Inputs at 8, cards at 12–16, hero surfaces at 20–28. Pills (radius.full) reserved for nav and primary CTAs. v0.12 keeps the v0.4 ratio intact."
        >
          <div className="grid gap-3 grid-cols-3 sm:grid-cols-5 lg:grid-cols-9">
            {[
              ["xs",  "3px"], ["sm",  "6px"], ["md",  "8px"],
              ["lg",  "12px"], ["xl",  "16px"], ["2xl", "20px"],
              ["3xl", "28px"], ["4xl", "36px"], ["full","∞"],
            ].map(([name, px]) => (
              <Card key={name} className="flex flex-col items-center gap-3" padding="md">
                <div
                  className="h-14 w-14 bg-[var(--color-accent)]"
                  style={{ borderRadius: `var(--radius-${name})` }}
                />
                <div className="flex flex-col items-center gap-1">
                  <div className="text-label-sm text-[color:var(--text-primary)]">{name}</div>
                  {/* lumen-lint-allow: typography — mono tabular at 11 radius value; no semantic preset for 11px tabular */}
                  <code className="lumen-mono lumen-tnum text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">{px}</code>
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
          description="Hairline borders do most of the surface separation work. Shadows are multi-layer, reserved for genuine lift — popovers, drawers, modals, toasts. Glow shadows (lime-tinted) carry hero CTAs and live-status."
        >
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((level) => (
              <div
                key={level}
                className="bg-[var(--surface-raised)] rounded-[var(--radius-xl)] border border-[var(--border-hairline)] p-5 flex flex-col items-center gap-2"
                style={{ boxShadow: `var(--shadow-${level})` }}
              >
                <div className="text-label-sm text-[color:var(--text-primary)]">{level}</div>
                {/* lumen-lint-allow: typography — mono regular at 11 token name; no semantic preset for 11px mono */}
                <code className="lumen-mono text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">
                  shadow.{level}
                </code>
              </div>
            ))}
          </div>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-3 mt-4">
            <div className="lumen-glass rounded-[var(--radius-2xl)] p-6 flex flex-col items-start gap-2">
              <span className="lumen-mono-cap text-[color:var(--text-tertiary)]">shadow.glass</span>
              <span className="text-heading-h5">Floating shell</span>
              <span className="text-body-xs text-[color:var(--text-tertiary)]">backdrop-blur 20 · saturate 140 · hairline</span>
            </div>
            <div
              className="rounded-[var(--radius-2xl)] border border-[var(--border-accent)] p-6 flex flex-col items-start gap-2 bg-[var(--surface-raised)]"
              style={{ boxShadow: "var(--shadow-glow-accent-strong)" }}
            >
              <span className="lumen-mono-cap text-[color:var(--text-accent)]">shadow.glow-accent</span>
              <span className="text-heading-h5">Hero CTA halo</span>
              <span className="text-body-xs text-[color:var(--text-tertiary)]">3-layer lime ambient · primary actions only</span>
            </div>
            <div
              className="rounded-[var(--radius-2xl)] border border-[var(--border-default)] p-6 flex flex-col items-start gap-2 bg-[var(--surface-raised)]"
              style={{ boxShadow: "var(--shadow-focus)" }}
            >
              <span className="lumen-mono-cap text-[color:var(--text-tertiary)]">shadow.focus</span>
              <span className="text-heading-h5">Focus ring</span>
              <span className="text-body-xs text-[color:var(--text-tertiary)]">3.5px lime alpha-40 · WCAG-visible on every surface</span>
            </div>
          </div>
        </Section>

        {/* SURFACES */}
        <Section
          id="surfaces"
          eyebrow="06 · Foundations"
          title="Surfaces"
          description="Canvas, raised, glass, glow. Cards stay flat with a hairline by default; reach for glass when something genuinely floats; reach for glow when something is the brand's voice."
        >
          <SubSection title="Canvas + architectural grid" description="The page background. A whisper-faint 64px lattice gives the obsidian an instrument-panel texture without screaming.">
            <div className="lumen-grid-architectural rounded-[var(--radius-2xl)] border border-[var(--border-hairline)] p-12 bg-[var(--surface-canvas)] flex items-center justify-center">
              <div className="lumen-mono-cap text-[color:var(--text-tertiary)]">canvas · grid 64px hairline</div>
            </div>
          </SubSection>

          <SubSection title="Glass surface — the floating shell" description="backdrop-filter blur 20px + saturate 140% + hairline border. Reserved for nav, popovers, sheets, hero device shells. Never used as a fashion statement.">
            <div className="relative rounded-[var(--radius-2xl)] border border-[var(--border-hairline)] p-12 overflow-hidden lumen-grid-architectural-fine bg-[var(--surface-canvas)]">
              <div className="relative grid gap-4 md:grid-cols-2">
                <div className="lumen-glass rounded-[var(--radius-xl)] p-6 flex flex-col gap-2">
                  <div className="lumen-mono-cap text-[color:var(--text-tertiary)]">surface.glass</div>
                  <div className="text-heading-h3">Floating shell</div>
                  <div className="text-body-xs text-[color:var(--text-tertiary)]">
                    Hairline border. Soft inner highlight. Sits ON canvas.
                  </div>
                </div>
                <div className="lumen-glass-strong rounded-[var(--radius-xl)] p-6 flex flex-col gap-2">
                  <div className="lumen-mono-cap text-[color:var(--text-tertiary)]">surface.glass-strong</div>
                  <div className="text-heading-h3">Modal / sheet</div>
                  <div className="text-body-xs text-[color:var(--text-tertiary)]">
                    blur 28 · saturate 160. For overlays that must read.
                  </div>
                </div>
              </div>
            </div>
          </SubSection>

          <SubSection title="Brand voice on canvas — flat surface" description="The hero panel: flat neutral obsidian, hairline border, hero-scale typography. Lumen prefers calm restraint over decorative gradients on surfaces — per principle 3 (less, but better) and the Premium-Psychology halo contract.">
            <div
              className="relative rounded-[var(--radius-3xl)] border border-[var(--border-hairline)] overflow-hidden bg-[var(--surface-canvas)]"
              style={{ minHeight: "260px" }}
            >
              <div className="relative h-full p-12 flex flex-col items-center justify-center gap-4 text-center">
                <span className="lumen-mono-cap text-[color:var(--text-accent)]">SYSTEM V0.11 · LIVE</span>
                <h3 className="text-display-md md:text-display-lg">
                  Calm and lit from within.
                </h3>
                <p className="max-w-[40ch] text-body-sm text-[color:var(--text-tertiary)]">
                  Surfaces stay flat. Lime carries the energy on its own.
                </p>
              </div>
            </div>
          </SubSection>

          <SubSection title="Card variants" description="Hairline by default. Hover lifts a notch; popover surfaces carry the soft multi-layer shadow.">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Card padding="lg" elevation="flat">
                <CardHeader title="Flat" description="Border only — content blocks" />
                <p className="text-body-xs text-[color:var(--text-secondary)]">
                  Used for content that sits IN the page, not on top of it.
                </p>
              </Card>
              <Card padding="lg" elevation="card">
                <CardHeader title="Card" description="Default · hairline + shadow.sm" />
                <p className="text-body-xs text-[color:var(--text-secondary)]">
                  Workhorse surface. KPI tiles, list rows, panels.
                </p>
              </Card>
              <Card padding="lg" elevation="lifted">
                <CardHeader title="Lifted" description="Hover state on interactive cards" />
                <p className="text-body-xs text-[color:var(--text-secondary)]">
                  Reach when the card needs to feel like it left the plane.
                </p>
              </Card>
              <Card padding="lg" elevation="popover">
                <CardHeader title="Popover" description="Floating menus, dropdowns, tooltips" />
                <p className="text-body-xs text-[color:var(--text-secondary)]">
                  Multi-layer shadow + border-subtle for off-canvas surfaces.
                </p>
              </Card>
            </div>
          </SubSection>
        </Section>

        {/* MOTION */}
        <Section
          id="motion"
          eyebrow="07 · Foundations"
          title="Motion"
          description="Decelerate, don't bounce. Hover the play button to fire each duration; click to replay. Standard easing carries 95% of UI motion. The pulse on LiveDot, the marquee on RateTicker, and the radial aurora fade-in are the only signature loops."
        >
          <Card padding="lg">
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              <MotionDemo token="micro" ms="80ms" />
              <MotionDemo token="fast" ms="140ms" />
              <MotionDemo token="base" ms="200ms" />
              <MotionDemo token="slow" ms="320ms" />
              <MotionDemo token="slower" ms="480ms" />
            </div>
          </Card>
        </Section>

        {/* ICONOGRAPHY */}
        <Section
          id="iconography"
          eyebrow="08 · Foundations"
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] text-[color:var(--text-primary)] hover:bg-[var(--surface-tint-accent)] transition-colors">
                      <I size={18} />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </Card>
        </Section>

        {/* VOICE */}
        <Section
          id="voice"
          eyebrow="09 · Foundations"
          title="Voice"
          description="The system's typographic idiom. Brutalist hairline frames around statement headlines. Mono uppercase tracked-out labels for system metadata. Italic accents reserved for one signature word per hero."
        >
          <SubSection title="Brutalist frame" description="A 1px hairline border at border.frame opacity, generous internal padding, no shadow. Wraps a single statement headline. Reference: 'STOP RE-DESIGNING'.">
            <div className="lumen-frame-brutalist text-center">
              <h3 className="text-display-lg md:text-display-2xl uppercase">
                Stop re-designing.
              </h3>
            </div>
          </SubSection>

          <SubSection title="Mono uppercase tracked labels" description="Every system metadata line uses .lumen-mono-cap — Satoshi at +0.16em tracking, uppercase, calt off, tnum on. Reads as 'instrument-panel signal' without a second typeface.">
            <Card padding="lg">
              <div className="flex flex-col gap-3 lumen-mono-cap text-[color:var(--text-tertiary)]">
                <div>SYSTEM V0.11 · LIVE</div>
                <div className="text-[color:var(--text-accent)]">@ DIGITAL HQ · GLOBAL ACCESS</div>
                <div>HOURS · MINS · SECS</div>
                <div>AI-POWERED INTERFACE GENERATOR</div>
                <div>INVITES IN: 12.02.05</div>
                <div className="text-[color:var(--text-accent)]">01 · OBSIDIAN-LIME · OBSIDIAN-LIME · OBSIDIAN-LIME</div>
              </div>
            </Card>
          </SubSection>

          <SubSection title="Italic accent" description="One word per hero gets the italic treatment, in lime accent. Used to break the otherwise tight, brutalist sans rhythm. Never two words. Never on body copy.">
            <Card padding="lg">
              <div className="text-display-lg md:text-display-2xl">
                Design at the{" "}
                {/* lumen-lint-allow: typography — italic accent override on display heading; brand-specific tracking override */}
                <em className="font-bold tracking-[var(--tracking-tightest)] text-[color:var(--text-accent)]">Speed</em>{" "}
                of Thought.
              </div>
            </Card>
          </SubSection>
        </Section>

        {/* CONTROLS */}
        <Section
          id="controls"
          eyebrow="10 · Components"
          title="Controls"
          description="Inputs, switches, sliders, and the form scaffolding around them. Every control honours focus visibility and screen-reader semantics."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card padding="lg">
              <CardHeader title="Buttons" description="Five intents · five sizes · loading + disabled states" />
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
              <CardHeader title="Form fields" description="v0.6 — single shell, single focus ring, slots bonded" />
              <div className="flex flex-col gap-4">
                <Field label="Pickup ZIP" placeholder="90045" leadingIcon={<MapPin size={14} />} mono />
                <Field label="Quote name" defaultValue="Standard LTL" trailingAddon="STD" />
                <Field label="Email" placeholder="ops@warp.example" type="email" hint="We'll send the booking confirmation here." />
                <Field label="Weight" defaultValue="abc" trailingAddon="lb" error="Weight must be a positive number." />
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Field states" description="Rest, hover, focus, error, success, disabled, read-only" />
              <div className="flex flex-col gap-4">
                <Field label="Rest" placeholder="Type a value" />
                <Field label="Required" placeholder="ops@warp.example" required type="email" />
                <Field label="Optional" placeholder="ops@warp.example" optional type="email" />
                <Field label="With description" description="Describes what the field expects." placeholder="Type a value" />
                <Field label="Read-only" defaultValue="Carrier ID — WRP-9824" readOnly mono />
                <Field label="Disabled" defaultValue="Locked field" disabled />
                <Field label="Mono numeric" defaultValue="$1,243.50" mono trailingAddon="USD" />
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
          eyebrow="11 · Components"
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
                <span className="text-body-xs text-[color:var(--text-tertiary)]">+3 collaborators</span>
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Skeletons" description="Shimmer placeholders while content loads" />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton width={36} height={36} rounded="9999px" />
                  <div className="flex-1 flex flex-col gap-[var(--space-1_5)]">
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
          eyebrow="12 · Components"
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
          eyebrow="13 · Warp signatures"
          title="Live-data signatures"
          description="The three primitives that carry Warp's instrument-panel mood across every surface — Stat, LiveDot, RateTicker. v0.11 keeps these intact; the 8 pt grid + spring-green-glow ambient amplifies them."
        >
          <SubSection title="Stat — big bold number, mono unit, optional delta + sparkline">
            <Card padding="lg" className="lumen-stat-card">
              <StatGrid cols={4} divided>
                <Stat label="Shipments today"   value="1,284"  delta="+12.4% wow" trend="up"
                  sparkData={[3,4,3,5,6,5,7,8,7,9,10,12]} />
                <Stat label="On-time %"         value="98.2"   unit="%" delta="+0.4 pts"  trend="up"
                  sparkData={[95,96,96,97,97,98,98,98,98,98,98,98]} />
                <Stat label="Avg cost / pallet" value="$42.10" delta="-3.6%"      trend="down"
                  polarity="good-down"
                  sparkData={[48,47,46,45,46,44,43,43,42,42,42,42]} />
                <Stat label="Active lanes"      value="1,547"  delta="+18 wk"     trend="up"
                  sparkData={[1480,1490,1495,1500,1510,1520,1525,1530,1535,1540,1545,1547]} />
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
                <LiveDot color="var(--lumen-cream-5)" label="Beta channel" />
              </div>
            </Card>
          </SubSection>

          <SubSection title="RateTicker — windowed view onto a stream">
            <RateTicker />
          </SubSection>
        </Section>
      </article>

      {/* ON-PAGE NAV — v0.11.5 grouped into 4 quiet categories. Aggressive
          hierarchy: a single H4-quiet group label organises 13 jump links so
          the reader scans by category instead of serially. */}
      <aside className="hidden lg:block">
        {/* lumen-lint-allow: typography — type-12 sidebar nav links; no semantic preset for 12 regular */}
        <nav className="sticky top-32 flex flex-col gap-6 text-[length:var(--type-12)]">
          <div className="lumen-mono-cap text-[color:var(--text-tertiary)]">On this page</div>
          {[
            { label: "Visual primitives", items: [
              ["color", "Color"],
              ["typography", "Typography"],
              ["spacing", "Spacing & grid"],
              ["radius", "Radius"],
              ["elevation", "Elevation"],
              ["surfaces", "Surfaces"],
            ] },
            { label: "Visual language", items: [
              ["motion", "Motion"],
              ["iconography", "Iconography"],
              ["voice", "Voice"],
            ] },
            { label: "Component patterns", items: [
              ["controls", "Controls"],
              ["display", "Display"],
              ["navigation", "Navigation"],
            ] },
            { label: "Live signals", items: [
              ["live-data", "Live data"],
            ] },
          ].map((group) => (
            <div key={group.label} className="flex flex-col gap-[var(--space-1_5)]">
              <div className="lumen-mono-cap text-[color:var(--text-tertiary)] opacity-70 mb-1">{group.label}</div>
              {group.items.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors py-1 border-l border-transparent hover:border-[var(--border-accent)] pl-3 -ml-3"
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}

/* helpers */

function TypeRow({
  role, sample, cls, px, weight,
}: { role: string; sample: React.ReactNode; cls: string; px: string; weight: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_120px_56px] items-baseline gap-2 md:gap-6">
      <code className="text-eyebrow-mono text-[color:var(--text-tertiary)] font-semibold">{role}</code>
      <div className={`${cls} text-[color:var(--text-primary)]`}>{sample}</div>
      {/* lumen-lint-allow: typography — mono tabular at 11 px value; no semantic preset for 11px tabular */}
      <code className="lumen-mono lumen-tnum text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">{px}</code>
      {/* lumen-lint-allow: typography — mono tabular at 11 weight value; no semantic preset for 11px tabular */}
      <code className="lumen-mono lumen-tnum text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">w{weight}</code>
    </div>
  );
}

function PairRow({
  primary, secondary, use, note,
}: { primary: string; secondary: string; use: string; note?: string }) {
  return (
    <li className="flex items-baseline gap-4 py-3 px-4 first:pt-4 last:pb-4">
      <div className="flex items-baseline gap-2 w-[200px] shrink-0">
        <span className="text-heading-h5 text-[color:var(--text-primary)]">{primary}</span>
        <span className="text-[color:var(--text-tertiary)]">+</span>
        <span className="text-heading-h5 text-[color:var(--text-primary)]">{secondary}</span>
      </div>
      <div className="flex-1 text-body-xs text-[color:var(--text-secondary)] leading-snug">{use}</div>
      {note && (
        /* lumen-lint-allow: typography — type-12 mono pair note; no semantic preset for mono+regular at 12 */
        <div className="hidden md:block text-[length:var(--type-12)] text-[color:var(--text-tertiary)] lumen-mono shrink-0">
          {note}
        </div>
      )}
    </li>
  );
}

function StatusRamp({ family }: { family: string }) {
  return (
    <div className="flex flex-col gap-[var(--space-1_5)]">
      <div className="flex items-baseline justify-between">
        {/* lumen-lint-allow: typography — mono regular at 11 token name; no semantic preset for 11px mono */}
        <code className="lumen-mono text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">{family}</code>
        {/* lumen-lint-allow: typography — plain regular at 11 caption; no semantic preset for 11px regular */}
        <span className="text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">10 stops</span>
      </div>
      <div className="grid grid-cols-10 gap-0 rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-hairline)]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-control-cozy" style={{ background: `var(--${family}-${i})` }} title={`var(--${family}-${i})`} />
        ))}
      </div>
    </div>
  );
}

function HeightSpec({ h, label, sub, tone = "grid" }: { h: number; label: string; sub: string; tone?: "grid" | "soft" }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={[
          "rounded-[var(--radius-md)] border border-[var(--border-default)] flex items-center justify-center px-4",
          tone === "soft" ? "bg-[var(--lumen-amber-1)] text-[color:var(--lumen-amber-7)]" : "bg-[var(--surface-tint-accent)] text-[color:var(--text-accent)]",
        ].join(" ")}
        style={{ height: h }}
      >
        {/* lumen-lint-allow: typography — mono semibold at 12 control-height numeral; no semantic preset for mono+semibold */}
        <span className="lumen-mono text-[length:var(--type-12)] font-semibold">{h}</span>
      </div>
      <div className="flex flex-col items-center">
        {/* lumen-lint-allow: typography — mono regular at 12 control label; no semantic preset for mono+regular at 12 */}
        <div className="lumen-mono text-[length:var(--type-12)] text-[color:var(--text-primary)]">{label}</div>
        {/* lumen-lint-allow: typography — 10px ornamental sublabel with widest tracking; below the semantic scale */}
        <div className="text-[10px] uppercase tracking-[var(--tracking-widest)] text-[color:var(--text-tertiary)]">{sub}</div>
      </div>
    </div>
  );
}

// PageHeader is intentionally unused on this page — the v0.4 hero is custom (brutalist frame).
// Other pages still import PageHeader directly from "@/components/section".

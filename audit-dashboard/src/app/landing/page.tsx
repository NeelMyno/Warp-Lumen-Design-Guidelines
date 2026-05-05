import { PageHeader } from "@/components/section";
import { Card } from "@/components/primitives/card";
import { Stat, StatGrid } from "@/components/primitives/stat";
import { LiveDot } from "@/components/primitives/live-dot";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { RateTicker } from "@/components/primitives/rate-ticker";
import { Avatar } from "@/components/primitives/avatar";
import { ScrollReveal } from "@/components/primitives/scroll-reveal";
import { Dot } from "lucide-react";
import { ArrowRight, Check, Truck, Box, MapPin, Code } from "@/components/primitives/icon";

export const metadata = { title: "Marketing & Landing · Lumen" };

export default function LandingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Marketing surface"
        title="Marketing & Landing"
        description="Type-led hero, screenshot-as-proof, live rate ticker, customer logos, FAQ. Apple-disciplined chrome on Warp-substantive content."
      />

      <div className="rounded-[var(--radius-xl)] overflow-hidden border border-[var(--border-hairline)] shadow-[var(--shadow-md)] bg-[var(--surface-page)]">
        <BrowserChrome url="warp.example.com" />

        {/* HERO — v0.11 obsidian-mint: architectural grid + brutalist headline (gradients stripped). Per first-impression.md the 50ms halo contract: branded chrome, single focal point, no layout shift.
            v0.11.13 — wrapped focal-point children in ScrollReveal so the eye
            is led into the hero instead of arriving on a fully-painted page.
            Above-the-fold reveals fire on first frame because IntersectionObserver
            considers them already-intersecting at mount. */}
        <section className="relative bg-[var(--surface-canvas)] px-10 pt-24 pb-20 lumen-grid-architectural overflow-hidden">
          <div className="relative max-w-default mx-auto flex flex-col gap-7">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 lumen-mono-cap text-[color:var(--text-accent)]">
                <span className="lumen-dot-pulse" aria-hidden />
                <span>Now in private beta · Spring 2026 · system v0.11 live</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h1 className="text-display-xl sm:text-display-2xl md:text-display-2xl text-[color:var(--text-primary)]">
                The freight network
                <br />
                for{" "}
                {/* lumen-lint-allow: typography — italic accent override on display heading; brand-specific tracking override */}
                <em className="not-italic font-bold tracking-[var(--tracking-tightest)] text-[color:var(--text-accent)]">
                  builders
                </em>
                .
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p className="max-w-[60ch] text-lead">
                One command quotes. One books. JSON out, pipes in. Stop logging into 10 carrier portals every morning &mdash; ship freight from the terminal you already use.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="flex flex-wrap gap-3 pt-3">
                {/* v0.11.13 — `glow` adds the .lumen-glow-cta hero halo on top of
                    the standard primary glow ladder. Per first-impression.md §2:
                    hero primary CTAs ship glow. Without it the 96–128 px brutalist
                    headline outweighs the CTA halo and the focal point flattens. */}
                <Button intent="primary" size="xl" pill glow trailingIcon={<ArrowRight size={16} />}>
                  Get started
                </Button>
                <Button intent="secondary" size="xl" pill leadingIcon={<Code size={16} />}>
                  Read the docs
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={320}>
              <div className="mt-2 inline-flex items-center gap-3 px-4 h-10 rounded-[var(--radius-full)] bg-[var(--surface-raised)] border border-[var(--border-default)] text-[color:var(--text-primary)] lumen-mono text-body-xs self-start">
                <span style={{ color: "var(--lumen-accent-4)" }}>$</span>
                npx warp quote --from=LAX --to=SFO
                <LiveDot />
              </div>
            </ScrollReveal>
          </div>
        </section>

        <RateTicker />

        {/* TRUST STRIP */}
        <section className="bg-[var(--surface-page)] px-10 py-section-xl border-t border-[var(--border-hairline)]">
          <div className="max-w-default mx-auto flex flex-col gap-5">
            <div className="lumen-eyebrow">Trusted by operators at</div>
            {/* v0.11.13 — dropped the conflicting `cursor-default` + `hover:`
                pair (P2-2 in 2026-05-04 audit). These are showcase wordmarks,
                not interactive elements; rendering them static reads as
                confidence (Hermes / Apple / Stripe convention). */}
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-[color:var(--text-tertiary)]">
              {["Walmart", "Gopuff", "KITH", "Faherty", "Brilliant Earth", "True Religion"].map((c) => (
                <div key={c} className="text-body-lg font-bold tracking-[var(--tracking-tight)] select-none">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STAT BAND
            v0.11.12 — went from 4 cold marketing numbers to 4 numbers
            with deltas + live sparklines. Per the halo / first-impression
            principle: visitors form their opinion in 50 ms, and "real
            live data" sells trust harder than bare claims do.
            Demoted hero→xl so the sparkline + delta pill don't fight the
            value for breathing room. */}
        <section className="bg-[var(--surface-sunken)] px-10 py-section-xl border-y border-[var(--border-hairline)]">
          <div className="max-w-default mx-auto">
            <StatGrid cols={4} divided>
              <Stat label="Shipments routed" value="655K+" size="xl"
                trend="up" delta="+18% qoq"
                sparkData={[480,510,535,560,590,610,635,655]} />
              <Stat label="On-time"          value="98.2"  unit="%" size="xl"
                trend="up" delta="+0.4 pts"
                sparkData={[97.4,97.6,97.8,97.9,98.0,98.1,98.1,98.2]} />
              <Stat label="Cost reduction"   value="27"    unit="%" size="xl"
                trend="up" delta="+2 pts"
                sparkData={[20,21,23,24,25,26,26,27]} />
              <Stat label="Lanes covered"    value="1,547" size="xl"
                trend="up" delta="+18 wk"
                sparkData={[1450,1470,1485,1500,1515,1525,1535,1547]} />
            </StatGrid>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-[var(--surface-page)] px-10 py-20">
          <div className="max-w-default mx-auto flex flex-col gap-12">
            <header className="max-w-[640px]">
              <div className="lumen-eyebrow mb-2">What you get</div>
              <h2 className="text-display-md md:text-display-lg">
                Every layer, no portal sprawl.
              </h2>
            </header>
            <div className="grid gap-3 md:grid-cols-3">
              <Feature icon={<Truck size={20} />} title="One contract, every carrier"
                copy="Sterling, ODFL, Saia, Estes, FedEx Freight, ABF — quoted, booked, billed in one place." />
              <Feature icon={<Box size={20} />} title="JSON in, JSON out"
                copy="Every action is an API call. Pipe quotes into a script, pump shipments out of an ERP." />
              <Feature icon={<MapPin size={20} />} title="Network that compounds"
                copy="Every lane your team books makes the next quote sharper for everyone on the network." />
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="bg-[var(--surface-page)] px-10 py-20 border-t border-[var(--border-hairline)]">
          <div className="max-w-default mx-auto flex flex-col gap-10">
            <header className="max-w-[640px]">
              <div className="lumen-eyebrow mb-2">Pricing</div>
              <h2 className="text-display-md md:text-display-lg">
                Pay for shipments, not seats.
              </h2>
            </header>
            <div className="grid gap-3 md:grid-cols-3">
              <PriceCard name="Starter" price="$0" period="forever free"
                features={["Up to 25 shipments / mo", "API + CLI access", "Email support"]} />
              <PriceCard name="Operator" price="$0.30" period="per shipment"
                features={["Unlimited shipments", "All carrier integrations", "Slack support"]} highlighted />
              <PriceCard name="Enterprise" price="Custom" period="volume + SSO"
                features={["Custom contract", "SSO, SCIM, audit", "Solutions engineer"]} />
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="bg-[var(--surface-sunken)] px-10 py-20 border-t border-[var(--border-hairline)]">
          <div className="max-w-[820px] mx-auto flex flex-col gap-6 text-center">
            <div
              aria-hidden
              className="mx-auto leading-none font-bold select-none"
              style={{
                fontSize: "96px",
                color: "var(--lumen-accent-4)",
                opacity: 0.18,
                marginBottom: "-24px",
              }}
            >
              &ldquo;
            </div>
            <div className="lumen-eyebrow">From an operator</div>
            <blockquote className="text-heading-h1 md:text-display-md font-semibold text-[color:var(--text-primary)]">
              Same routes. Lower cost per pallet. AI keeps it dropping. We&apos;ve stopped logging into 10 carrier portals every morning.
            </blockquote>
            <div className="flex items-center justify-center gap-3 mt-2">
              <Avatar name="J Park" size="md" />
              <div className="flex flex-col leading-tight text-left">
                <span className="text-body-sm font-semibold">Jay Park</span>
                <span className="text-body-xs text-[color:var(--text-tertiary)]">VP Operations · Faherty</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[var(--surface-page)] px-10 py-20 border-t border-[var(--border-hairline)]">
          <div className="max-w-[820px] mx-auto flex flex-col gap-7">
            <header>
              <div className="lumen-eyebrow mb-2">FAQ</div>
              <h2 className="text-heading-h1 md:text-display-md">
                Common questions
              </h2>
            </header>
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] divide-y divide-[var(--border-hairline)]">
              {[
                { q: "Do I need to integrate with each carrier?", a: "No. We hold every contract and route the right one for the lane and weight." },
                { q: "Can my ERP push shipments in?", a: "Yes — every action is an API call. Ready integrations for NetSuite, SAP, Brightpearl, Cin7." },
                { q: "How long does setup take?", a: "There is no setup. You log in, get rates, book, track." },
              ].map((item) => (
                <details key={item.q} className="group p-5">
                  <summary className="flex items-center justify-between cursor-pointer text-label-lg">
                    <span>{item.q}</span>
                    <span className="text-[color:var(--text-tertiary)] group-open:rotate-180 transition-transform duration-[var(--motion-base)]">▾</span>
                  </summary>
                  <p className="mt-3 text-body-md text-[color:var(--text-secondary)]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — light-mode preview band. Labeled so the mode swap reads as
            intentional ("here's the same surface in light mode"), not jarring. */}
        <section className="bg-[var(--surface-inverse)] px-10 pt-12 pb-20 border-t border-[var(--border-hairline)]">
          <div className="max-w-default mx-auto flex flex-col items-start gap-7">
            <div
              className="lumen-mono-cap"
              style={{ color: "var(--text-inverse)", opacity: 0.5 }}
            >
              Light mode preview · same tokens, inverted surfaces
            </div>
            <h2
              className="text-display-lg md:text-display-2xl mt-2"
              style={{ color: "var(--text-inverse)" }}
            >
              Ship freight without
              <br />
              <span style={{ color: "var(--lumen-accent-3)" }}>leaving your terminal.</span>
            </h2>
            <Button intent="primary" size="xl" pill glow trailingIcon={<ArrowRight size={16} />}>
              Get started
            </Button>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className="bg-[var(--surface-inverse)] px-10 py-12"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-default mx-auto grid gap-8 md:grid-cols-[1.5fr_2fr] text-body-xs">
            <div className="flex flex-col gap-4" style={{ color: "var(--text-inverse)" }}>
              <div className="text-heading-h5">Warp</div>
              <p className="opacity-70 max-w-[40ch] leading-snug">
                The open source freight network. Built by people who&apos;ve lived every layer of freight.
              </p>
              <LiveDot label="API healthy" />
            </div>
            <div className="grid grid-cols-3 gap-6" style={{ color: "var(--text-inverse)" }}>
              {[
                ["Product", ["Quoting", "Tracking", "API & CLI", "Status"]],
                ["Network", ["Carriers", "Lanes", "Customers", "Pricing"]],
                ["Company", ["About", "Careers", "Press", "Contact"]],
              ].map(([h, items]) => (
                <div key={h as string}>
                  <div className="lumen-eyebrow mb-3" style={{ color: "var(--text-inverse)", opacity: 0.6 }}>
                    {h as string}
                  </div>
                  <ul className="flex flex-col gap-2 opacity-80">
                    {(items as string[]).map((it) => (
                      <li key={it} className="hover:opacity-100 cursor-pointer transition-opacity">{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Feature({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <Card padding="lg" className="flex flex-col gap-4 hover:shadow-[var(--shadow-md)] transition-shadow duration-[var(--motion-soft)]">
      <div className="h-11 w-11 rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-tint-accent)] grid place-items-center text-[color:var(--text-accent)]">
        {icon}
      </div>
      <div className="text-heading-h3">{title}</div>
      <p className="text-body-md text-[color:var(--text-secondary)]">{copy}</p>
    </Card>
  );
}

function PriceCard({
  name, price, period, features, highlighted,
}: {
  name: string; price: string; period: string; features: string[]; highlighted?: boolean;
}) {
  return (
    <Card
      padding="lg"
      elevation={highlighted ? "lifted" : "card"}
      className={[
        "flex flex-col gap-5",
        highlighted ? "!border-[var(--color-accent)]" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div className="text-heading-h5">{name}</div>
        {highlighted && <Badge status="accent" leadingDot>Most popular</Badge>}
      </div>
      <div className="flex items-baseline gap-[var(--space-1_5)]">
        <div className="text-display-lg lumen-tnum">{price}</div>
        <div className="text-body-xs text-[color:var(--text-tertiary)]">{period}</div>
      </div>
      <ul className="flex flex-col gap-stack-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-body-sm text-[color:var(--text-secondary)]">
            <Check size={14} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button intent={highlighted ? "primary" : "secondary"} fullWidth trailingIcon={<ArrowRight size={14} />}>
        Choose {name}
      </Button>
    </Card>
  );
}

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="bg-[var(--surface-sunken)] border-b border-[var(--border-hairline)] px-3 py-2 flex items-center gap-2">
      <div className="flex gap-[var(--space-1_5)]">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="flex-1 mx-3 max-w-md">
        <div className="bg-[var(--surface-raised)] border border-[var(--border-hairline)] rounded-[var(--radius-md)] px-3 h-7 flex items-center gap-2 text-micro text-[color:var(--text-secondary)] lumen-mono">
          <Dot size={16} strokeWidth={4} className="text-[color:var(--text-accent)]" aria-hidden focusable={false} />
          {url}
        </div>
      </div>
    </div>
  );
}

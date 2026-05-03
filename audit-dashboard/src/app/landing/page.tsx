import { PageHeader } from "@/components/section";
import { Card } from "@/components/primitives/card";
import { Stat, StatGrid } from "@/components/primitives/stat";
import { LiveDot } from "@/components/primitives/live-dot";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { RateTicker } from "@/components/primitives/rate-ticker";
import { Avatar } from "@/components/primitives/avatar";
import { ArrowRight, Check, Truck, Box, MapPin, Code } from "@/components/primitives/icon";

export const metadata = { title: "Marketing & Landing · Lumen" };

export default function LandingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tab 4 of 8 · Marketing surface"
        title="Marketing & Landing"
        description="Public marketing surfaces. Type-led hero, screenshot-as-proof, live rate ticker, customer logos, FAQ. Reads as Apple-disciplined and Warp-substantive at the same time."
      />

      <div className="rounded-[var(--radius-xl)] overflow-hidden border border-[var(--border-hairline)] shadow-[var(--shadow-md)] bg-[var(--surface-page)]">
        <BrowserChrome url="warp.example.com" />

        {/* HERO — v0.4 obsidian-lime: architectural grid + brutalist headline (gradients stripped) */}
        <section className="relative bg-[var(--surface-canvas)] px-10 pt-24 pb-20 lumen-grid-architectural overflow-hidden">
          <div className="relative max-w-default mx-auto flex flex-col gap-7">
            <div className="inline-flex items-center gap-2 lumen-mono-cap text-[var(--text-accent)]">
              <span className="lumen-dot-pulse" aria-hidden />
              <span>Now in private beta · Spring 2026 · system v0.4 live</span>
            </div>

            <h1 className="text-display-xl sm:text-display-2xl md:text-display-2xl text-[var(--text-primary)]">
              The freight network
              <br />
              for{" "}
              {/* lumen-lint-allow: typography — italic accent override on display heading; brand-specific tracking override */}
              <em className="not-italic font-bold tracking-[var(--tracking-tightest)] text-[var(--text-accent)]">
                builders
              </em>
              .
            </h1>

            <p className="max-w-[60ch] text-lead">
              One command quotes. One books. JSON out, pipes in. Stop logging into 10 carrier portals every morning &mdash; ship freight from the terminal you already use.
            </p>

            <div className="flex flex-wrap gap-3 pt-3">
              <Button intent="primary" size="xl" pill trailingIcon={<ArrowRight size={16} />}>
                Get started
              </Button>
              <Button intent="secondary" size="xl" pill leadingIcon={<Code size={16} />}>
                Read the docs
              </Button>
            </div>

            {/* lumen-lint-allow: typography — type-13 mono CLI prompt mock; no semantic preset for mono+regular at 13 */}
            <div className="mt-2 inline-flex items-center gap-3 px-4 h-10 rounded-[var(--radius-full)] bg-[var(--surface-raised)] border border-[var(--border-default)] text-[var(--text-primary)] lumen-mono text-[var(--type-13)] self-start">
              <span style={{ color: "var(--lumen-accent-4)" }}>$</span>
              npx warp quote --from=LAX --to=SFO
              <LiveDot />
            </div>
          </div>
        </section>

        <RateTicker />

        {/* TRUST STRIP */}
        <section className="bg-[var(--surface-page)] px-10 py-section-xl border-t border-[var(--border-hairline)]">
          <div className="max-w-default mx-auto flex flex-col gap-5">
            <div className="lumen-eyebrow">Trusted by operators at</div>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-[var(--text-tertiary)]">
              {["Walmart", "Gopuff", "KITH", "Faherty", "Brilliant Earth", "True Religion"].map((c) => (
                /* lumen-lint-allow: typography — type-18 bold trust-logo wordmark; no preset for 18/bold */
                <div key={c} className="text-[var(--type-18)] font-bold tracking-[var(--tracking-tight)] hover:text-[var(--text-secondary)] transition-colors cursor-default">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STAT BAND */}
        <section className="bg-[var(--surface-sunken)] px-10 py-section-xl border-y border-[var(--border-hairline)]">
          <div className="max-w-default mx-auto">
            <StatGrid cols={4} divided>
              <Stat label="Shipments routed" value="655K+" size="hero" />
              <Stat label="On-time"          value="98.2"  unit="%" size="hero" />
              <Stat label="Cost reduction"   value="27"    unit="%" size="hero" />
              <Stat label="Lanes covered"    value="1,547" size="hero" />
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
          <div className="max-w-[820px] mx-auto flex flex-col gap-7 text-center">
            <div className="lumen-eyebrow">From an operator</div>
            <blockquote className="text-heading-h1 md:text-display-md font-semibold text-[var(--text-primary)]">
              &ldquo;Same routes. Lower cost per pallet. AI keeps it dropping. We've stopped logging into 10 carrier portals every morning.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <Avatar name="J Park" size="md" />
              <div className="flex flex-col leading-tight">
                <span className="text-body-sm font-semibold">Jay Park</span>
                <span className="text-body-xs text-[var(--text-tertiary)]">VP Operations · Faherty</span>
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
                    <span className="text-[var(--text-tertiary)] group-open:rotate-180 transition-transform duration-[var(--motion-base)]">▾</span>
                  </summary>
                  {/* lumen-lint-allow: typography — type-15 FAQ answer; intermediate body density between 14 and 16 */}
                  <p className="mt-3 text-[var(--type-15)] text-[var(--text-secondary)] leading-snug">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--surface-inverse)] px-10 py-20 border-t border-[var(--border-hairline)]">
          <div className="max-w-default mx-auto flex flex-col items-start gap-7">
            <h2
              className="text-display-lg md:text-display-2xl"
              style={{ color: "var(--text-inverse)" }}
            >
              Ship freight without
              <br />
              <span style={{ color: "var(--lumen-accent-3)" }}>leaving your terminal.</span>
            </h2>
            <Button intent="primary" size="lg" trailingIcon={<ArrowRight size={16} />}>
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
      <div className="h-11 w-11 rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-tint-accent)] grid place-items-center text-[var(--text-accent)]">
        {icon}
      </div>
      <div className="text-heading-h3">{title}</div>
      {/* lumen-lint-allow: typography — type-15 feature copy; intermediate body density between 14 and 16 */}
      <p className="text-[var(--type-15)] text-[var(--text-secondary)] leading-[var(--leading-snug)]">{copy}</p>
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
        <div className="text-body-xs text-[var(--text-tertiary)]">{period}</div>
      </div>
      <ul className="flex flex-col gap-stack-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-body-sm text-[var(--text-secondary)]">
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
        {/* lumen-lint-allow: typography — type-12 mono URL bar mock; no semantic preset for mono+regular at 12 */}
        <div className="bg-[var(--surface-raised)] border border-[var(--border-hairline)] rounded-[var(--radius-md)] px-3 h-7 flex items-center gap-2 text-[var(--type-12)] text-[var(--text-secondary)] lumen-mono">
          <span className="text-[var(--text-accent)]">●</span>
          {url}
        </div>
      </div>
    </div>
  );
}

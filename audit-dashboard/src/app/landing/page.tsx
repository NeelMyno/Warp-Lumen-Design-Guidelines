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
        eyebrow="Tab 3 of 7 · Marketing surface"
        title="Marketing & Landing"
        description="Public marketing surfaces. Type-led hero, screenshot-as-proof, live rate ticker, customer logos, FAQ. Reads as Apple-disciplined and Warp-substantive at the same time."
      />

      <div className="rounded-[var(--radius-xl)] overflow-hidden border border-[var(--border-hairline)] shadow-[var(--shadow-md)] bg-[var(--surface-page)]">
        <BrowserChrome url="warp.example.com" />

        {/* HERO */}
        <section className="relative bg-[var(--surface-page)] px-10 pt-20 pb-16 lumen-stripe-grid">
          <div className="relative max-w-[1100px] mx-auto flex flex-col gap-7">
            <div className="inline-flex">
              <Badge status="accent" size="md" leadingDot>
                Now in private beta · Spring 2026
              </Badge>
            </div>

            <h1 className="text-[var(--type-61)] sm:text-[var(--type-72)] md:text-[var(--type-76)] font-bold tracking-[var(--tracking-tightest)] leading-[var(--leading-flat)] text-[var(--text-primary)]">
              The freight network
              <br />
              <span className="text-[var(--text-tertiary)]">for builders.</span>
            </h1>

            <p className="max-w-[60ch] text-[var(--type-20)] md:text-[var(--type-22)] text-[var(--text-secondary)] leading-[var(--leading-snug)]">
              One command quotes. One books. JSON out, pipes in. Stop logging into 10 carrier portals every morning &mdash; ship freight from the terminal you already use.
            </p>

            <div className="flex flex-wrap gap-3 pt-3">
              <Button intent="primary" size="lg" trailingIcon={<ArrowRight size={16} />}>
                Get started
              </Button>
              <Button intent="secondary" size="lg" leadingIcon={<Code size={16} />}>
                Read the docs
              </Button>
            </div>

            <div className="mt-2 inline-flex items-center gap-3 px-3 h-9 rounded-[var(--radius-md)] bg-[var(--surface-inverse)] text-[var(--text-inverse)] lumen-mono text-[var(--type-13)] self-start">
              <span style={{ color: "var(--lumen-accent-3)" }}>$</span>
              npx warp quote --from=LAX --to=SFO
              <LiveDot />
            </div>
          </div>
        </section>

        <RateTicker />

        {/* TRUST STRIP */}
        <section className="bg-[var(--surface-page)] px-10 py-10 border-t border-[var(--border-hairline)]">
          <div className="max-w-[1100px] mx-auto flex flex-col gap-5">
            <div className="lumen-eyebrow">Trusted by operators at</div>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-[var(--text-tertiary)]">
              {["Walmart", "Gopuff", "KITH", "Faherty", "Brilliant Earth", "True Religion"].map((c) => (
                <div key={c} className="text-[var(--type-18)] font-bold tracking-[var(--tracking-tight)] hover:text-[var(--text-secondary)] transition-colors cursor-default">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STAT BAND */}
        <section className="bg-[var(--surface-sunken)] px-10 py-14 border-y border-[var(--border-hairline)]">
          <div className="max-w-[1100px] mx-auto">
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
          <div className="max-w-[1100px] mx-auto flex flex-col gap-12">
            <header className="max-w-[640px]">
              <div className="lumen-eyebrow mb-2">What you get</div>
              <h2 className="text-[var(--type-44)] md:text-[var(--type-49)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]">
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
          <div className="max-w-[1100px] mx-auto flex flex-col gap-10">
            <header className="max-w-[640px]">
              <div className="lumen-eyebrow mb-2">Pricing</div>
              <h2 className="text-[var(--type-44)] md:text-[var(--type-49)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]">
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
            <blockquote className="text-[var(--type-31)] md:text-[var(--type-39)] font-semibold tracking-[var(--tracking-tight)] leading-[var(--leading-tight)] text-[var(--text-primary)]">
              &ldquo;Same routes. Lower cost per pallet. AI keeps it dropping. We've stopped logging into 10 carrier portals every morning.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <Avatar name="J Park" size="md" />
              <div className="flex flex-col leading-tight">
                <span className="text-[var(--type-14)] font-semibold">Jay Park</span>
                <span className="text-[var(--type-13)] text-[var(--text-tertiary)]">VP Operations · Faherty</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[var(--surface-page)] px-10 py-20 border-t border-[var(--border-hairline)]">
          <div className="max-w-[820px] mx-auto flex flex-col gap-7">
            <header>
              <div className="lumen-eyebrow mb-2">FAQ</div>
              <h2 className="text-[var(--type-31)] md:text-[var(--type-39)] font-bold tracking-[var(--tracking-tighter)]">
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
                  <summary className="flex items-center justify-between cursor-pointer text-[var(--type-16)] font-medium tracking-[var(--tracking-tight)]">
                    <span>{item.q}</span>
                    <span className="text-[var(--text-tertiary)] group-open:rotate-180 transition-transform duration-[var(--motion-base)]">▾</span>
                  </summary>
                  <p className="mt-3 text-[var(--type-15)] text-[var(--text-secondary)] leading-snug">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--surface-inverse)] px-10 py-20 border-t border-[var(--border-hairline)]">
          <div className="max-w-[1100px] mx-auto flex flex-col items-start gap-7">
            <h2
              className="text-[var(--type-49)] md:text-[var(--type-72)] font-bold tracking-[var(--tracking-tightest)] leading-[var(--leading-flat)]"
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
          <div className="max-w-[1100px] mx-auto grid gap-8 md:grid-cols-[1.5fr_2fr] text-[var(--type-13)]">
            <div className="flex flex-col gap-4" style={{ color: "var(--text-inverse)" }}>
              <div className="font-semibold text-[var(--type-15)]">Warp</div>
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
      <div className="text-[var(--type-20)] font-semibold tracking-[var(--tracking-tight)]">{title}</div>
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
        <div className="text-[var(--type-15)] font-semibold tracking-[var(--tracking-tight)]">{name}</div>
        {highlighted && <Badge status="accent" leadingDot>Most popular</Badge>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <div className="text-[var(--type-49)] font-bold tracking-[var(--tracking-tighter)] lumen-tnum">{price}</div>
        <div className="text-[var(--type-13)] text-[var(--text-tertiary)]">{period}</div>
      </div>
      <ul className="flex flex-col gap-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[var(--type-14)] text-[var(--text-secondary)]">
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
      <div className="flex gap-1.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="flex-1 mx-3 max-w-md">
        <div className="bg-[var(--surface-raised)] border border-[var(--border-hairline)] rounded-[var(--radius-md)] px-3 h-7 flex items-center gap-2 text-[var(--type-12)] text-[var(--text-secondary)] lumen-mono">
          <span className="text-[var(--text-accent)]">●</span>
          {url}
        </div>
      </div>
    </div>
  );
}

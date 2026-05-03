import { PageHeader } from "@/components/section";
import { Card, CardHeader } from "@/components/primitives/card";
import { Stat, StatGrid } from "@/components/primitives/stat";
import { LiveDot } from "@/components/primitives/live-dot";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { RateTicker } from "@/components/primitives/rate-ticker";
import { ArrowRight, Check, Truck, Box, MapPin, Code } from "@/components/primitives/icon";

export const metadata = { title: "Marketing & Landing · Lumen" };

export default function LandingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tab 3 of 7"
        title="Marketing & Landing"
        description="Public marketing surfaces. Type-led hero, screenshot-as-proof, live data ticker, customer logos, FAQ. Built to read as Apple-disciplined and Warp-substantive at the same time."
      />

      <div className="lumen-card overflow-hidden">
        {/* Browser frame */}
        <BrowserChrome url="warp.example.com" />

        {/* Hero */}
        <section className="bg-[var(--surface-page)] px-10 pt-14 pb-12">
          <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
            <Badge status="accent">
              <LiveDot color="currentColor" /> Now in private beta · Spring 2026
            </Badge>
            <h1 className="text-[var(--type-61)] sm:text-[var(--type-76)] font-bold tracking-[var(--tracking-tightest)] leading-[var(--leading-tight)] text-[var(--text-primary)]">
              The freight network<br />for builders.
            </h1>
            <p className="max-w-[640px] text-[var(--type-20)] text-[var(--text-secondary)] leading-[var(--leading-snug)]">
              One command quotes. One books. JSON out, pipes in. Stop logging into 10 carrier portals every morning &mdash; ship freight from the terminal you already use.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button intent="primary" size="lg" trailingIcon={<ArrowRight />}>
                Get started
              </Button>
              <Button intent="secondary" size="lg" leadingIcon={<Code size={16} />}>
                Read the docs
              </Button>
            </div>
            <div className="lumen-mono text-[var(--type-13)] text-[var(--text-tertiary)] pt-1">
              <span className="text-[var(--text-secondary)]">$</span> npx warp quote --from=LAX --to=SFO
            </div>
          </div>
        </section>

        {/* Live ticker */}
        <RateTicker />

        {/* Trust strip */}
        <section className="bg-[var(--surface-page)] px-10 py-10 border-t border-[var(--border-subtle)]">
          <div className="max-w-[1100px] mx-auto flex flex-col gap-4">
            <div className="lumen-eyebrow">Trusted by operators at</div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-[var(--text-tertiary)]">
              {["Walmart", "Gopuff", "KITH", "Faherty", "Brilliant Earth", "True Religion"].map((c) => (
                <div key={c} className="text-[var(--type-18)] font-semibold tracking-[var(--tracking-tight)]">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stat band */}
        <section className="bg-[var(--surface-sunken)] px-10 py-12 border-y border-[var(--border-subtle)]">
          <div className="max-w-[1100px] mx-auto">
            <StatGrid cols={4}>
              <Stat label="Shipments routed" value="655K+" size="lg" />
              <Stat label="On-time" value="98.2" unit="%" size="lg" />
              <Stat label="Cost reduction" value="27" unit="%" size="lg" />
              <Stat label="Lanes covered" value="1,547" size="lg" />
            </StatGrid>
          </div>
        </section>

        {/* Feature blocks */}
        <section className="bg-[var(--surface-page)] px-10 py-16">
          <div className="max-w-[1100px] mx-auto flex flex-col gap-12">
            <header className="max-w-[640px]">
              <div className="lumen-eyebrow mb-2">What you get</div>
              <h2 className="text-[var(--type-39)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]">
                Every layer, no portal sprawl.
              </h2>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
              <Feature
                icon={<Truck size={20} />}
                title="One contract, every carrier"
                copy="Sterling, ODFL, Saia, Estes, FedEx Freight, ABF — quoted, booked, billed in one place."
              />
              <Feature
                icon={<Box size={20} />}
                title="JSON in, JSON out"
                copy="Every action is an API call. Pipe quotes into a script, pump shipments out of an ERP."
              />
              <Feature
                icon={<MapPin size={20} />}
                title="Network that compounds"
                copy="Every lane your team books makes the next quote sharper for everyone on the network."
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-[var(--surface-page)] px-10 py-16 border-t border-[var(--border-subtle)]">
          <div className="max-w-[1100px] mx-auto flex flex-col gap-8">
            <header className="max-w-[640px]">
              <div className="lumen-eyebrow mb-2">Pricing</div>
              <h2 className="text-[var(--type-39)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]">
                Pay for shipments, not seats.
              </h2>
            </header>
            <div className="grid gap-4 md:grid-cols-3">
              <PriceCard
                name="Starter"
                price="$0"
                period="forever free"
                features={["Up to 25 shipments / mo", "API + CLI access", "Email support"]}
              />
              <PriceCard
                name="Operator"
                price="$0.30"
                period="per shipment"
                features={["Unlimited shipments", "All carrier integrations", "Slack support"]}
                highlighted
              />
              <PriceCard
                name="Enterprise"
                price="Custom"
                period="volume + SSO"
                features={["Custom contract", "SSO, SCIM, audit", "Solutions engineer"]}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[var(--surface-sunken)] px-10 py-16 border-t border-[var(--border-subtle)]">
          <div className="max-w-[820px] mx-auto flex flex-col gap-6">
            <header>
              <div className="lumen-eyebrow mb-2">FAQ</div>
              <h2 className="text-[var(--type-31)] font-bold tracking-[var(--tracking-tighter)]">
                Common questions
              </h2>
            </header>
            <div className="lumen-card divide-y divide-[var(--border-subtle)]">
              {[
                { q: "Do I need to integrate with each carrier?", a: "No. We hold every contract and route the right one for the lane and weight." },
                { q: "Can my ERP push shipments in?", a: "Yes — every action is an API call. We have ready integrations for NetSuite, SAP, Brightpearl, and Cin7." },
                { q: "How long does setup take?", a: "There is no setup. You log in, get rates, book, track." },
              ].map((item) => (
                <details key={item.q} className="group p-5">
                  <summary className="flex items-center justify-between cursor-pointer text-[var(--type-16)] font-medium">
                    <span>{item.q}</span>
                    <span className="text-[var(--text-tertiary)] group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="mt-3 text-[var(--type-15)] text-[var(--text-secondary)]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--surface-inverse)] text-[var(--text-inverse)] px-10 py-16 border-t border-[var(--border-subtle)]">
          <div className="max-w-[1100px] mx-auto flex flex-col items-start gap-6">
            <h2
              className="text-[var(--type-49)] font-bold tracking-[var(--tracking-tightest)] leading-[var(--leading-tight)]"
              style={{ color: "var(--text-inverse)" }}
            >
              Ship freight without<br /> leaving your terminal.
            </h2>
            <Button intent="primary" size="lg" trailingIcon={<ArrowRight />}>
              Get started
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[var(--surface-inverse)] text-[var(--text-inverse)] px-10 py-10 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="max-w-[1100px] mx-auto grid gap-6 md:grid-cols-[1fr_2fr] text-[var(--type-13)]">
            <div className="flex flex-col gap-3 opacity-80">
              <div className="font-semibold text-[var(--type-15)]" style={{ color: "var(--text-inverse)" }}>Warp</div>
              <p style={{ color: "var(--text-inverse)", opacity: 0.7 }}>
                The open source freight network.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 opacity-80">
              {[
                ["Product", ["Quoting", "Tracking", "API & CLI"]],
                ["Network", ["Carriers", "Lanes", "Status"]],
                ["Company", ["About", "Careers", "Contact"]],
              ].map(([h, items]) => (
                <div key={h as string}>
                  <div className="lumen-eyebrow mb-2" style={{ color: "var(--text-inverse)", opacity: 0.7 }}>{h as string}</div>
                  <ul className="flex flex-col gap-1.5">
                    {(items as string[]).map((it) => <li key={it}>{it}</li>)}
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
    <Card padding="lg" className="flex flex-col gap-3">
      <div className="h-10 w-10 rounded-[var(--radius-md)] border border-[var(--border-default)] grid place-items-center text-[var(--text-primary)]">
        {icon}
      </div>
      <div className="text-[var(--type-18)] font-semibold tracking-[var(--tracking-tight)]">{title}</div>
      <p className="text-[var(--type-15)] text-[var(--text-secondary)] leading-[var(--leading-snug)]">{copy}</p>
    </Card>
  );
}

function PriceCard({
  name,
  price,
  period,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <Card
      padding="lg"
      className={[
        "flex flex-col gap-4",
        highlighted ? "!border-[var(--color-accent)] !shadow-[var(--shadow-md)]" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div className="text-[var(--type-15)] font-semibold tracking-[var(--tracking-tight)]">{name}</div>
        {highlighted && <Badge status="accent">Most popular</Badge>}
      </div>
      <div className="flex items-baseline gap-1">
        <div className="text-[var(--type-39)] font-bold tracking-[var(--tracking-tighter)] lumen-tnum">{price}</div>
        <div className="text-[var(--type-13)] text-[var(--text-tertiary)]">{period}</div>
      </div>
      <ul className="flex flex-col gap-2">
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
    <div className="bg-[var(--surface-sunken)] border-b border-[var(--border-subtle)] px-3 py-2 flex items-center gap-2">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="flex-1 mx-3 max-w-md">
        <div className="bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-3 h-7 flex items-center text-[var(--type-12)] text-[var(--text-secondary)] lumen-mono">
          {url}
        </div>
      </div>
    </div>
  );
}

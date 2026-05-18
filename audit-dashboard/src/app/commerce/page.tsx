import { PageHeader } from "@/components/section";
import { Card } from "@/components/primitives/card";
import { Button, IconButton } from "@/components/primitives/button";
import { Stat } from "@/components/primitives/stat";
import { Avatar } from "@/components/primitives/avatar";
import { Breadcrumb } from "@/components/primitives/breadcrumb";
// v0.12.8 — pruned ArrowRight / Check / ChevronDown / Badge (now imported
// inside buy.client.tsx) from this server file. Cart, Search, User, Plus
// stay — they're consumed by the storefront chrome + announcement bar.
import { Cart, Search, User, Plus } from "@/components/primitives/icon";
// v0.12.8 — Buy panel extracted to a client island. The R2 audit caught
// the color + size pickers as hardcoded showcase mockups with no useState;
// clicks produced no visual feedback. The client island wires real state
// so the swatch ring + "Color · {name}" label + size border track the
// user's selection. See buy.client.tsx for rationale.
import { Buy } from "./buy.client";

export const metadata = { title: "Commerce · Lumen" };

export default function CommercePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Storefront surface"
        title="Commerce"
        description="Storefront patterns for Shopify, BigCommerce, WooCommerce. Product detail, related items, drawer cart — held to the same Lumen typographic discipline."
      />

      <div className="rounded-[var(--radius-xl)] overflow-hidden border border-[var(--border-hairline)] shadow-[var(--shadow-md)] bg-[var(--surface-page)]">
        <Announcement />
        <StoreHeader />

        {/* PRODUCT DETAIL */}
        <section className="bg-[var(--surface-page)] px-8 pt-8 pb-12">
          <Breadcrumb items={[
            { href: "#", label: "Shop" },
            { href: "#", label: "Workhorse" },
            { label: "Field Jacket Mk II" },
          ]} />
          <div className="mt-8 grid gap-12 md:grid-cols-[1.1fr_1fr]">
            <Gallery />
            <Buy />
          </div>
        </section>

        {/* SPECS BAND */}
        <section className="bg-[var(--surface-sunken)] px-8 py-12 border-y border-[var(--border-hairline)]">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Lead time"        value="3–5"  unit="days" size="md" />
            <Stat label="Carbon offset"    value="100"  unit="%"    size="md" />
            <Stat label="Return window"    value="30"   unit="days" size="md" />
            <Stat label="Lifetime warranty" value="Yes"               size="md" />
          </div>
        </section>

        {/* REVIEWS */}
        <section className="bg-[var(--surface-page)] px-8 py-12">
          <div className="grid gap-10 md:grid-cols-[260px_1fr]">
            <div className="flex flex-col gap-3">
              <div className="lumen-eyebrow">Customer rating</div>
              <div className="flex items-baseline gap-2">
                <span className="text-metric-xl lumen-tnum">
                  4.8
                </span>
                <span className="lumen-mono text-body-xs text-[color:var(--text-tertiary)]">
                  /5 · 184 reviews
                </span>
              </div>
              <Stars value={4.8} />
              <div className="mt-3 flex flex-col gap-[var(--space-1_5)]">
                {[5, 4, 3, 2, 1].map((s) => (
                  <Bar key={s} stars={s} pct={[78, 14, 5, 2, 1][5 - s]} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {REVIEWS.map((r) => (
                <Card key={r.author} padding="lg">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="text-heading-h5">
                      {r.title}
                    </div>
                    <Stars value={r.rating} size={12} />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar name={r.author} size="xs" />
                    <span className="lumen-mono text-micro text-[color:var(--text-tertiary)]">
                      {r.author} · {r.when}
                    </span>
                  </div>
                  <p className="text-body-sm text-[color:var(--text-secondary)] leading-snug">
                    {r.body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED */}
        <section className="bg-[var(--surface-page)] px-8 pb-12 border-t border-[var(--border-hairline)] pt-12">
          <div className="lumen-eyebrow mb-6">You may also like</div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {RELATED.map((p) => (
              <Card key={p.name} padding="none" className="hover:shadow-[var(--shadow-md)] transition-shadow cursor-pointer group">
                <div
                  className="aspect-[4/5] relative"
                  style={{ background: p.bgA }}
                >
                  <div className="absolute top-2 right-2">
                    <IconButton aria-label="Add to wishlist" intent="secondary" size="sm" className="!bg-[var(--surface-raised)]/80">
                      <Plus size={14} />
                    </IconButton>
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-[2px]">
                  <div className="text-label-md truncate">{p.name}</div>
                  <div className="lumen-mono lumen-tnum text-body-xs text-[color:var(--text-secondary)]">
                    {p.price}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StoreHeader() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[var(--border-hairline)] bg-[var(--surface-raised)] px-8 h-14">
      <div className="flex items-center gap-8">
        <div className="text-body-lg font-bold tracking-[var(--tracking-tight)]">
          Foundry
        </div>
        <nav className="hidden md:flex items-center gap-6 text-body-sm text-[color:var(--text-secondary)]">
          {["Shop", "Collections", "Editorial", "Studio", "About"].map((n) => (
            <a key={n} href="#" className="hover:text-[color:var(--text-primary)] transition-colors">{n}</a>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <IconButton aria-label="Search"><Search size={15} /></IconButton>
        <IconButton aria-label="Account"><User size={15} /></IconButton>
        <Button intent="secondary" size="sm" leadingIcon={<Cart size={14} />}>
          Cart · 2
        </Button>
      </div>
    </header>
  );
}

function Announcement() {
  return (
    <div className="bg-[var(--surface-inverse)] text-[color:var(--text-inverse)] text-micro py-2 text-center">
      Free freight on orders over $200 — handled by{" "}
      <span className="lumen-mono" style={{ color: "var(--lumen-accent-3)" }}>@warp</span>
    </div>
  );
}

function Gallery() {
  const tiles = [
    "var(--lumen-obsidian-7)",
    "var(--lumen-obsidian-6)",
    "var(--lumen-obsidian-5)",
    "var(--lumen-obsidian-8)",
  ];
  return (
    <div className="grid gap-3 grid-cols-[88px_1fr]">
      <div className="flex flex-col gap-2">
        {tiles.map((bg, i) => (
          <button
            key={i}
            className={[
              "aspect-square rounded-[var(--radius-md)] overflow-hidden border-2 transition-colors",
              i === 0 ? "border-[var(--text-primary)]" : "border-transparent hover:border-[var(--border-default)]",
            ].join(" ")}
            style={{ background: bg }}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>
      <div
        className="aspect-[4/5] rounded-[var(--radius-xl)] border border-[var(--border-hairline)]"
        style={{ background: tiles[0] }}
      />
    </div>
  );
}

// v0.12.8 — Buy moved to ./buy.client.tsx as a client island so color + size
// pickers can track real useState instead of hardcoding `i === 0` / `s === "M"`.
// Importing here keeps the page a server component (metadata export intact)
// while the small interactive island handles the user's variant decisions.

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const partial = value - full;
  return (
    <div className="flex items-center gap-1" aria-label={`${value} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fillPct = i < full ? 100 : i === full ? Math.round(partial * 100) : 0;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <defs>
              <linearGradient id={`sg-${i}-${value}-${size}`}>
                <stop offset={`${fillPct}%`} stopColor="var(--text-primary)" />
                <stop offset={`${fillPct}%`} stopColor="var(--border-default)" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3-5.6-4.9 7.4-.6L12 2z"
              fill={`url(#sg-${i}-${value}-${size})`}
            />
          </svg>
        );
      })}
    </div>
  );
}

/* v0.11.12 — rating histogram bars now carry a sentiment-aware tint:
   5★ → accent (positive lead), 4★ → mid-accent, 3★ → neutral text,
   2★ → mid-amber, 1★ → red. Magnitude still shines through bar
   length (which is the primary cue); colour just amplifies the
   "did this jacket make people happy?" read at a glance. Bars
   bumped from 1.5px → 2px height for clearer visual hits, and the
   percentage reads into type-12 mono (was micro) so it earns its
   place at this hero-rating scale. */
const RATING_BAR_TONE: Record<number, string> = {
  5: "var(--lumen-accent-5)",
  4: "var(--lumen-accent-7)",
  3: "var(--text-tertiary)",
  2: "var(--lumen-amber-5)",
  1: "var(--lumen-red-5)",
};

function Bar({ stars, pct }: { stars: number; pct: number }) {
  return (
    <div className="flex items-center gap-2 text-micro">
      <span className="w-3 lumen-mono text-[color:var(--text-tertiary)]">{stars}</span>
      <div className="flex-1 h-2 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-[var(--motion-medium,320ms)]"
          style={{ width: `${pct}%`, background: RATING_BAR_TONE[stars] }}
        />
      </div>
      <span className="w-9 text-right lumen-mono lumen-tnum text-[length:var(--type-12)] text-[color:var(--text-secondary)]">{pct}%</span>
    </div>
  );
}

const REVIEWS = [
  {
    author: "Mercer A.",
    title: "Wear it. Beat it. Buy it again.",
    when: "3 weeks ago",
    rating: 5,
    body: "Two months in. Cuffs are starting to memorize my wrists. Zips are still butter. The fit assumes a t-shirt under a flannel — not a scrunched hoodie — and that's exactly right.",
  },
  {
    author: "Park J.",
    title: "Right amount of structure",
    when: "1 month ago",
    rating: 4.5,
    body: "Stiffer than a Fjällräven for the first week, then drapes. Storm flap stops the wind in Chicago. Sleeves run a touch long for me at 5'9\".",
  },
  {
    author: "Reyes A.",
    title: "Replaces three things",
    when: "2 months ago",
    rating: 5,
    body: "Replaces the chore coat, the rain shell, and the field jacket I had been alternating. Pockets actually hold a notebook and a Kindle Paperwhite at the same time.",
  },
];

const RELATED = [
  { name: "Tin No. 4 Reproofing Wax",  price: "$24",  bgA: "#3a4a5e", bgB: "#1f2a3c" },
  { name: "Workhorse Crew Sweatshirt", price: "$120", bgA: "#525c44", bgB: "#222b18" },
  { name: "Ranger Belt",               price: "$78",  bgA: "#7a6042", bgB: "#352a18" },
  { name: "Roll-Top Day Pack",         price: "$148", bgA: "#1a2332", bgB: "#0a0e16" },
];

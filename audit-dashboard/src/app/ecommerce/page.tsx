import { PageHeader } from "@/components/section";
import { Card } from "@/components/primitives/card";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { Stat } from "@/components/primitives/stat";
import {
  ArrowRight,
  Cart,
  Check,
  Search,
  User,
  ChevronDown,
  Plus,
  X,
} from "@/components/primitives/icon";

export const metadata = { title: "E-commerce · Lumen" };

export default function EcommercePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tab 5 of 7"
        title="E-commerce"
        description="Storefront patterns suitable for Shopify, BigCommerce, or WooCommerce themes. Product detail, related items, drawer cart, and checkout — held to the same Lumen typographic discipline."
      />

      <div className="dash-card overflow-hidden">
        <StoreHeader />
        <Announcement />

        {/* Product detail */}
        <section className="bg-[var(--surface-page)] px-8 py-10">
          <Breadcrumbs />
          <div className="mt-6 grid gap-10 md:grid-cols-[1.1fr_1fr]">
            <Gallery />
            <Buy />
          </div>
        </section>

        {/* Specs */}
        <section className="bg-[var(--surface-sunken)] px-8 py-10 border-y border-[var(--border-subtle)]">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Stat label="Lead time" value="3–5" unit="days" size="sm" />
            <Stat label="Carbon offset" value="100" unit="%" size="sm" />
            <Stat label="Return window" value="30" unit="days" size="sm" />
            <Stat label="Lifetime warranty" value="Yes" size="sm" />
          </div>
        </section>

        {/* Reviews */}
        <section className="bg-[var(--surface-page)] px-8 py-10">
          <div className="grid gap-8 md:grid-cols-[260px_1fr]">
            <div className="flex flex-col gap-2">
              <div className="dash-eyebrow">Rating</div>
              <div className="flex items-baseline gap-2">
                <span className="text-[var(--type-49)] font-bold tracking-[var(--tracking-tighter)] dash-tnum">
                  4.8
                </span>
                <span className="dash-mono text-[var(--type-14)] text-[var(--text-tertiary)]">/5 · 184 reviews</span>
              </div>
              <Stars value={4.8} />
              <div className="mt-3 flex flex-col gap-1.5">
                {[5, 4, 3, 2, 1].map((s) => (
                  <Bar key={s} stars={s} pct={[78, 14, 5, 2, 1][5 - s]} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {REVIEWS.map((r) => (
                <Card key={r.author}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[var(--type-15)] font-semibold">{r.title}</div>
                    <Stars value={r.rating} size={12} />
                  </div>
                  <div className="dash-mono text-[var(--type-12)] text-[var(--text-tertiary)] mb-2">
                    {r.author} · {r.when}
                  </div>
                  <p className="text-[var(--type-14)] text-[var(--text-secondary)]">{r.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="bg-[var(--surface-page)] px-8 pb-12">
          <div className="dash-eyebrow mb-4">You may also like</div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {RELATED.map((p) => (
              <Card key={p.name} padding="none" className="overflow-hidden">
                <div
                  className="aspect-[4/5]"
                  style={{
                    background:
                      `linear-gradient(135deg, ${p.bgA} 0%, ${p.bgB} 100%)`,
                  }}
                />
                <div className="p-3">
                  <div className="text-[var(--type-14)] font-medium">{p.name}</div>
                  <div className="dash-mono text-[var(--type-13)] dash-tnum text-[var(--text-secondary)]">
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
    <header className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)] px-6 py-3">
      <div className="flex items-center gap-6">
        <div className="text-[var(--type-18)] font-bold tracking-[var(--tracking-tight)]">
          Foundry
        </div>
        <nav className="hidden md:flex items-center gap-5 text-[var(--type-14)] text-[var(--text-secondary)]">
          {["Shop", "Collections", "Editorial", "Studio", "About"].map((n) => (
            <a key={n} href="#" className="hover:text-[var(--text-primary)]">{n}</a>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Button intent="tertiary" size="sm" leadingIcon={<Search size={14} />}>Search</Button>
        <Button intent="tertiary" size="sm" leadingIcon={<User size={14} />} aria-label="Account" />
        <Button intent="secondary" size="sm" leadingIcon={<Cart size={14} />}>
          Cart · 2
        </Button>
      </div>
    </header>
  );
}

function Announcement() {
  return (
    <div className="bg-[var(--surface-inverse)] text-[var(--text-inverse)] text-[var(--type-13)] py-2 text-center">
      Free freight on orders over $200 — handled by{" "}
      <span className="text-[var(--accent-400)] dash-mono">@warp</span>
    </div>
  );
}

function Breadcrumbs() {
  return (
    <nav className="dash-mono text-[var(--type-12)] text-[var(--text-tertiary)] flex items-center gap-1.5">
      Shop / Collections / Workhorse / <span className="text-[var(--text-primary)]">Field Jacket Mk II</span>
    </nav>
  );
}

function Gallery() {
  const tiles = [
    "linear-gradient(135deg, #243245, #1a2332)",
    "linear-gradient(135deg, #2a3a52, #161e2a)",
    "linear-gradient(135deg, #3b4b66, #1f2a3c)",
    "linear-gradient(135deg, #21304a, #0f1622)",
  ];
  return (
    <div className="grid gap-3 grid-cols-[80px_1fr]">
      <div className="flex flex-col gap-2">
        {tiles.map((bg, i) => (
          <button
            key={i}
            className="aspect-square rounded-[var(--radius-md)] border border-[var(--border-subtle)] overflow-hidden hover:border-[var(--border-default)]"
            style={{ background: bg }}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>
      <div
        className="aspect-[4/5] rounded-[var(--radius-lg)] border border-[var(--border-subtle)]"
        style={{ background: tiles[0] }}
      />
    </div>
  );
}

function Buy() {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="dash-eyebrow mb-1">Workhorse Series</div>
        <h1 className="text-[var(--type-39)] font-bold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)]">
          Field Jacket Mk II
        </h1>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="dash-mono dash-tnum text-[var(--type-25)] font-semibold">$248</span>
          <span className="dash-mono dash-tnum text-[var(--type-15)] text-[var(--text-tertiary)] line-through">$320</span>
          <Badge status="accent">22% off</Badge>
        </div>
      </div>

      <p className="text-[var(--type-15)] text-[var(--text-secondary)] leading-[var(--leading-snug)]">
        Waxed organic cotton, branched seams, two-way main zip. Built to take a beating and to age the way good things do.
      </p>

      <div>
        <div className="dash-eyebrow mb-2">Color · Olive Drab</div>
        <div className="flex gap-2">
          {[
            ["#525c44", "Olive Drab"],
            ["#1a1f29", "Storm Navy"],
            ["#7a6042", "Ranger Tan"],
            ["#454545", "Slate"],
          ].map(([hex, name]) => (
            <button
              key={name}
              aria-label={name}
              className="h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-[var(--border-default)]"
              style={{ background: hex, boxShadow: name === "Olive Drab" ? "0 0 0 2px var(--text-primary), 0 0 0 4px var(--surface-page)" : undefined }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="dash-eyebrow mb-2">Size</div>
        <div className="grid grid-cols-6 gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              className={[
                "h-10 rounded-[var(--radius-md)] border text-[var(--type-14)] font-medium",
                s === "M"
                  ? "border-[var(--text-primary)] bg-[var(--surface-raised)] text-[var(--text-primary)]"
                  : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <Button intent="primary" size="lg" leadingIcon={<Cart size={16} />}>
          Add to cart · $248
        </Button>
        <Button intent="secondary" size="md" trailingIcon={<ArrowRight size={14} />}>
          Buy with shop pay
        </Button>
        <p className="text-[var(--type-13)] text-[var(--text-secondary)] mt-2 flex items-start gap-2">
          <Check size={14} /> Ships in 2 days · 30-day returns · Lifetime repair
        </p>
      </div>

      <details className="border-t border-[var(--border-subtle)] pt-4 group">
        <summary className="flex justify-between cursor-pointer text-[var(--type-15)] font-medium">
          Materials & care
          <ChevronDown size={14} />
        </summary>
        <p className="mt-2 text-[var(--type-14)] text-[var(--text-secondary)]">
          11oz organic cotton, beeswax-finished. Spot clean. Re-wax annually with our Tin No. 4.
        </p>
      </details>
      <details className="border-t border-[var(--border-subtle)] pt-4 group">
        <summary className="flex justify-between cursor-pointer text-[var(--type-15)] font-medium">
          Shipping & returns
          <ChevronDown size={14} />
        </summary>
        <p className="mt-2 text-[var(--type-14)] text-[var(--text-secondary)]">
          Free freight on orders over $200, fulfilled by Warp. 30-day no-questions returns.
        </p>
      </details>
    </div>
  );
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const partial = value - full;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fillPct = i < full ? 100 : i === full ? Math.round(partial * 100) : 0;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <defs>
              <linearGradient id={`sg-${i}-${value}`}>
                <stop offset={`${fillPct}%`} stopColor="var(--text-primary)" />
                <stop offset={`${fillPct}%`} stopColor="var(--border-default)" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3-5.6-4.9 7.4-.6L12 2z"
              fill={`url(#sg-${i}-${value})`}
            />
          </svg>
        );
      })}
    </div>
  );
}

function Bar({ stars, pct }: { stars: number; pct: number }) {
  return (
    <div className="flex items-center gap-2 text-[var(--type-12)]">
      <span className="w-3 dash-mono text-[var(--text-tertiary)]">{stars}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
        <div className="h-full bg-[var(--text-primary)]" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right dash-mono text-[var(--text-tertiary)]">{pct}%</span>
    </div>
  );
}

const REVIEWS = [
  {
    author: "Sokolovsky D.",
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
    body: "Replaces the chore coat, the rain shell, and the field jacket I had been alternating. Pockets actually hold a notebook and a kindle paperwhite at the same time.",
  },
];

const RELATED = [
  { name: "Tin No. 4 Reproofing Wax",   price: "$24",  bgA: "#3a4a5e", bgB: "#1f2a3c" },
  { name: "Workhorse Crew Sweatshirt",  price: "$120", bgA: "#525c44", bgB: "#222b18" },
  { name: "Ranger Belt",                price: "$78",  bgA: "#7a6042", bgB: "#352a18" },
  { name: "Roll-Top Day Pack",          price: "$148", bgA: "#1a2332", bgB: "#0a0e16" },
];

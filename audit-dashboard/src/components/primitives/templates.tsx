"use client";

import { ReactNode } from "react";
import { Search as SearchIcon } from "./icon";

/* ─────────────────────────  ERROR / STATE PAGES  ───────────────────────── */
export function ErrorPage({
  code,
  title,
  description,
  primary = "Go home",
  secondary = "Contact support",
}: {
  code: string;
  title: string;
  description: string;
  primary?: string;
  secondary?: string;
}) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-12 text-center max-w-[480px] mx-auto">
      <div className="lumen-mono text-[var(--type-72)] font-light tracking-[var(--tracking-tighter)] text-[var(--text-tertiary)] leading-[var(--leading-flat)]">
        {code}
      </div>
      <div className="text-[var(--type-22)] font-semibold tracking-[var(--tracking-tight)] mt-2 text-[var(--text-primary)]">{title}</div>
      <p className="text-[var(--type-13)] text-[var(--text-tertiary)] mt-2 leading-[var(--leading-snug)] max-w-[36ch] mx-auto">{description}</p>
      <div className="flex items-center justify-center gap-2 mt-6">
        <button className="h-10 px-4 rounded-[var(--radius-md)] bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] text-[var(--type-14)] font-medium">{primary}</button>
        <button className="h-10 px-4 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--type-14)] font-medium">{secondary}</button>
      </div>
    </div>
  );
}

/* ─────────────────────────  LOGIN  ───────────────────────── */
export function LoginCard() {
  return (
    <div className="w-[380px] rounded-[var(--radius-xl)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-6 shadow-[var(--shadow-sm)]">
      <div className="lumen-mono text-[var(--type-15)] font-bold tracking-[-0.02em] mb-6">warp.</div>
      <div className="text-[var(--type-22)] font-semibold tracking-[var(--tracking-tight)]">Sign in</div>
      <p className="text-[var(--type-13)] text-[var(--text-tertiary)] mt-1">Use your work email to continue.</p>
      <div className="mt-5 space-y-3">
        <SocialBtn label="Continue with Google" icon={<GoogleG />} />
        <SocialBtn label="Continue with Microsoft" icon={<MsLogo />} />
        <SocialBtn label="Continue with Passkey" icon={<KeyIcon />} />
        <div className="flex items-center gap-3 my-2">
          <span className="h-px flex-1 bg-[var(--border-hairline)]" />
          <span className="text-[var(--type-11)] uppercase tracking-[var(--tracking-wider)] text-[var(--text-tertiary)]">or</span>
          <span className="h-px flex-1 bg-[var(--border-hairline)]" />
        </div>
        <input className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--type-13)] w-full focus:outline-none focus:border-[var(--border-focus)] focus:shadow-[var(--shadow-focus)]" placeholder="you@company.com" />
        <button className="w-full h-10 rounded-[var(--radius-md)] bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] text-[var(--type-13)] font-semibold">Send magic link</button>
      </div>
      <div className="mt-5 text-center text-[var(--type-12)] text-[var(--text-tertiary)]">
        New to Warp? <a className="lumen-link">Request access</a>
      </div>
    </div>
  );
}
function SocialBtn({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <button className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--type-13)] font-medium flex items-center justify-center gap-2 hover:bg-[var(--surface-sunken)]">
      <span>{icon}</span> {label}
    </button>
  );
}
function GoogleG() {
  return <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden><path fill="#4285f4" d="M17.6 9.2c0-.6 0-1.1-.1-1.7H9v3.3h4.8c-.2 1.1-.8 2-1.7 2.7v2.2h2.8c1.6-1.5 2.7-3.7 2.7-6.5z" /><path fill="#34a853" d="M9 18c2.4 0 4.4-.8 5.9-2.2l-2.8-2.2c-.8.6-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H1v2.3C2.5 15.9 5.5 18 9 18z" /><path fill="#fbbc05" d="M3.9 10.7c-.2-.6-.3-1.2-.3-1.7s.1-1.1.3-1.7V5H1c-.7 1.3-1 2.7-1 4s.3 2.7 1 4l2.9-2.3z" /><path fill="#ea4335" d="M9 3.6c1.3 0 2.6.5 3.5 1.4l2.6-2.6C13.4.9 11.4 0 9 0 5.5 0 2.5 2.1 1 5l2.9 2.3C4.6 5.2 6.6 3.6 9 3.6z" /></svg>;
}
function MsLogo() {
  return <svg width="13" height="13" viewBox="0 0 18 18" aria-hidden><rect width="8" height="8" fill="#f25022" /><rect x="10" width="8" height="8" fill="#7fba00" /><rect y="10" width="8" height="8" fill="#00a4ef" /><rect x="10" y="10" width="8" height="8" fill="#ffb900" /></svg>;
}
function KeyIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="8" cy="12" r="4" /><path d="M12 12h10M18 8v4M22 12v4" /></svg>;
}

/* ─────────────────────────  HERO + TRUST ROW  ───────────────────────── */
export function HeroBlock() {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-10 md:p-14 relative overflow-hidden">
      <div aria-hidden className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[var(--lumen-accent-a14)] blur-3xl pointer-events-none" />
      <div className="lumen-eyebrow text-[10px] mb-4">Warp · Lumen design system</div>
      <h1 className="text-[var(--type-49)] md:text-[var(--type-56)] font-semibold tracking-[var(--tracking-tighter)] leading-[var(--leading-tight)] max-w-[20ch]">
        The instrument panel for North-American freight.
      </h1>
      <p className="mt-4 max-w-[58ch] text-[var(--type-17)] text-[var(--text-secondary)] leading-[var(--leading-snug)]">
        Live carrier rates, automated quoting, and operational signal in one calm surface. Built for the people who actually move trucks.
      </p>
      <div className="flex flex-wrap items-center gap-2 mt-6">
        <button className="h-12 px-6 rounded-[var(--radius-md)] bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] text-[var(--type-15)] font-semibold shadow-[var(--shadow-glow-accent)]">Get started</button>
        <button className="h-12 px-6 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--type-15)] font-medium">Watch the demo</button>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[var(--type-12)] uppercase tracking-[var(--tracking-wider)] text-[var(--text-tertiary)]">
        <span>Sterling LTL</span>
        <span>Saia</span>
        <span>Estes Express</span>
        <span>ABF Freight</span>
        <span>Old Dominion</span>
      </div>
    </section>
  );
}

/* ─────────────────────────  FEATURE GRID  ───────────────────────── */
export function FeatureGrid() {
  const features = [
    { title: "Live carrier rates", body: "12,000 carriers indexed, refreshed every 90 s." },
    { title: "Automated quoting", body: "From email to bookable quote in under 6 minutes." },
    { title: "Operational signal", body: "Confidence scores on every recommendation." },
    { title: "Calm interfaces", body: "Built for sustained, eight-hour use." },
    { title: "API-first", body: "Everything in the UI is also a typed endpoint." },
    { title: "SOC 2 + ISO 27001", body: "Compliance posture documented in the trust center." },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {features.map((f) => (
        <div key={f.title} className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-5">
          <div className="text-[var(--type-15)] font-semibold tracking-[var(--tracking-tight)]">{f.title}</div>
          <p className="text-[var(--type-13)] text-[var(--text-tertiary)] mt-1.5 leading-[var(--leading-snug)]">{f.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────  TESTIMONIAL CARD  ───────────────────────── */
export function TestimonialCard() {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-6 max-w-[440px]">
      <div className="text-[var(--type-25)] font-semibold tracking-[var(--tracking-tight)] leading-[var(--leading-snug)]">
        "Lumen replaced four spreadsheets and three Slack threads. We can see the day."
      </div>
      <div className="flex items-center gap-3 mt-5">
        <span className="h-10 w-10 rounded-full bg-[var(--lumen-navy-7)] text-white inline-flex items-center justify-center lumen-mono text-[var(--type-13)] font-semibold">JR</span>
        <div>
          <div className="text-[var(--type-13)] font-medium">Jamie Rivera</div>
          <div className="text-[var(--type-12)] text-[var(--text-tertiary)]">Director of Logistics, Sterling LTL</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  STAT STRIP  ───────────────────────── */
export function StatStrip() {
  return (
    <div className="rounded-[var(--radius-xl)] bg-[var(--surface-inverse)] text-[var(--text-inverse)] p-8 md:p-10 grid gap-6 md:grid-cols-4">
      {[
        { k: "12,400", v: "carriers indexed" },
        { k: "$2.1B", v: "freight under management" },
        { k: "94%", v: "quote accuracy" },
        { k: "3.2 min", v: "avg quote time" },
      ].map((s) => (
        <div key={s.v}>
          <div className="lumen-tnum text-[var(--type-39)] font-semibold tracking-[var(--tracking-tighter)] leading-[var(--leading-flat)]">{s.k}</div>
          <div className="text-[var(--type-12)] uppercase tracking-[var(--tracking-wider)] text-[var(--lumen-navy-3)] mt-1.5">{s.v}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────  MAINTENANCE BANNER  ───────────────────────── */
export function MaintenanceCard() {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-12 text-center max-w-[480px] mx-auto">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[var(--surface-tint-accent)] flex items-center justify-center text-[var(--text-accent)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4L15 12l-3-3 2.7-2.7z" /></svg>
      </div>
      <div className="text-[var(--type-22)] font-semibold tracking-[var(--tracking-tight)]">Scheduled maintenance</div>
      <p className="text-[var(--type-13)] text-[var(--text-tertiary)] mt-2 leading-[var(--leading-snug)]">
        We're rolling out a database migration. Quoting is paused until 14:00 UTC. Existing shipments continue to track normally.
      </p>
      <div className="mt-6 inline-flex items-center gap-3 text-[var(--type-12)]">
        <span className="lumen-mono text-[var(--text-tertiary)]">Status</span>
        <span className="inline-flex items-center gap-1.5 text-[var(--lumen-amber-7)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--lumen-amber-5)]" />Partial degradation</span>
      </div>
    </div>
  );
}

/* ─────────────────────────  EMPTY STATES (variants)  ───────────────────────── */
export function NoDataIllustration() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none" aria-hidden>
      <rect x="6" y="14" width="68" height="38" rx="4" stroke="var(--border-default)" strokeWidth="1.5" />
      <line x1="6" y1="22" x2="74" y2="22" stroke="var(--border-default)" strokeWidth="1" />
      <rect x="14" y="30" width="22" height="3" rx="1" fill="var(--border-hairline)" />
      <rect x="14" y="38" width="48" height="3" rx="1" fill="var(--border-hairline)" />
      <rect x="14" y="46" width="14" height="3" rx="1" fill="var(--border-hairline)" />
      <circle cx="64" cy="14" r="6" fill="var(--lumen-accent-4)" opacity="0.18" />
      <path d="M64 14L66 12L64 14L66 16" stroke="var(--lumen-accent-7)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

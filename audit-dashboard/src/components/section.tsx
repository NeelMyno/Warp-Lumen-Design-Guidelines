import { ReactNode } from "react";

/**
 * v0.13.4 Phase 10 — `PageHeader` consumes the mode-aware tokens via
 * `.lumen-hero` + `.lumen-atmosphere` + `.lumen-noise-overlay` utilities.
 *
 * Restrained mode (default): `surface.hero` resolves to flat obsidian — the
 * panel reads as the existing v0.12.6 header treatment over the canvas
 * (`surface.canvas` = obsidian.800). `surface.atmosphere` is transparent and
 * `noise.overlay` opacity is 0, so neither paints. The only visible delta is
 * the rounded corner clip + inner padding that frames the content as a panel.
 *
 * Expressive mode: `surface.hero` rebinds to `mesh.aurora-spring` (3-blob
 * radial gradient at 8% over obsidian). `surface.atmosphere` adds an 8% Spring
 * Green wash. The SVG feTurbulence grain fades in via the `[data-mode]` rule
 * in lumen-scoping.css. The `mesh-drift 24s` animation hooks onto
 * `var(--motion-atmosphere)` baked into `.lumen-hero`.
 *
 * Hard rule 15 (AGENTS.md): mode is a scope attribute, never a per-component
 * prop. This component does NOT branch on mode — semantic tokens rebind under
 * the ancestor's `data-mode`. The `<html data-mode>` attribute is owned by
 * the chrome ModeToggle; this component sees the cascade.
 *
 * Hard rule 16 (AGENTS.md): backdrop-filter only on floating shells. This is
 * a page-level hero (not a floating shell), so it composes mesh + atmosphere +
 * noise — never `backdrop-filter`. Glass remains reserved for popovers, sheets,
 * command palette, hero device frames, nav.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta?: ReactNode;
}) {
  return (
    <header className="mb-12 md:mb-16 lumen-hero lumen-card-edge relative overflow-hidden rounded-[var(--radius-xl)]">
      {/* v0.13.6 Phase 11 Bucket 3 — .lumen-card-edge adds the 135deg ambient
          edge sheen via ::after pseudo, painting only in expressive mode. Composes
          with .lumen-hero's mesh + atmosphere + noise so the hero gains an
          additional "lit-from-upper-left" cue when the system enters expressive. */}
      {/* Mode-aware atmospheric overlays. Both are absolute / pointer-events:none
          and paint NOTHING in restrained mode (atmosphere transparent, noise
          opacity 0). In expressive: 8% Spring Green tint + 8% SVG feTurbulence
          grain. */}
      <div className="lumen-atmosphere" aria-hidden />
      <div className="lumen-noise-overlay" aria-hidden />

      {/* Content frame. Padding gives the mesh visual breathing room around the
          headline + description in expressive; matches the existing
          `.lumen-frame-brutalist` interior padding rhythm in restrained
          (no border so the panel reads as flush with the canvas). */}
      <div className="relative z-10 px-6 py-8 md:px-10 md:py-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="lumen-eyebrow">{eyebrow}</div>
          {meta && <span className="text-[color:var(--text-tertiary)]">·</span>}
          {meta}
        </div>
        <h1 className="text-display-md md:text-display-lg text-[color:var(--text-primary)]">
          {title}
        </h1>
        <p className="mt-4 max-w-[60ch] text-body-md md:text-body-lg text-[color:var(--text-secondary)]">
          {description}
        </p>
      </div>
    </header>
  );
}

export function Section({
  id,
  title,
  description,
  eyebrow,
  meta,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    // v0.13.6 Phase 11 Bucket 3 — every section frame gains the .lumen-card-edge
    // utility so its bounding rectangle picks up the ambient edge sheen in
    // expressive mode. In restrained the ::after pseudo is opacity 0 (invisible).
    // The section element itself stays hairline-dashed at the top per v0.12.6
    // visual identity; the sheen composes ON TOP of that hairline without
    // replacing it.
    <section
      id={id}
      className="lumen-reveal lumen-card-edge scroll-mt-32 border-t border-[var(--border-hairline)] pt-12 md:pt-16"
    >
      <div className="mb-8 md:mb-10 flex flex-col gap-2">
        {eyebrow && <div className="lumen-eyebrow mb-1">{eyebrow}</div>}
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h2 className="text-display-sm md:text-heading-h1 font-semibold text-[color:var(--text-primary)]">
            {title}
          </h2>
          {meta}
        </div>
        {description && (
          <p className="max-w-[68ch] text-body-sm md:text-body-md text-[color:var(--text-tertiary)]">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function SubSection({
  title,
  description,
  meta,
  children,
}: {
  title: string;
  description?: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div className="lumen-eyebrow">{title}</div>
          {description && (
            <div className="text-body-xs text-[color:var(--text-tertiary)]">
              {description}
            </div>
          )}
        </div>
        {meta}
      </div>
      {children}
    </div>
  );
}

// Lumen v0.13 Phase 1 — landing-hero example component.
//
// MODE-AGNOSTIC: this component does NOT branch on mode. It paints with
// semantic tokens that rebind under the surrounding ModeScope's data-mode
// attribute. Toggle the mode wrapper and this same JSX renders visually
// distinct output (mesh background + animated drift + noise overlay in
// expressive; flat obsidian in restrained).
//
// Per master doc Phase 1 Group E:
//   - Hero panel with `background: var(--surface-hero)` (mesh in expressive,
//     flat in restrained — rebound via lumen-mode-tokens.css)
//   - Brutalist hairline frame around the headline (border.frame voice element)
//   - One italic accent word in `text.accent` (Spring Green)
//   - Mono-uppercase tracked label ("SYSTEM V0.13 · LIVE")
//   - Primary CTA button with `shadow.glow-accent`
//   - Noise overlay via `noise.default` (visible only in expressive — opacity 0
//     in restrained via the .lumen-noise-overlay utility class)
//
// Same JSX. The toggle proves the mode rebind works.
import { LUMEN_VERSION_MAJOR_MINOR_UPPER } from "@/lib/version";

export function LandingHero() {
  return (
    <div className="lumen-hero relative isolate overflow-hidden rounded-[var(--radius-2xl)] border border-[color:var(--border-hairline)]">
      {/* Ambient atmospheric layer — Spring Green tint over the mesh in expressive,
          transparent in restrained. Sits behind content via z-index. */}
      <div className="lumen-atmosphere" aria-hidden />

      {/* SVG feTurbulence grain overlay — 8% noise in expressive, opacity 0 in
          restrained. Dithers gradient banding without being visible at 1:1. */}
      <div className="lumen-noise-overlay" aria-hidden />

      {/* Content frame — brutalist hairline border at border.frame (alpha 40%).
          The frame is one of Lumen's voice elements per foundations/voice-and-tone.md. */}
      <div className="relative z-10 flex flex-col gap-7 px-8 py-16 sm:px-16 sm:py-24">
        {/* Mono-uppercase tracked-out signature label. Mode-aware via
            data-mode='expressive' on the LiveDot pulse — pulse animates in
            expressive, freezes in restrained via prefers-reduced-motion gate. */}
        <div className="flex items-center gap-2 lumen-mono-cap text-[color:var(--text-accent)]">
          <span
            aria-hidden
            className="inline-block w-2 h-2 rounded-full bg-[color:var(--color-accent-500)]"
            style={{
              boxShadow:
                "0 0 0 4px rgba(0, 250, 138, 0.32), 0 0 12px rgba(0, 250, 138, 0.48)",
            }}
          />
          <span>{`SYSTEM ${LUMEN_VERSION_MAJOR_MINOR_UPPER} · LIVE`}</span>
        </div>

        {/* Brutalist hero headline. One italic accent word in text.accent. */}
        <h1
          className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.025em] text-[color:var(--text-primary)] max-w-[18ch]"
          style={{ fontFeatureSettings: "'ss01' on, 'case' on" }}
        >
          Operations as{" "}
          <em
            className="not-italic font-bold text-[color:var(--text-accent)]"
            style={{ fontStyle: "italic", fontVariationSettings: "'ital' 1" }}
          >
            instruments
          </em>
          .
        </h1>

        {/* Body lede. Stays at text.primary — reads cleanly over both mesh + flat. */}
        <p className="max-w-[60ch] text-base sm:text-lg leading-relaxed text-[color:var(--text-secondary)]">
          One mode for the operator, one for the brand moment. Same components,
          same tokens, same focus rings. Switch a single attribute on the scope
          container and the atmosphere rebinds.
        </p>

        {/* Primary CTA with shadow.glow-accent. The glow is the v0.13 3-layer
            signature (inner 14/34 + mid 60 blur + outer 120 blur). Reserved for
            hero / brand-signature moments per master doc §7 Phase 0. */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-full)] bg-[color:var(--color-accent-500)] text-[color:var(--color-accent-fg)] font-semibold transition-all duration-150"
            style={{
              boxShadow:
                "0 14px 34px rgba(0, 250, 138, 0.24), 0 0 60px rgba(0, 250, 138, 0.12), 0 0 120px rgba(0, 250, 138, 0.08)",
            }}
          >
            Start a freight
            <span aria-hidden>→</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-[var(--radius-full)] border border-[color:var(--border-default)] text-[color:var(--text-primary)] font-medium transition-colors duration-150 hover:bg-[color:var(--surface-raised)]"
          >
            Read the contract
          </button>
        </div>

        {/* The brutalist hairline frame voice element — explicit border.frame
            stroke at alpha 40%, mounted as a sub-panel beneath the CTA to
            demonstrate the voice element in both modes. The tertiary-text label
            wraps in `.lumen-text-scrim` so it clears WCAG 2.4.13 on the
            expressive mesh peak — per modes.md §"Contrast contract on
            expressive hero". The scrim is a no-op in restrained mode (the
            ::before pseudo-element collapses to transparent). */}
        <div
          className="mt-8 border border-dashed p-6 rounded-[var(--radius-md)]"
          style={{ borderColor: "var(--color-alpha-paper-40, rgba(255, 255, 255, 0.40))" }}
        >
          <p className="lumen-text-scrim inline-block lumen-mono-cap text-[color:var(--text-tertiary)] mb-2">
            BRUTALIST HAIRLINE FRAME · BORDER.FRAME · ALPHA 40%
          </p>
          <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
            Voice element preserved across modes. Same stroke, same alpha. The
            frame reads decisively against flat obsidian (restrained) and against
            the aurora mesh (expressive).
          </p>
        </div>
      </div>
    </div>
  );
}

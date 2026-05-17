---
name: Modes
type: foundation
version: 0.13.0
last_updated: 2026-05-16
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./hierarchy.md
  - ./first-impression.md
  - ./motion-language.md
  - ./accessibility.md
  - ../01-tokens/modes/restrained.tokens.json
  - ../01-tokens/modes/expressive.tokens.json
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Lumen Modes — Restrained × Expressive

> **v0.13 NEW.** Lumen ships in two modes sharing one primitive set, one component library, and one accessibility contract. **Restrained** is the default — dense operator surfaces, the v0.12.6 voice verbatim. **Expressive** is opt-in via `data-mode="expressive"` on a scope container — landing surfaces, AI panels, marketing pages, onboarding, empty states, hero device frames. The accent (`#00FA8A`), the type (Satoshi), the focus-ring contract, and the WCAG 2.2 AA floor are UNCHANGED across modes. Only ambient atmosphere and a small set of semantic surface tokens rebind.

---

## 1. The routing table

| Surface | Mode | Why |
|---|---|---|
| SaaS dashboard / tables / settings / terminals | **Restrained** | Operator density, scan-readability, hairline-first. Atmosphere is noise on a dashboard. |
| Command palette / drawer / sheet inside an operator surface | **Restrained** | Floating shells use `surface.glass` regardless of mode; the surrounding canvas is restrained. |
| Landing page hero + product story | **Expressive** | First-impression budget. Atmosphere does work here. |
| AI chat / agent / generation surfaces | **Expressive** | The "live" feel — aurora, soft glow on the spring-green accent. |
| Onboarding flows | **Expressive** | Narrative moments, illustration, room for delight. |
| Marketing pages, pricing, comparison | **Expressive** | Brand voice, peak-end signalling. |
| Empty states (zero data, just-installed) | **Expressive** | Single signature illustration + the system's voice. |
| Hero device frame / phone bezel mockup | **Expressive** | The frame's chrome can take blur + grain. |

When in doubt: if the surface's job is to help an operator do a task in under 5 seconds, **restrained**. If the surface's job is to make a person feel something about Warp, **expressive**.

---

## 2. How mode is set

Mode is a scope attribute on a container. **Never a per-component prop.** Components do not branch on mode; semantic tokens rebind under mode.

```tsx
// Restrained — explicit (also the default if no attribute is set)
<div data-mode="restrained">
  <ShipmentsTable />
</div>

// Expressive — opt-in on a hero block
<section data-mode="expressive">
  <HeroLanding />
</section>
```

The runtime CSS resolves `:root, [data-mode="restrained"], [data-mood="quiet-industrial"]` (default rebind set) and `[data-mode="expressive"]` (expressive rebind set). The legacy `data-mood="quiet-industrial"` v0.12.6 attribute keeps working — restrained inherits it.

---

## 3. What rebinds under expressive

Only a small set of semantic tokens rebind:

| Token | Restrained value | Expressive value | Effect |
|---|---|---|---|
| `surface.hero` | canvas | canvas + named mesh recipe + 8% grain | Aurora-tier ambient backdrop |
| `surface.canvas-ambient` | canvas | canvas + accent-alpha-12 radial | Subtle radial glow behind content |
| `surface.atmosphere` | transparent | `{color.alpha.accent.12}` overlay | Spring-green tinted atmospheric layer |
| `motion.atmosphere.aurora-fade` | gated on reduced-motion | 1200ms fade-in on mount | The atmospheric reveal |
| `shadow.glow-accent` | reserved for hero CTA | available on hero device frames | 3-layer Spring Green ambient |

Everything else — control heights, type scale, radius, focus rings, all colors except atmosphere — stays IDENTICAL across modes.

---

## 4. Fallbacks (the a11y contract)

Expressive mode honours both reduced-motion AND reduced-transparency. The fallback chain:

| Condition | Fallback |
|---|---|
| `@media (prefers-reduced-motion: reduce)` | Aurora fade-in collapses to instant. Mesh animation freezes. Grain shimmer freezes. RateTicker pauses. LiveDot pulse pauses. |
| `@media (prefers-reduced-transparency: reduce)` | All `surface.glass*` alphas bump to ≥ 0.85. Backdrop-filter blur drops to 0. Mesh recipes collapse to flat fill. |
| `@supports not (backdrop-filter)` | Glass surfaces resolve to solid `surface.popover` fallback. |

These fallbacks are baked into the token `$extensions.lumen.fallback` paths and the CSS `@media`/`@supports` queries — engineers don't write them per-component.

---

## 5. Where mode SHOULDN'T be used

- **NEVER on a data table, row, cell, or chart axis.** Expressive's atmospheric layers reduce text contrast.
- **NEVER nested.** A `data-mode="expressive"` scope inside a `data-mode="restrained"` scope is undefined behaviour. If a hero card needs to live inside a dashboard, the hero card uses restrained semantic tokens — it doesn't switch modes.
- **NEVER as a per-component prop.** No `<Card mode="expressive">`. Always scope-level.

---

## 6. The 5 mesh recipes (Phase 1 will land these)

Reserved names — Phase 0 declares the slots; Phase 1 implements them in `01-tokens/primitives/mesh.tokens.json`.

| Recipe | Use case |
|---|---|
| `mesh.aurora-spring` | Landing-hero default — the Spring Green ambient that defines the brand |
| `mesh.aurora-cool` | AI surface variant — cooler indigo overlay for "thinking" moments |
| `mesh.dock-bay` | Freight-specific — warm dock-bay glow, container yard at dusk |
| `mesh.lane-arc` | Freight-specific — arc gradient suggesting a route from origin to destination |
| `mesh.cross-dock` | Freight-specific — grid overlay suggesting cross-dock cells |

---

## 7. Decision rubric

When a designer asks "should this be restrained or expressive?", the decision is:

1. **Will an operator look at this surface multiple times per day to do real work?** → restrained.
2. **Is this surface seen mostly by first-time visitors or prospects?** → expressive.
3. **Does it contain a data table, tracked log, or operator queue?** → restrained, even if it's the landing page of an analytics product.
4. **Does it contain a single signature illustration or a hero device frame?** → expressive.
5. **Is it the AI chat / agent / generation surface?** → expressive (atmosphere helps signal "alive").

Default to restrained when in doubt. Expressive is opt-in.

---

## References

- [`principles.md`](./principles.md) — §2 less, but better
- [`hierarchy.md`](./hierarchy.md) — three-tier rule per section
- [`first-impression.md`](./first-impression.md) — the 50ms halo for expressive heroes
- [`motion-language.md`](./motion-language.md) — easing curves, spring constants, reduced-motion routing
- [`accessibility.md`](./accessibility.md) — WCAG 2.2 AA floor, reduced-transparency policy
- [`01-tokens/modes/restrained.tokens.json`](../01-tokens/modes/restrained.tokens.json) — restrained rebind set (Phase 0 placeholder)
- [`01-tokens/modes/expressive.tokens.json`](../01-tokens/modes/expressive.tokens.json) — expressive rebind set (Phase 0 stub; Phase 1 fills)
- [`doc/LUMEN-v0.13-MASTER-REFACTOR.md`](../../doc/LUMEN-v0.13-MASTER-REFACTOR.md) — §2 constraint 1 (dual-mode), §5 architecture

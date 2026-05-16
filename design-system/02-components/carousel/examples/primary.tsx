// Lumen Carousel — Web React example. Snap scroll + prev/next controls + dot indicator.

"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

export function Carousel({
  items,
  active: controlledActive,
  onActiveChange,
  loop = false,
  autoplay,
  indicator = "dots",
  controls = true,
  snap = "center",
  perView = 1,
  ariaLabel,
}: {
  items: ReactNode[];
  active?: number;
  onActiveChange?: (i: number) => void;
  loop?: boolean;
  autoplay?: number;
  indicator?: "dots" | "progress" | "fraction" | "none";
  controls?: boolean;
  snap?: "start" | "center";
  perView?: number;
  ariaLabel: string;
}) {
  const [uncontrolled, setUncontrolled] = useState(0);
  const active = controlledActive ?? uncontrolled;
  const isControlled = controlledActive !== undefined;
  const setActive = (next: number) => {
    if (!isControlled) setUncontrolled(next);
    onActiveChange?.(next);
  };

  const trackRef = useRef<HTMLOListElement>(null);
  const [playing, setPlaying] = useState(autoplay !== undefined);

  useEffect(() => {
    if (!playing || !autoplay) return;
    const t = setInterval(() => {
      const next = loop ? (active + 1) % items.length : Math.min(active + 1, items.length - 1);
      setActive(next);
    }, autoplay);
    return () => clearInterval(t);
  }, [playing, autoplay, active, loop, items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[active] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: snap });
  }, [active, snap]);

  const go = (delta: number) => {
    let next = active + delta;
    if (loop) next = (next + items.length) % items.length;
    else next = Math.min(items.length - 1, Math.max(0, next));
    setActive(next);
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => autoplay && setPlaying(true)}
      onFocusCapture={() => setPlaying(false)}
      onBlurCapture={() => autoplay && setPlaying(true)}
      className="relative"
    >
      <ol
        ref={trackRef}
        className={[
          "flex overflow-x-auto snap-x scrollbar-none",
          snap === "center" ? "snap-mandatory" : "snap-mandatory",
          "scroll-smooth motion-reduce:scroll-auto",
          "-mx-2 px-2 gap-3",
        ].join(" ")}
        style={{ scrollSnapType: snap === "center" ? "x mandatory" : "x mandatory" }}
      >
        {items.map((slide, i) => (
          <li
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${items.length}`}
            aria-hidden={i !== active}
            className="shrink-0 snap-center"
            style={{
              scrollSnapAlign: snap,
              flexBasis: `calc(${100 / perView}% - ${12 * (perView - 1) / perView}px)`,
            }}
          >
            {slide}
          </li>
        ))}
      </ol>
      {controls && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            disabled={!loop && active === 0}
            className={[
              "absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full",
              "bg-[var(--color-surface-raised)] border border-[var(--color-border-hairline)]",
              "text-[var(--color-text-primary)] hover:bg-[var(--color-action-ghost-bg-hover)]",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
              "disabled:opacity-40 disabled:pointer-events-none",
            ].join(" ")}
          >
            <ChevronLeft size={14} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            disabled={!loop && active === items.length - 1}
            className={[
              "absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full",
              "bg-[var(--color-surface-raised)] border border-[var(--color-border-hairline)]",
              "text-[var(--color-text-primary)] hover:bg-[var(--color-action-ghost-bg-hover)]",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
              "disabled:opacity-40 disabled:pointer-events-none",
            ].join(" ")}
          >
            <ChevronRight size={14} aria-hidden />
          </button>
        </>
      )}
      <div className="mt-3 flex items-center justify-center gap-2">
        {indicator === "dots" && items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className={[
              "h-1.5 rounded-full transition-all duration-[var(--motion-duration-base)]",
              i === active ? "w-6 bg-[var(--color-accent-500)]" : "w-1.5 bg-[var(--color-alpha-paper-24)] hover:bg-[var(--color-text-tertiary)]",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
            ].join(" ")}
          />
        ))}
        {indicator === "fraction" && (
          <span className="lumen-tnum text-[var(--type-label-sm)] text-[var(--color-text-tertiary)]">
            {active + 1} of {items.length}
          </span>
        )}
        {autoplay && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause carousel" : "Play carousel"}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-action-ghost-bg-hover)]"
          >
            {playing ? <Pause size={12} aria-hidden /> : <Play size={12} aria-hidden />}
          </button>
        )}
      </div>
    </section>
  );
}
